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

export default function HeroSearchWidget() {
  const [activeTab, setActiveTab] = useState('explore');
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const widgetRef = useRef(null);
  const router = useRouter();

  // Real verified destinations and states with functional routes
  const verifiedLocations = [
    { name: 'Jaipur', state: 'Rajasthan', href: '/states/rajasthan', tag: 'State Capital' },
    { name: 'Rajasthan', state: 'West India', href: '/states/rajasthan', tag: 'State' },
    { name: 'Kerala', state: 'South India', href: '/states/kerala', tag: 'State' },
    { name: 'Himachal Pradesh', state: 'North India', href: '/states/himachal-pradesh', tag: 'State' },
    { name: 'Goa', state: 'West India', href: '/states/goa', tag: 'State' },
    { name: 'Uttarakhand', state: 'North India', href: '/states/uttarakhand', tag: 'State' },
    { name: 'Ladakh', state: 'North India', href: '/states/ladakh', tag: 'Union Territory' },
    { name: 'Tamil Nadu', state: 'South India', href: '/states/tamil-nadu', tag: 'State' },
    { name: 'Karnataka', state: 'South India', href: '/states/karnataka', tag: 'State' },
    { name: 'Madhya Pradesh', state: 'Central India', href: '/states/madhya-pradesh', tag: 'State' },
  ];

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
  };

  const popularPills = [
    { label: 'Rajasthan', href: '/states/rajasthan' },
    { label: 'Kerala', href: '/states/kerala' },
    { label: 'North India', href: '/destinations?region=north' },
    { label: 'South India', href: '/destinations?region=south' },
    { label: 'All 36 States & UTs', href: '/states' },
    { label: 'Travel Guides', href: '/articles' },
  ];

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
      <div className="hero-search-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'explore'}
          className={`hero-tab-btn ${activeTab === 'explore' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('explore');
            setSuggestions([]);
          }}
        >
          <IconMapPin size={18} stroke={1.8} className="hero-tab-icon" />
          <span>Explore Destinations</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'plan'}
          className={`hero-tab-btn ${activeTab === 'plan' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('plan');
            setSuggestions([]);
          }}
        >
          <IconCalendar size={18} stroke={1.8} className="hero-tab-icon" />
          <span>Plan a Trip</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'routes'}
          className={`hero-tab-btn ${activeTab === 'routes' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('routes');
            setSuggestions([]);
          }}
        >
          <IconRoute size={18} stroke={1.8} className="hero-tab-icon" />
          <span>Find Routes</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'interest'}
          className={`hero-tab-btn ${activeTab === 'interest' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('interest');
            setSuggestions([]);
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
          />

          {/* Autocomplete suggestions dropdown */}
          {suggestions.length > 0 && (
            <div className="hero-search-suggestions-dropdown" role="listbox">
              {suggestions.map((item) => (
                <button
                  key={item.slug}
                  type="button"
                  className="hero-search-suggestion-item"
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
        <span className="hero-popular-label">Popular:</span>
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
