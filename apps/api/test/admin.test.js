import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { createAdminRouter } from '../src/routes/admin.js';

const editor = { id:'11111111-1111-4111-8111-111111111111',email:'editor@example.invalid',role:'editor' };
const admin = { ...editor, id:'22222222-2222-4222-8222-222222222222',role:'admin' };
const recordId = '33333333-3333-4333-8333-333333333333';
const destinationId = '44444444-4444-4444-8444-444444444444';

function makePrisma(overrides = {}) {
  const row = { id:recordId,slug:'sample-place',name_en:'Sample Place',status:'DRAFT',destination_id:destinationId,updated_at:new Date(),published_at:null };
  const models = Object.fromEntries(['destinations','attractions','articles','media_assets','admin_audit_logs'].map((name) => [name, {
    count:async () => 0, findMany:async () => [], findUnique:async () => row,
    create:async ({data}) => ({...row,...data}), update:async ({data}) => ({...row,...data}), groupBy:async () => [],
  }]));
  Object.assign(models,...[]);
  for (const [key,value] of Object.entries(overrides)) models[key] = {...models[key],...value};
  const prisma = { ...models, $transaction:async (arg) => typeof arg === 'function' ? arg(prisma) : Promise.all(arg) };
  return prisma;
}

async function setup({ role='editor', prisma=makePrisma() } = {}) {
  const app = express();
  app.use(express.json());
  app.use('/admin',createAdminRouter({prisma,resolveUser:async (token) => token === 'valid' ? {state:'authenticated',principal:{...editor,role}} : token === 'unknown-role' ? {state:'authenticated',principal:{...editor,role:'visitor'}} : {state:'unauthorized'}}));
  const server = app.listen(0,'127.0.0.1');
  await new Promise((resolve) => server.once('listening',resolve));
  const base = `http://127.0.0.1:${server.address().port}/admin`;
  return { server,base,request:(path,options={}) => fetch(`${base}${path}`,{...options,headers:{...(options.body?{'content-type':'application/json'}:{}),...(options.headers||{})}}) };
}

test('admin API rejects missing and unprivileged credentials',async (t) => {
  const ctx=await setup(); t.after(()=>ctx.server.close());
  assert.equal((await ctx.request('/destinations')).status,401);
  assert.equal((await ctx.request('/destinations',{headers:{authorization:'Bearer unknown-role'}})).status,403);
});

test('editor can create draft destination and receives audited response',async (t) => {
  let audited;
  const prisma=makePrisma({admin_audit_logs:{create:async ({data}) => {audited=data;return data;}}});
  const ctx=await setup({prisma}); t.after(()=>ctx.server.close());
  const response=await ctx.request('/destinations',{method:'POST',headers:{authorization:'Bearer valid'},body:JSON.stringify({slug:'sample-place',name_en:'Sample Place'})});
  assert.equal(response.status,201);
  assert.equal((await response.json()).data.status,'DRAFT');
  assert.equal(audited.action,'content_created');
});

test('invalid content and workflow transitions are rejected',async (t) => {
  const ctx=await setup(); t.after(()=>ctx.server.close());
  const headers={authorization:'Bearer valid'};
  assert.equal((await ctx.request('/destinations',{method:'POST',headers,body:JSON.stringify({slug:'Bad slug',name_en:'X'})})).status,400);
  assert.equal((await ctx.request(`/destinations/${recordId}/status`,{method:'PATCH',headers,body:JSON.stringify({status:'PUBLISHED'})})).status,403);
  assert.equal((await ctx.request('/destinations?page=0',{headers})).status,400);
});

test('admin can publish complete reviewed content and content writes require audit table',async (t) => {
  const row={id:recordId,slug:'sample-place',name_en:'Sample Place',summary_en:'A sample summary',description_en:'A sample description',status:'REVIEW'};
  let audit;
  const prisma=makePrisma({destinations:{findUnique:async()=>row,update:async ({data})=>({...row,...data})},admin_audit_logs:{create:async ({data})=>{audit=data;return data;}}});
  const ctx=await setup({role:'admin',prisma}); t.after(()=>ctx.server.close());
  const response=await ctx.request(`/destinations/${recordId}/status`,{method:'PATCH',headers:{authorization:'Bearer valid','content-type':'application/json'},body:JSON.stringify({status:'PUBLISHED'})});
  assert.equal(response.status,200);
  assert.equal((await response.json()).data.status,'PUBLISHED');
  assert.equal(audit.action,'status_changed');
});

test('content list applies pagination and filters',async (t) => {
  let where;
  const prisma=makePrisma({destinations:{count:async(args)=>{where=args.where;return 1;},findMany:async(args)=>{where=args.where;return [{id:recordId}];}}});
  const ctx=await setup({prisma}); t.after(()=>ctx.server.close());
  const response=await ctx.request('/destinations?q=Delhi&status=REVIEW&page=2&limit=5',{headers:{authorization:'Bearer valid'}});
  const payload=await response.json();
  assert.equal(response.status,200);
  assert.equal(payload.pagination.page,2);
  assert.equal(payload.data.length,1);
  assert.equal(where.status,'REVIEW');
});
