import { prisma } from '../src/db.js';

async function migrate() {
  console.log('Applying backward-compatible migrations to articles table...');
  
  await prisma.$executeRawUnsafe(`
    ALTER TABLE articles 
    ADD COLUMN IF NOT EXISTS category text,
    ADD COLUMN IF NOT EXISTS tags text,
    ADD COLUMN IF NOT EXISTS destination_id uuid REFERENCES destinations(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS state_id uuid REFERENCES states(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS cover_image_url text,
    ADD COLUMN IF NOT EXISTS cover_image_alt text,
    ADD COLUMN IF NOT EXISTS canonical_url text;
  `);

  console.log('Migration complete. Verifying columns...');
  const cols = await prisma.$queryRawUnsafe(
    "SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'articles' ORDER BY ordinal_position"
  );
  console.log('Updated columns:', cols.map(c => c.column_name));
}

migrate()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
  });
