'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  IconMapPin,
  IconArrowRight,
  IconExternalLink,
  getRegionIcon,
} from './icons';

const mapPins = [
  { id: 'nawalgarh', name: 'Nawalgarh', state: 'Rajasthan', stateSlug: 'rajasthan', region: 'west', lat: 27.8483, lng: 75.2677, tag: 'Shekhawati Painted Havelis', href: '/destinations/nawalgarh-rajasthan', isPublished: true },
  { id: 'rajasthan', name: 'Rajasthan Heritage Circuit', state: 'Rajasthan', stateSlug: 'rajasthan', region: 'west', lat: 26.9124, lng: 75.7873, tag: 'Forts, Havelis & Thar Desert', href: '/states/rajasthan', isPublished: false },
  { id: 'kerala', name: 'Kerala Backwaters & Hills', state: 'Kerala', stateSlug: 'kerala', region: 'south', lat: 9.4981, lng: 76.3388, tag: 'Lagoons, Backwaters & Tea Gardens', href: '/states/kerala', isPublished: false },
  { id: 'himachal', name: 'Himachal Himalayan Valleys', state: 'Himachal Pradesh', stateSlug: 'himachal-pradesh', region: 'north', lat: 32.2432, lng: 77.1892, tag: 'Alpine Meadows & Cedar Valleys', href: '/states/himachal-pradesh', isPublished: false },
  { id: 'ladakh', name: 'Ladakh High-Altitude Passes', state: 'Ladakh', stateSlug: 'ladakh', region: 'north', lat: 34.1526, lng: 77.5771, tag: 'Monasteries & Sacred High Valleys', href: '/states/ladakh', isPublished: false },
  { id: 'goa', name: 'Goan Coastal Heritage', state: 'Goa', stateSlug: 'goa', region: 'west', lat: 15.2993, lng: 74.1240, tag: 'Beaches & Portuguese Architecture', href: '/states/goa', isPublished: false },
  { id: 'karnataka', name: 'Karnataka Heritage Circuit', state: 'Karnataka', stateSlug: 'karnataka', region: 'south', lat: 15.3350, lng: 76.4600, tag: 'Vijayanagara Ruins & Western Ghats', href: '/states/karnataka', isPublished: false },
  { id: 'madhyapradesh', name: 'Central India Heritage & Wilds', state: 'Madhya Pradesh', stateSlug: 'madhya-pradesh', region: 'central', lat: 24.8318, lng: 79.9199, tag: 'UNESCO Temples & Tiger Reserves', href: '/states/madhya-pradesh', isPublished: false },
  { id: 'northeast', name: 'Meghalaya Living Root Forests', state: 'Meghalaya', stateSlug: 'meghalaya', region: 'northeast', lat: 25.5788, lng: 91.8933, tag: 'Living Root Bridges & Cloud Valleys', href: '/states/meghalaya', isPublished: false },
];

export default function MapExplorerClient() {
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [activePin, setActivePin] = useState(mapPins[0]);

  const filtered = selectedRegion === 'all'
    ? mapPins
    : mapPins.filter((p) => p.region === selectedRegion);

  return (
    <div>
      {/* Region Filter Bar */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
        {[
          { id: 'all', label: 'All Regions' },
          { id: 'north', label: 'North India' },
          { id: 'south', label: 'South India' },
          { id: 'west', label: 'West India' },
          { id: 'central', label: 'Central India' },
          { id: 'northeast', label: 'Northeast India' },
        ].map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setSelectedRegion(r.id)}
            style={{
              padding: '0.55rem 1.15rem',
              borderRadius: '999px',
              border: selectedRegion === r.id ? '1px solid var(--teal-deep)' : '1px solid var(--border-color)',
              background: selectedRegion === r.id ? 'var(--teal-deep)' : '#FFFFFF',
              color: selectedRegion === r.id ? '#FFFDF8' : 'var(--text-primary)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {getRegionIcon(r.id, { size: 16 })}
            <span>{r.label}</span>
          </button>
        ))}
      </div>

      {/* Map Explorer Interface */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        {/* Destination List Panel */}
        <div style={{ background: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', maxHeight: '520px', overflowY: 'auto' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '1rem' }}>
            Select a Destination ({filtered.length} Locations)
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {filtered.map((pin) => (
              <div
                key={pin.id}
                onClick={() => setActivePin(pin)}
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: activePin.id === pin.id ? '2px solid var(--teal-primary)' : '1px solid var(--border-color)',
                  background: activePin.id === pin.id ? 'var(--cream)' : '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <strong style={{ display: 'block', color: 'var(--teal-deep)', fontSize: '1.05rem' }}>{pin.name}</strong>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{pin.state} · {pin.tag}</span>
                </div>
                <span style={{ color: 'var(--gold-dark)', fontWeight: 700, fontSize: '0.85rem' }}>
                  {activePin.id === pin.id ? '● Selected' : '○'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Destination Geographic Card */}
        <div style={{ background: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '2rem', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ background: 'var(--teal-deep)', color: '#FFFDF8', fontWeight: 700, padding: '0.25rem 0.65rem', borderRadius: '999px', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                {activePin.region.toUpperCase()} INDIA
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Coordinates: {activePin.lat.toFixed(4)}° N, {activePin.lng.toFixed(4)}° E
              </span>
            </div>

            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', fontSize: '1.8rem', margin: '0 0 0.35rem 0' }}>
              {activePin.name}
            </h3>
            <span style={{ fontSize: '1rem', color: 'var(--gold-dark)', fontWeight: 600, display: 'block', marginBottom: '1rem' }}>
              {activePin.state} · {activePin.tag}
            </span>

            {/* Stylized Simulated Map Tile */}
            <div
              style={{
                width: '100%',
                height: '200px',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                position: 'relative',
                background: '#E5E7EB',
                border: '1px solid var(--border-color)',
                marginBottom: '1.5rem',
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80"
                alt="Map topography background"
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
              />
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'var(--teal-deep)', color: '#FFFFFF', padding: '0.5rem 1rem', borderRadius: '999px', fontWeight: 700, fontSize: '0.85rem', boxShadow: '0 4px 12px rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <IconMapPin size={16} style={{ color: 'var(--gold-muted)' }} />
                <span>{activePin.name}, {activePin.state}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link
              href={activePin.href || '/destinations'}
              className="btn-gold-pill"
              style={{ textDecoration: 'none', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <span>Explore {activePin.name}</span>
              <IconArrowRight size={16} />
            </Link>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${activePin.lat},${activePin.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-teal"
              style={{ textDecoration: 'none', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <span>Open in Google Maps</span>
              <IconExternalLink size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
