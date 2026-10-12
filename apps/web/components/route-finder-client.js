'use client';
import { useState } from 'react';
import Link from 'next/link';

const corridorData = {
  'delhi-jaipur': {
    title: 'New Delhi (DEL) → Jaipur (JAI)',
    distance: '280 km via Expressway',
    air: {
      duration: '55 mins flight time',
      airports: 'Indira Gandhi Int’l (DEL) → Jaipur Int’l (JAI)',
      airlines: 'IndiGo, Air India, SpiceJet (multiple daily departures)',
      note: 'Airport in Jaipur is at Sanganer, roughly 12 km from the city center.',
    },
    train: {
      duration: '3h 40m – 4h 30m',
      topTrains: [
        { name: 'Vande Bharat Express (20978)', dep: '06:10 AM', arr: '09:55 AM', days: 'Except Wed' },
        { name: 'Ajmer Shatabdi Express (12015)', dep: '06:10 AM', arr: '10:40 AM', days: 'Daily' },
        { name: 'Double Decker Express (12986)', dep: '05:35 PM', arr: '10:05 PM', days: 'Daily' },
      ],
      stations: 'New Delhi (NDLS) / Delhi Sarai Rohilla (DEE) → Jaipur Junction (JP)',
      officialLink: 'https://www.irctc.co.in',
    },
    road: {
      duration: '4 – 4.5 hours driving',
      route: 'Delhi-Mumbai Expressway (NE4) via Sohna & Dausa OR NH48 via Gurugram & Kotputli',
      tolls: 'FASTag mandatory; expressway is fully access-controlled with wayside amenities.',
    },
    bus: {
      duration: '5 – 6 hours',
      services: 'RSRTC AC Volvo & Scania buses from ISBT Kashmere Gate & Bikaner House (Pandara Road)',
      note: 'Bikaner House services offer comfortable direct service to Sindhi Camp Jaipur.',
    },
  },
  'delhi-varanasi': {
    title: 'New Delhi (DEL) → Varanasi (VNS)',
    distance: '820 km via Expressway',
    air: {
      duration: '1h 20m flight time',
      airports: 'Indira Gandhi Int’l (DEL) → Lal Bahadur Shastri Int’l (VNS, Babatpur)',
      airlines: 'IndiGo, Air India, Vistara (multiple daily non-stop flights)',
      note: 'Babatpur Airport is 26 km from the Ghats area (approx 45-60 min taxi).',
    },
    train: {
      duration: '8h 00m (Vande Bharat) to 11h 30m (Shiv Ganga)',
      topTrains: [
        { name: 'Vande Bharat Express (22436)', dep: '06:00 AM', arr: '02:00 PM', days: 'Except Thu' },
        { name: 'Shiv Ganga Express (12560)', dep: '08:05 PM', arr: '06:10 AM (Overnight)', days: 'Daily' },
      ],
      stations: 'New Delhi (NDLS) → Varanasi Junction (BSB) / Banaras (BSBS)',
      officialLink: 'https://www.irctc.co.in',
    },
    road: {
      duration: '11 – 12 hours driving',
      route: 'Yamuna Expressway to Agra, Agra-Lucknow Expressway, then Purvanchal Expressway to Varanasi.',
      tolls: 'World-class greenfield expressway stretch with FASTag electronic tolling.',
    },
    bus: {
      duration: '14 – 16 hours',
      services: 'UPSRTC AC Sleeper buses from Anand Vihar ISBT to Varanasi Cantt.',
      note: 'Train or flight strongly recommended over long-haul bus on this route.',
    },
  },
  'mumbai-goa': {
    title: 'Mumbai (BOM) → Goa (GOI / GOX)',
    distance: '585 km via NH66',
    air: {
      duration: '1h 10m flight time',
      airports: 'Chhatrapati Shivaji Maharaj (BOM) → Dabolim (GOI) or Manohar Int’l Mopa (GOX)',
      airlines: 'IndiGo, Air India, Akasa Air (frequent hourly departures)',
      note: 'Mopa (GOX) is convenient for North Goa; Dabolim (GOI) is closer to Central & South Goa.',
    },
    train: {
      duration: '7h 45m (Vande Bharat) to 10h (Tejas/Konkan Kanya)',
      topTrains: [
        { name: 'CSMT Madgaon Vande Bharat (22229)', dep: '05:25 AM', arr: '01:10 PM', days: 'Tri-weekly/Daily' },
        { name: 'Tejas Express (82901)', dep: '05:50 AM', arr: '04:00 PM', days: 'Regular' },
        { name: 'Konkan Kanya Express (20111)', dep: '11:05 PM', arr: '10:45 AM (Scenic overnight)', days: 'Daily' },
      ],
      stations: 'Mumbai CSMT / Lokmanya Tilak (LTT) → Madgaon (MAO) / Thivim (THVM)',
      officialLink: 'https://www.irctc.co.in',
    },
    road: {
      duration: '10 – 12 hours driving',
      route: 'Mumbai-Pune Expressway, then NH48 via Satara and Kolhapur, down Amboli Ghat.',
      tolls: 'Scenic mountain ghat pass; check road conditions during monsoon months.',
    },
    bus: {
      duration: '12 – 14 hours',
      services: 'Kadamba State Transport & luxury multi-axle sleepers from Borivali/Dadar to Panaji/Mapusa.',
      note: 'Overnight sleeper coaches depart around 7 PM and arrive in Goa early morning.',
    },
  },
};

export default function RouteFinderClient() {
  const [selectedCorridor, setSelectedCorridor] = useState('delhi-jaipur');
  const [activeTab, setActiveTab] = useState('all');

  const corridor = corridorData[selectedCorridor];

  return (
    <div>
      {/* Corridor Selection Row */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.75rem',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '2rem',
        }}
      >
        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.6rem' }}>
          Select Popular Travel Corridor
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
          {Object.entries(corridorData).map(([key, item]) => (
            <button
              key={key}
              type="button"
              onClick={() => setSelectedCorridor(key)}
              style={{
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: selectedCorridor === key ? '2px solid var(--teal-primary)' : '1px solid var(--border-color)',
                background: selectedCorridor === key ? 'var(--cream)' : '#FFFFFF',
                color: 'var(--teal-deep)',
                fontWeight: 700,
                textAlign: 'left',
                cursor: 'pointer',
              }}
            >
              {item.title}
              <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500, marginTop: '0.2rem' }}>
                {item.distance}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Mode Filters */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {[
          { id: 'all', label: 'All Transport Modes', icon: '🧭' },
          { id: 'train', label: 'By Train (IRCTC)', icon: '🚆' },
          { id: 'air', label: 'By Air', icon: '✈️' },
          { id: 'road', label: 'By Road / Expressways', icon: '🚗' },
          { id: 'bus', label: 'By State Buses', icon: '🚌' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.55rem 1.1rem',
              borderRadius: '999px',
              border: activeTab === tab.id ? '1px solid var(--teal-deep)' : '1px solid var(--border-color)',
              background: activeTab === tab.id ? 'var(--teal-deep)' : '#FFFFFF',
              color: activeTab === tab.id ? '#FFFDF8' : 'var(--text-primary)',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <span>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      {/* Corridor Details Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
        {/* Train Card */}
        {(activeTab === 'all' || activeTab === 'train') && (
          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '2rem', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ fontSize: '1.4rem' }}>🚆</span>
                <div>
                  <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', fontSize: '1.3rem' }}>
                    Indian Railways (Fastest & Scenic Option)
                  </h3>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Estimated travel duration: {corridor.train.duration}</span>
                </div>
              </div>
              <a
                href={corridor.train.officialLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold-pill"
                style={{ textDecoration: 'none', fontSize: '0.85rem' }}
              >
                Book on IRCTC Official Portal ↗
              </a>
            </div>

            <p style={{ margin: '0 0 1rem 0', fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
              <strong>Stations:</strong> {corridor.train.stations}
            </p>

            <div style={{ background: 'var(--cream)', borderRadius: 'var(--radius-md)', padding: '1rem', border: '1px solid var(--border-color)' }}>
              <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--teal-deep)', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Recommended Express Trains
              </strong>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {corridor.train.topTrains.map((tr) => (
                  <div key={tr.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', background: '#FFFFFF', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', flexWrap: 'wrap', gap: '0.4rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--teal-primary)' }}>{tr.name}</span>
                    <span style={{ color: 'var(--text-muted)' }}>Depart {tr.dep} → Arrive {tr.arr}</span>
                    <span style={{ color: 'var(--gold-dark)', fontWeight: 600 }}>{tr.days}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Flight Card */}
        {(activeTab === 'all' || activeTab === 'air') && (
          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '2rem', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.4rem' }}>✈️</span>
              <div>
                <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', fontSize: '1.3rem' }}>
                  Domestic Flights
                </h3>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Air flight time: {corridor.air.duration}</span>
              </div>
            </div>
            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.92rem', color: 'var(--text-primary)' }}>
              <strong>Airports:</strong> {corridor.air.airports}
            </p>
            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
              <strong>Airlines:</strong> {corridor.air.airlines}
            </p>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              💡 {corridor.air.note} Use DigiYatra app for facial recognition biometric entry at major Indian airports.
            </p>
          </div>
        )}

        {/* Road & Expressway Card */}
        {(activeTab === 'all' || activeTab === 'road') && (
          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '2rem', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.4rem' }}>🚗</span>
              <div>
                <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', fontSize: '1.3rem' }}>
                  Road & Expressways (Self-Drive / Private Cab)
                </h3>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Estimated driving duration: {corridor.road.duration}</span>
              </div>
            </div>
            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.92rem', color: 'var(--text-primary)' }}>
              <strong>Route & Highways:</strong> {corridor.road.route}
            </p>
            <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              <strong>Tolling Guidance:</strong> {corridor.road.tolls}
            </p>
          </div>
        )}

        {/* Bus Card */}
        {(activeTab === 'all' || activeTab === 'bus') && (
          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '2rem', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.4rem' }}>🚌</span>
              <div>
                <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', fontSize: '1.3rem' }}>
                  Inter-State Bus Services
                </h3>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Estimated travel duration: {corridor.bus.duration}</span>
              </div>
            </div>
            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.92rem', color: 'var(--text-primary)' }}>
              <strong>Operators:</strong> {corridor.bus.services}
            </p>
            <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              <strong>Tips:</strong> {corridor.bus.note}
            </p>
          </div>
        )}
      </div>

      {/* Essential Travel Tips Banner */}
      <div style={{ background: 'var(--cream)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
        <h4 style={{ margin: '0 0 0.75rem 0', fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', fontSize: '1.25rem' }}>
          Transit Safety & Practical Booking Tips
        </h4>
        <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.8 }}>
          <li><strong>Train Bookings:</strong> Book IRCTC tickets 60–120 days ahead for peak festival seasons (Diwali, New Year, Holi). Foreign Tourist Quota is available at major railway reservation bureaus.</li>
          <li><strong>Airport Taxis:</strong> Always book prepaid taxi counters inside the arrivals terminal or use verified apps (Uber / Ola) rather than touts outside.</li>
          <li><strong>National Emergency Transit Helpline:</strong> Dial <strong>139</strong> for RailMadad assistance on Indian Railways 24x7.</li>
        </ul>
      </div>
    </div>
  );
}
