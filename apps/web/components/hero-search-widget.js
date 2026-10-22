'use client';

import { useState } from 'react';
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
  const router = useRouter();

  const destinationSuggestions = [
    { name: 'Jaipur', state: 'Rajasthan', slug: 'jaipur' },
    { name: 'Varanasi', state: 'Uttar Pradesh', slug: 'varanasi' },
    { name: 'Manali', state: 'Himachal Pradesh', slug: 'manali' },
    { name: 'Goa', state: 'Goa', slug: 'goa' },
    { name: 'Udaipur', state: 'Rajasthan', slug: 'udaipur' },
    { name: 'Rishikesh', state: 'Uttarakhand', slug: 'rishikesh' },
    { name: 'Nawalgarh', state: 'Rajasthan', slug: 'nawalgarh-rajasthan' },
    { name: 'Kerala Backwaters', state: 'Kerala', slug: 'kerala' },
    { name: 'Leh Ladakh', state: 'Ladakh', slug: 'ladakh' },
    { name: 'Darjeeling', state: 'West Bengal', slug: 'darjeeling' },
  ];

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (val.trim().length > 0) {
      const filtered = destinationSuggestions.filter(
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

  const selectSuggestion = (dest) => {
    router.push(`/destinations/${dest.slug}`);
    setQuery('');
    setSuggestions([]);
  };

  const popularPills = [
    { label: 'Jaipur', href: '/destinations/jaipur' },
    { label: 'Udaipur', href: '/search?q=Udaipur' },
    { label: 'Goa', href: '/search?q=Goa' },
    { label: 'Varanasi', href: '/search?q=Varanasi' },
    { label: 'Rishikesh', href: '/search?q=Rishikesh' },
    { label: 'Kerala', href: '/search?q=Kerala' },
    { label: 'Kashmir', href: '/search?q=Kashmir' },
    { label: 'Leh Ladakh', href: '/search?q=Ladakh' },
    { label: 'Ayodhya', href: '/search?q=Ayodhya' },
    { label: 'Mysore', href: '/search?q=Mysore' },
  ];

  const getPlaceholder = () => {
    switch (activeTab) {
      case 'plan':
        return 'Where do you want to plan your trip? (e.g. Rajasthan, Kerala, Himachal...)';
      case 'routes':
        return 'Enter destination to find train, bus, and flight routes...';
      case 'interest':
        return 'Search by interest (e.g. Forts & Palaces, Ghats, Beaches, Wildlife...)';
      default:
        return 'Where do you want to go? (e.g. Jaipur, Kerala, Varanasi...)';
    }
  };

  return (
    <div className="hero-search-card">
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
