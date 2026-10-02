import { cookies } from 'next/headers';

const dictionaries = {
  en: {
    nav: {
      destinations: 'Destinations',
      attractions: 'Attractions',
      articles: 'Articles',
      about: 'About',
      states: 'States & UTs',
      search: 'Search'
    },
    footer: {
      tagline: 'A thoughtful journey across India.',
      about: 'About Us',
      contact: 'Contact',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      note: 'Policies must be reviewed by the project owner before publication.'
    },
    common: {
      searchLabel: 'Search',
      searchPlaceholder: 'Name, description...',
      searchBtn: 'Search',
      searchClear: 'Clear',
      prevPage: '← Prev',
      nextPage: 'Next →',
      page: 'Page',
      viewOnMap: 'View on map ↗',
      explore: 'Explore ↗',
      view: 'View ↗',
      allDestinations: 'All destinations ↗',
      readArticles: 'Read travel articles ↗',
      home: 'Home'
    },
    content: {
      empty: 'No published {type} available at the moment.',
      notFound: 'This content is not available.',
      error: 'Content could not be loaded. Please try again later.',
      invalid: 'Invalid page number.',
      journal: 'JOURNAL',
      destinationGuide: 'DESTINATION GUIDE',
      attractionGuide: 'ATTRACTION GUIDE',
      district: 'DISTRICT',
      destinations: 'DESTINATIONS',
      localAreas: 'LOCAL AREAS',
      bestTime: 'BEST TIME TO VISIT',
      exploreIndia: 'EXPLORE INDIA',
      statesAndUTs: 'States and Union Territories of India',
      statesDesc: 'Discover travel destinations, heritage, and culture across every region.'
    },
    home: {
      heroTitle: 'India, thoughtfully discovered.',
      heroDesc: 'Travel guides and trip planning, shaped around the places and stories published by our editors.',
      heroExplore: 'Explore India ↗',
      destEyebrow: 'DESTINATIONS',
      destTitle: 'Start your journey',
      destDesc: 'Browse published destination guides.',
      artEyebrow: 'JOURNAL',
      artTitle: 'Travel stories',
      artDesc: 'Latest articles from our editors.',
      artLink: 'All articles ↗'
    }
  },
  hi: {
    nav: {
      destinations: 'स्थान',
      attractions: 'आकर्षण',
      articles: 'लेख',
      about: 'हमारे बारे में',
      states: 'राज्य और केंद्र शासित प्रदेश',
      search: 'खोजें'
    },
    footer: {
      tagline: 'भारत को समझकर देखने की शुरुआत।',
      about: 'हमारे बारे में',
      contact: 'संपर्क',
      privacy: 'गोपनीयता नीति (Privacy)',
      terms: 'सेवा की शर्तें (Terms)',
      note: 'नीतियों को प्रकाशित करने से पहले project owner की समीक्षा आवश्यक है।'
    },
    common: {
      searchLabel: 'खोजें',
      searchPlaceholder: 'नाम, विवरण...',
      searchBtn: 'खोजें',
      searchClear: 'साफ़ करें',
      prevPage: '← पिछला',
      nextPage: 'अगला →',
      page: 'पेज',
      viewOnMap: 'नक्शे पर देखें ↗',
      explore: 'देखें ↗',
      view: 'देखें ↗',
      allDestinations: 'सभी स्थान ↗',
      readArticles: 'यात्रा लेख पढ़ें ↗',
      home: 'मुखपृष्ठ'
    },
    content: {
      empty: 'अभी कोई प्रकाशित {type} उपलब्ध नहीं है।',
      notFound: 'यह सामग्री उपलब्ध नहीं है।',
      error: 'सामग्री अभी लोड नहीं हो सकी। कृपया कुछ देर बाद फिर कोशिश करें।',
      invalid: 'पेज नंबर मान्य नहीं है।',
      journal: 'यात्रा वृत्तांत (JOURNAL)',
      destinationGuide: 'स्थान मार्गदर्शिका',
      attractionGuide: 'आकर्षण मार्गदर्शिका',
      district: 'ज़िला',
      destinations: 'प्रमुख स्थान',
      localAreas: 'स्थानीय क्षेत्र',
      bestTime: 'घूमने का सही समय',
      exploreIndia: 'भारत खोजें',
      statesAndUTs: 'भारत के राज्य और केंद्र शासित प्रदेश',
      statesDesc: 'हर क्षेत्र में पर्यटन स्थलों, विरासत और संस्कृति की खोज करें।'
    },
    home: {
      heroTitle: 'भारत, समझदारी से खोजें।',
      heroDesc: 'हमारे संपादकों द्वारा प्रकाशित स्थानों और कहानियों के आधार पर यात्रा मार्गदर्शिका और योजना।',
      heroExplore: 'भारत खोजें ↗',
      destEyebrow: 'स्थान (DESTINATIONS)',
      destTitle: 'यात्रा की शुरुआत',
      destDesc: 'प्रकाशित स्थान मार्गदर्शिका देखें।',
      artEyebrow: 'यात्रा वृत्तांत (JOURNAL)',
      artTitle: 'यात्रा की कहानियाँ',
      artDesc: 'हमारे संपादकों के नवीनतम लेख।',
      artLink: 'सभी लेख ↗'
    }
  }
};

export async function getLanguage() {
  const cookieStore = await cookies();
  const lang = cookieStore.get('NEXT_LOCALE')?.value;
  return lang === 'hi' ? 'hi' : 'en';
}

export async function getDictionary() {
  const lang = await getLanguage();
  return dictionaries[lang];
}
