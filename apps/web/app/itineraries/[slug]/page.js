import Link from 'next/link';
import { notFound } from 'next/navigation';
import prisma from '../../../lib/db.js';
import ItineraryInteractiveClient from '../../../components/itinerary-interactive-client.js';

export const dynamic = 'force-dynamic';

const curatedItinerariesData = {};
/*
const oldCurated = {
  '2-days-in-jaipur': {
    slug: '2-days-in-jaipur',
    title: '2 Days in Jaipur: Royal Heritage & Bazaars',
    subtitle: 'The Definitive Pink City Weekend Expedition',
    days: '2 Days',
    durationDays: 2,
    placesCount: '6+ Heritage Sites',
    category: 'Heritage',
    badgeColor: 'var(--gold-dark)',
    cover: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
    summary: 'A fast-paced weekend soaking up the grandest forts, mirrored palaces, UNESCO observatories, and vibrant spice and textile bazaars of the Pink City.',
    destinationSlug: 'jaipur',
    destinationName: 'Jaipur, Rajasthan',
    bestTimeToVisit: 'October to March (pleasant winter days with cool evenings)',
    budgetEstimate: '₹4,500 – ₹9,000 per person (Mid-range stay, monument entries & local cabs)',
    daysSchedule: [
      {
        day: 1,
        theme: 'Amber Citadel & Walled City Palaces',
        title: 'Day 1: Royal Forts, Mirrored Halls & Sunset at Nahargarh',
        summary: 'Explore the 16th-century Kachwaha stronghold in Amber before returning into the pink-walled old city for sunset ramparts.',
        activities: [
          {
            time: '08:30 AM',
            title: 'Amer Fort & Sheesh Mahal',
            category: 'UNESCO Hill Fort',
            note: 'Arrive at opening to beat tour crowds. Walk up through Suraj Pol into Jaleb Chowk, then admire the concave Belgian mirror work inside the Hall of Mirrors.',
            transport: '11 km north of city center via Delhi highway (approx 25 mins by auto or taxi).',
          },
          {
            time: '12:00 PM',
            title: 'Panna Meena ka Kund & Jal Mahal',
            category: 'Architecture & Stepwell',
            note: 'Admire the 16th-century geometric stepped well just behind Amber Fort, followed by a lakeside photo stop at Man Sagar Lake to view the floating Jal Mahal.',
            transport: '5-minute drive from Amber to Panna Meena Kund; 10 mins back towards city for Jal Mahal promenade.',
          },
          {
            time: '01:30 PM',
            title: 'Authentic Rajasthani Thali Lunch',
            category: 'Culinary Stop',
            note: 'Savor crisp Baati, Panchmel Dal, Churma, and fragrant Ker Sangri at a heritage dining room.',
            transport: 'Near MI Road or Old City gate.',
          },
          {
            time: '03:30 PM',
            title: 'City Palace & Chandra Mahal Courtyards',
            category: 'Royal Palace Complex',
            note: 'Visit the Mubarak Mahal textile gallery, Sabha Niwas council hall, and the famed peacock gate in Pritam Niwas Chowk.',
            transport: 'Located at the heart of the walled city.',
          },
          {
            time: '05:30 PM',
            title: 'Sunset at Nahargarh Fort Ramparts',
            category: 'Panoramic Sunset',
            note: 'Watch twilight cast an amber and rose glow across the expanse of Jaipur from the ramparts cafe (Padao).',
            transport: 'Winding 14 km uphill drive via Charan Mandir road (arrange return taxi in advance).',
          },
        ],
      },
      {
        day: 2,
        theme: 'Astronomy, Museums & Vibrant Bazaars',
        title: 'Day 2: UNESCO Sundials, Hawa Mahal & Old City Bazaars',
        summary: 'Immerse yourself in Jaipur’s scientific brilliance, central museums, and world-renowned handicraft markets.',
        activities: [
          {
            time: '09:00 AM',
            title: 'Jantar Mantar Astronomical Observatory',
            category: 'UNESCO World Heritage',
            note: 'Witness the Vrihat Samrat Yantra, the world’s largest stone sundial, measuring local solar time to an accuracy of two seconds.',
            transport: 'Adjacent to City Palace entrance in the old city.',
          },
          {
            time: '11:00 AM',
            title: 'Hawa Mahal & Rooftop Tea',
            category: 'Iconic Monument',
            note: 'Photograph the five-tiered pink honeycomb facade from the opposite street cafe terrace, then walk through the wind-ventilation chambers inside.',
            transport: '5-minute walk from Jantar Mantar along Badi Choupad.',
          },
          {
            time: '01:00 PM',
            title: 'Laxmi Mishthan Bhandar (LMB) & Johari Bazaar',
            category: 'Heritage Sweets & Lunch',
            note: 'Famous Pyaz Kachori, spiced kadi, and Ghevar sweets in the historic jewelers market.',
            transport: 'Johari Bazaar main strip.',
          },
          {
            time: '03:30 PM',
            title: 'Albert Hall State Museum',
            category: 'Indo-Saracenic Museum',
            note: 'Admire royal Persian carpets, miniature paintings, marble sculptures, and coin treasures inside Rajasthan’s oldest museum.',
            transport: 'Located in Ram Niwas Garden, 2 km south of the walled city gates.',
          },
          {
            time: '05:30 PM',
            title: 'Bapu Bazaar & Nehru Bazaar Craft Walk',
            category: 'Shopping & Handicrafts',
            note: 'Pick up hand-stitched camel leather mojaris, Sanganeri block-printed bedcovers, and Jaipuri blue pottery from verified government craft emporiums.',
            transport: 'Along the southern pink city wall.',
          },
        ],
      },
    ],
  },
  '3-days-in-kerala': {
    slug: '3-days-in-kerala',
    title: '3 Days in Kerala: Backwaters, Colonial Ports & Spices',
    subtitle: 'God’s Own Country Coastal Odyssey',
    days: '3 Days',
    durationDays: 3,
    placesCount: '8+ Scenic Stops',
    category: 'Nature',
    badgeColor: '#16A34A',
    cover: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
    summary: 'Glide along tranquil palm-fringed backwaters in an eco-friendly kettuvallam houseboat, explore Fort Kochi’s spice warehouses, and witness Kathakali theater.',
    destinationSlug: null,
    destinationName: 'Kerala (Kochi & Alleppey)',
    bestTimeToVisit: 'September to March (lush green landscapes and balmy coastal weather)',
    budgetEstimate: '₹8,000 – ₹16,000 per person (Includes private houseboat day cruise, boutique homestay, and fresh coastal seafood)',
    daysSchedule: [
      {
        day: 1,
        theme: 'Colonial Spice Port of Fort Kochi',
        title: 'Day 1: Chinese Fishing Nets, Jew Town & Kathakali',
        summary: 'Discover Kochi’s multi-layered history where Portuguese, Dutch, British, and Arab merchants traded cardamom and black pepper.',
        activities: [
          {
            time: '09:00 AM',
            title: 'Fort Kochi Beach & Chinese Fishing Nets',
            category: 'Maritime Heritage',
            note: 'Cantilevered shore-operated fishing nets (Cheena Vala) introduced by traders from the court of Kublai Khan.',
            transport: 'Fort Kochi heritage district.',
          },
          {
            time: '11:00 AM',
            title: 'St. Francis Church & Santa Cruz Basilica',
            category: 'Historic Churches',
            note: 'India’s oldest European church (1503), originally burial site of Portuguese explorer Vasco da Gama.',
            transport: 'Short walking distance in Fort Kochi.',
          },
          {
            time: '02:00 PM',
            title: 'Mattancherry Palace & Jew Town Antique Markets',
            category: 'Murals & Spice Warehouses',
            note: 'Admire Ramayana mythological murals and walk the cobblestone lane leading to the 1568 Paradesi Synagogue.',
            transport: '10-minute auto-rickshaw ride from Fort Kochi to Mattancherry.',
          },
          {
            time: '06:00 PM',
            title: 'Traditional Kathakali & Kalaripayattu Demonstration',
            category: 'Classical Arts',
            note: 'Watch elaborate facial makeup application followed by expressive eye mudras and ancient martial arts demonstrations.',
            transport: 'Kerala Kathakali Centre in Fort Kochi.',
          },
        ],
      },
      {
        day: 2,
        theme: 'Alleppey Backwaters & Houseboat Living',
        title: 'Day 2: Houseboat Cruise through Punnamada & Vembanad Lake',
        summary: 'Step aboard a traditional thatched kettuvallam for an unhurried voyage through Kerala’s serene waterways.',
        activities: [
          {
            time: '09:30 AM',
            title: 'Drive to Alleppey (Alappuzha) Jetty',
            category: 'Scenic Coastal Transit',
            note: 'Drive south through coastal coconut groves and quiet lagoons.',
            transport: '55 km south of Kochi (approx 1h 30m by private taxi).',
          },
          {
            time: '11:30 AM',
            title: 'Boarding the Kettuvallam at Punnamada Jetty',
            category: 'Backwaters Cruise',
            note: 'Wooden craft tied with coir ropes without a single iron nail, powered by quiet outboard motors.',
            transport: 'Boarding at designated eco-tourism jetty.',
          },
          {
            time: '01:30 PM',
            title: 'Traditional Kerala Banana-Leaf Lunch on Water',
            category: 'Culinary Experience',
            note: 'Freshly prepared Karimeen Pollichathu (pearl spot fish in banana leaf), red rice, avial, and coconut sambal.',
            transport: 'Served on board while cruising.',
          },
          {
            time: '04:00 PM',
            title: 'Village Canoe Ride through Narrow Canals',
            category: 'Village Immersion',
            note: 'Transfer to a non-motorized rowboat to see riverside duck farming, coir spinning, and paddy fields below sea level.',
            transport: 'Guided canal excursion from houseboat mooring.',
          },
        ],
      },
      {
        day: 3,
        theme: 'Kumarakom Bird Sanctuary & Marari Beach Sunset',
        title: 'Day 3: Wetland Bird Sanctuary & Arabian Sea Relaxation',
        summary: 'Greet the morning listening to migratory birds in Kumarakom before winding down on the pristine golden sands of Marari.',
        activities: [
          {
            time: '06:30 AM',
            title: 'Kumarakom Bird Sanctuary Walking Trail',
            category: 'Eco-Tourism & Wildlife',
            note: '14-acre bird haven on the banks of Vembanad Lake; spot Siberian cranes, egrets, herons, and kingfishers.',
            transport: '30 mins drive from Alleppey.',
          },
          {
            time: '11:00 AM',
            title: 'Spice Garden & Ayurvedic Herbal Garden Tour',
            category: 'Spices & Botanical Tour',
            note: 'Learn the cultivation methods of black pepper, green cardamom, nutmeg, cinnamon, and healing Ayurvedic shrubs.',
            transport: 'Organic spice homestead in Kottayam district.',
          },
          {
            time: '03:30 PM',
            title: 'Marari Beach Relaxation & Coastal Sunset',
            category: 'Serene Coastal Beach',
            note: 'Pristine fishing village beach lined with coconut palms, undisturbed by commercial beach shacks.',
            transport: '15 km north of Alleppey along the coast.',
          },
        ],
      },
    ],
  },
  '4-days-in-uttarakhand': {
    slug: '4-days-in-uttarakhand',
    title: '4 Days in Uttarakhand: Sacred Rivers & Mountain Vistas',
    subtitle: 'From Haridwar’s Sacred Ghats to Mussoorie’s Ridge',
    days: '4 Days',
    durationDays: 4,
    placesCount: '7+ Holy & Hill Stops',
    category: 'Spiritual',
    badgeColor: 'var(--teal-primary)',
    cover: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
    summary: 'Experience the mystical Ganga Aarti in Haridwar, practice yoga along the jade waters of Rishikesh, and breathe fresh deodar air atop Mussoorie.',
    destinationSlug: null,
    destinationName: 'Uttarakhand (Haridwar, Rishikesh & Mussoorie)',
    bestTimeToVisit: 'September to November & March to May',
    budgetEstimate: '₹7,000 – ₹14,000 per person',
    daysSchedule: [
      {
        day: 1,
        theme: 'Haridwar: Gateway of the Gods',
        title: 'Day 1: Mansa Devi Cable Car & Har Ki Pauri Evening Aarti',
        summary: 'Begin where the sacred River Ganga descends from the Shivalik Himalayas onto the northern plains.',
        activities: [
          { time: '10:00 AM', title: 'Arrival & Check-in along the Ganges', category: 'Arrival', note: 'Check into a river-facing ashram or heritage hotel.', transport: 'Connected by Shatabdi & Vande Bharat to New Delhi (4 hours).' },
          { time: '02:00 PM', title: 'Mansa Devi Temple Ropeway (Udan Khatola)', category: 'Hilltop Temple', note: 'Cable car ascent to Bilwa Parvat for panoramic valley views.', transport: 'Base station 1 km from Haridwar Junction.' },
          { time: '05:30 PM', title: 'Grand Ganga Aarti at Har Ki Pauri Ghat', category: 'Sacred Ritual', note: 'Witness hundreds of floating marigold leaf lamps (diyas) dancing on the rapid waters to the sound of temple bells and conch shells.', transport: 'Pedestrian ghat area; arrive 1 hour early for seating.' },
        ],
      },
      {
        day: 2,
        theme: 'Rishikesh: Yoga Capital of the World',
        title: 'Day 2: Beatles Ashram, Suspension Bridges & Triveni Ghat',
        summary: 'Cross iconic suspension bridges to explore ashrams, organic vegan cafes, and meditation sanctuaries.',
        activities: [
          { time: '08:00 AM', title: 'Drive to Rishikesh (Tapovan / Swarg Ashram)', category: 'Transit', note: 'Short 25 km drive north along the Shivalik foothills.', transport: '45 mins taxi from Haridwar.' },
          { time: '10:00 AM', title: 'Beatles Ashram (Chaurasi Kutia)', category: 'Heritage Ashram', note: 'Maharishi Mahesh Yogi’s meditation retreat in Rajaji Tiger Reserve where the Beatles composed the White Album in 1968.', transport: 'Forest path from Ram Jhula / Swarg Ashram.' },
          { time: '02:00 PM', title: 'Ram Jhula & Lakshman Jhula Heritage Promenade', category: 'Suspension Bridge', note: 'Wander bookshops, Ayurvedic pharmacies, and open-air river cafes overlooking the emerald Ganga.', transport: 'Pedestrian and two-wheeler bridge zone.' },
          { time: '05:30 PM', title: 'Parmarth Niketan Evening River Aarti', category: 'Spiritual Chanting', note: 'Pristine choral singing led by ashram gurukul students as the sun dips behind the wooded peaks.', transport: 'Parmarth Niketan ghat.' },
        ],
      },
      {
        day: 3,
        theme: 'Adventure on the Ganges',
        title: 'Day 3: White Water Rafting & Neer Garh Waterfall Hike',
        summary: 'Engage with Rishikesh’s adventurous spirit through certified river guides and jungle freshwater pools.',
        activities: [
          { time: '09:00 AM', title: 'White Water Rafting (Shivpuri to NIM Beach)', category: 'River Adventure', note: '16 km grade III rapids (Three Blind Mice, Roller Coaster, Golf Course) with licensed river masters.', transport: 'Operated by Uttarakhand Tourism licensed outfitters.' },
          { time: '02:00 PM', title: 'Neer Garh Natural Waterfall Trek', category: 'Nature Hike', note: 'A shaded 2-tiered jungle waterfall offering refreshing freshwater wading pools.', transport: '5 km north of Tapovan on Badrinath road.' },
          { time: '05:30 PM', title: 'Sound Healing & Meditation Session', category: 'Wellness', note: 'Tibetan singing bowls and breathwork in a serene Tapovan studio.', transport: 'Tapovan upper ridge.' },
        ],
      },
      {
        day: 4,
        theme: 'Queen of the Hills: Mussoorie',
        title: 'Day 4: Mall Road, Gun Hill & Himalayan Sunset',
        summary: 'Ascend to the colonial British hill station of Mussoorie for cool mountain breezes and snow-capped Himalayan panoramas.',
        activities: [
          { time: '08:30 AM', title: 'Scenic Drive to Mussoorie via Dehradun', category: 'Mountain Drive', note: 'Ascent through deodar pine forests and winding ghat roads.', transport: '75 km drive (approx 2h 30m by taxi).' },
          { time: '12:00 PM', title: 'Mall Road & Historic Landour Bakehouse', category: 'Colonial Hill Walk', note: 'Taste apple crumble and ginger tea in historic Landour, residence of author Ruskin Bond.', transport: 'Landour is 4 km above Mussoorie Mall Road.' },
          { time: '04:00 PM', title: 'Gun Hill Cable Car & Doon Valley Twilight', category: 'Viewpoint', note: 'Second highest peak in Mussoorie offering clear views of Bandarpunch and Gangotri peaks on crisp days.', transport: 'Ropeway terminal off Mall Road.' },
        ],
      },
    ],
  },
  '1-week-in-rajasthan': {
    slug: '1-week-in-rajasthan',
    title: '1 Week in Royal Rajasthan: The Grand Circuit',
    subtitle: 'Jaipur, Jodhpur & Udaipur Citadel Expedition',
    days: '7 Days',
    durationDays: 7,
    placesCount: '12+ Palaces & Forts',
    category: 'Culture',
    badgeColor: 'var(--terracotta)',
    cover: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=1200&q=80',
    summary: 'The quintessential royal journey connecting the Pink City of Jaipur, the Sun Citadel of Mehrangarh in Jodhpur, and romantic lakeside palaces of Udaipur.',
    destinationSlug: 'jaipur',
    destinationName: 'Rajasthan (Jaipur, Jodhpur & Udaipur)',
    bestTimeToVisit: 'October to March',
    budgetEstimate: '₹18,000 – ₹38,000 per person',
    daysSchedule: [
      {
        day: 1,
        theme: 'Pink City Foundations',
        title: 'Day 1: Jaipur City Palace, Jantar Mantar & Johari Bazaar',
        summary: 'Discover the walled city founded by astronomical ruler Maharaja Sawai Jai Singh II in 1727.',
        activities: [
          { time: '09:00 AM', title: 'City Palace Complex & Peacock Gate', category: 'Royal Residence', note: 'Explore royal courtyards and private miniature art collections.', transport: 'Old City Center.' },
          { time: '12:00 PM', title: 'Jantar Mantar UNESCO Sundials', category: 'Observatory', note: 'Guided tour of the equator sundial.', transport: 'Adjacent to City Palace.' },
          { time: '03:30 PM', title: 'Hawa Mahal & Old City Walk', category: 'Architecture', note: 'Photograph the lattice facade.', transport: 'Badi Choupad.' },
        ],
      },
      {
        day: 2,
        theme: 'Jaipur Hill Forts',
        title: 'Day 2: Amer Fort, Jaigarh & Nahargarh Sunset',
        summary: 'Ascend the rugged Aravalli ridge to conquer Jaipur’s three interconnected military citadels.',
        activities: [
          { time: '08:30 AM', title: 'Amer Fort & Sheesh Mahal', category: 'UNESCO Fort', note: '16th-century mirrored palace.', transport: '11 km north.' },
          { time: '01:00 PM', title: 'Jaigarh Fort & Jaivana Cannon', category: 'Royal Armory', note: 'Massive cannon on wheels.', transport: 'Connecting tunnel or drive.' },
          { time: '05:30 PM', title: 'Nahargarh Fort Ramparts Sunset', category: 'Sunset Point', note: 'Twilight overlook of Jaipur.', transport: 'Nahargarh road.' },
        ],
      },
      {
        day: 3,
        theme: 'Transit to the Blue City',
        title: 'Day 3: Travel to Jodhpur & Old Blue City Walk',
        summary: 'Travel westward across Rajasthan into the Marwar gateway city beneath the desert sun.',
        activities: [
          { time: '06:00 AM', title: 'Jaipur to Jodhpur (Vande Bharat / Express Train)', category: 'Train Transit', note: 'Smooth 4.5-hour train journey across the Thar plains.', transport: 'Jaipur Junction (JP) to Jodhpur Junction (JU).' },
          { time: '03:00 PM', title: 'Navchokiya Blue Houses Heritage Walk', category: 'Heritage Walk', note: 'Wander indigo-painted Brahmin alleys beneath Mehrangarh.', transport: 'Brahmapuri / Navchokiya quarter.' },
          { time: '06:00 PM', title: 'Clock Tower (Ghanta Ghar) & Sardar Market', category: 'Spices & Handicrafts', note: 'Mathania red chillies and Makhania lassi.', transport: 'City center.' },
        ],
      },
      {
        day: 4,
        theme: 'The Citadel of the Sun',
        title: 'Day 4: Mehrangarh Fort & Jaswant Thada',
        summary: 'Explore Rudyard Kipling’s "palace that might have been built by Titans and colored by the morning sun."',
        activities: [
          { time: '09:00 AM', title: 'Mehrangarh Fort & Museum', category: 'Impregnable Fort', note: 'Perched 400 feet above the city; see royal palanquins and howdahs.', transport: 'Clifftop ascent.' },
          { time: '02:00 PM', title: 'Jaswant Thada Royal Cenotaphs', category: 'White Marble Cenotaph', note: 'Intricately carved translucent marble memorial.', transport: '1 km from Mehrangarh.' },
          { time: '05:00 PM', title: 'Umaid Bhawan Palace & Museum', category: 'Art Deco Palace', note: 'One of the world’s largest private royal residences.', transport: '5 km east of city.' },
        ],
      },
      {
        day: 5,
        theme: 'Through the Aravallis to Udaipur',
        title: 'Day 5: Ranakpur Jain Temples en route to Udaipur',
        summary: 'Drive through mountain passes to witness India’s most intricate marble temple architecture.',
        activities: [
          { time: '08:00 AM', title: 'Private Drive Jodhpur → Ranakpur → Udaipur', category: 'Scenic Road Trip', note: '260 km road journey through picturesque Aravalli gorges.', transport: 'Approx 6 hours with temple stop.' },
          { time: '11:30 AM', title: 'Ranakpur Chaumukha Temple', category: 'Jain Marble Wonder', note: '15th-century temple with 1,444 uniquely hand-carved pillars, no two alike.', transport: 'Ranakpur valley.' },
          { time: '05:30 PM', title: 'Evening Arrival at Lake Pichola', category: 'Romantic Lakeside', note: 'Check into lakeside haveli in Udaipur.', transport: 'Udaipur old city.' },
        ],
      },
      {
        day: 6,
        theme: 'The City of Lakes',
        title: 'Day 6: Udaipur City Palace & Lake Pichola Boat Cruise',
        summary: 'Experience the crown jewel of Mewar royalty reflected in mirror-like waters.',
        activities: [
          { time: '09:00 AM', title: 'City Palace Complex & Crystal Gallery', category: 'Grand Palace', note: 'Granite and marble balconies overlooking the lake.', transport: 'East bank of Lake Pichola.' },
          { time: '01:00 PM', title: 'Jagdish Temple & Old City Bazaar', category: '1651 Temple', note: 'Three-story stone temple dedicated to Lord Vishnu.', transport: 'City Palace gates.' },
          { time: '04:30 PM', title: 'Sunset Boat Cruise around Jag Mandir', category: 'Lakeside Cruise', note: 'Pass the Lake Palace (Taj) and dock at Jag Mandir island pavilion.', transport: 'Bansi Ghat jetty.' },
          { time: '07:00 PM', title: 'Dharohar Folk Dance at Bagore ki Haveli', category: 'Folk Performance', note: 'Puppet dance and Chari fire dance in an 18th-century courtyard.', transport: 'Gangaur Ghat.' },
        ],
      },
      {
        day: 7,
        theme: 'Gardens & Mountain Passes of Mewar',
        title: 'Day 7: Saheliyon ki Bari & Sajjangarh Monsoon Palace',
        summary: 'Conclude your royal voyage with royal fountain gardens and sunset atop Sajjangarh peak.',
        activities: [
          { time: '09:30 AM', title: 'Saheliyon ki Bari (Courtyard of Maidens)', category: 'Royal Fountains', note: 'Marble elephants, lotus pools, and gravity-fed natural fountains.', transport: 'North Udaipur.' },
          { time: '02:00 PM', title: 'Vintage Car Museum & Mewar Cuisine', category: 'Royal Motors', note: 'Rolls-Royces and Cadillacs collected by the Maharanas of Udaipur.', transport: 'Near Gulab Bagh.' },
          { time: '05:00 PM', title: 'Sajjangarh (Monsoon Palace) High Sunset', category: 'Clifftop Overlook', note: 'High fortress overlooking Fateh Sagar and Pichola lakes at sunset.', transport: '10 km uphill via biological park road.' },
        ],
      },
    ],
  },
};
*/

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const dbItem = await prisma.itineraries.findFirst({
      where: { slug, status: 'PUBLISHED' },
      select: { title_en: true, description_en: true },
    });
    if (dbItem) {
      return {
        title: `${dbItem.title_en} | BharatYatra`,
        description: dbItem.description_en ? dbItem.description_en.slice(0, 160) : 'Handcrafted travel itinerary for India on BharatYatra.',
        alternates: {
          canonical: `https://bharat-yatra-in.vercel.app/itineraries/${slug}`,
        },
      };
    }
  } catch {}

  return {
    title: 'Itinerary Not Found | BharatYatra',
    description: 'Day-by-day travel itinerary on BharatYatra.',
  };
}

export default async function ItineraryDetailPage({ params }) {
  const { slug } = await params;

  let itinerary = null;

  try {
      const dbItem = await prisma.itineraries.findFirst({
        where: { slug, status: 'PUBLISHED' },
        include: {
          destinations: true,
          itinerary_days: {
            orderBy: { day_number: 'asc' },
            include: {
              itinerary_stops: {
                orderBy: { sort_order: 'asc' },
                include: { attractions: true },
              },
            },
          },
        },
      });

      if (dbItem) {
        itinerary = {
          slug: dbItem.slug,
          title: dbItem.title_en,
          subtitle: `${dbItem.duration_days} Days Travel Circuit`,
          days: `${dbItem.duration_days} Days`,
          durationDays: dbItem.duration_days,
          placesCount: `${dbItem.itinerary_days.length} Days Itinerary`,
          category: 'Curated Route',
          badgeColor: 'var(--teal-primary)',
          cover: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
          summary: dbItem.description_en || 'Comprehensive day-by-day guide crafted by BharatYatra editors.',
          destinationSlug: dbItem.destinations?.slug || null,
          destinationName: dbItem.destinations?.name_en || 'India',
          bestTimeToVisit: 'Check destination seasonal guidelines',
          budgetEstimate: 'Use our interactive Budget Calculator for custom rates',
          daysSchedule: dbItem.itinerary_days.map((d) => ({
            day: d.day_number,
            theme: d.title_en || `Day ${d.day_number}`,
            title: d.title_en || `Day ${d.day_number}`,
            summary: d.notes_en || '',
            activities: d.itinerary_stops.map((s, idx) => ({
              time: `Stop ${idx + 1}`,
              title: s.attractions?.name_en || s.custom_name_en || `Stop ${idx + 1}`,
              category: s.attractions?.category || 'Attraction',
              note: s.notes_en || s.attractions?.description_en?.slice(0, 160) || '',
              transport: null,
            })),
          })),
        };
      }
    } catch (err) {
      console.error('Failed to query DB itinerary:', err);
    }

  if (!itinerary) {
    notFound();
  }

  return (
    <main className="itinerary-page-root" style={{ background: '#FFFDF8', minHeight: '80vh', padding: '2.5rem 0 5rem 0' }}>
      <div className="page-shell" style={{ maxWidth: '1080px', margin: '0 auto', padding: '0 1.25rem' }}>
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem' }}>
          <ol style={{ display: 'flex', gap: '0.5rem', listStyle: 'none', margin: 0, padding: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <li><Link href="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Home</Link></li>
            <li>/</li>
            <li><Link href="/itineraries" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Suggested Itineraries</Link></li>
            <li>/</li>
            <li style={{ color: 'var(--teal-primary)', fontWeight: 600 }}>{itinerary.title}</li>
          </ol>
        </nav>

        {/* Hero Header Card */}
        <header
          style={{
            background: '#FFFFFF',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '2rem',
          }}
        >
          <div style={{ height: '340px', width: '100%', position: 'relative' }}>
            <img
              src={itinerary.cover}
              alt={itinerary.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(16, 47, 44, 0.9) 0%, rgba(16, 47, 44, 0.2) 60%, transparent 100%)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '1.75rem',
                left: '2rem',
                right: '2rem',
                color: '#FFFDF8',
              }}
            >
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                <span
                  style={{
                    background: itinerary.badgeColor,
                    color: '#FFFFFF',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '0.25rem 0.65rem',
                    borderRadius: '999px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {itinerary.category}
                </span>
                <span
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(4px)',
                    color: '#FFFFFF',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    padding: '0.25rem 0.65rem',
                    borderRadius: '999px',
                  }}
                >
                  ⏱ {itinerary.days} · {itinerary.placesCount}
                </span>
              </div>
              <h1
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
                  margin: '0 0 0.35rem 0',
                  lineHeight: 1.2,
                  color: '#FFFDF8',
                }}
              >
                {itinerary.title}
              </h1>
              <p style={{ margin: 0, fontSize: '1rem', color: 'rgba(255, 253, 248, 0.85)', fontWeight: 500 }}>
                {itinerary.subtitle} {itinerary.destinationName ? `· 📍 ${itinerary.destinationName}` : ''}
              </p>
            </div>
          </div>

          {/* Quick Facts Bar */}
          <div
            style={{
              padding: '1.25rem 2rem',
              background: 'var(--cream)',
              borderTop: '1px solid var(--border-color)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.25rem',
            }}
          >
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--teal-deep)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>
                Best Time to Travel
              </span>
              <span style={{ fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                {itinerary.bestTimeToVisit}
              </span>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--teal-deep)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>
                Estimated Budget Baseline
              </span>
              <span style={{ fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                {itinerary.budgetEstimate}
              </span>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--teal-deep)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>
                Pacing & Transit
              </span>
              <span style={{ fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                Comfortable daily pacing with realistic transit buffers
              </span>
            </div>
          </div>
        </header>

        {/* Executive Summary */}
        <div style={{ marginBottom: '2.5rem' }}>
          <p style={{ fontSize: '1.12rem', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
            {itinerary.summary}
          </p>
        </div>

        {/* Interactive Schedule Component */}
        <ItineraryInteractiveClient itinerary={itinerary} />
      </div>
    </main>
  );
}
