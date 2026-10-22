import prisma from './db.js';

// Curated editorial defaults for BharatYatra
export const DEFAULT_APPEARANCE = {
  'site/brand/logo': '/image.png',
  'site/brand/navbar_logo': '/image.png',
  'site/brand/favicon': '/icon.svg',
  'site/home/hero': 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1920&q=85', // Majestic Indian architecture
  'site/home/cta-bg': 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1920&q=85', // Kerala backwaters & serene nature
  'site/regions/north': 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80', // Himalayas / Kashmir
  'site/regions/south': 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80', // Kerala tea gardens / backwaters
  'site/regions/east': 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80', // Konark / Bengal heritage
  'site/regions/west': 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80', // Rajasthan Havelis / Thar desert
  'site/regions/central': 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=800&q=80', // Khajuraho / Bandhavgarh
  'site/regions/northeast': 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?auto=format&fit=crop&w=800&q=80', // Meghalaya Living Root Bridges
};

// Curated unique image fallbacks for articles and destinations to avoid repetition
export const TOPIC_CURATED_IMAGES = {
  heritage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=900&q=80',
  haveli: 'https://images.unsplash.com/photo-1609137144822-44670087c536?auto=format&fit=crop&w=900&q=80',
  food: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=900&q=80',
  routes: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=900&q=80',
  culture: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=900&q=80',
  nature: 'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=900&q=80',
  desert: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=900&q=80',
  temple: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=900&q=80',
};

export function getEditorialImage(item, fallbackTopic = 'heritage') {
  if (item?.cover_image_url) return item.cover_image_url;
  
  const text = `${item?.slug || ''} ${item?.title_en || ''} ${item?.name_en || ''} ${item?.category || ''}`.toLowerCase();
  
  if (text.includes('food') || text.includes('culture') || text.includes('culinary')) {
    return TOPIC_CURATED_IMAGES.food;
  }
  if (text.includes('route') || text.includes('timing') || text.includes('plan') || text.includes('tips')) {
    return TOPIC_CURATED_IMAGES.routes;
  }
  if (text.includes('haveli') || text.includes('fresco') || text.includes('mural')) {
    return TOPIC_CURATED_IMAGES.haveli;
  }
  if (text.includes('explore') || text.includes('places') || text.includes('around')) {
    return TOPIC_CURATED_IMAGES.heritage;
  }
  if (text.includes('temple') || text.includes('sacred') || text.includes('spiritual')) {
    return TOPIC_CURATED_IMAGES.temple;
  }
  
  return TOPIC_CURATED_IMAGES[fallbackTopic] || TOPIC_CURATED_IMAGES.heritage;
}

export async function getSiteAppearance() {
  try {
    const assets = await prisma.media_assets.findMany({
      where: { storage_path: { startsWith: 'site/' } },
      select: { storage_path: true, public_url: true }
    });

    const map = { ...DEFAULT_APPEARANCE };
    for (const asset of assets) {
      if (asset.public_url) {
        map[asset.storage_path] = asset.public_url;
      }
    }
    return map;
  } catch (err) {
    // Return resilient defaults if DB is temporarily busy on serverless cold starts
    return DEFAULT_APPEARANCE;
  }
}
