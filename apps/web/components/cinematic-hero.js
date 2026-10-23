'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  IconMapPin,
  IconArrowRight,
  IconX,
  IconVolume,
  IconVolumeOff,
  IconLandmark,
  IconRoute,
  IconPhoneCall,
} from './icons.js';

const popularDestinations = [
  { name: 'Nawalgarh', state: 'Rajasthan', slug: 'nawalgarh-rajasthan' },
  { name: 'Jaipur', state: 'Rajasthan', slug: 'jaipur-rajasthan' },
  { name: 'Kerala Backwaters', state: 'Kerala', slug: '' },
  { name: 'Varanasi', state: 'Uttar Pradesh', slug: '' },
  { name: 'Goa Beaches', state: 'Goa', slug: '' },
  { name: 'Ladakh Valleys', state: 'Ladakh', slug: '' },
];

export default function CinematicHero({ poster = '/hero.jpg' } = {}) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isMuted, setIsMuted] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef(null);
  const router = useRouter();

  // Muted autoplay requirement for modern browsers
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.defaultMuted = true;
      videoRef.current.volume = 0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setVideoLoaded(true))
          .catch((err) => {
            console.warn('Hero video autoplay fallback:', err);
          });
      }
    }
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (val.trim().length > 0) {
      const q = val.toLowerCase().trim();
      const matches = popularDestinations.filter(
        (d) => d.name.toLowerCase().includes(q) || d.state.toLowerCase().includes(q)
      );
      setSuggestions(matches.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const term = query.trim();
    if (!term) return;
    router.push(`/destinations?q=${encodeURIComponent(term)}`);
    setSuggestions([]);
  };

  const selectSuggestion = (dest) => {
    setQuery('');
    setSuggestions([]);
    if (dest.slug) {
      router.push(`/destinations/${dest.slug}`);
    } else {
      router.push(`/destinations?q=${encodeURIComponent(dest.name)}`);
    }
  };

  const toggleSound = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    videoRef.current.volume = nextMuted ? 0 : 0.6;
    setIsMuted(nextMuted);
  };

  return (
    <section
      className="by-cinematic-hero"
      aria-label="Discover India Hero"
      style={poster ? { backgroundImage: `url(${poster})` } : undefined}
    >
      {/* Background Video Layer */}
      {!videoFailed ? (
        <video
          ref={videoRef}
          className={`by-hero-video ${videoLoaded ? 'loaded' : ''}`}
          autoPlay
          muted
          loop
          playsInline
          webkit-playsinline="true"
          preload="metadata"
          poster={poster || '/hero.jpg'}
          aria-hidden="true"
          onCanPlay={() => setVideoLoaded(true)}
          onLoadedData={() => setVideoLoaded(true)}
          onError={() => setVideoFailed(true)}
        >
          <source src="/videos/bharatyatra-india.mp4" type="video/mp4" />
        </video>
      ) : null}

      {/* Cinematic Ambient Dark Vignette Overlay for Crisp Contrast */}
      <div className="by-hero-video-overlay" aria-hidden="true" />

      {/* Foreground Hero Content Shell */}
      <div className="by-hero-content">
        {/* Eyebrow Pill */}
        <div className="by-hero-eyebrow">
          <span>DISCOVER INCREDIBLE INDIA</span>
        </div>

        {/* Main Title Heading */}
        <h1 className="by-hero-title">
          Discover the Soul of <span style={{ fontStyle: 'italic', color: 'var(--gold-muted, #E99A24)' }}>India</span>
        </h1>

        {/* Description Subtitle */}
        <p className="by-hero-subtitle">
          Curated travel discovery across India&apos;s living heritage, sacred landscapes, timeless architectures, and unforgettable journeys.
        </p>

        {/* Search Card Widget */}
        <div className="hero-search-card">
          <form
            className="hero-search-input-form"
            onSubmit={handleSearchSubmit}
            role="search"
            aria-label="Destination Search"
          >
            <div className="hero-search-field-wrap">
              <span className="hero-search-field-icon" aria-hidden="true">
                <IconMapPin size={20} color="var(--teal-primary, #153E3A)" />
              </span>
              <input
                id="hero-destination-search"
                type="search"
                name="q"
                className="hero-search-field-input"
                placeholder="Where do you want to explore in India? (e.g. Jaipur, Nawalgarh, Kerala)"
                aria-label="Where do you want to explore?"
                value={query}
                onChange={handleInputChange}
                autoComplete="off"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setSuggestions([]);
                  }}
                  aria-label="Clear search query"
                  style={{
                    position: 'absolute',
                    right: '12px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-secondary, #64736F)',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <IconX size={16} />
                </button>
              )}

              {/* Suggestions Dropdown */}
              {suggestions.length > 0 && (
                <div className="hero-search-suggestions-dropdown" role="listbox">
                  {suggestions.map((dest) => (
                    <button
                      key={dest.slug || dest.name}
                      type="button"
                      className="hero-search-suggestion-item"
                      onClick={() => selectSuggestion(dest)}
                      role="option"
                      aria-selected="false"
                    >
                      <IconMapPin size={16} color="var(--gold-dark, #C58B32)" />
                      <span className="sugg-name">{dest.name}</span>
                      <span className="sugg-state">{dest.state}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="hero-search-submit-btn"
              aria-label="Explore India"
            >
              <span>Explore</span>
              <IconArrowRight size={18} />
            </button>
          </form>

          {/* Popular Destination Pills */}
          <div className="hero-popular-row">
            <span className="hero-popular-label">Popular:</span>
            <div className="hero-popular-pills">
              <Link href="/destinations/nawalgarh-rajasthan" className="hero-popular-pill">
                Nawalgarh
              </Link>
              <Link href="/destinations?region=north" className="hero-popular-pill">
                North India
              </Link>
              <Link href="/destinations?region=south" className="hero-popular-pill">
                South India
              </Link>
              <Link href="/destinations?region=west" className="hero-popular-pill">
                Rajasthan &amp; West
              </Link>
              <Link href="/states" className="hero-popular-pill">
                All 36 States
              </Link>
            </div>
          </div>
        </div>

        {/* Trust Badges Strip */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '1.25rem',
            marginTop: '2rem',
            fontSize: '0.85rem',
            color: '#FFFDF8',
            opacity: 0.92,
          }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <IconLandmark size={16} color="var(--gold-muted, #E99A24)" />
            <span>Authentic Heritage Guides</span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <IconRoute size={16} color="var(--gold-muted, #E99A24)" />
            <span>Verified Routes &amp; Transits</span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <IconPhoneCall size={16} color="var(--gold-muted, #E99A24)" />
            <span>Tourist Helpline (1363 / 112)</span>
          </div>
        </div>
      </div>

      {/* Discreet Sound / Mute Toggle in Bottom Corner */}
      {!videoFailed && (
        <button
          type="button"
          onClick={toggleSound}
          style={{
            position: 'absolute',
            bottom: '16px',
            right: '16px',
            zIndex: 10,
            background: 'rgba(16, 47, 44, 0.75)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#FFFDF8',
            padding: '6px 12px',
            borderRadius: '999px',
            fontSize: '0.78rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}
          aria-label={isMuted ? 'Unmute video audio' : 'Mute video audio'}
          title={isMuted ? 'Unmute video audio' : 'Mute video audio'}
        >
          {isMuted ? (
            <>
              <IconVolumeOff size={15} />
              <span>Audio Muted</span>
            </>
          ) : (
            <>
              <IconVolume size={15} />
              <span>Audio On</span>
            </>
          )}
        </button>
      )}
    </section>
  );
}
