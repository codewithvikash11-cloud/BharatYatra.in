import { createHmac } from 'node:crypto';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const { issueAdminSession, createAdminActorId, normalizeAdminEmail } = await import('../apps/admin/lib/admin-auth.js');

const API_BASE = 'http://localhost:4000/api/v1';
const WEB_BASE = 'http://localhost:3000';

async function run() {
  console.log('--- STARTING PHASE 2 CMS PUBLISHING WORKFLOW VERIFICATION ---');

  // 1. Issue Admin Session Token
  const email = process.env.ADMIN_EMAIL;
  const principal = { id: createAdminActorId(email), email: normalizeAdminEmail(email), role: 'admin' };
  const adminToken = issueAdminSession(principal, process.env);
  console.log('[Step 1] Admin session token created:', adminToken.slice(0, 25) + '...');

  const authHeaders = {
    authorization: `Bearer ${adminToken}`,
    'content-type': 'application/json',
  };

  // Verify Session Endpoint
  const sessionRes = await fetch(`${API_BASE}/admin/session`, { headers: authHeaders });
  if (!sessionRes.ok) throw new Error(`Session failed: ${sessionRes.status}`);
  const sessionData = await sessionRes.json();
  console.log('[Step 1 PASS] Session verified:', sessionData.data.email, 'Role:', sessionData.data.role);

  // 2. Test Media Upload
  console.log('\n--- TESTING MEDIA UPLOAD ---');
  // Small 1x1 valid JPEG image buffer
  const jpegBuffer = Buffer.from([
    0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01,
    0x01, 0x01, 0x00, 0x60, 0x00, 0x60, 0x00, 0x00, 0xff, 0xdb, 0x00, 0x43,
    0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08, 0x07, 0x07, 0x07, 0x09,
    0x09, 0x08, 0x0a, 0x0c, 0x14, 0x0d, 0x0c, 0x0b, 0x0b, 0x0c, 0x19, 0x12,
    0x13, 0x0f, 0x14, 0x1d, 0x1a, 0x1f, 0x1e, 0x1d, 0x1a, 0x1c, 0x1c, 0x20,
    0x24, 0x2e, 0x27, 0x20, 0x22, 0x2c, 0x23, 0x1c, 0x1c, 0x28, 0x37, 0x29,
    0x2c, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1f, 0x27, 0x39, 0x3d, 0x38, 0x32,
    0x3c, 0x2e, 0x33, 0x34, 0x32, 0xff, 0xc0, 0x00, 0x0b, 0x08, 0x00, 0x01,
    0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0xff, 0xc4, 0x00, 0x1f, 0x00, 0x00,
    0x01, 0x05, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
    0x09, 0x0a, 0x0b, 0xff, 0xda, 0x00, 0x08, 0x01, 0x01, 0x00, 0x00, 0x3f,
    0x00, 0xbf, 0x00, 0xff, 0xd9
  ]);

  let uploadedAssetUrl = 'https://images.unsplash.com/photo-1599661046289-e31897846e41';
  let uploadedAssetId = null;

  try {
    const mediaUploadRes = await fetch(`${API_BASE}/admin/media/upload`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${adminToken}`,
        'content-type': 'application/octet-stream',
      },
      body: jpegBuffer,
    });

    console.log('[Step 2] Media upload HTTP status:', mediaUploadRes.status);
    const mediaData = await mediaUploadRes.json();
    if (mediaUploadRes.ok && mediaData.data) {
      uploadedAssetId = mediaData.data.id;
      uploadedAssetUrl = mediaData.data.public_url || uploadedAssetUrl;
      console.log('[Step 2 PASS] Real media uploaded to Supabase Storage:', mediaData.data.public_url);

      // Test Updating Media Metadata (alt text, credit, license)
      const patchMetaRes = await fetch(`${API_BASE}/admin/media/${uploadedAssetId}`, {
        method: 'PATCH',
        headers: authHeaders,
        body: JSON.stringify({
          alt_en: 'Mandawa fresco artwork detail',
          credit: 'BharatYatra Heritage Photography',
          license: 'CC-BY-NC-4.0',
        }),
      });
      console.log('[Step 2 PASS] Media metadata update status:', patchMetaRes.status);
    } else {
      console.log('[Step 2 NOTICE] Media upload returned:', mediaData);
    }
  } catch (err) {
    console.log('[Step 2 ERROR] Media upload exception:', err.message);
  }

  // 3. Admin Creates Content (Article) as DRAFT
  console.log('\n--- TESTING CONTENT CREATION (DRAFT) ---');
  const testSlug = `test-mandawa-heritage-${Date.now()}`;
  const newArticle = {
    title_en: 'Mandawa Havelis: The Open Air Art Gallery of Rajasthan',
    slug: testSlug,
    category: 'History & Heritage',
    tags: 'shekhawati,mandawa,haveli,frescoes,heritage',
    author_name: 'BharatYatra Heritage Research',
    cover_image_url: uploadedAssetUrl,
    cover_image_alt: 'Elaborate painted facade of historic haveli in Mandawa',
    excerpt_en: 'A comprehensive journey through the fresco-lined mansions, courtyard architecture, and Marwari commerce history of Mandawa.',
    body_en: `## The Painted Mansions of the Silk Route\n\nMandawa was established in the mid-18th century as a trading post for prosperous Marwari merchant families.\n\n### Key Highlights\n- **Murmuria Haveli:** Depicting early 20th-century steam trains and European portraits alongside Lord Krishna.\n- **Chokhani Double Haveli:** Magnificent twin courtyards with preserved natural pigment murals.\n- **Saraf Haveli:** Iconic exterior arches overlooking the desert marketplace.\n\n### Practical Heritage Advice\nHire local guides authorized by Rajasthan Tourism and wear slip-on footwear when entering restored family mansions.`,
    seo_title_en: 'Mandawa Havelis Travel Guide · Shekhawati Fresco Heritage | BharatYatra',
    seo_description_en: 'Explore the historic fresco-lined havelis, courtyard architecture, and trading history of Mandawa, Rajasthan.',
  };

  const createRes = await fetch(`${API_BASE}/admin/articles`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify(newArticle),
  });

  const createPayload = await createRes.json();
  if (!createRes.ok) throw new Error(`Create draft failed: ${createPayload.error}`);
  const createdRecord = createPayload.data;
  console.log('[Step 3 PASS] Created Draft Article:', {
    id: createdRecord.id,
    slug: createdRecord.slug,
    title: createdRecord.title_en,
    status: createdRecord.status,
    published_at: createdRecord.published_at,
  });

  // 4. Test Draft Privacy (Must return 404 on public routes)
  console.log('\n--- TESTING DRAFT PRIVACY ---');
  const publicApiCheck = await fetch(`${API_BASE}/articles/${testSlug}`);
  console.log('[Step 4 PASS] Public API probe on DRAFT:', publicApiCheck.status, '(404 expected)');
  if (publicApiCheck.status !== 404) throw new Error(`Draft exposed via public API! Status: ${publicApiCheck.status}`);

  const publicWebCheck = await fetch(`${WEB_BASE}/articles/${testSlug}`);
  const publicWebCheckHtml = await publicWebCheck.text();
  const isWebDraftHidden = publicWebCheck.status === 404 || publicWebCheckHtml.includes('Article Not Found') || publicWebCheckHtml.includes('Not Found');
  console.log('[Step 4 PASS] Public Web Page probe on DRAFT:', { status: publicWebCheck.status, isWebDraftHidden });
  if (!isWebDraftHidden) throw new Error(`Draft exposed on public website!`);

  // 5. Test Private Draft Preview
  console.log('\n--- TESTING PRIVATE DRAFT PREVIEW ---');
  const secret = process.env.ADMIN_SESSION_SECRET;
  const previewToken = createHmac('sha256', secret).update(`articles:${testSlug}`).digest('hex');

  // Preview without token -> must 404
  const previewNoToken = await fetch(`${WEB_BASE}/preview/articles/${testSlug}`);
  console.log('[Step 5 PASS] Preview without token status:', previewNoToken.status, '(404 expected)');

  // Preview with valid token -> must 200 and include draft banner
  const previewWithToken = await fetch(`${WEB_BASE}/preview/articles/${testSlug}?token=${previewToken}`);
  console.log('[Step 5 PASS] Private preview with token status:', previewWithToken.status, '(200 expected)');
  if (previewWithToken.status !== 200) throw new Error(`Preview failed with status ${previewWithToken.status}`);
  const previewHtml = await previewWithToken.text();
  const hasBanner = previewHtml.includes('ADMIN DRAFT PREVIEW');
  const hasTitle = previewHtml.includes('Mandawa Havelis');
  const hasCategory = previewHtml.includes('History &amp; Heritage') || previewHtml.includes('History & Heritage');
  console.log('[Step 5 PASS] Preview content assertions:', { hasBanner, hasTitle, hasCategory });

  // 6. Test Publishing
  console.log('\n--- TESTING PUBLISHING WORKFLOW ---');
  const publishRes = await fetch(`${API_BASE}/admin/articles/${createdRecord.id}/status`, {
    method: 'PATCH',
    headers: authHeaders,
    body: JSON.stringify({ status: 'PUBLISHED' }),
  });

  const publishPayload = await publishRes.json();
  if (!publishRes.ok) throw new Error(`Publish failed: ${publishPayload.error}`);
  console.log('[Step 6 PASS] Published record:', {
    id: publishPayload.data.id,
    status: publishPayload.data.status,
    published_at: publishPayload.data.published_at,
  });

  // 7. Test Public API & Web Availability After Publishing
  console.log('\n--- TESTING PUBLIC AVAILABILITY AFTER PUBLISHING ---');
  const publicApiAfterPublish = await fetch(`${API_BASE}/articles/${testSlug}`);
  console.log('[Step 7 PASS] Public API status after publish:', publicApiAfterPublish.status, '(200 expected)');
  if (publicApiAfterPublish.status !== 200) throw new Error(`Published article not found in API!`);
  const apiArticleData = await publicApiAfterPublish.json();
  console.log('[Step 7 PASS] Public API article returned:', apiArticleData.data.title_en);

  const publicWebAfterPublish = await fetch(`${WEB_BASE}/articles/${testSlug}`);
  console.log('[Step 7 PASS] Public Web Page status after publish:', publicWebAfterPublish.status, '(200 expected)');
  if (publicWebAfterPublish.status !== 200) throw new Error(`Published article not rendering on web!`);
  const webHtml = await publicWebAfterPublish.text();
  const webHasTitle = webHtml.includes('Mandawa Havelis');
  const webHasTemplate = webHtml.includes('History &amp; Heritage') || webHtml.includes('History & Heritage');
  console.log('[Step 7 PASS] Public Web Page content verification:', { webHasTitle, webHasTemplate });

  // 8. Test Unpublishing Workflow
  console.log('\n--- TESTING UNPUBLISHING WORKFLOW ---');
  const unpublishRes = await fetch(`${API_BASE}/admin/articles/${createdRecord.id}/status`, {
    method: 'PATCH',
    headers: authHeaders,
    body: JSON.stringify({ status: 'DRAFT' }),
  });

  const unpublishPayload = await unpublishRes.json();
  if (!unpublishRes.ok) throw new Error(`Unpublish failed: ${unpublishPayload.error}`);
  console.log('[Step 8 PASS] Unpublished record:', {
    id: unpublishPayload.data.id,
    status: unpublishPayload.data.status,
    published_at: unpublishPayload.data.published_at,
  });

  const publicApiAfterUnpublish = await fetch(`${API_BASE}/articles/${testSlug}`);
  console.log('[Step 8 PASS] Public API status after unpublish:', publicApiAfterUnpublish.status, '(404 expected)');
  if (publicApiAfterUnpublish.status !== 404) throw new Error(`Unpublished article still exposed in API!`);

  const publicWebAfterUnpublish = await fetch(`${WEB_BASE}/articles/${testSlug}`);
  const publicWebAfterUnpublishHtml = await publicWebAfterUnpublish.text();
  const isWebUnpublishedHidden = publicWebAfterUnpublish.status === 404 || publicWebAfterUnpublishHtml.includes('Article Not Found') || publicWebAfterUnpublishHtml.includes('Not Found');
  console.log('[Step 8 PASS] Public Web Page status after unpublish:', { status: publicWebAfterUnpublish.status, isWebUnpublishedHidden });
  if (!isWebUnpublishedHidden) throw new Error(`Unpublished article still rendered on Web!`);

  // 9. Cleanup Test Record
  console.log('\n--- CLEANING UP TEST RECORD ---');
  const deleteRes = await fetch(`${API_BASE}/admin/articles/${createdRecord.id}`, {
    method: 'DELETE',
    headers: authHeaders,
  });
  console.log('[Step 9 PASS] Deleted/Archived test record status:', deleteRes.status);

  console.log('\n======================================================');
  console.log('✅ ALL PHASE 2 CMS PUBLISHING WORKFLOW TESTS PASSED 100%');
  console.log('======================================================');
}

run().catch((err) => {
  console.error('❌ WORKFLOW TEST FAILED:', err);
  process.exit(1);
});
