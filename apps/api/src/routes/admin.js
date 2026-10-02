import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { prisma as defaultPrisma } from '../db.js';
import { requireAdmin } from '../auth/admin-auth.js';

const RESOURCES = {
  destinations: {
    model: 'destinations', fields: ['slug','name_en','name_hi','summary_en','summary_hi','description_en','description_hi','state_name','district_name','state_id','district_id','tehsil_id','latitude','longitude','best_time_en','best_time_hi'],
    required: ['slug','name_en'], publishRequired:['summary_en','description_en'], searchable: ['slug','name_en','name_hi','state_name','district_name'],
  },
  attractions: {
    model: 'attractions', fields: ['destination_id','slug','name_en','name_hi','description_en','description_hi','category','latitude','longitude','visiting_hours','entry_fee_note','source_url','verified_at'],
    required: ['destination_id','slug','name_en'], publishRequired:['description_en','category'], searchable: ['slug','name_en','name_hi','category'],
  },
  articles: {
    model: 'articles', fields: ['slug','title_en','title_hi','excerpt_en','excerpt_hi','body_en','body_hi','author_name','seo_title_en','seo_title_hi','seo_description_en','seo_description_hi'],
    required: ['slug','title_en'], publishRequired:['excerpt_en','body_en','author_name'], searchable: ['slug','title_en','title_hi','author_name'],
  },
  states: {
    model: 'states', fields: ['slug','name_en','name_hi','type','description_en','description_hi'],
    required: ['slug','name_en'], publishRequired:['description_en'], searchable: ['slug','name_en','name_hi'],
  },
  districts: {
    model: 'districts', fields: ['state_id','slug','name_en','name_hi','description_en','description_hi'],
    required: ['state_id','slug','name_en'], publishRequired:['description_en'], searchable: ['slug','name_en','name_hi'],
  },
  tehsils: {
    model: 'tehsils', fields: ['district_id','slug','name_en','name_hi','local_label','description_en','description_hi'],
    required: ['district_id','slug','name_en'], publishRequired:['description_en'], searchable: ['slug','name_en','name_hi'],
  },
};
const STATUSES = ['DRAFT','REVIEW','PUBLISHED','ARCHIVED'];
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_PAGE_SIZE = 100;

function safeError(response, status, error) { return response.status(status).json({ error }); }
function parsePage(query) {
  const page = query.page === undefined ? 1 : Number(query.page);
  const limit = query.limit === undefined ? 20 : Number(query.limit);
  if (!Number.isInteger(page) || page < 1 || page > 100000 || !Number.isInteger(limit) || limit < 1 || limit > MAX_PAGE_SIZE) return null;
  if (Object.keys(query).some((key) => !['page','limit','q','status'].includes(key))) return null;
  return { page, limit, skip: (page - 1) * limit };
}
function parseFields(resource, body, { partial = false } = {}) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return { error: 'A JSON object is required' };
  const allowed = new Set([...resource.fields, ...(partial ? [] : ['status'])]);
  const unknown = Object.keys(body).filter((key) => !allowed.has(key));
  if (unknown.length) return { error: `Unsupported field: ${unknown[0]}` };
  const data = {};
  for (const [key, value] of Object.entries(body)) {
    if (key === 'status') {
      if (!STATUSES.includes(value)) return { error: 'Invalid status' };
      data.status = value;
    } else if (['latitude','longitude'].includes(key)) {
      if (value !== null && (typeof value !== 'number' || !Number.isFinite(value) || value < (key === 'latitude' ? -90 : -180) || value > (key === 'latitude' ? 90 : 180))) return { error: `Invalid ${key}` };
      data[key] = value;
    } else if (['destination_id', 'state_id', 'district_id', 'tehsil_id'].includes(key)) {
      if (value !== null && !UUID.test(value || '')) return { error: `Invalid ${key}` };
      data[key] = value;
    } else if (key === 'verified_at') {
      if (value !== null && (typeof value !== 'string' || Number.isNaN(Date.parse(value)))) return { error: 'Invalid verified_at' };
      data[key] = value === null ? null : new Date(value);
    } else if (key === 'slug') {
      if (typeof value !== 'string' || value.length > 160 || !SLUG.test(value)) return { error: 'Invalid slug' };
      data[key] = value;
    } else if (value !== null && typeof value !== 'string') return { error: `Invalid ${key}` };
    else data[key] = value;
  }
  return { data };
}
function validateComplete(resource, data) {
  const missing = resource.required.filter((field) => typeof data[field] !== 'string' || !data[field].trim());
  if (missing.length) return `Required field: ${missing[0]}`;
  return null;
}
function validateForReview(resource,data){
  const basic=validateComplete(resource,data);if(basic)return basic;
  const missing=(resource.publishRequired||[]).find((field)=>typeof data[field]!=='string'||!data[field].trim());
  return missing?`Required before review: ${missing}`:null;
}
function statusTransitionAllowed(role, current, next) {
  if (current === next) return false;
  if (role === 'editor') return current === 'DRAFT' && next === 'REVIEW';
  return ({
    DRAFT: ['REVIEW','ARCHIVED'],
    REVIEW: ['DRAFT','PUBLISHED','ARCHIVED'],
    PUBLISHED: ['DRAFT','ARCHIVED'],
    ARCHIVED: ['DRAFT'],
  })[current]?.includes(next) || false;
}
function createAudit(prisma, principal, input) {
  return prisma.admin_audit_logs.create({ data: { actor_user_id: principal.id, ...input } });
}

export function createAdminRouter({ prisma = defaultPrisma, resolveUser } = {}) {
  const router = Router();
  router.use(requireAdmin(resolveUser ? { resolveUser } : {}));

  router.get('/session', (request, response) => response.set('Cache-Control','no-store').json({ data: { id: request.adminPrincipal.id, email: request.adminPrincipal.email, role: request.adminPrincipal.role } }));

  router.get('/overview', async (_request, response) => {
    try {
      const counts = await Promise.all(Object.entries(RESOURCES).map(async ([key, resource]) => {
        const grouped = await prisma[resource.model].groupBy({ by: ['status'], _count: { _all: true } });
        return [key, Object.fromEntries(STATUSES.map((status) => [status, grouped.find((row) => row.status === status)?._count._all || 0]))];
      }));
      response.set('Cache-Control','no-store');
      return response.json({ data: Object.fromEntries(counts) });
    } catch { return safeError(response, 503, 'Dashboard temporarily unavailable'); }
  });

  router.get('/audit-logs', async (request, response) => {
    if (request.adminPrincipal.role !== 'admin') return safeError(response, 403, 'Admin role required');
    const page = parsePage(request.query);
    if (!page || request.query.q || request.query.status) return safeError(response, 400, 'Invalid pagination');
    try {
      const [total,data] = await prisma.$transaction([
        prisma.admin_audit_logs.count(),
        prisma.admin_audit_logs.findMany({ select: { id:true,actor_user_id:true,action:true,entity_type:true,entity_id:true,previous_status:true,next_status:true,changed_fields:true,created_at:true }, orderBy: { created_at:'desc' }, skip:page.skip, take:page.limit }),
      ]);
      return response.set('Cache-Control','no-store').json({ data, pagination:{ page:page.page,limit:page.limit,total,totalPages:Math.ceil(total/page.limit) } });
    } catch { return safeError(response, 503, 'Audit history unavailable; apply the reviewed admin audit migration first'); }
  });

  router.get('/media', async (request, response) => {
    const page = parsePage(request.query);
    if (!page || request.query.status) return safeError(response,400,'Invalid pagination');
    try {
      const where = request.query.q ? { OR: ['storage_path','alt_en','alt_hi','credit'].map((field) => ({ [field]: { contains: String(request.query.q).slice(0,100), mode:'insensitive' } })) } : {};
      const [total,data] = await prisma.$transaction([prisma.media_assets.count({where}),prisma.media_assets.findMany({where,orderBy:{created_at:'desc'},skip:page.skip,take:page.limit})]);
      return response.set('Cache-Control','no-store').json({data,pagination:{page:page.page,limit:page.limit,total,totalPages:Math.ceil(total/page.limit)}});
    } catch { return safeError(response,503,'Media library unavailable'); }
  });

  router.patch('/media/:id', async (request,response)=>{
    if(!UUID.test(request.params.id))return safeError(response,400,'Invalid media id');
    const allowed=['alt_en','alt_hi','credit','license','width','height'];
    if(!request.body||typeof request.body!=='object'||Array.isArray(request.body)||!Object.keys(request.body).length||Object.keys(request.body).some((key)=>!allowed.includes(key)))return safeError(response,400,'Invalid media metadata');
    for(const key of Object.keys(request.body)){
      const value=request.body[key];
      if(['width','height'].includes(key)?(value!==null&&(!Number.isInteger(value)||value<1||value>50000)):(value!==null&&typeof value!=='string'))return safeError(response,400,`Invalid ${key}`);
    }
    try{
      const updated=await prisma.$transaction(async(tx)=>{
        const old=await tx.media_assets.findUnique({where:{id:request.params.id}});if(!old)return null;
        const row=await tx.media_assets.update({where:{id:old.id},data:request.body});
        await createAudit(tx,request.adminPrincipal,{action:'content_updated',entity_type:'media_assets',entity_id:row.id,changed_fields:Object.keys(request.body)});
        return row;
      });
      return updated?response.set('Cache-Control','no-store').json({data:updated}):safeError(response,404,'Media asset not found');
    }catch{return safeError(response,503,'Media metadata could not be saved; verify the audit migration is applied');}
  });

  router.post('/media/upload', async (request, response) => {
    const bucket=process.env.MEDIA_STORAGE_BUCKET;
    if (!bucket) return safeError(response,503,'Media storage is not configured');
    const contentType=request.get('content-type')||'';
    const body=request.body;
    if(!/^application\/octet-stream$/i.test(contentType)||!Buffer.isBuffer(body)||body.length<12||body.length>5*1024*1024)return safeError(response,400,'Choose an image up to 5 MB');
    const signatures=[
      {type:'image/jpeg',ext:'jpg',ok:body[0]===0xff&&body[1]===0xd8&&body[2]===0xff},
      {type:'image/png',ext:'png',ok:body.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))},
      {type:'image/webp',ext:'webp',ok:body.toString('ascii',0,4)==='RIFF'&&body.toString('ascii',8,12)==='WEBP'},
      {type:'image/avif',ext:'avif',ok:body.toString('ascii',4,12).includes('ftypavif')},
    ];
    const image=signatures.find(({ok})=>ok);
    if(!image)return safeError(response,400,'Only valid JPEG, PNG, WebP and AVIF images are accepted');
    const url=process.env.SUPABASE_URL;
    const key=process.env.SUPABASE_SERVICE_ROLE_KEY;
    if(!url||!key)return safeError(response,503,'Supabase Storage is not configured');
    const storagePath=`admin/${randomUUID()}.${image.ext}`;
    const endpoint=`${url.replace(/\/+$/,'')}/storage/v1/object/${encodeURIComponent(bucket)}/${storagePath.split('/').map(encodeURIComponent).join('/')}`;
    try{
      const uploaded=await fetch(endpoint,{method:'POST',headers:{authorization:`Bearer ${request.adminPrincipal.accessToken}`,apikey:key,'content-type':image.type,'cache-control':'3600','x-upsert':'false'},body,signal:AbortSignal.timeout(15000)});
      if(!uploaded.ok)return safeError(response,uploaded.status===403?403:503,uploaded.status===403?'Supabase Storage upload policy denied this account':'Storage upload failed');
      let asset;
      try{
        asset=await prisma.$transaction(async(tx)=>{
          const row=await tx.media_assets.create({data:{storage_path:storagePath,public_url:null}});
          await createAudit(tx,request.adminPrincipal,{action:'media_uploaded',entity_type:'media_assets',entity_id:row.id,changed_fields:['storage_path']});
          return row;
        });
      }catch{
        try{await fetch(endpoint,{method:'DELETE',headers:{authorization:`Bearer ${request.adminPrincipal.accessToken}`,apikey:key},signal:AbortSignal.timeout(5000)});}catch{}
        return safeError(response,503,'Media metadata could not be saved; verify the audit migration is applied');
      }
      return response.status(201).set('Cache-Control','no-store').json({data:asset});
    }catch{return safeError(response,503,'Storage upload failed');}
  });

  for (const [type, resource] of Object.entries(RESOURCES)) {
    router.get(`/${type}`, async (request, response) => {
      const page = parsePage(request.query);
      if (!page) return safeError(response,400,'Invalid pagination or filters');
      if (request.query.status && !STATUSES.includes(request.query.status)) return safeError(response,400,'Invalid status filter');
      const search = typeof request.query.q === 'string' ? request.query.q.trim().slice(0,100) : '';
      const where = { ...(request.query.status ? { status:request.query.status } : {}), ...(search ? { OR:resource.searchable.map((field) => ({[field]:{contains:search,mode:'insensitive'}})) } : {}) };
      try {
        const [total,data] = await prisma.$transaction([prisma[resource.model].count({where}),prisma[resource.model].findMany({where,orderBy:{updated_at:'desc'},skip:page.skip,take:page.limit})]);
        return response.set('Cache-Control','no-store').json({data,pagination:{page:page.page,limit:page.limit,total,totalPages:Math.ceil(total/page.limit)}});
      } catch { return safeError(response,503,'Content list unavailable'); }
    });
    router.get(`/${type}/:id`, async (request, response) => {
      if (!UUID.test(request.params.id)) return safeError(response,400,'Invalid record id');
      try {
        const data = await prisma[resource.model].findUnique({where:{id:request.params.id}});
        return data ? response.set('Cache-Control','no-store').json({data}) : safeError(response,404,'Record not found');
      } catch { return safeError(response,503,'Content record unavailable'); }
    });
    router.post(`/${type}`, async (request, response) => {
      if (request.body && Object.hasOwn(request.body,'status')) return safeError(response,400,'Create content as DRAFT, then use the review workflow');
      const parsed = parseFields(resource,request.body,{partial:false});
      if (parsed.error) return safeError(response,400,parsed.error);
      const data = {...parsed.data,status:'DRAFT'};
      const completeness = validateComplete(resource,data);
      if (completeness) return safeError(response,400,completeness);
      if (data.status === 'PUBLISHED' && request.adminPrincipal.role !== 'admin') return safeError(response,403,'Only admins can publish content');
      try {
        if (['districts', 'tehsils', 'attractions'].includes(type)) {
          let parentType = type === 'attractions' ? 'destinations' : (type === 'districts' ? 'states' : 'districts');
          let parentIdField = type === 'attractions' ? 'destination_id' : (type === 'districts' ? 'state_id' : 'district_id');
          const parent = await prisma[parentType].findUnique({where:{id:data[parentIdField]},select:{id:true,status:true}});
          if (!parent || (data.status === 'PUBLISHED' && parent.status !== 'PUBLISHED')) return safeError(response,400,`${parentType.slice(0, -1)} must exist and be published before publication`);
        }
        const created = await prisma.$transaction(async (tx) => {
          const row = await tx[resource.model].create({data:{...data,published_at:data.status === 'PUBLISHED' ? new Date() : null}});
          await createAudit(tx,request.adminPrincipal,{action:'content_created',entity_type:type,entity_id:row.id,next_status:row.status,changed_fields:Object.keys(data)});
          return row;
        });
        return response.status(201).set('Cache-Control','no-store').json({data:created});
      } catch (error) { if (error?.code === 'P2002') return safeError(response,409,'A record with this slug already exists'); return safeError(response,503,'Content could not be saved; verify the audit migration is applied'); }
    });
    router.patch(`/${type}/:id`, async (request, response) => {
      if (!UUID.test(request.params.id)) return safeError(response,400,'Invalid record id');
      const parsed = parseFields(resource,request.body,{partial:true});
      if (parsed.error || !Object.keys(parsed.data || {}).length) return safeError(response,400,parsed.error || 'At least one editable field is required');
      if (request.adminPrincipal.role === 'editor' && (parsed.data.status || parsed.data.published_at)) return safeError(response,403,'Editors cannot change workflow status directly');
      try {
        const updated = await prisma.$transaction(async (tx) => {
          const old = await tx[resource.model].findUnique({where:{id:request.params.id}});
          if (!old) return null;
          if(request.adminPrincipal.role==='editor'&&old.status!=='DRAFT')return {forbidden:true};
          const row = await tx[resource.model].update({where:{id:old.id},data:{...parsed.data,updated_at:new Date()}});
          await createAudit(tx,request.adminPrincipal,{action:'content_updated',entity_type:type,entity_id:row.id,previous_status:old.status,next_status:row.status,changed_fields:Object.keys(parsed.data)});
          return row;
        });
        return updated ? response.set('Cache-Control','no-store').json({data:updated}) : safeError(response,404,'Record not found');
      } catch (error) { if (error?.code === 'P2002') return safeError(response,409,'A record with this slug already exists'); return safeError(response,503,'Content could not be saved; verify the audit migration is applied'); }
    });
    router.patch(`/${type}/:id/status`, async (request, response) => {
      if (!UUID.test(request.params.id) || !request.body || Object.keys(request.body).length !== 1 || !STATUSES.includes(request.body.status)) return safeError(response,400,'Invalid status request');
      try {
        const updated = await prisma.$transaction(async (tx) => {
          const old = await tx[resource.model].findUnique({where:{id:request.params.id}});
          if (!old) return null;
          const next = request.body.status;
          if (!statusTransitionAllowed(request.adminPrincipal.role,old.status,next)) return { forbidden:true };
          if (next === 'REVIEW' || next === 'PUBLISHED') {
            const completeness = validateForReview(resource,old);
            if (completeness) return { invalid:completeness };
          }
          if (['districts', 'tehsils', 'attractions'].includes(type) && next === 'PUBLISHED') {
            let parentType = type === 'attractions' ? 'destinations' : (type === 'districts' ? 'states' : 'districts');
            let parentIdField = type === 'attractions' ? 'destination_id' : (type === 'districts' ? 'state_id' : 'district_id');
            const parent = await tx[parentType].findUnique({where:{id:old[parentIdField]},select:{status:true}});
            if (parent?.status !== 'PUBLISHED') return { invalid:`${parentType.slice(0,-1)} must be published first` };
          }
          const row = await tx[resource.model].update({where:{id:old.id},data:{status:next,published_at:next === 'PUBLISHED' ? new Date() : null,updated_at:new Date()}});
          await createAudit(tx,request.adminPrincipal,{action:'status_changed',entity_type:type,entity_id:row.id,previous_status:old.status,next_status:next,changed_fields:['status']});
          return row;
        });
        if (!updated) return safeError(response,404,'Record not found');
        if (updated.forbidden) return safeError(response,403,'This workflow transition is not permitted');
        if (updated.invalid) return safeError(response,400,updated.invalid);
        return response.set('Cache-Control','no-store').json({data:updated});
      } catch { return safeError(response,503,'Status could not be changed; verify the audit migration is applied'); }
    });
    router.delete(`/${type}/:id`,async(request,response)=>{
      if(request.adminPrincipal.role!=='admin')return safeError(response,403,'Admin role required to archive content');
      if(!UUID.test(request.params.id))return safeError(response,400,'Invalid record id');
      try{
        const archived=await prisma.$transaction(async(tx)=>{
          const old=await tx[resource.model].findUnique({where:{id:request.params.id}});if(!old)return null;
          if(old.status==='ARCHIVED')return old;
          const row=await tx[resource.model].update({where:{id:old.id},data:{status:'ARCHIVED',published_at:null,updated_at:new Date()}});
          await createAudit(tx,request.adminPrincipal,{action:'status_changed',entity_type:type,entity_id:row.id,previous_status:old.status,next_status:'ARCHIVED',changed_fields:['status']});return row;
        });
        return archived?response.set('Cache-Control','no-store').json({data:archived}):safeError(response,404,'Record not found');
      }catch{return safeError(response,503,'Content could not be archived; verify the audit migration is applied');}
    });
  }
  return router;
}

export default createAdminRouter;
