import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const articles = await prisma.articles.findMany({
    select: { id: true, slug: true, category: true, title_en: true, status: true }
  });
  console.log("Articles:", JSON.stringify(articles, null, 2));

  const destinations = await prisma.destinations.findMany({
    select: { id: true, slug: true, name_en: true, status: true }
  });
  console.log("Destinations:", JSON.stringify(destinations, null, 2));

  const attractions = await prisma.attractions.findMany({
    select: { id: true, slug: true, name_en: true, category: true, status: true }
  });
  console.log("Attractions:", JSON.stringify(attractions, null, 2));
}
main().finally(() => prisma.$disconnect());
