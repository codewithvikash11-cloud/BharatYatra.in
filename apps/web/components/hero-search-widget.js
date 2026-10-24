'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  IconMapPin,
  IconCalendar,
  IconRoute,
  IconCategory,
  IconSearch,
} from './icons.js';

const popularDestinationNames = ['Varanasi', 'Jaipur', 'Goa', 'Kedarnath', 'Prayagraj'];

export default function HeroSearchWidget({ destinations = [] }) {
  const [activeTab, setActiveTab] = useState('explore');
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const widgetRef = useRef(null);
  const router = useRouter();
  const verifiedLocations = destinations.map((destination) => ({
    ...destination,
    href: `/destinations/${destination.slug}`,
  }));
  const popularPills = popularDestinationNames.map((name) => {
    const destination = destinations.find((item) => item.name.toLowerCase() === name.toLowerCase());
    return {
      label: name,
      href: destination ? `/destinations/${destination.slug}` : `/destinations?q=${encodeURIComponent(name)}`,
    };
  });

  // Close suggestions when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (widgetRef.current && !widgetRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSuggestions([]);
        setActiveSuggestion(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setActiveSuggestion(-1);
    if (val.trim().length > 0) {
      const filtered = verifiedLocations.filter(
        (d) =>
          d.name.toLowerCase().includes(val.toLowerCase()) ||
          d.state.toLowerCase().includes(val.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    if (activeSuggestion >= 0 && suggestions[activeSuggestion]) {
      selectSuggestion(suggestions[activeSuggestion]);
      return;
    }

    if (activeTab === 'plan') {
      router.push(`/trip-planner?destination=${encodeURIComponent(query.trim())}`);
    } else if (activeTab === 'routes') {
      router.push(`/routes?to=${encodeURIComponent(query.trim())}`);
    } else {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
    setSuggestions([]);
  };

  const selectSuggestion = (loc) => {
    router.push(loc.href);
    setQuery('');
    setSuggestions([]);
    setActiveSuggestion(-1);
  };

  const handleSuggestionKeyDown = (event) => {
    if (!suggestions.length) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveSuggestion((index) => (index + 1) % suggestions.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveSuggestion((index) => index <= 0 ? suggestions.length - 1 : index - 1);
    }
  };

  const getPlaceholder = () => {
    switch (activeTab) {
      case 'plan':
        return 'Where do you want to plan your trip? (e.g. Rajasthan, Kerala, Himachal...)';
      case 'routes':
        return 'Enter destination to find train, bus, and flight routes...';
      case 'interest':
        return 'Search by interest (e.g. Forts & Palaces, Havelis, Beaches, Wildlife...)';
      default:
        return 'Where do you want to go? (e.g. Rajasthan, Kerala, Goa...)';
    }
  };

  return (
    <div className="hero-search-card" ref={widgetRef}>
      {/* 1. Four Header Tabs */}
      <div className="hero-search-tabs" role="group" aria-label="Search mode">
        <button
          type="button"
          aria-pressed={activeTab === 'explore'}
          className={`hero-tab-btn ${activeTab === 'explore' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('explore');
            setSuggestions([]);
            setActiveSuggestion(-1);
          }}
        >
          <IconMapPin size={18} stroke={1.8} className="hero-tab-icon" />
          <span>Explore Destinations</span>
        </button>

        <button
          type="button"
          aria-pressed={activeTab === 'plan'}
          className={`hero-tab-btn ${activeTab === 'plan' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('plan');
            setSuggestions([]);
            setActiveSuggestion(-1);
          }}
        >
          <IconCalendar size={18} stroke={1.8} className="hero-tab-icon" />
          <span>Plan a Trip</span>
        </button>

        <button
          type="button"
          aria-pressed={activeTab === 'routes'}
          className={`hero-tab-btn ${activeTab === 'routes' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('routes');
            setSuggestions([]);
            setActiveSuggestion(-1);
          }}
        >
          <IconRoute size={18} stroke={1.8} className="hero-tab-icon" />
          <span>Find Routes</span>
        </button>

        <button
          type="button"
          aria-pressed={activeTab === 'interest'}
          className={`hero-tab-btn ${activeTab === 'interest' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('interest');
            setSuggestions([]);
            setActiveSuggestion(-1);
          }}
        >
          <IconCategory size={18} stroke={1.8} className="hero-tab-icon" />
          <span>Search by Interest</span>
        </button>
      </div>

      {/* 2. Search Input Row with Orange Button */}
      <form onSubmit={handleSearchSubmit} className="hero-search-input-form" role="search">
        <div className="hero-search-field-wrap">
          <IconSearch
            className="hero-search-field-icon"
            size={20}
            stroke={2}
            color="#87938F"
          />

          <input
            type="search"
            className="hero-search-field-input"
            value={query}
            onChange={handleInputChange}
            placeholder={getPlaceholder()}
            aria-label="Search destinations in India"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={suggestions.length > 0}
            aria-controls="hero-search-suggestion-list"
            aria-activedescendant={activeSuggestion >= 0 ? `hero-search-option-${activeSuggestion}` : undefined}
            onKeyDown={handleSuggestionKeyDown}
          />

          {/* Autocomplete suggestions dropdown */}
          {suggestions.length > 0 && (
            <div className="hero-search-suggestions-dropdown" id="hero-search-suggestion-list" role="listbox" aria-label="Search suggestions">
              {suggestions.map((item, index) => (
                <button
                  key={item.href}
                  id={`hero-search-option-${index}`}
                  type="button"
                  className={`hero-search-suggestion-item ${activeSuggestion === index ? 'active' : ''}`}
                  role="option"
                  aria-selected={activeSuggestion === index}
                  tabIndex={-1}
                  onClick={() => selectSuggestion(item)}
                >
                  <IconMapPin size={16} stroke={1.8} className="sugg-pin" color="var(--gold-dark)" />
                  <span className="sugg-name">{item.name}</span>
                  <span className="sugg-state">{item.state}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <button type="submit" className="hero-search-submit-btn">
          <IconSearch
            size={18}
            stroke={2.2}
          />
          <span>Search</span>
        </button>
      </form>

      {/* 3. Popular Destinations Pills */}
      <div className="hero-popular-row">
      <span className="hero-popular-label">Explore:</span>
        <div className="hero-popular-pills">
          {popularPills.map((pill) => (
            <Link key={pill.label} href={pill.href} className="hero-popular-pill">
              {pill.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
