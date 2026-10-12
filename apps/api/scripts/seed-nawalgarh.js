import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedNawalgarh() {
  console.log('--- Starting Nawalgarh & Shekhawati Demo Seed ---');

  // 1. Fetch Rajasthan state
  let rajasthan = await prisma.states.findUnique({
    where: { slug: 'rajasthan' },
  });

  if (!rajasthan) {
    console.log('Seeding Rajasthan state...');
    rajasthan = await prisma.states.create({
      data: {
        slug: 'rajasthan',
        name_en: 'Rajasthan',
        name_hi: 'राजस्थान',
        type: 'STATE',
        status: 'PUBLISHED',
        description_en: 'The Land of Kings, renowned for vibrant culture, forts, palaces, and historic heritage towns.',
      },
    });
  }

  // 2. Upsert Jhunjhunu District
  let jhunjhunu = await prisma.districts.findFirst({
    where: { state_id: rajasthan.id, slug: 'jhunjhunu' },
  });

  if (!jhunjhunu) {
    console.log('Creating Jhunjhunu district...');
    jhunjhunu = await prisma.districts.create({
      data: {
        state_id: rajasthan.id,
        slug: 'jhunjhunu',
        name_en: 'Jhunjhunu',
        name_hi: 'झुंझुनू',
        status: 'PUBLISHED',
        description_en: 'Heart of the historic Shekhawati region, famous across the world for open-air fresco galleries and grand merchant havelis.',
      },
    });
  }

  // 3. Upsert Nawalgarh Tehsil
  let tehsil = await prisma.tehsils.findFirst({
    where: { district_id: jhunjhunu.id, slug: 'nawalgarh' },
  });

  if (!tehsil) {
    console.log('Creating Nawalgarh tehsil...');
    tehsil = await prisma.tehsils.create({
      data: {
        district_id: jhunjhunu.id,
        slug: 'nawalgarh',
        name_en: 'Nawalgarh',
        name_hi: 'नवलगढ़',
        local_label: 'Tehsil & Heritage Municipality',
        status: 'PUBLISHED',
      },
    });
  }

  // 4. Upsert Nawalgarh Destination
  const nawalgarhSlug = 'nawalgarh-rajasthan';
  console.log(`Upserting Destination: ${nawalgarhSlug}...`);
  const destination = await prisma.destinations.upsert({
    where: { slug: nawalgarhSlug },
    update: {
      name_en: 'Nawalgarh',
      name_hi: 'नवलगढ़',
      summary_en: 'Often called the Golden City of Shekhawati, Nawalgarh is celebrated for its hundreds of painted merchant havelis, rich Marwari commerce history, and serene heritage lanes.',
      description_en: 'Founded in 1737 by Thakur Nawal Singh, Nawalgarh serves as the cultural heart of Rajasthan’s Shekhawati circuit. The town flourished as a mercantile hub along historic caravan routes, where affluent Marwari trading families commissioned lavish mansions adorned with exquisite fresco murals depicting mythology, European trains, daily life, and courtly ceremonies.',
      state_name: 'Rajasthan',
      district_name: 'Jhunjhunu',
      state_id: rajasthan.id,
      district_id: jhunjhunu.id,
      tehsil_id: tehsil.id,
      latitude: 27.8499,
      longitude: 75.2699,
      best_time_en: 'October to March (pleasant desert winter months)',
      status: 'PUBLISHED',
      published_at: new Date(),
    },
    create: {
      slug: nawalgarhSlug,
      name_en: 'Nawalgarh',
      name_hi: 'नवलगढ़',
      summary_en: 'Often called the Golden City of Shekhawati, Nawalgarh is celebrated for its hundreds of painted merchant havelis, rich Marwari commerce history, and serene heritage lanes.',
      description_en: 'Founded in 1737 by Thakur Nawal Singh, Nawalgarh serves as the cultural heart of Rajasthan’s Shekhawati circuit. The town flourished as a mercantile hub along historic caravan routes, where affluent Marwari trading families commissioned lavish mansions adorned with exquisite fresco murals depicting mythology, European trains, daily life, and courtly ceremonies.',
      state_name: 'Rajasthan',
      district_name: 'Jhunjhunu',
      state_id: rajasthan.id,
      district_id: jhunjhunu.id,
      tehsil_id: tehsil.id,
      latitude: 27.8499,
      longitude: 75.2699,
      best_time_en: 'October to March (pleasant desert winter months)',
      status: 'PUBLISHED',
      published_at: new Date(),
    },
  });

  // 5. Upsert Nawalgarh Attractions
  const attractionsData = [
    {
      slug: 'dr-ramnath-a-poddar-haveli-museum',
      name_en: 'Dr. Ramnath A. Poddar Haveli Museum',
      description_en: 'Built in the 1920s, this meticulously restored heritage museum showcases over 750 vivid fresco murals spanning religious themes, desert lifestyle, royal processions, and rare depictions of steam locomotives and hot air balloons.',
      category: 'Museum & Haveli',
      visiting_hours: 'Typically open during daytime hours; verify locally before visiting',
      entry_fee_note: 'Nominal admission fee charged by the private trust; photography charges may apply',
    },
    {
      slug: 'morarka-haveli-museum',
      name_en: 'Morarka Haveli Museum',
      description_en: 'A premier example of traditional Shekhawati courtyard architecture, known for its remarkably preserved exterior friezes, courtyards, and detailed paintings illustrating Krishna Leela and epic folklore.',
      category: 'Heritage Haveli',
      visiting_hours: 'Open during standard daylight hours',
      entry_fee_note: 'Entry ticket managed on-site by caretaker',
    },
    {
      slug: 'aath-haveli-complex',
      name_en: 'Aath Haveli Complex',
      description_en: 'A fascinating architectural cluster of eight historic havelis showing the chronological evolution of fresco art styles from early natural vegetable dyes to late colonial-influenced themes.',
      category: 'Architectural Cluster',
      visiting_hours: 'Exterior viewing accessible; individual haveli entry depends on resident caretakers',
      entry_fee_note: 'Free exterior walking; courtesy tips customary for caretakers',
    },
    {
      slug: 'roop-niwas-kothi',
      name_en: 'Roop Niwas Kothi & Heritage Grounds',
      description_en: 'Originally built as a country palace for Nawalgarh nobility, this sprawling heritage property combines traditional Rajput architecture with European palatial accents and landscaped gardens.',
      category: 'Heritage Estate',
      visiting_hours: 'Heritage hotel premises; restaurant and ground visits available by reservation or prior inquiry',
      entry_fee_note: 'Guest access and dining patrons',
    },
    {
      slug: 'bala-kila-fort',
      name_en: 'Bala Kila Fort & Clock Tower',
      description_en: 'The historic fortified stronghold at the heart of Nawalgarh, featuring surviving bastions, ancient ramparts, and the town’s iconic heritage clock tower marking the old market square.',
      category: 'Fort & Landmark',
      visiting_hours: 'Central town landmark; accessible throughout the day in the bazaar core',
      entry_fee_note: 'Free public access to perimeter and bazaar area',
    },
  ];

  for (const item of attractionsData) {
    console.log(`Upserting Attraction: ${item.slug}...`);
    await prisma.attractions.upsert({
      where: {
        destination_id_slug: {
          destination_id: destination.id,
          slug: item.slug,
        },
      },
      update: {
        name_en: item.name_en,
        description_en: item.description_en,
        category: item.category,
        visiting_hours: item.visiting_hours,
        entry_fee_note: item.entry_fee_note,
        status: 'PUBLISHED',
        published_at: new Date(),
      },
      create: {
        destination_id: destination.id,
        slug: item.slug,
        name_en: item.name_en,
        description_en: item.description_en,
        category: item.category,
        visiting_hours: item.visiting_hours,
        entry_fee_note: item.entry_fee_note,
        status: 'PUBLISHED',
        published_at: new Date(),
      },
    });
  }

  // 6. Upsert the 5 Demo Articles
  const demoArticles = [
    {
      slug: 'nawalgarh-rajasthan-travel-guide',
      title_en: 'Nawalgarh, Rajasthan: A Travel Guide to the Shekhawati Heritage Town',
      excerpt_en: 'Discover Nawalgarh, the golden heart of Rajasthan’s Shekhawati region. From fresco-adorned merchant havelis to historic bazaars, explore the best sights, architecture, and cultural highlights.',
      category: 'Travel Guides',
      tags: JSON.stringify(['demo', 'nawalgarh', 'rajasthan', 'shekhawati', 'travel-guide']),
      author_name: 'BharatYatra Editorial',
      cover_image_url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
      cover_image_alt: 'Intricate Rajasthani heritage archways and frescoes in Nawalgarh',
      seo_title_en: 'Nawalgarh Rajasthan Travel Guide: Shekhawati Heritage Town',
      seo_description_en: 'Complete travel guide to Nawalgarh, Rajasthan. Explore painted havelis, Poddar Museum, historic bazaars, and essential Shekhawati travel tips.',
      canonical_url: 'https://bharat-yatra-in.vercel.app/articles/nawalgarh-rajasthan-travel-guide',
      body_en: `## Welcome to the Golden Town of Shekhawati

Nestled in the Jhunjhunu district of Rajasthan, **Nawalgarh** is revered by art lovers and historians as the "Open-Air Art Gallery" of India. Unlike fortified desert capitals like Jodhpur or Jaisalmer, Nawalgarh’s skyline is defined not just by ramparts, but by hundreds of opulent, brightly painted merchant mansions known as *havelis*.

Founded in 1737 by Thakur Nawal Singh, the town served as a bustling trading enclave along vital caravan routes connecting northern India with western sea ports. During the late 19th and early 20th centuries, wealthy Marwari merchants transformed their ancestral homes into extraordinary canvases of mural art.

---

### Highlights of Nawalgarh

1. **Dr. Ramnath A. Poddar Haveli Museum:** A magnificent repository with over 750 restored murals detailing Rajasthani folklore, religious epics, and technological curiosities of the colonial era.
2. **Morarka Haveli:** Famed for its serene courtyards and intricate ceiling woodwork.
3. **Aath Haveli:** An architectural grouping illustrating how fresco pigments shifted from organic vegetable dyes to imported chemical colors over decades.
4. **Heritage Bazaar Walks:** Narrow cobblestone alleyways filled with brass artisans, spice vendors, and traditional bangle-makers.

---

### Best Time to Visit

The desert plains of Shekhawati experience warm summers. The most pleasant time to plan your visit is between **October and March**, when days are sunny and evenings bring a crisp, refreshing chill ideal for walking tours.

---

### Getting There

- **By Road:** Nawalgarh is approximately 140 km from Jaipur (around 3 to 3.5 hours drive via NH52) and roughly 275 km from New Delhi.
- **By Rail:** Nawalgarh has a railway station connecting directly to Jaipur, Sikar, and Delhi Sarai Rohilla on regional routes.
- **By Air:** The nearest airport is Jaipur International Airport (JAI), with frequent domestic and international connections.
`,
    },
    {
      slug: 'exploring-nawalgarh-havelis-fresco-heritage',
      title_en: "Exploring Nawalgarh's Havelis and Fresco Heritage",
      excerpt_en: 'Step into a world where walls tell stories. Explore the unique fresco techniques, pigments, and motifs that distinguish Nawalgarh’s painted havelis from anywhere else in India.',
      category: 'Heritage & Culture',
      tags: JSON.stringify(['demo', 'nawalgarh', 'havelis', 'fresco-art', 'rajasthan-heritage']),
      author_name: 'BharatYatra Editorial',
      cover_image_url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
      cover_image_alt: 'Carved sandstone balconies and exterior murals in Shekhawati havelis',
      seo_title_en: "Exploring Nawalgarh's Havelis & Fresco Murals | BharatYatra",
      seo_description_en: 'A deep dive into the fresco murals, pigments, and architecture of Nawalgarh havelis in Rajasthan.',
      canonical_url: 'https://bharat-yatra-in.vercel.app/articles/exploring-nawalgarh-havelis-fresco-heritage',
      body_en: `## The Wall Paintings of Shekhawati

In Rajasthan’s Shekhawati region, art was not confined to museum corridors or royal palace vaults—it was painted across every arch, doorway, and inner courtyard of the merchant havelis. In **Nawalgarh**, this artistic expression reached its aesthetic zenith.

---

### The *Fresco Secco* and *Buon Fresco* Techniques

Local masons and painters (*chiteras*) developed sophisticated techniques to ensure murals could withstand centuries of desert heat and monsoonal humidity:

- **Araysh Plaster:** A mirror-smooth lime plaster made by grinding limestone with marble dust, curd, and natural binders, polished with agate stones.
- **Natural Pigments:** Early frescoes drew upon mineral and botanical sources—lampblack for deep charcoal, yellow ochre from clay, copper sulfate for greens, and lapis lazuli for azure blues.
- **Transition to Modern Pigments:** In the late 19th century, German synthetic dyes introduced brilliant synthetic ultramarine blues and crimsons, visible in later haveli facades.

---

### Fascinating Motifs and Themes

What makes Nawalgarh’s frescoes genuinely captivating is the juxtaposition of traditional Hindu iconography with contemporary inventions observed during merchant travels:

- **Epics & Mythology:** Scenes from the Ramayana, Mahabharata, and playful depictions of Krishna dancing with the Gopis.
- **Modern Marvels:** English steam locomotives, early biplanes, gramophones, and Victorian portraits depicted with curious Rajput artistic sensibilities.
- **Courtly Life:** Processions of royal elephants, camels, court dancers, and hunting expeditions along the Aravalli hills.

---

### Tips for Haveli Explorers

- Carry a small flashlight to inspect ceilings in shaded inner courtyards (*zenana* quarters).
- Respect local private owners: several havelis remain private family residences or trust properties.
- Hire an authorized local guide in Nawalgarh to understand the historical context behind specific mural panels.
`,
    },
    {
      slug: 'places-to-explore-in-and-around-nawalgarh',
      title_en: 'Places to Explore in and Around Nawalgarh',
      excerpt_en: 'Beyond the famed Poddar and Morarka havelis, discover hidden cenotaphs, stepwells, the clock tower bazaar, and scenic day trips across Jhunjhunu and Sikar districts.',
      category: 'Sightseeing',
      tags: JSON.stringify(['demo', 'nawalgarh', 'sightseeing', 'jhunjhunu', 'day-trips']),
      author_name: 'BharatYatra Editorial',
      cover_image_url: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80',
      cover_image_alt: 'Historic Indian heritage landmarks and stone architecture',
      seo_title_en: 'Places to Explore in and Around Nawalgarh, Rajasthan',
      seo_description_en: 'Discover top sightseeing spots in and around Nawalgarh: Bala Kila Fort, stepwells, Dundlod, Mandawa, and Jhunjhunu.',
      canonical_url: 'https://bharat-yatra-in.vercel.app/articles/places-to-explore-in-and-around-nawalgarh',
      body_en: `## Uncovering Nawalgarh & Shekhawati Surroundings

While Nawalgarh itself holds enough painted architecture to fill multiple days of walking, its strategic location makes it an ideal base for exploring neighboring heritage hamlets across the Shekhawati triangle.

---

### Top Sights Inside Nawalgarh

1. **Dr. Ramnath A. Poddar Haveli Museum**
   The quintessential starting point. The museum houses dedicated galleries for musical instruments, regional costumes, and rare miniature models alongside its legendary frescoes.

2. **The Clock Tower (Ghantaghar) and Poddar Chhatris**
   Standing at the crossroads of Nawalgarh’s main bazaar, the clock tower marks the pulse of the town. Nearby, the domed cenotaphs (*chhatris*) feature memorial paintings honoring revered town founders.

3. **Bala Kila (The Fort)**
   Built by Thakur Nawal Singh in the 18th century, parts of the fort now house local administrative offices and markets, but its massive corner bastions still stand tall.

4. **Koolwal Kothi & Roop Niwas**
   Stately residences illustrating the European-influenced palatial architecture favored by merchant dynasties in the early 1900s.

---

### Day Excursions in the Region

- **Dundlod (approx. 7 km):** Known for Dundlod Fort and magnificent equestrian heritage featuring indigenous Marwari horses.
- **Mandawa (approx. 30 km):** Another famed fresco town featuring Castle Mandawa, Chokhani Haveli, and buzzing cultural cafes.
- **Fatehpur Shekhawati (approx. 45 km):** Renowned for the Nadine Le Prince Cultural Centre, a French artist’s restoration project of the 1802 Haveli Devra.
- **Jhunjhunu (approx. 40 km):** The district headquarters, home to the sprawling Rani Sati Temple and Khetri Mahal with its open-air wind palaces.
`,
    },
    {
      slug: 'nawalgarh-local-culture-food-travel-experiences',
      title_en: "Nawalgarh's Local Culture, Food, and Travel Experiences",
      excerpt_en: 'Immerse yourself in authentic Shekhawati hospitality: savor piping-hot Pyaaz Kachoris, Ghevar, and Daal Baati Churma, and experience the warm cadence of heritage town life.',
      category: 'Food & Culture',
      tags: JSON.stringify(['demo', 'nawalgarh', 'rajasthani-food', 'culture', 'local-cuisine']),
      author_name: 'BharatYatra Editorial',
      cover_image_url: 'https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&w=1200&q=80',
      cover_image_alt: 'Traditional Rajasthani cultural flavors and heritage street atmosphere',
      seo_title_en: "Nawalgarh Local Culture, Food & Experiences | BharatYatra",
      seo_description_en: 'A culinary and cultural travel journey through Nawalgarh, Rajasthan: local street delicacies, artisanal crafts, and Marwari traditions.',
      canonical_url: 'https://bharat-yatra-in.vercel.app/articles/nawalgarh-local-culture-food-travel-experiences',
      body_en: `## Savoring the Spirit of Shekhawati

To truly appreciate Nawalgarh, one must look beyond the painted lime walls and embrace the rhythmic cadence of daily life in Rajasthan’s heartland. From early morning temple chimes to the aromas of pure ghee sweets drifting through bazaar alleys, Nawalgarh offers an intimate and authentic cultural experience.

---

### Must-Try Local Delicacies

Rajasthani cuisine was historically shaped by arid climate conditions, emphasizing rich dairy, lentils, and sun-dried spices that could sustain travelers across desert trails.

1. **Pyaaz and Hing Kachoris:**
   Fried to golden perfection in local *halwai* shops, crisp kachoris stuffed with spiced onions and asafoetida are the quintessential morning breakfast.
2. **Daal Baati Churma:**
   Crushed wheat dough dumplings baked over fire, generously dipped in pure desi ghee, paired with five-lentil *panchmel* dal and sweet almond churma.
3. **Ker Sangri & Gatte ki Sabzi:**
   Authentic desert delicacies prepared with dried wild desert capers (*ker*) and desert beans (*sangri*), simmered in tangy yogurt gravies.
4. **Mawa Peda & Ghevar:**
   Rich condensed-milk confections crafted fresh in Nawalgarh's traditional sweetshops.

---

### Artisanal Crafts & Souvenirs

- **Tie & Dye (Bandhani & Leheriya):** Discover colorful sarees, turbans, and dupattas crafted with intricate resist-dyeing methods by skilled local artisans.
- **Miniature Haveli Paintings:** Local painters continue to produce small-scale gouache paintings on handmade paper and stone slabs, replicating authentic Shekhawati fresco motifs.
- **Wooden Handicrafts & Carved Brackets:** Reclaimed teak and sheesham carvings salvaged from heritage restorations.

---

### Responsible Travel & Cultural Etiquette

- Dress modestly when strolling through heritage alleys and residential neighborhoods.
- Greet locals with a respectful *"Khamma Ghani"* (traditional Rajasthani greeting).
- Inquire before photographing residents or private home interiors.
`,
    },
    {
      slug: 'planning-visit-to-nawalgarh-routes-timing-tips',
      title_en: 'Planning a Visit to Nawalgarh: Routes, Timing, and Practical Tips',
      excerpt_en: 'Everything you need to plan a seamless journey to Nawalgarh: transport options, recommended 2-day itinerary, packing essentials, and local travel advice.',
      category: 'Travel Tips',
      tags: JSON.stringify(['demo', 'nawalgarh', 'travel-tips', 'itinerary', 'rajasthan-planning']),
      author_name: 'BharatYatra Editorial',
      cover_image_url: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80',
      cover_image_alt: 'Sunset over historic stone architecture and desert road in Rajasthan',
      seo_title_en: 'Planning a Visit to Nawalgarh: Routes, Timing & Travel Tips',
      seo_description_en: 'Practical travel guide for visiting Nawalgarh: routes from Delhi and Jaipur, packing advice, 2-day itinerary, and local navigation.',
      canonical_url: 'https://bharat-yatra-in.vercel.app/articles/planning-visit-to-nawalgarh-routes-timing-tips',
      body_en: `## Practical Travel Guide to Nawalgarh

A trip to Nawalgarh requires thoughtful planning to balance walking through heritage havelis, navigating bazaar lanes, and discovering nearby Shekhawati landmarks. Here are practical insights to help you craft your journey.

---

### Suggested 2-Day Itinerary

#### Day 1: The Architectural Core
- **Morning:** Arrive in Nawalgarh, check into a heritage haveli hotel. Begin with the flagship **Dr. Ramnath A. Poddar Haveli Museum** to understand the fresco styles and historical background.
- **Afternoon:** Stroll to the **Morarka Haveli Museum** and examine the intricate central courtyard carvings. Enjoy a traditional thali lunch at a local heritage restaurant.
- **Late Afternoon:** Walk through the **Aath Haveli** cluster. Photograph exterior facades in soft golden hour sunlight.
- **Evening:** Explore the Clock Tower market, sampling fresh kachoris and observing brass craftsmen at work.

#### Day 2: Forts, Country Estates & Excursions
- **Morning:** Visit **Bala Kila Fort** ramparts, followed by a quiet walk around the **Poddar Chhatris** cenotaphs.
- **Afternoon:** Head 7 km north to **Dundlod** for an afternoon visit to Dundlod Fort and traditional Marwari horse stables.
- **Evening:** Sunset tea on the grounds of **Roop Niwas Kothi**, reflecting on the heritage and preserving memories of Shekhawati.

---

### Practical Travel Tips

1. **Footwear:** Wear comfortable slip-on walking shoes. You will be walking through cobblestone alleys and removing footwear frequently at temples and private museum courtyards.
2. **Sun Protection:** Even in winter months, mid-day desert sunshine is bright. Bring a wide-brim hat, UV sunglasses, and high-SPF sunscreen.
3. **Cash & Digital Payments:** While UPI (digital QR payments) is widely accepted across stores, keeping modest cash on hand is helpful for small temple donations, auto-rickshaws, and rural roadside stalls.
4. **Getting Around:** Nawalgarh’s historic core is best explored entirely on foot or via electric rickshaws (*e-rickshaws*) that easily navigate narrow heritage lanes.
`,
    },
  ];

  for (const article of demoArticles) {
    console.log(`Upserting Demo Article: ${article.slug}...`);
    await prisma.articles.upsert({
      where: { slug: article.slug },
      update: {
        title_en: article.title_en,
        excerpt_en: article.excerpt_en,
        body_en: article.body_en,
        category: article.category,
        tags: article.tags,
        author_name: article.author_name,
        cover_image_url: article.cover_image_url,
        cover_image_alt: article.cover_image_alt,
        seo_title_en: article.seo_title_en,
        seo_description_en: article.seo_description_en,
        canonical_url: article.canonical_url,
        destination_id: destination.id,
        state_id: rajasthan.id,
        status: 'PUBLISHED',
        published_at: new Date(),
        updated_at: new Date(),
      },
      create: {
        slug: article.slug,
        title_en: article.title_en,
        excerpt_en: article.excerpt_en,
        body_en: article.body_en,
        category: article.category,
        tags: article.tags,
        author_name: article.author_name,
        cover_image_url: article.cover_image_url,
        cover_image_alt: article.cover_image_alt,
        seo_title_en: article.seo_title_en,
        seo_description_en: article.seo_description_en,
        canonical_url: article.canonical_url,
        destination_id: destination.id,
        state_id: rajasthan.id,
        status: 'PUBLISHED',
        published_at: new Date(),
      },
    });
  }

  console.log('✅ Successfully seeded Nawalgarh destination, attractions, and 5 demo articles.');
}

seedNawalgarh()
  .catch((e) => {
    console.error('Error seeding Nawalgarh:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
