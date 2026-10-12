import { prisma } from '../src/db.js';

async function main() {
  const cols = await prisma.$queryRawUnsafe(
    "SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'articles' ORDER BY ordinal_position"
  );
  console.log('Columns in articles table:', cols);

  const existingArticles = await prisma.articles.findMany({
    select: { id: true, slug: true, title_en: true, status: true }
  });
  console.log('Existing articles count:', existingArticles.length);
  console.log('Existing articles:', existingArticles);

  const destinations = await prisma.destinations.findMany({
    select: { id: true, slug: true, name_en: true, state_name: true, status: true }
  });
  console.log('Existing destinations:', destinations);

  const states = await prisma.states.findMany({
    select: { id: true, slug: true, name_en: true, status: true }
  });
  console.log('Existing states:', states);

  const districts = await prisma.districts.findMany({
    select: { id: true, slug: true, name_en: true, state_id: true }
  });
  console.log('Existing districts count:', districts.length);
}

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
