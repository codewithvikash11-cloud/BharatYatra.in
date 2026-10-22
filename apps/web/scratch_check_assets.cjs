const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const assets = await prisma.media_assets.findMany();
  console.log('Total media assets:', assets.length);
  for (const a of assets) {
    console.log(`[${a.storage_path}] -> ${a.public_url}`);
  }

  const articles = await prisma.articles.findMany({
    select: { slug: true, title_en: true, cover_image_url: true }
  });
  console.log('\nArticles:');
  for (const art of articles) {
    console.log(`[${art.slug}] cover: ${art.cover_image_url}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
