'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  IconMapPin,
  IconCompass,
  IconAlertTriangle,
  IconRoute,
  IconArrowRight,
  IconMap,
  IconExternalLink,
} from './icons';

// Verified coordinate repository of hubs, destinations, and attractions
const verifiedPlaces = [
  // Hubs / Destinations
  {
    type: 'destination',
    slug: 'jaipur',
    name: 'Jaipur (The Pink City)',
    state: 'Rajasthan',
    lat: 26.9124,
    lng: 75.7873,
    cover: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80',
    summary: 'UNESCO World Heritage walled city, Rajput hill forts, and royal observatories.',
    href: '/destinations/jaipur',
  },
  {
    type: 'destination',
    slug: 'varanasi',
    name: 'Varanasi (Kashi)',
    state: 'Uttar Pradesh',
    lat: 25.3176,
    lng: 82.9739,
    cover: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=600&q=80',
    summary: 'Sacred river ghats along the Ganges, evening aarti, and Kashi Vishwanath temple.',
    href: '/destinations/varanasi',
  },
  {
    type: 'destination',
    slug: 'udaipur',
    name: 'Udaipur (City of Lakes)',
    state: 'Rajasthan',
    lat: 24.5854,
    lng: 73.7125,
    cover: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=600&q=80',
    summary: 'Lakeside Mewar palaces, Lake Pichola boat cruises, and marble heritage temples.',
    href: '/destinations/udaipur',
  },
  {
    type: 'destination',
    slug: 'manali',
    name: 'Manali',
    state: 'Himachal Pradesh',
    lat: 32.2432,
    lng: 77.1892,
    cover: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80',
    summary: 'Himalayan alpine pine valleys, Solang adventure, and Rohtang Pass.',
    href: '/destinations/manali',
  },
  {
    type: 'destination',
    slug: 'rishikesh',
    name: 'Rishikesh',
    state: 'Uttarakhand',
    lat: 30.0869,
    lng: 78.2676,
    cover: 'https://images.unsplash.com/photo-1607963496350-f84f09d84c17?auto=format&fit=crop&w=600&q=80',
    summary: 'Yoga capital of the world, suspension bridges, and Himalayan foothills rafting.',
    href: '/destinations/rishikesh',
  },
  {
    type: 'destination',
    slug: 'goa',
    name: 'Goa',
    state: 'Goa',
    lat: 15.2993,
    lng: 74.1240,
    cover: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80',
    summary: 'Portuguese heritage churches, spice plantations, and golden sandy coastlines.',
    href: '/destinations/goa',
  },
  {
    type: 'destination',
    slug: 'nawalgarh-rajasthan',
    name: 'Nawalgarh (Shekhawati)',
    state: 'Rajasthan',
    lat: 27.8489,
    lng: 75.2711,
    cover: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80',
    summary: 'Open-air art gallery of Rajasthan, renowned for frescoed merchant havelis.',
    href: '/destinations/nawalgarh-rajasthan',
  },

  // Key Verified Monuments & Attractions
  {
    type: 'attraction',
    slug: 'amer-fort',
    name: 'Amer Fort & Sheesh Mahal',
    state: 'Rajasthan (Jaipur)',
    lat: 26.9855,
    lng: 75.8513,
    cover: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80',
    summary: '16th-century UNESCO hilltop fortress with mirrored palace halls and Maota Lake views.',
    href: '/attractions/jaipur/amer-fort',
  },
  {
    type: 'attraction',
    slug: 'hawa-mahal',
    name: 'Hawa Mahal (Palace of Winds)',
    state: 'Rajasthan (Jaipur)',
    lat: 26.9239,
    lng: 75.8267,
    cover: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80',
    summary: 'Iconic five-story pink sandstone facade with 953 carved jharokhas casements.',
    href: '/attractions/jaipur/hawa-mahal',
  },
  {
    type: 'attraction',
    slug: 'city-palace',
    name: 'City Palace Jaipur',
    state: 'Rajasthan (Jaipur)',
    lat: 26.9258,
    lng: 75.8237,
    cover: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80',
    summary: 'Royal residence featuring Chandra Mahal, Peacock Gate, and Mubarak Mahal.',
    href: '/attractions/jaipur/city-palace',
  },
  {
    type: 'attraction',
    slug: 'jantar-mantar',
    name: 'Jantar Mantar Observatory',
    state: 'Rajasthan (Jaipur)',
    lat: 26.9248,
    lng: 75.8246,
    cover: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80',
    summary: 'UNESCO World Heritage collection of nineteen architectural astronomical instruments.',
    href: '/attractions/jaipur/jantar-mantar',
  },
  {
    type: 'attraction',
    slug: 'nahargarh-fort',
    name: 'Nahargarh Fort',
    state: 'Rajasthan (Jaipur)',
    lat: 26.9374,
    lng: 75.8156,
    cover: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=600&q=80',
    summary: 'Aravalli ramparts fortification with panoramic twilight overlook across the Pink City.',
    href: '/attractions/jaipur/nahargarh-fort',
  },
  {
    type: 'attraction',
    slug: 'taj-mahal',
    name: 'Taj Mahal (Agra)',
    state: 'Uttar Pradesh (Agra)',
    lat: 27.1751,
    lng: 78.0421,
    cover: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80',
    summary: '17th-century white marble mausoleum on the south bank of the Yamuna River.',
    href: '/destinations',
  },
  {
    type: 'attraction',
    slug: 'qutub-minar',
    name: 'Qutub Minar (Delhi)',
    state: 'Delhi (Mehrauli)',
    lat: 28.5245,
    lng: 77.1855,
    cover: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80',
    summary: '73-meter victory minaret of fluted red sandstone built in 1192 CE.',
    href: '/destinations',
  },
];

const presetHubs = [
  { name: 'Jaipur (Pink City)', lat: 26.9124, lng: 75.7873 },
  { name: 'New Delhi (Connaught Place)', lat: 28.6315, lng: 77.2167 },
  { name: 'Mumbai (Gateway of India)', lat: 18.9220, lng: 72.8347 },
  { name: 'Udaipur (Lake Pichola)', lat: 24.5760, lng: 73.6835 },
  { name: 'Varanasi (Dashashwamedh Ghat)', lat: 25.3076, lng: 83.0104 },
  { name: 'Kochi (Fort Kochi)', lat: 9.9658, lng: 76.2421 },
  { name: 'Rishikesh (Triveni Ghat)', lat: 30.1068, lng: 78.2982 },
  { name: 'Manali (Mall Road)', lat: 32.2396, lng: 77.1887 },
];

// Haversine spherical distance formula (returns distance in km)
function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10; // Round to 1 decimal place
}

export default function NearbyPlacesClient() {
  const [currentCoords, setCurrentCoords] = useState({ lat: 26.9124, lng: 75.7873, name: 'Jaipur (Pink City)' });
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [maxRadiusKm, setMaxRadiusKm] = useState(300); // 50, 150, 300, 1000
  const [filterType, setFilterType] = useState('all'); // all, destination, attraction

  const handleUseGeolocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    setLocationError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        setCurrentCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          name: `My GPS Coordinates (${pos.coords.latitude.toFixed(4)}°, ${pos.coords.longitude.toFixed(4)}°)`,
        });
      },
      (err) => {
        setIsLocating(false);
        if (err.code === 1) {
          setLocationError('Location permission was denied. Please choose a hub city below.');
        } else {
          setLocationError('Unable to retrieve your current location. Please choose a hub city below.');
        }
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  };

  const handleSelectHub = (hub) => {
    setLocationError('');
    setCurrentCoords({ lat: hub.lat, lng: hub.lng, name: hub.name });
  };

  // Calculate distances and sort
  const placesWithDistance = useMemo(() => {
    return verifiedPlaces
      .map((place) => {
        const distanceKm = calculateHaversineDistance(currentCoords.lat, currentCoords.lng, place.lat, place.lng);
        return { ...place, distanceKm };
      })
      .filter((place) => {
        if (filterType !== 'all' && place.type !== filterType) return false;
        if (maxRadiusKm < 1000 && place.distanceKm > maxRadiusKm) return false;
        return true;
      })
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [currentCoords, maxRadiusKm, filterType]);

  return (
    <div>
      {/* Location Control Card */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '2.5rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--teal-deep)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>
              Base Coordinate Reference
            </span>
            <strong style={{ fontSize: '1.25rem', color: 'var(--teal-deep)', fontFamily: 'var(--font-heading)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <IconMapPin size={20} />
              <span>{currentCoords.name}</span>
            </strong>
            <span style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Lat: {currentCoords.lat.toFixed(4)}° · Lng: {currentCoords.lng.toFixed(4)}°
            </span>
          </div>

          <button
            type="button"
            onClick={handleUseGeolocation}
            disabled={isLocating}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.25rem',
              borderRadius: '999px',
              border: '1px solid var(--teal-primary)',
              background: 'var(--teal-primary)',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: isLocating ? 'wait' : 'pointer',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <IconCompass size={18} />
            <span>{isLocating ? 'Acquiring GPS…' : 'Use My Device Location'}</span>
          </button>
        </div>

        {locationError && (
          <div
            role="alert"
            style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              color: '#DC2626',
              fontSize: '0.88rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <IconAlertTriangle size={18} />
            <span>{locationError}</span>
          </div>
        )}

        {/* Quick Hub Selector Buttons */}
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.6rem' }}>
            Or Pick a Base City:
          </span>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {presetHubs.map((hub) => {
              const isActive = currentCoords.name === hub.name;
              return (
                <button
                  key={hub.name}
                  type="button"
                  onClick={() => handleSelectHub(hub)}
                  style={{
                    padding: '0.45rem 0.9rem',
                    borderRadius: '999px',
                    border: isActive ? '1px solid var(--teal-deep)' : '1px solid var(--border-color)',
                    background: isActive ? 'var(--teal-deep)' : 'var(--cream)',
                    color: isActive ? '#FFFDF8' : 'var(--text-primary)',
                    fontSize: '0.82rem',
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {hub.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Radius & Type Filter Bar */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Maximum Radius:</span>
            {[
              { label: 'Within 50 km', val: 50 },
              { label: 'Within 150 km', val: 150 },
              { label: 'Within 300 km', val: 300 },
              { label: 'All India', val: 1000 },
            ].map((r) => (
              <button
                key={r.val}
                type="button"
                onClick={() => setMaxRadiusKm(r.val)}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '6px',
                  border: maxRadiusKm === r.val ? '1px solid var(--teal-primary)' : '1px solid var(--border-color)',
                  background: maxRadiusKm === r.val ? 'var(--teal-primary)' : '#FFFFFF',
                  color: maxRadiusKm === r.val ? '#FFFFFF' : 'var(--text-primary)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {r.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Filter Type:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{
                padding: '0.4rem 0.75rem',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                background: '#FFFFFF',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
              }}
            >
              <option value="all">All Places</option>
              <option value="destination">Destinations Only</option>
              <option value="attraction">Monuments & Attractions</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', fontSize: '1.35rem', margin: 0 }}>
          {placesWithDistance.length} Places Found Near {currentCoords.name}
        </h2>
        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          Calculated via verified spherical coordinates (Haversine formula)
        </span>
      </div>

      {/* Results Grid */}
      {placesWithDistance.length === 0 ? (
        <div className="empty-editorial-card" style={{ maxWidth: '640px', margin: '2rem auto', textAlign: 'center', padding: '3rem 1.5rem' }}>
          <div style={{ color: 'var(--teal-primary)', marginBottom: '0.75rem', display: 'flex', justifyContent: 'center' }}>
            <IconCompass size={40} />
          </div>
          <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', fontSize: '1.25rem', margin: '0 0 0.5rem 0' }}>
            No verified places found within {maxRadiusKm} km
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6, margin: '0 0 1.5rem 0' }}>
            Expand your search radius or select another base city like Jaipur, Delhi, or Mumbai to explore nearby attractions.
          </p>
          <button
            type="button"
            onClick={() => setMaxRadiusKm(1000)}
            className="btn-gold-pill"
            style={{ fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <span>Search All India Places</span>
            <IconArrowRight size={16} />
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem', marginBottom: '3.5rem' }}>
          {placesWithDistance.map((item) => {
            const isSelf = item.distanceKm === 0;
            const mapsDirUrl = `https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lng}`;

            return (
              <article
                key={item.slug}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ height: '180px', width: '100%', position: 'relative' }}>
                  <img
                    src={item.cover}
                    alt={item.name}
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      top: '1rem',
                      left: '1rem',
                      background: item.type === 'destination' ? 'var(--teal-deep)' : 'var(--gold-dark)',
                      color: '#FFFFFF',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '0.25rem 0.65rem',
                      borderRadius: '999px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {item.type === 'destination' ? 'Destination' : 'Attraction'}
                  </span>
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '1rem',
                      right: '1rem',
                      background: 'rgba(16, 47, 44, 0.85)',
                      backdropFilter: 'blur(4px)',
                      color: '#FFFFFF',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      padding: '0.3rem 0.75rem',
                      borderRadius: '999px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    {isSelf ? (
                      <>
                        <IconMapPin size={14} />
                        <span>At this location</span>
                      </>
                    ) : (
                      <>
                        <IconRoute size={14} />
                        <span>{item.distanceKm} km away</span>
                      </>
                    )}
                  </span>
                </div>

                <div style={{ padding: '1.75rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--gold-dark)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '0.35rem' }}>
                    <IconMapPin size={14} />
                    <span>{item.state}</span>
                  </span>

                  <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', fontSize: '1.3rem', margin: '0 0 0.5rem 0' }}>
                    <Link href={item.href} style={{ color: 'inherit', textDecoration: 'none' }}>
                      {item.name}
                    </Link>
                  </h3>

                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 1.25rem 0', flex: 1 }}>
                    {item.summary}
                  </p>

                  {/* Geographic Coordinates Label */}
                  <div style={{ background: 'var(--cream)', borderRadius: 'var(--radius-sm)', padding: '0.65rem 0.85rem', border: '1px solid var(--border-color)', marginBottom: '1.25rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Verified GPS: {item.lat.toFixed(4)}° N, {item.lng.toFixed(4)}° E
                  </div>

                  <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                    <Link href={item.href} className="btn-gold-pill" style={{ fontSize: '0.82rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <span>Explore Guide</span>
                      <IconArrowRight size={14} />
                    </Link>
                    <a
                      href={mapsDirUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="button-link-secondary"
                      style={{ fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <IconMap size={14} />
                      <span>Navigate</span>
                      <IconExternalLink size={12} />
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
