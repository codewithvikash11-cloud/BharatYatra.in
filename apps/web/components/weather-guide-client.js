'use client';
import { useState } from 'react';
import Link from 'next/link';
import { IconCloudSun, IconArrowRight } from './icons.js';

const monthsData = [
  {
    month: 'January',
    season: 'Peak Winter',
    summary: 'Clear blue skies and crisp sunny days across northern plains, heritage circuits, and southern beaches.',
    tempRanges: {
      north: '5°C – 20°C (Chilly mornings, sunny afternoons)',
      west: '10°C – 24°C (Ideal for fort walks in Rajasthan)',
      south: '22°C – 31°C (Warm tropical beach weather)',
      east: '12°C – 23°C (Pleasant and dry)',
    },
    topPlaces: [
      { name: 'Jaipur', state: 'Rajasthan', desc: 'Mild sunshine, heritage festivals & walking tours.', href: '/destinations/jaipur' },
      { name: 'Goa', state: 'Goa', desc: 'Peak beach season with calm turquoise Arabian Sea waters.', href: '/destinations?state=goa' },
      { name: 'Varanasi', state: 'Uttar Pradesh', desc: 'Atmospheric early morning mist along the sacred Ganges ghats.', href: '/articles' },
      { name: 'Kerala Backwaters', state: 'Kerala', desc: 'Cool breezes cruising tranquil palm-fringed lagoons.', href: '/destinations' },
    ],
  },
  {
    month: 'February',
    season: 'Late Winter / Spring',
    summary: 'One of the most pleasant travel months in India. Warm daytime sun with comfortable evenings everywhere.',
    tempRanges: {
      north: '10°C – 24°C (Gentle spring breeze)',
      west: '13°C – 28°C (Pleasant sightseeing)',
      south: '23°C – 32°C (Dry, sunny, and breezy)',
      east: '15°C – 26°C (Perfect exploration weather)',
    },
    topPlaces: [
      { name: 'Udaipur', state: 'Rajasthan', desc: 'Lakeside palaces under gentle afternoon sunlight.', href: '/destinations' },
      { name: 'Hampi', state: 'Karnataka', desc: 'Explore boulders and Vijayanagara ruins before summer heat arrives.', href: '/destinations' },
      { name: 'Nawalgarh', state: 'Rajasthan', desc: 'Open-air art gallery havelis in Shekhawati.', href: '/destinations/nawalgarh-rajasthan' },
      { name: 'Rishikesh', state: 'Uttarakhand', desc: 'Comfortable rafting temperatures and evening Ganga Aarti.', href: '/destinations' },
    ],
  },
  {
    month: 'March',
    season: 'Early Summer / Spring Festivals',
    summary: 'The month of vibrant Holi celebrations. Days warm up while hill stations begin to open up.',
    tempRanges: {
      north: '15°C – 30°C (Pleasant early, warmer by late month)',
      west: '18°C – 33°C (Dry desert warmth)',
      south: '25°C – 34°C (Humid tropical warmth)',
      east: '19°C – 31°C (Occasional spring showers)',
    },
    topPlaces: [
      { name: 'Mathura & Vrindavan', state: 'Uttar Pradesh', desc: 'Epicentre of traditional Braj Holi festivities.', href: '/articles' },
      { name: 'Jaipur', state: 'Rajasthan', desc: 'Royal Elephant & Holi celebrations across palace gates.', href: '/destinations/jaipur' },
      { name: 'Kaziranga', state: 'Assam', desc: 'Prime wildlife safari window for one-horned rhinoceros.', href: '/destinations' },
    ],
  },
  {
    month: 'April – June',
    season: 'Summer / Hill Retreat Window',
    summary: 'Hot in the central and northern plains. Peak season for the Himalayas, Kashmir, Ladakh, and tea estates.',
    tempRanges: {
      north: '28°C – 42°C (Plains hot; Himalayas 12°C – 22°C)',
      west: '30°C – 43°C (Dry desert heat)',
      south: '28°C – 36°C (Hill stations 15°C – 22°C)',
      east: '25°C – 35°C (Pre-monsoon showers)',
    },
    topPlaces: [
      { name: 'Manali & Spiti', state: 'Himachal Pradesh', desc: 'High-altitude mountain passes and apple blossom valleys.', href: '/destinations' },
      { name: 'Leh Ladakh', state: 'Ladakh', desc: 'Pangong Tso and mountain passes open for high-altitude road trips.', href: '/destinations' },
      { name: 'Munnar', state: 'Kerala', desc: 'Cool mist-covered Western Ghat tea plantations.', href: '/destinations' },
    ],
  },
  {
    month: 'July – September',
    season: 'Southwest Monsoon',
    summary: 'Lush greenery, dramatic waterfalls, and rejuvenated hills. Excellent for nature lovers, Ayurveda, and rain lovers.',
    tempRanges: {
      north: '24°C – 34°C (Rainy with high humidity)',
      west: '24°C – 32°C (Green Aravallis and full lakes)',
      south: '23°C – 30°C (Heavy coastal and Western Ghats rains)',
      east: '25°C – 32°C (Plentiful rainfall in green plains)',
    },
    topPlaces: [
      { name: 'Kerala (Ayurveda)', state: 'Kerala', desc: 'Traditional monsoon Ayurvedic wellness rejuvenation.', href: '/destinations' },
      { name: 'Udaipur Lakes', state: 'Rajasthan', desc: 'Lake Pichola and Fateh Sagar filled to the brim with green hills.', href: '/destinations' },
      { name: 'Valley of Flowers', state: 'Uttarakhand', desc: 'UNESCO alpine valley blooming with thousands of wild species.', href: '/destinations' },
    ],
  },
  {
    month: 'October – December',
    season: 'Autumn & Festive Winter',
    summary: 'The golden season across the Indian subcontinent. Diwali lights, harvest festivals, and cool desert weather.',
    tempRanges: {
      north: '10°C – 26°C (Crisp sunny weather)',
      west: '14°C – 28°C (Peak Rajasthan tourism window)',
      south: '22°C – 30°C (Gentle tropical winter)',
      east: '16°C – 26°C (Pleasant festive atmosphere)',
    },
    topPlaces: [
      { name: 'Jaipur', state: 'Rajasthan', desc: 'The classic destination in its finest season.', href: '/destinations/jaipur' },
      { name: 'Pushkar', state: 'Rajasthan', desc: 'World-famous annual camel fair and sacred lake celebrations.', href: '/destinations' },
      { name: 'Varanasi', state: 'Uttar Pradesh', desc: 'Dev Deepawali when a million oil lamps light the ghats.', href: '/articles' },
      { name: 'Rann of Kutch', state: 'Gujarat', desc: 'White salt desert under moonlight at the Rann Utsav festival.', href: '/destinations' },
    ],
  },
];

export default function WeatherGuideClient() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const current = monthsData[selectedIdx];

  return (
    <div>
      {/* Month Selector Buttons */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.75rem', marginBottom: '2rem' }}>
        {monthsData.map((m, idx) => (
          <button
            key={m.month}
            type="button"
            onClick={() => setSelectedIdx(idx)}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: '999px',
              border: selectedIdx === idx ? '1px solid var(--teal-deep)' : '1px solid var(--border-color)',
              background: selectedIdx === idx ? 'var(--teal-deep)' : '#FFFFFF',
              color: selectedIdx === idx ? '#FFFDF8' : 'var(--text-primary)',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {m.month}
          </button>
        ))}
      </div>

      {/* Main Climate Overview Card */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '2.25rem',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '2.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
          <IconCloudSun size={24} style={{ color: 'var(--gold-dark)', flexShrink: 0 }} />
          <span style={{ background: 'var(--cream)', color: 'var(--teal-deep)', fontWeight: 700, padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.8rem', border: '1px solid var(--border-color)' }}>
            {current.season.toUpperCase()}
          </span>
        </div>

        <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', fontSize: '1.8rem', margin: '0.4rem 0 0.75rem 0' }}>
          Traveling in {current.month}: What to Expect
        </h2>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 2rem 0' }}>
          {current.summary}
        </p>

        {/* Regional Temperatures */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
          <div>
            <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--teal-deep)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              North India
            </strong>
            <span style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', display: 'block', marginTop: '0.2rem' }}>
              {current.tempRanges.north}
            </span>
          </div>
          <div>
            <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--teal-deep)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              West & Rajasthan
            </strong>
            <span style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', display: 'block', marginTop: '0.2rem' }}>
              {current.tempRanges.west}
            </span>
          </div>
          <div>
            <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--teal-deep)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              South India & Coast
            </strong>
            <span style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', display: 'block', marginTop: '0.2rem' }}>
              {current.tempRanges.south}
            </span>
          </div>
          <div>
            <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--teal-deep)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              East & Northeast
            </strong>
            <span style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', display: 'block', marginTop: '0.2rem' }}>
              {current.tempRanges.east}
            </span>
          </div>
        </div>
      </div>

      {/* Recommended Destinations Grid */}
      <div>
        <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', fontSize: '1.4rem', marginBottom: '1.25rem' }}>
          Best Destinations to Visit in {current.month}
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
          {current.topPlaces.map((place) => (
            <Link
              key={place.name}
              href={place.href}
              style={{
                textDecoration: 'none',
                background: '#FFFFFF',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '1.5rem',
                display: 'block',
                transition: 'transform 0.15s ease',
              }}
            >
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--gold-dark)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.25rem' }}>
                {place.state}
              </span>
              <strong style={{ fontSize: '1.2rem', color: 'var(--teal-deep)', display: 'block', marginBottom: '0.4rem', fontFamily: 'var(--font-heading)' }}>
                {place.name}
              </strong>
              <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {place.desc}
              </p>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '0.85rem', fontSize: '0.82rem', fontWeight: 600, color: 'var(--teal-secondary)' }}>
                <span>Explore Guide</span>
                <IconArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
