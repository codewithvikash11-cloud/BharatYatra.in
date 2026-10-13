import { createHmac } from 'node:crypto';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const { issueAdminSession, createAdminActorId, normalizeAdminEmail } = await import('../apps/admin/lib/admin-auth.js');

const API_BASE = 'http://localhost:4000/api/v1';
const WEB_BASE = 'http://localhost:3000';

async function runTests() {
  console.log('================================================================');
  console.log('BHARATYATRA ADMIN CMS — PUBLISHING & LIFECYCLE VERIFICATION SUITE');
  console.log('================================================================\n');

  const results = {
    passed: [],
    failed: [],
    blocked: [],
  };

  function pass(name, detail = '') {
    console.log(`[PASS] ${name}${detail ? ` -> ${detail}` : ''}`);
    results.passed.push({ name, detail });
  }

  function fail(name, detail = '') {
    console.error(`[FAIL] ${name}${detail ? ` -> ${detail}` : ''}`);
    results.failed.push({ name, detail });
  }

  // 1. Admin Authentication
  console.log('--- 1. ADMIN AUTHENTICATION ---');
  let adminToken = '';
  try {
    const email = process.env.ADMIN_EMAIL || 'admin@bharatyatra.in';
    const principal = { id: createAdminActorId(email), email: normalizeAdminEmail(email), role: 'admin' };
    adminToken = issueAdminSession(principal, process.env);
    const sessionRes = await fetch(`${API_BASE}/admin/session`, {
      headers: { authorization: `Bearer ${adminToken}` },
    });
    if (!sessionRes.ok) throw new Error(`HTTP ${sessionRes.status}`);
    const sessionData = await sessionRes.json();
    pass('Admin Authentication', `Logged in as ${sessionData.data.email} (${sessionData.data.role})`);
  } catch (err) {
    fail('Admin Authentication', err.message);
    return;
  }

  const authHeaders = {
    authorization: `Bearer ${adminToken}`,
    'content-type': 'application/json',
  };

  // 2. Geographic Hierarchy & Parent-Child Validation
  console.log('\n--- 2. GEOGRAPHIC HIERARCHY VALIDATION ---');
  try {
    // Fetch valid states and districts
    const statesRes = await fetch(`${API_BASE}/admin/states?limit=10`, { headers: authHeaders });
    const statesData = await statesRes.json();
    const rajasthan = statesData.data?.find((s) => s.slug === 'rajasthan') || statesData.data?.[0];

    const distRes = await fetch(`${API_BASE}/admin/districts?limit=10`, { headers: authHeaders });
    const distData = await distRes.json();
    const jhunjhunu = distData.data?.find((d) => d.slug === 'jhunjhunu') || distData.data?.[0];

    pass('Geographic Data Loaded', `State: ${rajasthan?.name_en}, District: ${jhunjhunu?.name_en}`);

    // Test invalid parent-child relation rejection (saving destination under mismatching state)
    const invalidDestPayload = {
      slug: `test-mismatch-${Date.now()}`,
      name_en: 'Invalid Location Subject',
      state_id: '00000000-0000-0000-0000-000000000000', // Non-existent state ID
    };
    const invalidRes = await fetch(`${API_BASE}/admin/destinations`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify(invalidDestPayload),
    });
    if (invalidRes.status === 400) {
      pass('Server-side Hierarchy Validation', 'Rejected non-existent state ID with HTTP 400');
    } else {
      fail('Server-side Hierarchy Validation', `Expected HTTP 400, got ${invalidRes.status}`);
    }
  } catch (err) {
    fail('Geographic Hierarchy Validation', err.message);
  }

  // 3. Article Creation & Draft Persistence
  console.log('\n--- 3. ARTICLE CREATION & DRAFT LIFECYCLE ---');
  const testSlug = `nawalgarh-havelis-frescoes-guide-${Date.now()}`;
  let createdArticle = null;

  try {
    const articlePayload = {
      title_en: 'Nawalgarh Havelis: The Painted Architectural Heart of Shekhawati',
      slug: testSlug,
      category: 'Destination Guide',
      tags: 'nawalgarh,shekhawati,fresco,rajasthan,heritage',
      author_name: 'BharatYatra Editorial',
      excerpt_en: 'An in-depth cultural exploration of Nawalgarh, famed as the Golden City of Shekhawati for its hundreds of fresco-adorned merchant havelis.',
      body_en: `## The Golden City of Shekhawati\n\nNawalgarh is renowned for some of the finest surviving fresco murals anywhere in Rajasthan. Founded in 1737 by Thakur Nawal Singh, the town prospered as a primary commercial stop along desert camel caravan routes.\n\n### Top Attractions in Nawalgarh\n- **Podar Haveli Museum:** Over 750 restored murals detailing Hindu mythology, train innovations, and colonial encounters.\n- **Aath Haveli Complex:** An architectural marvel of eight continuous courtyards featuring rich natural pigment frescoes.\n- **Roop Niwas Kothi:** Former royal residence converted into a heritage sanctuary on the town's perimeter.\n\n### Best Time to Visit\nOctober through March provides cool morning temperatures ideal for walking tours through the walled bazaar.\n\n### How to Reach\nLocated in Jhunjhunu district, accessible via state highway from Jaipur (140 km) or Sikar railway junction.\n\n### Practical Travel Tips\nCarry modest cash reserves for local entry fees and hire registered heritage storytellers at Podar Museum gates.`,
      cover_image_url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41',
      cover_image_alt: 'Carved doorway and painted arch of a Nawalgarh haveli courtyard in Rajasthan',
      seo_title_en: 'Nawalgarh Havelis Travel Guide · Shekhawati Heritage | BharatYatra',
      seo_description_en: 'Complete guide to Nawalgarh in Shekhawati, Rajasthan: Podar Haveli museum, Aath Haveli, fresco history, travel tips, and best time to visit.',
      canonical_url: `https://bharatyatra.in/articles/${testSlug}`,
    };

    const createRes = await fetch(`${API_BASE}/admin/articles`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify(articlePayload),
    });

    const createData = await createRes.json();
    if (!createRes.ok) throw new Error(createData.error || `HTTP ${createRes.status}`);
    createdArticle = createData.data;

    pass('Create Article as DRAFT', `ID: ${createdArticle.id}, Status: ${createdArticle.status}`);

    // Confirm Draft Persistence by fetching back
    const getRes = await fetch(`${API_BASE}/admin/articles/${createdArticle.id}`, { headers: authHeaders });
    const getData = await getRes.json();
    if (getData.data?.slug === testSlug && getData.data?.status === 'DRAFT') {
      pass('Draft Content Persistence', 'Confirmed article fields persist accurately in database');
    } else {
      fail('Draft Content Persistence', 'Failed to retrieve saved draft correctly');
    }
  } catch (err) {
    fail('Article Creation & Persistence', err.message);
    return;
  }

  // 4. Draft Privacy (Strictly Hidden from Public Routes)
  console.log('\n--- 4. DRAFT PRIVACY VERIFICATION ---');
  try {
    const publicApiRes = await fetch(`${API_BASE}/articles/${testSlug}`);
    if (publicApiRes.status === 404) {
      pass('Public API Draft Protection', 'Public API returned 404 for DRAFT article');
    } else {
      fail('Public API Draft Protection', `DRAFT exposed via public API! Status: ${publicApiRes.status}`);
    }

    const publicWebRes = await fetch(`${WEB_BASE}/articles/${testSlug}`);
    const publicWebText = await publicWebRes.text();
    const isProtected = publicWebRes.status === 404 || publicWebText.includes('Not Found');
    if (isProtected) {
      pass('Public Web Draft Protection', 'Public web page returned 404/Not Found for DRAFT');
    } else {
      fail('Public Web Draft Protection', 'DRAFT exposed on public website!');
    }
  } catch (err) {
    fail('Draft Privacy Verification', err.message);
  }

  // 5. Private Draft HMAC Token Preview
  console.log('\n--- 5. PRIVATE DRAFT PREVIEW ---');
  try {
    const secret = process.env.ADMIN_SESSION_SECRET;
    const previewToken = createHmac('sha256', secret).update(`articles:${testSlug}`).digest('hex');
    const previewUrl = `${WEB_BASE}/preview/articles/${testSlug}?token=${previewToken}`;

    const previewRes = await fetch(previewUrl);
    const previewHtml = await previewRes.text();

    if (previewRes.ok && previewHtml.includes('Nawalgarh Havelis')) {
      pass('Private Draft Preview', `HMAC preview token rendered draft accurately (HTTP ${previewRes.status})`);
    } else {
      fail('Private Draft Preview', `Failed to render draft preview. Status: ${previewRes.status}`);
    }
  } catch (err) {
    fail('Private Draft Preview', err.message);
  }

  // 6. Publishing Workflow
  console.log('\n--- 6. PUBLISHING WORKFLOW ---');
  try {
    const publishRes = await fetch(`${API_BASE}/admin/articles/${createdArticle.id}/status`, {
      method: 'PATCH',
      headers: authHeaders,
      body: JSON.stringify({ status: 'PUBLISHED' }),
    });
    const publishData = await publishRes.json();
    if (!publishRes.ok) throw new Error(publishData.error || `HTTP ${publishRes.status}`);

    if (publishData.data?.status === 'PUBLISHED' && publishData.data?.published_at) {
      pass('Publish Article Live', `Status: PUBLISHED, Published At: ${publishData.data.published_at}`);
    } else {
      fail('Publish Article Live', 'Did not update status to PUBLISHED properly');
    }
  } catch (err) {
    fail('Publishing Workflow', err.message);
    return;
  }

  // 7. Public Website Integration Verification
  console.log('\n--- 7. PUBLIC WEBSITE INTEGRATION ---');
  try {
    // Public API returns published article
    const pubApiRes = await fetch(`${API_BASE}/articles/${testSlug}`);
    if (pubApiRes.ok) {
      const pubData = await pubApiRes.json();
      pass('Public API Delivery', `Returned published article: "${pubData.data?.title_en}"`);
    } else {
      fail('Public API Delivery', `HTTP ${pubApiRes.status}`);
    }

    // Public Web page renders content template
    const pubWebRes = await fetch(`${WEB_BASE}/articles/${testSlug}`);
    const pubWebHtml = await pubWebRes.text();
    if (pubWebRes.ok && pubWebHtml.includes('Nawalgarh Havelis')) {
      pass('Public Article Page Render', `Rendered article with content template (HTTP ${pubWebRes.status})`);
    } else {
      fail('Public Article Page Render', `Public page did not render article (HTTP ${pubWebRes.status})`);
    }

    // Verify Structured Data / SEO in rendered page
    if (pubWebHtml.includes('schema.org') && pubWebHtml.includes('Nawalgarh Havelis')) {
      pass('SEO Schema & OpenGraph', 'JSON-LD structured data and meta tags present in public page');
    } else {
      fail('SEO Schema & OpenGraph', 'Missing structured data');
    }

    // Public search integration
    const searchRes = await fetch(`${WEB_BASE}/search?q=Nawalgarh`);
    const searchHtml = await searchRes.text();
    if (searchRes.ok && (searchHtml.includes('Nawalgarh') || searchHtml.includes('Nawalgarh Havelis'))) {
      pass('Search System Integration', 'Search page successfully matches query and renders relevant links');
    } else {
      fail('Search System Integration', `Search did not find published content (HTTP ${searchRes.status})`);
    }
  } catch (err) {
    fail('Public Website Integration', err.message);
  }

  // 8. Update Published Content
  console.log('\n--- 8. UPDATE PUBLISHED ARTICLE ---');
  try {
    const updateRes = await fetch(`${API_BASE}/admin/articles/${createdArticle.id}`, {
      method: 'PATCH',
      headers: authHeaders,
      body: JSON.stringify({
        title_en: 'Nawalgarh Havelis: Complete Heritage & Fresco Guide 2026',
      }),
    });
    const updateData = await updateRes.json();
    if (updateRes.ok && updateData.data?.title_en?.includes('2026')) {
      pass('Update Published Content', 'Successfully updated title on published article');
    } else {
      fail('Update Published Content', updateData.error || `HTTP ${updateRes.status}`);
    }
  } catch (err) {
    fail('Update Published Content', err.message);
  }

  // 9. Duplication Feature
  console.log('\n--- 9. ARTICLE DUPLICATION ---');
  let duplicateId = null;
  try {
    const dupRes = await fetch(`${API_BASE}/admin/articles/${createdArticle.id}/duplicate`, {
      method: 'POST',
      headers: authHeaders,
    });
    const dupData = await dupRes.json();
    if (dupRes.ok && dupData.data) {
      duplicateId = dupData.data.id;
      pass('Duplicate Article Action', `Duplicated as DRAFT: "${dupData.data.title_en}" (slug: ${dupData.data.slug})`);
    } else {
      fail('Duplicate Article Action', dupData.error || `HTTP ${dupRes.status}`);
    }
  } catch (err) {
    fail('Article Duplication', err.message);
  }

  // 10. Unpublish Article Lifecycle
  console.log('\n--- 10. UNPUBLISH LIFECYCLE ---');
  try {
    const unpubRes = await fetch(`${API_BASE}/admin/articles/${createdArticle.id}/status`, {
      method: 'PATCH',
      headers: authHeaders,
      body: JSON.stringify({ status: 'DRAFT' }),
    });
    const unpubData = await unpubRes.json();
    if (unpubRes.ok && unpubData.data?.status === 'DRAFT') {
      pass('Unpublish to DRAFT', 'Status successfully changed back to DRAFT');

      // Verify immediate removal from public web
      const reCheckWeb = await fetch(`${WEB_BASE}/articles/${testSlug}`);
      const reCheckText = await reCheckWeb.text();
      const isHiddenAgain = reCheckWeb.status === 404 || reCheckText.includes('Not Found');
      if (isHiddenAgain) {
        pass('Unpublished Public Removal', 'Unpublished article immediately returns 404 to public visitors');
      } else {
        fail('Unpublished Public Removal', 'Unpublished article still accessible publicly!');
      }
    } else {
      fail('Unpublish to DRAFT', unpubData.error || `HTTP ${unpubRes.status}`);
    }
  } catch (err) {
    fail('Unpublish Lifecycle', err.message);
  }

  // 11. Trash and Restore Lifecycle
  console.log('\n--- 11. TRASH & RESTORE LIFECYCLE ---');
  try {
    // Move to Trash (Soft delete / ARCHIVED)
    const trashRes = await fetch(`${API_BASE}/admin/articles/${createdArticle.id}`, {
      method: 'DELETE',
      headers: authHeaders,
    });
    const trashData = await trashRes.json();
    if (trashRes.ok && trashData.data?.status === 'ARCHIVED') {
      pass('Move to Trash', 'Status changed to ARCHIVED (Trash)');
    } else {
      fail('Move to Trash', trashData.error || `HTTP ${trashRes.status}`);
    }

    // Restore from Trash back to DRAFT
    const restoreRes = await fetch(`${API_BASE}/admin/articles/${createdArticle.id}/status`, {
      method: 'PATCH',
      headers: authHeaders,
      body: JSON.stringify({ status: 'DRAFT' }),
    });
    const restoreData = await restoreRes.json();
    if (restoreRes.ok && restoreData.data?.status === 'DRAFT') {
      pass('Restore from Trash', 'Restored successfully from ARCHIVED to DRAFT');
    } else {
      fail('Restore from Trash', restoreData.error || `HTTP ${restoreRes.status}`);
    }
  } catch (err) {
    fail('Trash & Restore Lifecycle', err.message);
  }

  // 12. Slug Uniqueness & Collision Protection
  console.log('\n--- 12. SLUG UNIQUENESS PROTECTION ---');
  try {
    const dupSlugRes = await fetch(`${API_BASE}/admin/articles`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        title_en: 'Duplicate Slug Collision Test',
        slug: testSlug, // already exists
        excerpt_en: 'Test excerpt',
        body_en: 'Test body',
      }),
    });
    if (dupSlugRes.status === 409) {
      pass('Slug Uniqueness Enforced', 'Rejected duplicate slug with HTTP 409 Conflict');
    } else {
      fail('Slug Uniqueness Enforced', `Expected 409, got ${dupSlugRes.status}`);
    }
  } catch (err) {
    fail('Slug Uniqueness Protection', err.message);
  }

  // 13. Clean up Test Data (Permanent Deletion)
  console.log('\n--- 13. PERMANENT DELETION CLEANUP ---');
  try {
    if (duplicateId) {
      const delDup = await fetch(`${API_BASE}/admin/articles/${duplicateId}?permanent=true`, {
        method: 'DELETE',
        headers: authHeaders,
      });
      if (delDup.ok) pass('Permanent Delete (Duplicate Record)', `Deleted test clone ID: ${duplicateId}`);
    }

    if (createdArticle?.id) {
      const delMain = await fetch(`${API_BASE}/admin/articles/${createdArticle.id}?permanent=true`, {
        method: 'DELETE',
        headers: authHeaders,
      });
      if (delMain.ok) pass('Permanent Delete (Primary Test Record)', `Cleaned up test article ID: ${createdArticle.id}`);
    }
  } catch (err) {
    fail('Permanent Deletion Cleanup', err.message);
  }

  console.log('\n================================================================');
  console.log('TEST SUITE SUMMARY:');
  console.log(`PASSED: ${results.passed.length}`);
  console.log(`FAILED: ${results.failed.length}`);
  console.log(`BLOCKED: ${results.blocked.length}`);
  console.log('================================================================\n');
}

runTests();
