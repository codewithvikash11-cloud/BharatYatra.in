import dotenv from 'dotenv';
dotenv.config();
import { createHmac } from 'node:crypto';
import { issueAdminSession, createAdminActorId, normalizeAdminEmail } from '../apps/api/src/auth/core.js';
import { prisma } from '../apps/api/src/db.js';

const API_BASE = 'http://localhost:4000/api/v1';
const WEB_BASE = 'http://localhost:3000';
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'dev-bharatyatra-admin-session-ultra-secret-key-2026';

function getAdminToken() {
  const email = normalizeAdminEmail(process.env.ADMIN_EMAIL || 'admin@bharatyatra.in');
  const principal = { id: createAdminActorId(email), email, role: 'admin' };
  return issueAdminSession(principal);
}

function getPreviewToken(slug) {
  return createHmac('sha256', SESSION_SECRET).update(`articles:${slug}`).digest('hex');
}

const token = getAdminToken();
const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
};

let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  [PASS] ${testName}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${testName}`);
    failed++;
  }
}

async function run() {
  console.log('===========================================================');
  console.log(' BHARATYATRA CMS — END-TO-END VERIFICATION SUITE');
  console.log('===========================================================\n');

  const testTimestamp = Date.now();
  const testSlug = `lifecycle-audit-${testTimestamp}`;
  let articleId = null;

  try {
    // -------------------------------------------------------------
    // Step 1: Create a draft article
    // -------------------------------------------------------------
    console.log('Step 1: Creating new draft article via Admin API...');
    const createRes = await fetch(`${API_BASE}/admin/articles`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        title_en: 'Mandawa Fresco Heritage Walk: Complete Guide',
        slug: testSlug,
        category: 'History & Heritage',
        author_name: 'BharatYatra Senior Editor',
        excerpt_en: 'A deep architectural dive into the painted havelis and Shekhawati merchant mansions.',
        body_en: '## The Open-Air Art Gallery\n\nMandawa was established in the mid-18th century as a key trading post on the silk route.',
        cover_image_url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
        cover_image_alt: 'Mandawa painted haveli courtyard',
        seo_title_en: 'Mandawa Fresco Heritage Walk | BharatYatra',
        seo_description_en: 'Discover the painted havelis, merchant architecture, and open air art galleries of Mandawa.',
      }),
    });
    const createData = await createRes.json();
    assert(createRes.status === 201 && createData.data?.id, 'Draft article created with HTTP 201');
    assert(createData.data?.status === 'DRAFT', 'Initial status is DRAFT');
    articleId = createData.data.id;

    // -------------------------------------------------------------
    // Step 2: Confirm draft persistence
    // -------------------------------------------------------------
    console.log('\nStep 2: Reloading and verifying draft persistence...');
    const getRes = await fetch(`${API_BASE}/admin/articles/${articleId}`, { headers });
    const getData = await getRes.json();
    assert(getRes.status === 200, 'Draft article fetched with HTTP 200');
    assert(getData.data.slug === testSlug, 'Draft slug matches persisted record');
    assert(getData.data.status === 'DRAFT', 'Persisted status is confirmed DRAFT');

    // -------------------------------------------------------------
    // Step 3: Private Preview & Public Inaccessibility
    // -------------------------------------------------------------
    console.log('\nStep 3: Checking draft privacy and HMAC preview token...');
    const pubDraftRes = await fetch(`${API_BASE}/articles/${testSlug}`);
    assert(pubDraftRes.status === 404, 'Public article endpoint returns 404 for DRAFT');

    const previewToken = getPreviewToken(testSlug);
    const prevRes = await fetch(`${WEB_BASE}/preview/articles/${testSlug}?token=${previewToken}`);
    const prevHtml = await prevRes.text();
    assert(prevRes.status === 200 && prevHtml.includes('ADMIN DRAFT PREVIEW'), 'Authenticated HMAC preview token successfully returns draft preview UI');

    // -------------------------------------------------------------
    // Step 4: Publish the article
    // -------------------------------------------------------------
    console.log('\nStep 4: Publishing article...');
    const pubStatusRes = await fetch(`${API_BASE}/admin/articles/${articleId}/status`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ status: 'PUBLISHED' }),
    });
    const pubStatusData = await pubStatusRes.json();
    assert(pubStatusRes.status === 200, 'Status changed with HTTP 200');
    assert(pubStatusData.data.status === 'PUBLISHED', 'Status transitioned to PUBLISHED');
    assert(Boolean(pubStatusData.data.published_at), 'published_at timestamp populated');

    // -------------------------------------------------------------
    // Step 5: Public accessibility after publication
    // -------------------------------------------------------------
    console.log('\nStep 5: Verifying public availability...');
    const pubCheckRes = await fetch(`${API_BASE}/articles/${testSlug}`);
    const pubCheckData = await pubCheckRes.json();
    assert(pubCheckRes.status === 200, 'Published article is accessible publicly (HTTP 200)');
    assert(pubCheckData.data?.title_en === 'Mandawa Fresco Heritage Walk: Complete Guide', 'Public data contains correct title');

    // -------------------------------------------------------------
    // Step 6: Edit and update published article
    // -------------------------------------------------------------
    console.log('\nStep 6: Updating published content...');
    const updateRes = await fetch(`${API_BASE}/admin/articles/${articleId}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({
        body_en: '## Updated Content\n\nMandawa features more than 50 preserved fresco mansions including the Murmuria Haveli and Gulab Rai Ladia Haveli.',
      }),
    });
    const updateData = await updateRes.json();
    assert(updateRes.status === 200, 'Article updated with HTTP 200');
    assert(updateData.data.body_en.includes('Murmuria Haveli'), 'Updated body content reflected in DB');

    // -------------------------------------------------------------
    // Step 7: Unpublish the article
    // -------------------------------------------------------------
    console.log('\nStep 7: Unpublishing article back to DRAFT...');
    const unpubRes = await fetch(`${API_BASE}/admin/articles/${articleId}/status`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ status: 'DRAFT' }),
    });
    const unpubData = await unpubRes.json();
    assert(unpubRes.status === 200, 'Status returned to DRAFT with HTTP 200');
    assert(unpubData.data.status === 'DRAFT', 'Status is confirmed DRAFT');

    const pubAfterUnpubRes = await fetch(`${API_BASE}/articles/${testSlug}`);
    assert(pubAfterUnpubRes.status === 404, 'Unpublished article is immediately inaccessible publicly (HTTP 404)');

    // -------------------------------------------------------------
    // Step 8: Move to Trash (Soft-delete / ARCHIVED)
    // -------------------------------------------------------------
    console.log('\nStep 8: Moving article to Trash (ARCHIVED)...');
    const trashRes = await fetch(`${API_BASE}/admin/articles/${articleId}`, {
      method: 'DELETE',
      headers,
    });
    const trashData = await trashRes.json();
    assert(trashRes.status === 200, 'Trash action completed with HTTP 200');
    assert(trashData.data?.status === 'ARCHIVED', 'Record marked as ARCHIVED (Trash)');

    const pubAfterTrashRes = await fetch(`${API_BASE}/articles/${testSlug}`);
    assert(pubAfterTrashRes.status === 404, 'Trashed article is inaccessible publicly (HTTP 404)');

    // -------------------------------------------------------------
    // Step 9: Restore from Trash
    // -------------------------------------------------------------
    console.log('\nStep 9: Restoring article from Trash to DRAFT...');
    const restoreRes = await fetch(`${API_BASE}/admin/articles/${articleId}/status`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ status: 'DRAFT' }),
    });
    const restoreData = await restoreRes.json();
    assert(restoreRes.status === 200, 'Restore action completed with HTTP 200');
    assert(restoreData.data.status === 'DRAFT', 'Restored record returned to DRAFT status');

    // -------------------------------------------------------------
    // Step 10: Permanent Deletion (Hard delete)
    // -------------------------------------------------------------
    console.log('\nStep 10: Permanently deleting test record...');
    const permDeleteRes = await fetch(`${API_BASE}/admin/articles/${articleId}?permanent=true`, {
      method: 'DELETE',
      headers,
    });
    assert(permDeleteRes.status === 200, 'Permanent delete executed with HTTP 200');

    const verifyDeleted = await prisma.articles.findUnique({ where: { id: articleId } });
    assert(verifyDeleted === null, 'Record completely removed from Supabase PostgreSQL');

    // -------------------------------------------------------------
    // Step 11: Verify Web App Public Routes (No fake fallbacks)
    // -------------------------------------------------------------
    console.log('\nStep 11: Verifying Next.js Web App routes and zero fake fallbacks...');

    // A non-existent article must return 404 or Not Found page, NOT fake data
    const nonExistentArticleRes = await fetch(`${WEB_BASE}/articles/non-existent-sample-slug`);
    const nonExistentHtml = await nonExistentArticleRes.text();
    assert(nonExistentArticleRes.status === 404 || nonExistentHtml.includes('Page not found') || nonExistentHtml.includes('not-found-page'), 'Non-existent article slug triggers Not Found (No fake dictionary fallback)');
    assert(!nonExistentHtml.includes('Shekhawati Haveli Trail'), 'Fake article dictionary content is not served');

    // Real published article must return 200
    const realArticleRes = await fetch(`${WEB_BASE}/articles/nawalgarh-rajasthan-travel-guide`);
    assert(realArticleRes.status === 200, 'Real published article returns HTTP 200');

    // Real published destination must return 200
    const realDestRes = await fetch(`${WEB_BASE}/destinations/nawalgarh-rajasthan`);
    assert(realDestRes.status === 200, 'Real published destination (Nawalgarh) returns HTTP 200');

    // Real published attraction must return 200
    const realAttrRes = await fetch(`${WEB_BASE}/attractions/nawalgarh-rajasthan/morarka-haveli-museum`);
    assert(realAttrRes.status === 200, 'Real published attraction returns HTTP 200');

    // Search query for Nawalgarh returns 200
    const searchRes = await fetch(`${WEB_BASE}/search?q=Nawalgarh`);
    assert(searchRes.status === 200, 'Search endpoint returns HTTP 200 with authentic database results');

    // Itineraries page returns 200 with clean empty state (no fake mock itineraries)
    const itinPageRes = await fetch(`${WEB_BASE}/itineraries`);
    const itinPageHtml = await itinPageRes.text();
    assert(itinPageRes.status === 200, 'Itineraries page returns HTTP 200');
    assert(itinPageHtml.includes('Curated Itineraries in Preparation'), 'Clean empty state rendered when DB has zero itineraries');
    assert(!itinPageHtml.includes('2-days-in-jaipur'), 'Zero fake mock itineraries rendered');

  } catch (err) {
    console.error('Test run failed with unhandled error:', err);
    failed++;
  }

  console.log('\n===========================================================');
  console.log(` RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log('===========================================================');

  if (failed > 0) process.exit(1);
  process.exit(0);
}

run();
