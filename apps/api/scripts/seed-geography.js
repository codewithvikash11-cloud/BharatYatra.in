import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const indiaStatesAndUTs = [
  // States (28)
  { slug: 'andhra-pradesh', name_en: 'Andhra Pradesh', type: 'STATE' },
  { slug: 'arunachal-pradesh', name_en: 'Arunachal Pradesh', type: 'STATE' },
  { slug: 'assam', name_en: 'Assam', type: 'STATE' },
  { slug: 'bihar', name_en: 'Bihar', type: 'STATE' },
  { slug: 'chhattisgarh', name_en: 'Chhattisgarh', type: 'STATE' },
  { slug: 'goa', name_en: 'Goa', type: 'STATE' },
  { slug: 'gujarat', name_en: 'Gujarat', type: 'STATE' },
  { slug: 'haryana', name_en: 'Haryana', type: 'STATE' },
  { slug: 'himachal-pradesh', name_en: 'Himachal Pradesh', type: 'STATE' },
  { slug: 'jharkhand', name_en: 'Jharkhand', type: 'STATE' },
  { slug: 'karnataka', name_en: 'Karnataka', type: 'STATE' },
  { slug: 'kerala', name_en: 'Kerala', type: 'STATE' },
  { slug: 'madhya-pradesh', name_en: 'Madhya Pradesh', type: 'STATE' },
  { slug: 'maharashtra', name_en: 'Maharashtra', type: 'STATE' },
  { slug: 'manipur', name_en: 'Manipur', type: 'STATE' },
  { slug: 'meghalaya', name_en: 'Meghalaya', type: 'STATE' },
  { slug: 'mizoram', name_en: 'Mizoram', type: 'STATE' },
  { slug: 'nagaland', name_en: 'Nagaland', type: 'STATE' },
  { slug: 'odisha', name_en: 'Odisha', type: 'STATE' },
  { slug: 'punjab', name_en: 'Punjab', type: 'STATE' },
  { slug: 'rajasthan', name_en: 'Rajasthan', type: 'STATE' },
  { slug: 'sikkim', name_en: 'Sikkim', type: 'STATE' },
  { slug: 'tamil-nadu', name_en: 'Tamil Nadu', type: 'STATE' },
  { slug: 'telangana', name_en: 'Telangana', type: 'STATE' },
  { slug: 'tripura', name_en: 'Tripura', type: 'STATE' },
  { slug: 'uttar-pradesh', name_en: 'Uttar Pradesh', type: 'STATE' },
  { slug: 'uttarakhand', name_en: 'Uttarakhand', type: 'STATE' },
  { slug: 'west-bengal', name_en: 'West Bengal', type: 'STATE' },
  
  // Union Territories (8)
  { slug: 'andaman-and-nicobar-islands', name_en: 'Andaman and Nicobar Islands', type: 'UT' },
  { slug: 'chandigarh', name_en: 'Chandigarh', type: 'UT' },
  { slug: 'dadra-and-nagar-haveli-and-daman-and-diu', name_en: 'Dadra and Nagar Haveli and Daman and Diu', type: 'UT' },
  { slug: 'delhi', name_en: 'Delhi', type: 'UT' },
  { slug: 'jammu-and-kashmir', name_en: 'Jammu and Kashmir', type: 'UT' },
  { slug: 'ladakh', name_en: 'Ladakh', type: 'UT' },
  { slug: 'lakshadweep', name_en: 'Lakshadweep', type: 'UT' },
  { slug: 'puducherry', name_en: 'Puducherry', type: 'UT' }
];

async function seedGeography() {
  console.log('Starting geography seed...');
  
  for (const item of indiaStatesAndUTs) {
    await prisma.states.upsert({
      where: { slug: item.slug },
      update: {
        name_en: item.name_en,
        type: item.type,
      },
      create: {
        slug: item.slug,
        name_en: item.name_en,
        type: item.type,
        status: 'PUBLISHED',
      },
    });
  }

  console.log('✅ Successfully seeded 28 States and 8 Union Territories.');
}

seedGeography()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
