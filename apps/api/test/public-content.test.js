import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'node:http';

const apiRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const workspaceRoot = path.resolve(apiRoot, '../..');
dotenv.config({ path: path.join(workspaceRoot, '.env'), override: true, quiet: true });

const { default: app } = await import('../src/app.js');
const { prisma } = await import('../src/db.js');
const server = createServer(app);
let baseUrl;

before(async () => {
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}/api/v1`;
  await prisma.$queryRaw`SELECT 1`;
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
  await prisma.$disconnect();
});

async function getJson(pathname) {
  const response = await fetch(`${baseUrl}${pathname}`);
  return { response, body: await response.json() };
}

const resources = [
  {
    name: 'destinations',
    listPath: '/destinations',
    model: prisma.destinations,
    publicWhere: { status: 'PUBLISHED' },
    privateWhere: { NOT: { status: 'PUBLISHED' } },
    detailPath: (record) => `/destinations/${record.slug}`,
  },
  {
    name: 'articles',
    listPath: '/articles',
    model: prisma.articles,
    publicWhere: { status: 'PUBLISHED' },
    privateWhere: { NOT: { status: 'PUBLISHED' } },
    detailPath: (record) => `/articles/${record.slug}`,
  },
  {
    name: 'attractions',
    listPath: '/attractions',
    model: prisma.attractions,
    publicWhere: { status: 'PUBLISHED', destinations: { is: { status: 'PUBLISHED' } } },
    privateWhere: { NOT: { status: 'PUBLISHED' } },
    detailPath: (record) => `/attractions/${record.destinationSlug}/${record.slug}`,
  },
];

test('rejects invalid pagination and unrecognized list parameters', async (t) => {
  for (const resource of resources) {
    await t.test(`${resource.name}: page bounds and unknown filters`, async () => {
      const invalidPage = await getJson(`${resource.listPath}?page=0`);
      assert.equal(invalidPage.response.status, 400);
      const invalidLimit = await getJson(`${resource.listPath}?limit=101`);
      assert.equal(invalidLimit.response.status, 400);
      const unexpected = await getJson(`${resource.listPath}?debug=true`);
      assert.equal(unexpected.response.status, 400);
      const blankSearch = await getJson(`${resource.listPath}?q=%20%20`);
      assert.equal(blankSearch.response.status, 400);
      const tooLongSearch = await getJson(`${resource.listPath}?q=${'x'.repeat(101)}`);
      assert.equal(tooLongSearch.response.status, 400);
    });
  }
  const badDestinationFilter = await getJson('/attractions?destination=Bad%20Slug');
  assert.equal(badDestinationFilter.response.status, 400);
});

test('accepts English and Hindi text searches on published content', async (t) => {
  for (const resource of resources) {
    await t.test(resource.name, async () => {
      const { response, body } = await getJson(`${resource.listPath}?q=${encodeURIComponent('यात्रा')}&page=1&limit=5`);
      assert.equal(response.status, 200);
      assert.equal(body.pagination.page, 1);
      assert.equal(body.pagination.limit, 5);
      assert.ok(Array.isArray(body.data));
      assert.ok(body.data.length <= 5);
      assert.equal(response.headers.get('cache-control'), 'no-store');
    });
  }
});

test('returns paginated public lists using verified publication filters', async (t) => {
  for (const resource of resources) {
    await t.test(resource.name, async () => {
      const { response, body } = await getJson(`${resource.listPath}?page=1&limit=2`);
      assert.equal(response.status, 200);
      assert.equal(body.pagination.page, 1);
      assert.equal(body.pagination.limit, 2);
      assert.ok(Number.isInteger(body.pagination.total));
      assert.ok(Array.isArray(body.data));
      assert.ok(body.data.length <= 2);
      for (const item of body.data) {
        assert.equal(typeof item.slug, 'string');
        assert.equal(Object.hasOwn(item, 'status'), false);
      }
    });
  }
});

test('returns published detail records', async (t) => {
  for (const resource of resources) {
    await t.test(resource.name, async (detailTest) => {
      const published = await resource.model.findFirst({
        where: resource.publicWhere,
        select: resource.name === 'attractions'
          ? { slug: true, destinations: { select: { slug: true } } }
          : { slug: true },
      });
      if (!published) detailTest.skip('No published record is currently available in this table.');
      else {
        const record = resource.name === 'attractions'
          ? { slug: published.slug, destinationSlug: published.destinations.slug }
          : published;
        const { response, body } = await getJson(resource.detailPath(record));
        assert.equal(response.status, 200);
        assert.equal(body.data.slug, record.slug);
        assert.equal(Object.hasOwn(body.data, 'status'), false);
      }
    });
  }
});

test('hides records outside the public publication policy', async (t) => {
  for (const resource of resources) {
    await t.test(resource.name, async (detailTest) => {
      const privateRecord = await resource.model.findFirst({
        where: resource.privateWhere,
        select: resource.name === 'attractions'
          ? { slug: true, destinations: { select: { slug: true } } }
          : { slug: true },
      });
      if (!privateRecord) detailTest.skip('No unpublished record is currently available to probe.');
      else {
        const record = resource.name === 'attractions'
          ? { slug: privateRecord.slug, destinationSlug: privateRecord.destinations.slug }
          : privateRecord;
        const hidden = await getJson(resource.detailPath(record));
        assert.equal(hidden.response.status, 404);
      }
    });
  }
});

test('validates detail slugs and returns not found for unknown slugs', async () => {
  const invalid = await getJson('/destinations/Not%20A%20Slug');
  assert.equal(invalid.response.status, 400);
  const missing = await getJson('/articles/no-such-bharatyatra-article');
  assert.equal(missing.response.status, 404);
});
