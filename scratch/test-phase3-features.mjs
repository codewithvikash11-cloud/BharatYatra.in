const WEB_BASE = 'http://localhost:3000';
const API_BASE = 'http://localhost:4000/api/v1';

const testRoutes = [
  { path: '/itineraries', expectedText: 'Suggested Itineraries for India' },
  { path: '/itineraries/2-days-in-jaipur', expectedText: '2 Days in Jaipur' },
  { path: '/itineraries/3-days-in-kerala', expectedText: '3 Days in Kerala' },
  { path: '/itineraries/4-days-in-uttarakhand', expectedText: '4 Days in Uttarakhand' },
  { path: '/itineraries/1-week-in-rajasthan', expectedText: '1 Week in Royal Rajasthan' },
  { path: '/destinations', expectedText: 'Explore India’s Destinations' },
  { path: '/destinations?region=north', expectedText: 'North India' },
  { path: '/destinations?region=south', expectedText: 'South India' },
  { path: '/destinations/jaipur', expectedText: 'Jaipur' },
  { path: '/attractions', expectedText: 'Attractions' },
  { path: '/attractions/jaipur', expectedText: 'Tourist Attractions' },
  { path: '/attractions/jaipur/amer-fort', expectedText: 'Amer Fort' },
  { path: '/trip-planner', expectedText: 'Plan Your Journey Across India' },
  { path: '/budget-calculator', expectedText: 'Trip Budget Calculator' },
  { path: '/checklist', expectedText: 'India Travel Preparation Checklist' },
  { path: '/routes', expectedText: 'India Routes' },
  { path: '/nearby', expectedText: 'Find Nearby Places' },
  { path: '/saved', expectedText: 'Your Saved Destinations' },
  { path: '/search?q=Jaipur', expectedText: 'Jaipur' },
  { path: '/events', expectedText: 'Festivals' },
];

async function run() {
  console.log('--- STARTING PHASE 3 FEATURES VERIFICATION ---');
  let passedCount = 0;
  let failedCount = 0;

  for (const route of testRoutes) {
    try {
      const url = `${WEB_BASE}${route.path}`;
      const res = await fetch(url);
      const html = await res.text();

      const statusOk = res.status === 200;
      const textOk = html.includes(route.expectedText);

      if (statusOk && textOk) {
        console.log(`[PASS] ${route.path} (HTTP ${res.status}, verified content: "${route.expectedText}")`);
        passedCount++;
      } else {
        console.error(`[FAIL] ${route.path} (HTTP ${res.status}, foundText: ${textOk})`);
        failedCount++;
      }
    } catch (err) {
      console.error(`[FAIL] ${route.path} - Error: ${err.message}`);
      failedCount++;
    }
  }

  // Also verify API Itinerary Endpoint
  try {
    const apiRes = await fetch(`${API_BASE}/itineraries`);
    const apiJson = await apiRes.json();
    if (apiRes.status === 200 && Array.isArray(apiJson.data)) {
      console.log(`[PASS] API GET /itineraries (HTTP 200, records: ${apiJson.data.length})`);
      passedCount++;
    } else {
      console.error(`[FAIL] API GET /itineraries (HTTP ${apiRes.status})`);
      failedCount++;
    }
  } catch (err) {
    console.error(`[FAIL] API GET /itineraries - Error: ${err.message}`);
    failedCount++;
  }

  console.log(`\n======================================================`);
  console.log(`PHASE 3 VERIFICATION SUMMARY: ${passedCount} PASSED, ${failedCount} FAILED`);
  console.log(`======================================================`);

  if (failedCount > 0) process.exit(1);
}

run();
