import test from 'node:test';
import assert from 'node:assert/strict';
import { getCollection, getContent, parsePage, parseSearchTerm } from '../lib/content-api.mjs';

function mockFetch(t) {
  const original = globalThis.fetch;
  const set = (handler) => { globalThis.fetch = handler; };
  t.after(() => { globalThis.fetch = original; });
  return set;
}

test('builds API-backed paginated collection requests', async (t) => {
  let requested;
  const setFetch = mockFetch(t);
  setFetch(async (url, options) => {
    requested = { url: String(url), options };
    return Response.json({ data: [], pagination: { page: 2, limit: 12, total: 0, totalPages: 0 } });
  });

  const result = await getCollection('attractions', { page: 2, limit: 12, destination: 'jaipur', q: ' लाल किला ' });
  assert.equal(result.state, 'success');
  assert.deepEqual(result.data, []);
  assert.equal(new URL(requested.url).searchParams.get('q'), 'लाल किला');
  assert.equal(requested.options.cache, 'no-store');
});

test('handles API errors, not found, and malformed payloads safely', async (t) => {
  const setFetch = mockFetch(t);
  setFetch(async () => new Response(null, { status: 503 }));
  assert.equal((await getCollection('articles')).state, 'error');

  setFetch(async () => new Response(null, { status: 404 }));
  assert.equal((await getContent('destinations', ['unknown'])).state, 'not-found');

  setFetch(async () => Response.json({ data: null }));
  assert.equal((await getContent('articles', ['bad-payload'])).state, 'error');
});

test('validates pagination locally and details use the attraction destination slug', async (t) => {
  let requested;
  const setFetch = mockFetch(t);
  setFetch(async (url) => {
    requested = String(url);
    return Response.json({ data: { slug: 'amber-fort' } });
  });

  assert.equal(parsePage(undefined), 1);
  assert.equal(parsePage('3'), 3);
  assert.equal(parsePage('0'), null);
  assert.equal(parsePage('1.5'), null);
  assert.deepEqual(parseSearchTerm(undefined), { valid: true, value: undefined });
  assert.deepEqual(parseSearchTerm('  हिमाचल  '), { valid: true, value: 'हिमाचल' });
  assert.equal(parseSearchTerm(['repeated']).valid, false);
  assert.equal(parseSearchTerm('x'.repeat(101)).valid, false);
  assert.equal((await getCollection('destinations', { page: 0 })).state, 'error');
  assert.equal((await getCollection('destinations', { q: 'x'.repeat(101) })).state, 'error');
  assert.equal((await getContent('destinations', ['Bad Slug'])).state, 'not-found');

  const detail = await getContent('attractions', ['jaipur', 'amber-fort']);
  assert.equal(detail.state, 'success');
  assert.match(requested, /\/api\/v1\/attractions\/jaipur\/amber-fort$/);
});
