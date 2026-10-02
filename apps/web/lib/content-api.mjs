import dotenv from 'dotenv';
import path from 'node:path';

// This helper runs only in Next.js server components. The API base URL is not a secret;
// database credentials and Supabase server keys are never read by the browser bundle.
dotenv.config({ path: path.resolve(process.cwd(), '..', '..', '.env') });

const apiBase = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api/v1').replace(/\/+$/, '');
const collectionPaths = {
  destinations: '/destinations',
  attractions: '/attractions',
  articles: '/articles',
  states: '/states',
  districts: '/districts',
  tehsils: '/tehsils',
};
const validSlug = (slug) => typeof slug === 'string' && slug.length <= 160 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);

async function request(pathname) {
  try {
    const response = await fetch(`${apiBase}${pathname}`, { cache: 'no-store', headers: { accept: 'application/json' } });
    if (response.status === 404) return { state: 'not-found' };
    if (!response.ok) return { state: 'error' };
    const payload = await response.json();
    if (!payload || typeof payload.data !== 'object' || payload.data === null) return { state: 'error' };
    return { state: 'success', payload };
  } catch {
    return { state: 'error' };
  }
}

function queryString(values) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) {
    if (value !== undefined && value !== null && value !== '') search.set(key, String(value));
  }
  const result = search.toString();
  return result ? `?${result}` : '';
}

export async function getCollection(resource, { page = 1, limit = 12, destination, state, district, tehsil, q } = {}) {
  const resourcePath = collectionPaths[resource];
  if (!resourcePath || !Number.isSafeInteger(page) || page < 1 || !Number.isSafeInteger(limit) || limit < 1 || limit > 100 || (q !== undefined && (typeof q !== 'string' || q.trim().length > 100))) {
    return { state: 'error' };
  }

  const search = q?.trim();
  const result = await request(`${resourcePath}${queryString({ page, limit, ...(destination ? { destination } : {}), ...(state ? { state } : {}), ...(district ? { district } : {}), ...(tehsil ? { tehsil } : {}), ...(search ? { q: search } : {}) })}`);
  if (result.state !== 'success') return result;
  if (!Array.isArray(result.payload?.data) || !result.payload?.pagination) return { state: 'error' };
  return { state: 'success', data: result.payload.data, pagination: result.payload.pagination };
}

export async function getContent(resource, segments) {
  if (resource === 'attractions' || resource === 'districts' || resource === 'tehsils') {
    const [parentSlug, itemSlug] = segments || [];
    if (!validSlug(parentSlug) || !validSlug(itemSlug)) return { state: 'not-found' };
    return request(`/${resource}/${encodeURIComponent(parentSlug)}/${encodeURIComponent(itemSlug)}`);
  }

  const resourcePath = collectionPaths[resource];
  const [slug] = segments || [];
  if (!resourcePath || !validSlug(slug)) return { state: 'not-found' };
  return request(`${resourcePath}/${encodeURIComponent(slug)}`);
}

export function parsePage(value) {
  if (value === undefined) return 1;
  if (Array.isArray(value) || typeof value !== 'string' || !/^[1-9]\d*$/.test(value)) return null;
  const page = Number(value);
  return Number.isSafeInteger(page) && page <= 1_000_000 ? page : null;
}

export function parseSearchTerm(value) {
  if (value === undefined) return { valid: true, value: undefined };
  if (Array.isArray(value) || typeof value !== 'string' || value.trim().length > 100) return { valid: false, value: undefined };
  return { valid: true, value: value.trim() || undefined };
}
