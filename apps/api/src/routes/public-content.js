import { Router } from 'express';
import { prisma } from '../db.js';

const router = Router();
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;
const MAX_PAGE = 1_000_000;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const publicFilter = { status: 'PUBLISHED' };
const searchableFields = {
  destinations: ['name_en', 'name_hi', 'summary_en', 'summary_hi', 'description_en', 'description_hi', 'state_name', 'district_name'],
  attractions: ['name_en', 'name_hi', 'description_en', 'description_hi', 'category'],
  articles: ['title_en', 'title_hi', 'excerpt_en', 'excerpt_hi', 'body_en', 'body_hi', 'author_name', 'category', 'tags', 'seo_title_en', 'seo_title_hi', 'seo_description_en', 'seo_description_hi'],
  itineraries: ['title_en', 'title_hi', 'description_en', 'description_hi'],
  states: ['name_en', 'name_hi'],
  districts: ['name_en', 'name_hi'],
  tehsils: ['name_en', 'name_hi'],
};

const itineraryFields = {
  slug: true,
  title_en: true,
  title_hi: true,
  description_en: true,
  description_hi: true,
  duration_days: true,
  published_at: true,
  destinations: { select: { slug: true, name_en: true, state_name: true } },
};

const destinationFields = {
  slug: true,
  name_en: true,
  name_hi: true,
  summary_en: true,
  summary_hi: true,
  description_en: true,
  description_hi: true,
  state_name: true,
  district_name: true,
  state_id: true,
  district_id: true,
  tehsil_id: true,
  latitude: true,
  longitude: true,
  best_time_en: true,
  best_time_hi: true,
  published_at: true,
  states: { select: { slug: true, name_en: true, name_hi: true } },
  districts: { select: { slug: true, name_en: true, name_hi: true } },
  tehsils: { select: { slug: true, name_en: true, name_hi: true } },
};

const stateFields = {
  slug: true, name_en: true, name_hi: true, type: true, description_en: true, description_hi: true, published_at: true,
};
const districtFields = {
  slug: true, name_en: true, name_hi: true, description_en: true, description_hi: true, published_at: true, states: { select: { slug: true, name_en: true, name_hi: true } },
};
const tehsilFields = {
  slug: true, name_en: true, name_hi: true, local_label: true, description_en: true, description_hi: true, published_at: true, districts: { select: { slug: true, name_en: true, name_hi: true, states: { select: { slug: true, name_en: true, name_hi: true } } } },
};

const attractionFields = {
  slug: true,
  name_en: true,
  name_hi: true,
  description_en: true,
  description_hi: true,
  category: true,
  latitude: true,
  longitude: true,
  visiting_hours: true,
  entry_fee_note: true,
  source_url: true,
  verified_at: true,
  published_at: true,
  destinations: { select: { slug: true, name_en: true, name_hi: true } },
};

const itineraryDetailFields = {
  ...itineraryFields,
  itinerary_days: {
    orderBy: { day_number: 'asc' },
    select: {
      id: true,
      day_number: true,
      title_en: true,
      title_hi: true,
      notes_en: true,
      notes_hi: true,
      itinerary_stops: {
        orderBy: { sort_order: 'asc' },
        select: {
          id: true,
          sort_order: true,
          custom_name_en: true,
          custom_name_hi: true,
          notes_en: true,
          notes_hi: true,
          attractions: { select: attractionFields },
        },
      },
    },
  },
};

const articleFields = {
  slug: true,
  title_en: true,
  title_hi: true,
  excerpt_en: true,
  excerpt_hi: true,
  body_en: true,
  body_hi: true,
  author_name: true,
  category: true,
  tags: true,
  cover_image_url: true,
  cover_image_alt: true,
  canonical_url: true,
  seo_title_en: true,
  seo_title_hi: true,
  seo_description_en: true,
  seo_description_hi: true,
  published_at: true,
  destinations: { select: { slug: true, name_en: true } },
  states: { select: { slug: true, name_en: true } },
};

function parseListQuery(request, allowed = ['page', 'limit', 'q']) {
  const unexpected = Object.keys(request.query).some((key) => !allowed.includes(key));
  if (unexpected) return null;

  const parsePositiveInteger = (value, fallback, maximum) => {
    if (value === undefined) return fallback;
    if (typeof value !== 'string' || !/^[1-9]\d*$/.test(value)) return null;
    const parsed = Number(value);
    return Number.isSafeInteger(parsed) && parsed <= maximum ? parsed : null;
  };

  const page = parsePositiveInteger(request.query.page, 1, MAX_PAGE);
  const limit = parsePositiveInteger(request.query.limit, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE);
  const rawSearch = request.query.q;
  if (page === null || limit === null || (rawSearch !== undefined && (typeof rawSearch !== 'string' || rawSearch.trim().length === 0 || rawSearch.trim().length > 100))) return null;
  return { page, limit, skip: (page - 1) * limit, q: rawSearch?.trim() };
}

function searchFilter(resource, query) {
  if (!query) return {};
  const cleaned = query.trim().replace(/\s+/g, ' ');
  const tokens = cleaned.split(' ').filter(Boolean);
  if (tokens.length === 0) return {};
  if (tokens.length === 1) {
    return { OR: searchableFields[resource].map((field) => ({ [field]: { contains: tokens[0], mode: 'insensitive' } })) };
  }
  return {
    AND: tokens.map((token) => ({
      OR: searchableFields[resource].map((field) => ({ [field]: { contains: token, mode: 'insensitive' } })),
    })),
  };
}

function validSlug(value) {
  return typeof value === 'string' && value.length <= 160 && SLUG_PATTERN.test(value);
}

function setPublicCache(response) {
  // Unpublishing takes effect immediately; avoid serving cached content after a status change.
  response.set('Cache-Control', 'no-store');
}

function invalidRequest(response) {
  return response.status(400).json({ error: 'Invalid request parameters' });
}

function notFound(response) {
  return response.status(404).json({ error: 'Not found' });
}

function databaseFailure(response, error) {
  if (error) {
    console.error('Public content query failed:', error);
  } else {
    console.error('Public content query failed: Unknown error');
  }
  return response.status(503).json({ error: 'Content temporarily unavailable' });
}

async function sendPage(response, model, where, select, pagination) {
  try {
    // The configured PostgreSQL role may bypass RLS. Keep this predicate aligned
    // with the verified public SELECT policies and expose only explicit fields.
    const [total, data] = await prisma.$transaction([
      model.count({ where }),
      model.findMany({
        where,
        select,
        orderBy: [{ published_at: 'desc' }, { slug: 'asc' }],
        skip: pagination.skip,
        take: pagination.limit,
      }),
    ]);
    setPublicCache(response);
    return response.json({
      data,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit),
      },
    });
  } catch (error) {
    return databaseFailure(response, error);
  }
}

router.get('/search', async (request, response) => {
  const rawQ = request.query.q;
  if (rawQ === undefined || typeof rawQ !== 'string' || rawQ.trim().length === 0) {
    return response.json({ data: { query: '', destinations: [], attractions: [], articles: [], itineraries: [] } });
  }
  const query = rawQ.trim();
  try {
    const [destinations, attractions, articles, itineraries] = await Promise.all([
      prisma.destinations.findMany({
        where: { ...publicFilter, ...searchFilter('destinations', query) },
        select: destinationFields,
        take: 10,
        orderBy: [{ published_at: 'desc' }, { name_en: 'asc' }],
      }),
      prisma.attractions.findMany({
        where: { ...publicFilter, destinations: { is: { ...publicFilter } }, ...searchFilter('attractions', query) },
        select: attractionFields,
        take: 10,
        orderBy: [{ published_at: 'desc' }, { name_en: 'asc' }],
      }),
      prisma.articles.findMany({
        where: { ...publicFilter, ...searchFilter('articles', query) },
        select: articleFields,
        take: 10,
        orderBy: [{ published_at: 'desc' }, { title_en: 'asc' }],
      }),
      prisma.itineraries.findMany({
        where: { ...publicFilter, ...searchFilter('itineraries', query) },
        select: itineraryFields,
        take: 10,
        orderBy: [{ published_at: 'desc' }, { title_en: 'asc' }],
      }),
    ]);
    setPublicCache(response);
    return response.json({
      data: {
        query,
        destinations,
        attractions,
        articles,
        itineraries,
      },
    });
  } catch (error) {
    return databaseFailure(response, error);
  }
});

const regionStateKeywords = {
  north: ['Rajasthan', 'Uttar Pradesh', 'Himachal Pradesh', 'Uttarakhand', 'Punjab', 'Haryana', 'Delhi', 'Jammu', 'Ladakh'],
  south: ['Kerala', 'Tamil Nadu', 'Karnataka', 'Andhra Pradesh', 'Telangana', 'Goa', 'Puducherry'],
  east: ['West Bengal', 'Odisha', 'Bihar', 'Jharkhand'],
  west: ['Rajasthan', 'Gujarat', 'Maharashtra', 'Goa'],
  central: ['Madhya Pradesh', 'Chhattisgarh'],
  northeast: ['Assam', 'Meghalaya', 'Arunachal Pradesh', 'Nagaland', 'Manipur', 'Mizoram', 'Tripura', 'Sikkim'],
};

router.get('/destinations', (request, response) => {
  const pagination = parseListQuery(request, ['page', 'limit', 'q', 'state', 'district', 'tehsil', 'region']);
  if (!pagination) return invalidRequest(response);
  const regionKey = typeof request.query.region === 'string' ? request.query.region.toLowerCase() : null;
  const regionKeywords = regionKey ? regionStateKeywords[regionKey] : null;

  const where = {
    ...publicFilter,
    ...searchFilter('destinations', pagination.q),
    ...(request.query.state ? { states: { is: { ...publicFilter, slug: request.query.state } } } : {}),
    ...(request.query.district ? { districts: { is: { ...publicFilter, slug: request.query.district } } } : {}),
    ...(request.query.tehsil ? { tehsils: { is: { ...publicFilter, slug: request.query.tehsil } } } : {}),
    ...(regionKeywords ? {
      OR: regionKeywords.flatMap((kw) => [
        { state_name: { contains: kw, mode: 'insensitive' } },
        { states: { is: { name_en: { contains: kw, mode: 'insensitive' } } } },
        { states: { is: { slug: { contains: kw.toLowerCase().replace(/\s+/g, '-'), mode: 'insensitive' } } } },
      ]),
    } : {}),
  };
  return sendPage(response, prisma.destinations, where, destinationFields, pagination);
});

router.get('/destinations/:slug', async (request, response) => {
  if (!validSlug(request.params.slug)) return invalidRequest(response);
  try {
    const data = await prisma.destinations.findFirst({
      where: { ...publicFilter, slug: request.params.slug },
      select: {
        ...destinationFields,
        attractions: {
          where: publicFilter,
          select: attractionFields,
          orderBy: { name_en: 'asc' },
        },
        articles: {
          where: publicFilter,
          select: articleFields,
          orderBy: { published_at: 'desc' },
        },
      },
    });
    if (!data) return notFound(response);
    setPublicCache(response);
    return response.json({ data });
  } catch (error) {
    return databaseFailure(response, error);
  }
});

router.get('/attractions', (request, response) => {
  const pagination = parseListQuery(request, ['page', 'limit', 'destination', 'q']);
  if (!pagination) return invalidRequest(response);
  if (request.query.destination !== undefined && !validSlug(request.query.destination)) {
    return invalidRequest(response);
  }
  const where = {
    ...publicFilter,
    destinations: { is: { ...publicFilter } },
    ...searchFilter('attractions', pagination.q),
    ...(request.query.destination ? { destinations: { is: { ...publicFilter, slug: request.query.destination } } } : {}),
  };
  return sendPage(response, prisma.attractions, where, attractionFields, pagination);
});

router.get('/attractions/:destinationSlug/:slug', async (request, response) => {
  const { destinationSlug, slug } = request.params;
  if (!validSlug(destinationSlug) || !validSlug(slug)) return invalidRequest(response);
  try {
    const data = await prisma.attractions.findFirst({
      where: {
        ...publicFilter,
        slug,
        destinations: { is: { ...publicFilter, slug: destinationSlug } },
      },
      select: attractionFields,
    });
    if (!data) return notFound(response);
    setPublicCache(response);
    return response.json({ data });
  } catch (error) {
    return databaseFailure(response, error);
  }
});

router.get('/articles', (request, response) => {
  const pagination = parseListQuery(request);
  if (!pagination) return invalidRequest(response);
  return sendPage(response, prisma.articles, { ...publicFilter, ...searchFilter('articles', pagination.q) }, articleFields, pagination);
});

router.get('/articles/:slug', async (request, response) => {
  if (!validSlug(request.params.slug)) return invalidRequest(response);
  try {
    const data = await prisma.articles.findFirst({
      where: { ...publicFilter, slug: request.params.slug },
      select: articleFields,
    });
    if (!data) return notFound(response);
    setPublicCache(response);
    return response.json({ data });
  } catch (error) {
    return databaseFailure(response, error);
  }
});

router.get('/itineraries', (request, response) => {
  const pagination = parseListQuery(request, ['page', 'limit', 'q', 'destination']);
  if (!pagination) return invalidRequest(response);
  const where = {
    ...publicFilter,
    ...searchFilter('itineraries', pagination.q),
    ...(request.query.destination ? { destinations: { is: { ...publicFilter, slug: request.query.destination } } } : {}),
  };
  return sendPage(response, prisma.itineraries, where, itineraryFields, pagination);
});

router.get('/itineraries/:slug', async (request, response) => {
  if (!validSlug(request.params.slug)) return invalidRequest(response);
  try {
    const data = await prisma.itineraries.findFirst({
      where: { ...publicFilter, slug: request.params.slug },
      select: itineraryDetailFields,
    });
    if (!data) return notFound(response);
    setPublicCache(response);
    return response.json({ data });
  } catch (error) {
    return databaseFailure(response, error);
  }
});

router.get('/states', (request, response) => {
  const pagination = parseListQuery(request);
  if (!pagination) return invalidRequest(response);
  return sendPage(response, prisma.states, { ...publicFilter, ...searchFilter('states', pagination.q) }, stateFields, pagination);
});

router.get('/states/:slug', async (request, response) => {
  if (!validSlug(request.params.slug)) return invalidRequest(response);
  try {
    const data = await prisma.states.findFirst({ where: { ...publicFilter, slug: request.params.slug }, select: stateFields });
    if (!data) return notFound(response);
    setPublicCache(response);
    return response.json({ data });
  } catch (error) {
    return databaseFailure(response, error);
  }
});

router.get('/districts', (request, response) => {
  const pagination = parseListQuery(request, ['page', 'limit', 'q', 'state']);
  if (!pagination) return invalidRequest(response);
  const where = {
    ...publicFilter, ...searchFilter('districts', pagination.q),
    ...(request.query.state ? { states: { is: { ...publicFilter, slug: request.query.state } } } : {})
  };
  return sendPage(response, prisma.districts, where, districtFields, pagination);
});

router.get('/districts/:stateSlug/:slug', async (request, response) => {
  const { stateSlug, slug } = request.params;
  if (!validSlug(stateSlug) || !validSlug(slug)) return invalidRequest(response);
  try {
    const data = await prisma.districts.findFirst({
      where: { ...publicFilter, slug, states: { is: { ...publicFilter, slug: stateSlug } } },
      select: districtFields,
    });
    if (!data) return notFound(response);
    setPublicCache(response);
    return response.json({ data });
  } catch (error) {
    return databaseFailure(response, error);
  }
});

router.get('/tehsils', (request, response) => {
  const pagination = parseListQuery(request, ['page', 'limit', 'q', 'district']);
  if (!pagination) return invalidRequest(response);
  const where = {
    ...publicFilter, ...searchFilter('tehsils', pagination.q),
    ...(request.query.district ? { districts: { is: { ...publicFilter, slug: request.query.district } } } : {})
  };
  return sendPage(response, prisma.tehsils, where, tehsilFields, pagination);
});

router.get('/tehsils/:districtSlug/:slug', async (request, response) => {
  const { districtSlug, slug } = request.params;
  if (!validSlug(districtSlug) || !validSlug(slug)) return invalidRequest(response);
  try {
    const data = await prisma.tehsils.findFirst({
      where: { ...publicFilter, slug, districts: { is: { ...publicFilter, slug: districtSlug } } },
      select: tehsilFields,
    });
    if (!data) return notFound(response);
    setPublicCache(response);
    return response.json({ data });
  } catch (error) {
    return databaseFailure(response, error);
  }
});

export default router;
