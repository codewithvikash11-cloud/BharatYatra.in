'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  IconDeviceFloppy,
  IconPrinter,
  IconCheckbox,
  IconSquare,
  IconClock,
  IconArrowRight,
} from './icons';

const sampleItineraries = {
  'jaipur': {
    2: [
      {
        day: 1,
        title: 'Royal Heritage Citadel & Palaces',
        activities: [
          { time: '08:30 AM', title: 'Amer Fort & Sheesh Mahal', note: 'Early morning to beat the heat; admire the mirrored ceiling.' },
          { time: '12:00 PM', title: 'Jal Mahal Promenade', note: 'Scenic lakeside photo stop en route back to the walled city.' },
          { time: '02:30 PM', title: 'City Palace & Museum', note: 'Explore royal courtyards and Peacock Gate.' },
          { time: '05:00 PM', title: 'Hawa Mahal View & Johari Bazaar', note: 'Rooftop cafe tea overlooking facade; bazaar walk.' },
        ],
      },
      {
        day: 2,
        title: 'Astronomy, Culture & Local Flavors',
        activities: [
          { time: '09:30 AM', title: 'Jantar Mantar Observatory', note: 'Witness the giant stone sundial in action.' },
          { time: '12:30 PM', title: 'Authentic Rajasthani Thali Lunch', note: 'Taste Dal Baati Churma and Gatte ki Sabzi.' },
          { time: '03:00 PM', title: 'Albert Hall Museum & Ram Niwas Garden', note: 'Indo-Saracenic museum with antique weaponry & pottery.' },
          { time: '05:30 PM', title: 'Sunset at Nahargarh Fort', note: 'Panoramic twilight view across the Pink City expanse.' },
        ],
      },
    ],
    3: [
      {
        day: 1,
        title: 'Amber Valley & Ancient Forts',
        activities: [
          { time: '08:30 AM', title: 'Amer Fort Exploration', note: 'Take the cobblestone path up to Jaleb Chowk.' },
          { time: '12:00 PM', title: 'Panna Meena ka Kund Stepwell', note: 'Symmetrical 16th-century stepped architecture.' },
          { time: '03:00 PM', title: 'Jaigarh Fort & Royal Foundry', note: 'See Jaivana, the largest cannon on wheels.' },
          { time: '06:00 PM', title: 'Jal Mahal Lake Sunset', note: 'Golden hour reflection in Man Sagar Lake.' },
        ],
      },
      {
        day: 2,
        title: 'Heart of the Walled City',
        activities: [
          { time: '09:00 AM', title: 'City Palace & Courtyards', note: 'Pritam Niwas Chowk and Sabha Niwas hall.' },
          { time: '11:30 AM', title: 'Jantar Mantar Instruments', note: 'Guided tour of equatorial sundials.' },
          { time: '02:00 PM', title: 'Laxmi Mishthan Bhandar (LMB)', note: 'Famous Pyaz Kachori and Ghevar sweet tasting.' },
          { time: '04:30 PM', title: 'Hawa Mahal & Bapu Bazaar', note: 'Mojari shoes, block-print textiles, and spices.' },
        ],
      },
      {
        day: 3,
        title: 'Artisan Villages & Heritage Evenings',
        activities: [
          { time: '09:30 AM', title: 'Sanganer Block-Printing Workshop', note: 'Witness age-old natural indigo dye stamping.' },
          { time: '01:00 PM', title: 'Galta Ji (Monkey Temple)', note: 'Sacred natural water spring pavilions nestled in cliffs.' },
          { time: '04:30 PM', title: 'Birla Mandir & Moti Dungri', note: 'White marble temple illuminated against the night sky.' },
          { time: '07:30 PM', title: 'Chokhi Dhani Cultural Village', note: 'Folk dances, puppet shows, and seated village feast.' },
        ],
      },
    ],
    4: [
      {
        day: 1,
        title: 'Amber Citadel & Stepwells',
        activities: [
          { time: '08:30 AM', title: 'Amer Fort', note: 'Royal courtyards & Sheesh Mahal.' },
          { time: '12:30 PM', title: 'Panna Meena ka Kund', note: 'Historic stepwell.' },
          { time: '03:30 PM', title: 'Jal Mahal View', note: 'Water palace photo stop.' },
        ],
      },
      {
        day: 2,
        title: 'Old City & Royal Residences',
        activities: [
          { time: '09:00 AM', title: 'City Palace Complex', note: 'Royal textile museum & Chandra Mahal.' },
          { time: '12:00 PM', title: 'Jantar Mantar', note: 'UNESCO sundials.' },
          { time: '03:30 PM', title: 'Hawa Mahal & Johari Bazaar', note: 'Pink facades and jewellery.' },
        ],
      },
      {
        day: 3,
        title: 'Hill Forts & Sunsets',
        activities: [
          { time: '09:30 AM', title: 'Albert Hall Museum', note: 'Central museum & pigeons plaza.' },
          { time: '01:30 PM', title: 'Traditional Rajasthani Lunch', note: 'Laal Maas or Ker Sangri.' },
          { time: '04:00 PM', title: 'Nahargarh Fort & Padao Cafe', note: 'Ramparts sunset overlook.' },
        ],
      },
      {
        day: 4,
        title: 'Artisans & Spiritual Havens',
        activities: [
          { time: '09:00 AM', title: 'Bagru or Sanganer Block-Printing', note: 'Textile artisan collective.' },
          { time: '02:00 PM', title: 'Galta Ji Temple Complex', note: 'Clifftop kunds and peaceful shrines.' },
          { time: '06:00 PM', title: 'Sound & Light Show at Amber', note: 'Narrated history under starry skies.' },
        ],
      },
    ],
  },
  'varanasi': {
    2: [
      {
        day: 1,
        title: 'Sacred Ghats & Evening Ganga Aarti',
        activities: [
          { time: '05:30 AM', title: 'Subah-e-Banaras Dawn Boat Ride', note: 'Row past Assi, Dashashwamedh, and Manikarnika ghats at sunrise.' },
          { time: '09:00 AM', title: 'Kashi Vishwanath Temple', note: 'Visit the Golden Temple via the new Vishwanath Corridor.' },
          { time: '12:30 PM', title: 'Lassi & Banarasi Kachori in Thatheri Bazaar', note: 'Blue Lassi shop & piping hot jalebis.' },
          { time: '06:00 PM', title: 'Grand Ganga Aarti at Dashashwamedh Ghat', note: 'Watch brass multi-tiered oil lamps lit by priests chanting mantras.' },
        ],
      },
      {
        day: 2,
        title: 'Sarnath & Heritage Silk Weaving',
        activities: [
          { time: '08:30 AM', title: 'Sarnath Deer Park & Dhamek Stupa', note: 'Where Lord Buddha preached his first sermon after enlightenment.' },
          { time: '11:30 AM', title: 'Sarnath Archaeological Museum', note: 'View the original 3rd-century BCE Lion Capital of Ashoka.' },
          { time: '03:00 PM', title: 'Banarasi Silk Weaving Colony', note: 'Observe handloom master craftsmen creating Zari brocades.' },
          { time: '06:30 PM', title: 'Evening Sitar Performance at Assi Ghat', note: 'Classical Hindustani music on the riverbank.' },
        ],
      },
    ],
  },
  'goa': {
    3: [
      {
        day: 1,
        title: 'Old Goa Heritage & Panaji Latin Quarter',
        activities: [
          { time: '09:30 AM', title: 'Basilica of Bom Jesus', note: '16th-century UNESCO World Heritage church housing St. Francis Xavier.' },
          { time: '11:30 AM', title: 'Sé Cathedral & Church of St. Cajetan', note: 'Portuguese Manueline architecture.' },
          { time: '02:00 PM', title: 'Goan Fish Curry Thali in Panaji', note: 'Traditional coconut-kokum curry with kingfish.' },
          { time: '04:30 PM', title: 'Fontainhas Walking Tour', note: 'Colonial terracotta-roofed heritage quarter with pastel villas.' },
        ],
      },
      {
        day: 2,
        title: 'North Goa Coast & Fort Aguada',
        activities: [
          { time: '09:00 AM', title: 'Fort Aguada & 1864 Lighthouse', note: '17th-century Portuguese fortress overlooking Sinquerim beach.' },
          { time: '12:30 PM', title: 'Anjuna or Vagator Beach Shack Lunch', note: 'Fresh seafood and coastal breeze.' },
          { time: '04:00 PM', title: 'Chapora Fort Ramparts', note: 'Panoramic clifftop sunset over Vagator shoreline.' },
        ],
      },
      {
        day: 3,
        title: 'Spice Plantations & South Goa Serenity',
        activities: [
          { time: '10:00 AM', title: 'Sahakari Spice Farm in Ponda', note: 'Guided tour of vanilla, cardamom, black pepper with Goan buffet.' },
          { time: '03:30 PM', title: 'Palolem or Benaulim Beach Walk', note: 'Crescent-shaped serene beach with golden sands.' },
        ],
      },
    ],
  },
};

export default function TripPlannerClient() {
  const [destination, setDestination] = useState('jaipur');
  const [days, setDays] = useState(3);
  const [travelStyle, setTravelStyle] = useState('heritage');
  const [travelers, setTravelers] = useState('2');
  const [completedStops, setCompletedStops] = useState({});
  const [savedSuccess, setSavedSuccess] = useState(false);

  const currentPlan = sampleItineraries[destination]?.[days] || sampleItineraries['jaipur'][3];

  const toggleStop = (dayIdx, actIdx) => {
    const key = `${dayIdx}-${actIdx}`;
    setCompletedStops((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    try {
      const planToSave = {
        destination,
        days,
        travelStyle,
        travelers,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem('bharatyatra_saved_plan', JSON.stringify(planToSave));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch {}
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') window.print();
  };

  return (
    <div className="trip-planner-interface">
      {/* Configuration Controls Bar */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.75rem',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '2.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.25rem',
          alignItems: 'end',
        }}
      >
        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
            Destination
          </label>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            style={{ width: '100%', padding: '0.7rem 0.9rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: '#FFFDF8', color: 'var(--text-primary)', fontSize: '0.95rem', fontWeight: 600 }}
          >
            <option value="jaipur">Jaipur (Rajasthan)</option>
            <option value="varanasi">Varanasi (Uttar Pradesh)</option>
            <option value="goa">Goa (Coastal Circuit)</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
            Duration (Days)
          </label>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {[2, 3, 4].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDays(d)}
                style={{
                  flex: 1,
                  padding: '0.65rem 0',
                  borderRadius: 'var(--radius-sm)',
                  border: days === d ? '1px solid var(--teal-deep)' : '1px solid var(--border-color)',
                  background: days === d ? 'var(--teal-deep)' : 'var(--cream)',
                  color: days === d ? '#FFFDF8' : 'var(--text-primary)',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {d} Days
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
            Travel Style
          </label>
          <select
            value={travelStyle}
            onChange={(e) => setTravelStyle(e.target.value)}
            style={{ width: '100%', padding: '0.7rem 0.9rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: '#FFFDF8', color: 'var(--text-primary)', fontSize: '0.95rem' }}
          >
            <option value="heritage">👑 Heritage & History</option>
            <option value="culture">🍲 Food & Local Culture</option>
            <option value="leisure">🌿 Relaxed & Leisure</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
            Travelers
          </label>
          <select
            value={travelers}
            onChange={(e) => setTravelers(e.target.value)}
            style={{ width: '100%', padding: '0.7rem 0.9rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: '#FFFDF8', color: 'var(--text-primary)', fontSize: '0.95rem' }}
          >
            <option value="1">Solo Traveler</option>
            <option value="2">Couple (2)</option>
            <option value="4">Family / Group (4+)</option>
          </select>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', fontSize: '1.6rem', margin: 0 }}>
            {destination.toUpperCase()} — {days}-Day Customized Plan
          </h2>
          <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            Click items to mark them complete as you travel.
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={handleSave}
            style={{
              padding: '0.6rem 1.25rem',
              borderRadius: '999px',
              border: 'none',
              background: 'var(--gold-muted)',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <IconDeviceFloppy size={18} />
            <span>{savedSuccess ? 'Plan Saved!' : 'Save Plan'}</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            style={{
              padding: '0.6rem 1.25rem',
              borderRadius: '999px',
              border: '1px solid var(--teal-deep)',
              background: 'transparent',
              color: 'var(--teal-deep)',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <IconPrinter size={18} />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Day by Day Plan Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
        {currentPlan.map((dayItem, dayIdx) => (
          <div
            key={dayItem.day}
            style={{
              background: '#FFFFFF',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <span style={{ background: 'var(--teal-deep)', color: '#FFFDF8', fontWeight: 700, padding: '0.35rem 0.85rem', borderRadius: '999px', fontSize: '0.82rem' }}>
                DAY {dayItem.day}
              </span>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', fontSize: '1.25rem' }}>
                {dayItem.title}
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {dayItem.activities.map((act, actIdx) => {
                const isChecked = !!completedStops[`${dayIdx}-${actIdx}`];
                return (
                  <div
                    key={actIdx}
                    onClick={() => toggleStop(dayIdx, actIdx)}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '1rem',
                      padding: '0.85rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      background: isChecked ? '#F0FDF4' : 'var(--cream)',
                      border: isChecked ? '1px solid #86EFAC' : '1px solid var(--border-color)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      textDecoration: isChecked ? 'line-through' : 'none',
                      opacity: isChecked ? 0.75 : 1,
                    }}
                  >
                    <span style={{ marginTop: '0.15rem', color: isChecked ? '#16A34A' : 'var(--text-muted)', display: 'inline-flex' }}>
                      {isChecked ? <IconCheckbox size={20} color="#16A34A" /> : <IconSquare size={20} />}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--teal-primary)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                          <IconClock size={13} />
                          {act.time}
                        </span>
                        <strong style={{ fontSize: '0.98rem', color: 'var(--text-primary)' }}>{act.title}</strong>
                      </div>
                      <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                        {act.note}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Direct Link to Verified Guide */}
      <div
        style={{
          background: 'var(--cream)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
      >
        <div>
          <p className="section-eyebrow" style={{ margin: 0 }}>EXPLORE FULL DESTINATION GUIDE</p>
          <h4 style={{ margin: '0.35rem 0 0 0', fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', fontSize: '1.35rem' }}>
            Ready to dive deeper into {destination === 'jaipur' ? 'Jaipur' : destination === 'varanasi' ? 'Varanasi' : 'Goa'}?
          </h4>
          <p style={{ margin: '0.35rem 0 0 0', color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Check verified ticket timings, where to stay, famous food stalls, and official emergency contacts.
          </p>
        </div>
        <Link
          href={destination === 'jaipur' ? '/destinations/jaipur' : `/destinations/${destination}`}
          className="btn-gold-pill"
          style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <span>View Full Guide</span>
          <IconArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
