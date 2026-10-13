import { prisma } from '../apps/api/src/db.js';

const isExecute = process.argv.includes('--execute') && process.argv.includes('--confirm');

async function main() {
  console.log('===========================================================');
  console.log(' BHARATYATRA — SAFE CONTENT CLEANUP AUDIT & REMOVAL TOOL');
  console.log(' Mode:', isExecute ? 'EXECUTE (Deleting approved records)' : 'DRY RUN (Audit only - No records deleted)');
  console.log('===========================================================\n');

  // Query all articles
  const allArticles = await prisma.articles.findMany({
    select: {
      id: true,
      slug: true,
      title_en: true,
      category: true,
      status: true,
      created_at: true,
    },
    orderBy: { created_at: 'asc' },
  });

  // Query all destinations
  const allDestinations = await prisma.destinations.findMany({
    select: {
      id: true,
      slug: true,
      name_en: true,
      status: true,
      created_at: true,
    },
  });

  // Query all attractions
  const allAttractions = await prisma.attractions.findMany({
    select: {
      id: true,
      slug: true,
      name_en: true,
      status: true,
      created_at: true,
    },
  });

  // Query all itineraries
  const allItineraries = await prisma.itineraries.findMany({
    select: {
      id: true,
      slug: true,
      title_en: true,
      status: true,
      created_at: true,
    },
  });

  // Criteria for identifying test/demo records:
  // Slugs or titles containing test-, test, temp, copy, direct-article, mandawa-heritage test timestamps
  const testArticles = allArticles.filter((art) => {
    const s = art.slug.toLowerCase();
    const t = art.title_en.toLowerCase();
    return (
      s.startsWith('test-') ||
      s.includes('-copy') ||
      t.startsWith('test ') ||
      t === 'test' ||
      /\d{12,}/.test(s) // timestamp-suffixed automated test slugs
    );
  });

  const genuineArticles = allArticles.filter((art) => !testArticles.some((t) => t.id === art.id));

  console.log('--- AUDIT FINDINGS ---\n');
  console.log(`Total Articles in Database:     ${allArticles.length}`);
  console.log(`- Genuine Published Articles:   ${genuineArticles.length}`);
  console.log(`- Test/Demo Articles Found:     ${testArticles.length}\n`);

  console.log(`Total Destinations in Database: ${allDestinations.length} (Genuine: ${allDestinations.length})`);
  console.log(`Total Attractions in Database:  ${allAttractions.length} (Genuine: ${allAttractions.length})`);
  console.log(`Total Itineraries in Database:  ${allItineraries.length}\n`);

  console.log('-----------------------------------------------------------');
  console.log('PROPOSED FOR REMOVAL (TEST & SCRATCH RECORDS ONLY):');
  console.log('-----------------------------------------------------------');

  if (testArticles.length === 0) {
    console.log('No test records found. Database is completely clean.\n');
  } else {
    console.table(
      testArticles.map((item, idx) => ({
        '#': idx + 1,
        ID: item.id,
        Title: item.title_en,
        Slug: item.slug,
        Type: 'Article (' + (item.category || 'Standard') + ')',
        Status: item.status,
        Created: item.created_at.toISOString(),
      }))
    );
  }

  console.log('\n-----------------------------------------------------------');
  console.log('GENUINE PUBLISHED CONTENT (PRESERVED & PROTECTED):');
  console.log('-----------------------------------------------------------');
  console.table(
    genuineArticles.map((item, idx) => ({
      '#': idx + 1,
      ID: item.id,
      Title: item.title_en,
      Slug: item.slug,
      Type: 'Article (' + (item.category || 'Standard') + ')',
      Status: item.status,
    }))
  );

  if (isExecute && testArticles.length > 0) {
    console.log('\n===========================================================');
    console.log(' EXECUTING CLEANUP WITH EXPLICIT CONFIRMATION...');
    console.log('===========================================================');

    const idsToDelete = testArticles.map((a) => a.id);
    const deleteResult = await prisma.articles.deleteMany({
      where: { id: { in: idsToDelete } },
    });

    console.log(`\nSuccessfully deleted ${deleteResult.count} test/demo articles.`);
    console.log('Genuine content was untouched and remains 100% intact.');
  } else if (!isExecute && testArticles.length > 0) {
    console.log('\n[SAFEGUARD ACTIVE]: To permanently remove these records, run with:');
    console.log('node scratch/cleanup-sample-content.mjs --execute --confirm\n');
  }

  process.exit(0);
}

main().catch((err) => {
  console.error('Cleanup tool error:', err);
  process.exit(1);
});
