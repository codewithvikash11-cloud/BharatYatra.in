'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  IconSearch,
  IconMapPin,
  IconArrowRight,
  IconX,
  IconVolume,
  IconVolumeOff,
  IconLandmark,
  IconRoute,
  IconPhoneCall,
  IconSparkles,
} from './icons.js';

const popularDestinations = [
  { name: 'Jaipur', state: 'Rajasthan', slug: 'jaipur' },
  { name: 'Varanasi', state: 'Uttar Pradesh', slug: 'varanasi' },
  { name: 'Goa', state: 'Goa', slug: 'goa' },
  { name: 'Udaipur', state: 'Rajasthan', slug: 'udaipur' },
  { name: 'Kerala Backwaters', state: 'Kerala', slug: 'kerala' },
  { name: 'Manali', state: 'Himachal Pradesh', slug: 'manali' },
  { name: 'Leh Ladakh', state: 'Ladakh', slug: 'ladakh' },
  { name: 'Rishikesh', state: 'Uttarakhand', slug: 'rishikesh' },
  { name: 'Agra', state: 'Uttar Pradesh', slug: 'agra' },
  { name: 'Nawalgarh', state: 'Rajasthan', slug: 'nawalgarh-rajasthan' },
];

export default function CinematicHero({ poster = '/hero.jpg' } = {}) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isMuted, setIsMuted] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef(null);
  const router = useRouter();

  // Ensure video begins muted strictly (browser autoplay requirement)
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.defaultMuted = true;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setVideoLoaded(true);
          })
          .catch((err) => {
            // Autoplay with muted policy fallback
            console.warn('Hero video autoplay was prevented or failed:', err);
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
    router.push(`/search?q=${encodeURIComponent(term)}`);
    setSuggestions([]);
  };

  const selectSuggestion = (dest) => {
    setQuery('');
    setSuggestions([]);
    if (dest.slug) {
      router.push(`/destinations/${dest.slug}`);
    } else {
      router.push(`/search?q=${encodeURIComponent(dest.name)}`);
    }
  };

  const toggleSound = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  return (
    <section
      className="by-cinematic-hero"
      aria-label="Hero: Discover Incredible India"
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
          preload="metadata"
          poster={poster || '/hero.jpg'}
          aria-hidden="true"
          onCanPlay={() => setVideoLoaded(true)}
          onError={() => setVideoFailed(true)}
        >
          <source src="/videos/bharatyatra-india.mp4" type="video/mp4" />
        </video>
      ) : null}

      {/* Cinematic Editorial Overlays */}
      <div className="by-hero-video-overlay" aria-hidden="true" />
      <div className="by-hero-video-vignette" aria-hidden="true" />

      {/* Hero Foreground Content */}
      <div className="by-container by-hero-shell">
        <div className="by-hero-editorial-wrap">
          {/* Eyebrow Badge */}
          <div className="by-hero-eyebrow-badge">
            <span className="by-eyebrow-dot" />
            <span className="by-eyebrow-text">DISCOVER INCREDIBLE INDIA</span>
          </div>

          {/* Main Heading */}
          <h1 className="by-cinematic-title">
            Discover the Soul of <span className="serif-italic-gold">India</span>
          </h1>

          {/* Description Subtitle */}
          <p className="by-cinematic-description">
            Explore India&apos;s breathtaking destinations, timeless heritage, vibrant cultures and unforgettable experiences.
          </p>

          {/* Prominent Destination Search Bar */}
          <div className="by-hero-search-card">
            <form
              className="by-hero-search-form"
              onSubmit={handleSearchSubmit}
              role="search"
              aria-label="Destination Search"
            >
              <div className="by-search-input-group">
                <span className="by-search-pin-icon" aria-hidden="true">
                  <IconMapPin size={20} color="var(--teal-primary, #153E3A)" />
                </span>
                <input
                  id="hero-destination-search"
                  type="search"
                  name="q"
                  className="by-search-field"
                  placeholder="Where do you want to explore?"
                  aria-label="Where do you want to explore?"
                  value={query}
                  onChange={handleInputChange}
                  autoComplete="off"
                />
                {query && (
                  <button
                    type="button"
                    className="by-search-clear-btn"
                    onClick={() => {
                      setQuery('');
                      setSuggestions([]);
                    }}
                    aria-label="Clear destination search"
                  >
                    <IconX size={16} />
                  </button>
                )}
              </div>

              <button
                type="submit"
                className="by-search-submit-btn"
                aria-label="Explore India"
              >
                <span>Explore India</span>
                <IconArrowRight size={18} />
              </button>
            </form>

            {/* Live Autocomplete Suggestions Dropdown */}
            {suggestions.length > 0 && (
              <div className="by-search-suggestions" role="listbox">
                {suggestions.map((dest) => (
                  <button
                    key={dest.slug || dest.name}
                    type="button"
                    className="by-suggestion-row"
                    onClick={() => selectSuggestion(dest)}
                    role="option"
                    aria-selected="false"
                  >
                    <IconMapPin size={16} color="var(--gold-dark, #C58B32)" />
                    <span className="by-sugg-name">{dest.name}</span>
                    <span className="by-sugg-state">{dest.state}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Popular Destinations Quick Row */}
            <div className="by-hero-popular-strip">
              <span className="by-popular-tag">Popular:</span>
              <div className="by-popular-pills">
                <Link href="/destinations/jaipur" className="by-pop-pill">
                  Jaipur
                </Link>
                <Link href="/search?q=Kerala" className="by-pop-pill">
                  Kerala
                </Link>
                <Link href="/search?q=Varanasi" className="by-pop-pill">
                  Varanasi
                </Link>
                <Link href="/search?q=Goa" className="by-pop-pill">
                  Goa
                </Link>
                <Link href="/search?q=Udaipur" className="by-pop-pill">
                  Udaipur
                </Link>
                <Link href="/search?q=Ladakh" className="by-pop-pill">
                  Ladakh
                </Link>
              </div>
            </div>
          </div>

          {/* Verified Editorial Trust Badges */}
          <div className="by-hero-trust-bar">
            <div className="by-trust-pill">
              <IconLandmark size={15} color="#C58B32" />
              <span>Authentic Heritage</span>
            </div>
            <div className="by-trust-pill">
              <IconRoute size={15} color="#C58B32" />
              <span>Verified Multimodal Routes</span>
            </div>
            <div className="by-trust-pill">
              <IconPhoneCall size={15} color="#C58B32" />
              <span>Official Helplines (112 &amp; 1363)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Discreet Sound / Mute Toggle in Corner */}
      {!videoFailed && (
        <button
          type="button"
          onClick={toggleSound}
          className="by-hero-sound-toggle"
          aria-label={isMuted ? 'Unmute travel audio' : 'Mute travel audio'}
          title={isMuted ? 'Unmute video audio' : 'Mute video audio'}
        >
          {isMuted ? (
            <>
              <IconVolumeOff size={16} />
              <span className="by-sound-label">Audio Muted</span>
            </>
          ) : (
            <>
              <IconVolume size={16} />
              <span className="by-sound-label">Audio On</span>
            </>
          )}
        </button>
      )}
    </section>
  );
}
