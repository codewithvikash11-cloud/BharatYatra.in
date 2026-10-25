'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import BrandLogo from './brand-logo.js';
import FavoritesDrawer from './favorites-drawer.js';
import {
  IconChevronDown,
  IconSearch,
  IconHeart,
  IconUser,
  IconCalendar,
  IconClipboardCheck,
  IconSettings,
  IconMapPin,
  IconRoute,
  IconCalculator,
  IconShieldCheck,
  IconSparkles,
  IconBookOpen,
  IconMap,
  IconMountain,
  IconBeach,
  IconBuildingCastle,
  IconBuildingMonument,
  IconPaw,
  IconLeaf,
  IconArrowRight,
} from './icons.js';

const defaultAdminUrl =
  process.env.NEXT_PUBLIC_ADMIN_URL ||
  (process.env.NODE_ENV === 'development'
    ? 'http://localhost:3001'
    : 'https://bharat-yatra-admin.vercel.app');

export default function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [destDropdownOpen, setDestDropdownOpen] = useState(false);
  const [favDrawerOpen, setFavDrawerOpen] = useState(false);
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [favCount, setFavCount] = useState(0);
  const [navSearch, setNavSearch] = useState('');
  const [adminUrl, setAdminUrl] = useState(defaultAdminUrl);
  const [theme, setTheme] = useState('system');

  useEffect(() => {
    const savedTheme = localStorage.getItem('bharatyatra-theme');
    const nextTheme = ['light', 'dark', 'system'].includes(savedTheme) ? savedTheme : 'system';
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
  }, []);

  const cycleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('bharatyatra-theme', nextTheme);
    document.documentElement.dataset.theme = nextTheme;
  };

  useEffect(() => {
    if (
      !process.env.NEXT_PUBLIC_ADMIN_URL &&
      typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ) {
      setAdminUrl('http://localhost:3001');
    }
  }, []);
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef(null);

  // Sync favorites count
  const syncFavCount = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('bharatyatra_favorites') || '[]');
      setFavCount(stored.length);
    } catch {
      setFavCount(0);
    }
  };

  useEffect(() => {
    syncFavCount();
    window.addEventListener('bharatyatra_favorites_updated', syncFavCount);
    window.addEventListener('storage', syncFavCount);
    return () => {
      window.removeEventListener('bharatyatra_favorites_updated', syncFavCount);
      window.removeEventListener('storage', syncFavCount);
    };
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setDestDropdownOpen(false);
    setAccountModalOpen(false);
  }, [pathname]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDestDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setDestDropdownOpen(false);
        setFavDrawerOpen(false);
        setAccountModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavSearchSubmit = (e) => {
    e.preventDefault();
    if (navSearch.trim()) {
      router.push(`/search?q=${encodeURIComponent(navSearch.trim())}`);
      setNavSearch('');
    }
  };

  const navLinks = [
    { href: '/trip-planner', label: 'Trip Planner' },
    { href: '/travel-help', label: 'Travel Help' },
    { href: '/events', label: 'Events' },
    { href: '/articles', label: 'Blog' },
  ];

  return (
    <>
      <header className="by-navbar-wrapper">
        <div className="by-navbar-container">
          {/* 1. Left: Brand Logo */}
          <div className="by-navbar-brand">
            <BrandLogo size="default" showSubtitle={true} />
          </div>

          {/* 2. Center: Primary Navigation */}
          <nav className="by-navbar-links" aria-label="Main Navigation">
            {/* Destinations Dropdown */}
            <div className="by-nav-dropdown-wrapper" ref={dropdownRef}>
              <button
                type="button"
                className={`by-nav-item by-nav-dropdown-btn ${pathname?.startsWith('/destinations') || pathname?.startsWith('/states') ? 'active' : ''}`}
                onClick={() => setDestDropdownOpen(!destDropdownOpen)}
                aria-expanded={destDropdownOpen}
                aria-haspopup="true"
              >
                <span>Destinations</span>
                <IconChevronDown
                  className={`by-dropdown-chevron ${destDropdownOpen ? 'rotated' : ''}`}
                  size={14}
                  stroke={2.2}
                />
              </button>

              {destDropdownOpen && (
                <div className="by-nav-dropdown-menu" role="menu">
                  <div className="by-dropdown-col">
                    <span className="by-dropdown-header">Explore by Region</span>
                    <Link href="/destinations?region=north" className="by-dropdown-link" role="menuitem">
                      <IconMountain size={18} stroke={1.8} style={{ marginRight: '8px', color: 'var(--teal-primary)' }} />
                      <span>North India <small>Himalayas &amp; Heritage</small></span>
                    </Link>
                    <Link href="/destinations?region=south" className="by-dropdown-link" role="menuitem">
                      <IconBeach size={18} stroke={1.8} style={{ marginRight: '8px', color: 'var(--teal-primary)' }} />
                      <span>South India <small>Beaches &amp; Temples</small></span>
                    </Link>
                    <Link href="/destinations?region=west" className="by-dropdown-link" role="menuitem">
                      <IconBuildingCastle size={18} stroke={1.8} style={{ marginRight: '8px', color: 'var(--teal-primary)' }} />
                      <span>West India <small>Rajasthan &amp; Deserts</small></span>
                    </Link>
                    <Link href="/destinations?region=east" className="by-dropdown-link" role="menuitem">
                      <IconBuildingMonument size={18} stroke={1.8} style={{ marginRight: '8px', color: 'var(--teal-primary)' }} />
                      <span>East India <small>Temples &amp; Culture</small></span>
                    </Link>
                    <Link href="/destinations?region=central" className="by-dropdown-link" role="menuitem">
                      <IconPaw size={18} stroke={1.8} style={{ marginRight: '8px', color: 'var(--teal-primary)' }} />
                      <span>Central India <small>Wildife &amp; Ancient Sites</small></span>
                    </Link>
                    <Link href="/destinations?region=northeast" className="by-dropdown-link" role="menuitem">
                      <IconLeaf size={18} stroke={1.8} style={{ marginRight: '8px', color: 'var(--teal-primary)' }} />
                      <span>North East India <small>Living Roots &amp; Valleys</small></span>
                    </Link>
                  </div>
                  <div className="by-dropdown-footer">
                    <Link href="/destinations" className="by-dropdown-viewall">
                      View All Destinations <IconArrowRight size={14} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: '4px' }} />
                    </Link>
                    <Link href="/states" className="by-dropdown-viewall">
                      Browse by 36 States &amp; UTs <IconArrowRight size={14} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: '4px' }} />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Other Main Links */}
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`by-nav-item ${isActive ? 'active' : ''}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* 3. Right: Header Search, Favorites, and Account */}
          <div className="by-navbar-actions">
            <button
              type="button"
              className="by-navbar-theme-btn"
              onClick={cycleTheme}
              aria-label={`Color theme: ${theme}. Activate to change theme.`}
              title={`Color theme: ${theme}`}
            >
              {theme === 'dark' ? '☾' : theme === 'light' ? '☀' : '◐'}
              <span className="by-theme-label">{theme}</span>
            </button>
            {/* Header Search Box */}
            <form onSubmit={handleNavSearchSubmit} className="by-navbar-search-form" role="search">
              <IconSearch
                size={16}
                stroke={2.2}
                color="#87938F"
                className="by-navbar-search-icon"
              />
              <input
                type="search"
                className="by-navbar-search-input"
                placeholder="Search destinations, states, places..."
                aria-label="Search destinations, states, places"
                value={navSearch}
                onChange={(e) => setNavSearch(e.target.value)}
              />
            </form>

            {/* Favorites Heart Button */}
            <button
              type="button"
              className="by-navbar-icon-btn by-favorites-btn"
              onClick={() => setFavDrawerOpen(true)}
              aria-label={`Saved destinations (${favCount} items)`}
              title="Saved destinations"
            >
              <IconHeart
                size={20}
                stroke={1.8}
                color={favCount > 0 ? '#B9653F' : '#153E3A'}
                style={{ fill: favCount > 0 ? '#B9653F' : 'none' }}
              />
              {favCount > 0 && <span className="by-favorites-badge">{favCount}</span>}
            </button>

            {/* Account Avatar Button */}
            <div className="by-account-btn-wrapper">
              <button
                type="button"
                className="by-navbar-icon-btn by-account-avatar-btn"
                onClick={() => setAccountModalOpen(!accountModalOpen)}
                aria-label="User Account"
                title="Account"
              >
                <IconUser
                  size={20}
                  stroke={1.8}
                  color="#153E3A"
                />
              </button>

              {accountModalOpen && (
                <div className="by-account-menu" role="menu">
                  <div className="by-account-menu-header">
                    <strong>BharatYatra Travel Club</strong>
                    <span>Plan &amp; save your journeys</span>
                  </div>
                  <Link href="/trip-planner" className="by-account-link" role="menuitem">
                    <IconCalendar size={16} stroke={1.8} style={{ marginRight: '8px', color: 'var(--teal-primary)' }} />
                    <span>My Saved Itineraries</span>
                  </Link>
                  <button
                    type="button"
                    className="by-account-link"
                    onClick={() => {
                      setAccountModalOpen(false);
                      setFavDrawerOpen(true);
                    }}
                    role="menuitem"
                  >
                    <IconHeart size={16} stroke={1.8} style={{ marginRight: '8px', color: '#B9653F' }} />
                    <span>Wishlist ({favCount})</span>
                  </button>
                  <Link href="/checklist" className="by-account-link" role="menuitem">
                    <IconClipboardCheck size={16} stroke={1.8} style={{ marginRight: '8px', color: 'var(--teal-primary)' }} />
                    <span>Packing Checklist</span>
                  </Link>
                  <a
                    href={adminUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="by-account-link by-admin-link"
                    role="menuitem"
                    suppressHydrationWarning
                  >
                    <IconSettings size={16} stroke={1.8} style={{ marginRight: '8px', color: 'var(--gold-dark)' }} />
                    <span>Admin Studio ↗</span>
                  </a>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              className="by-mobile-hamburger"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className={`by-hamburger-line ${mobileMenuOpen ? 'open' : ''}`} />
              <span className={`by-hamburger-line ${mobileMenuOpen ? 'open' : ''}`} />
              <span className={`by-hamburger-line ${mobileMenuOpen ? 'open' : ''}`} />
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="by-mobile-drawer">
            <div className="by-mobile-search-row">
              <form onSubmit={handleNavSearchSubmit} className="by-mobile-search-form">
                <input
                  type="search"
                  placeholder="Search destinations, states..."
                  value={navSearch}
                  onChange={(e) => setNavSearch(e.target.value)}
                />
                <button type="submit">Search</button>
              </form>
            </div>

            <div className="by-mobile-nav-list">
              <Link href="/destinations" className="by-mobile-link" onClick={() => setMobileMenuOpen(false)}>
                <IconMapPin size={18} stroke={1.8} style={{ marginRight: '10px', color: 'var(--teal-primary)' }} />
                <span>Destinations</span>
              </Link>
              <Link href="/trip-planner" className="by-mobile-link" onClick={() => setMobileMenuOpen(false)}>
                <IconCalendar size={18} stroke={1.8} style={{ marginRight: '10px', color: 'var(--teal-primary)' }} />
                <span>Trip Planner</span>
              </Link>
              <Link href="/routes" className="by-mobile-link" onClick={() => setMobileMenuOpen(false)}>
                <IconRoute size={18} stroke={1.8} style={{ marginRight: '10px', color: 'var(--teal-primary)' }} />
                <span>Routes &amp; Transport</span>
              </Link>
              <Link href="/budget-calculator" className="by-mobile-link" onClick={() => setMobileMenuOpen(false)}>
                <IconCalculator size={18} stroke={1.8} style={{ marginRight: '10px', color: 'var(--teal-primary)' }} />
                <span>Budget Calculator</span>
              </Link>
              <Link href="/travel-help" className="by-mobile-link" onClick={() => setMobileMenuOpen(false)}>
                <IconShieldCheck size={18} stroke={1.8} style={{ marginRight: '10px', color: 'var(--teal-primary)' }} />
                <span>Travel Help</span>
              </Link>
              <Link href="/events" className="by-mobile-link" onClick={() => setMobileMenuOpen(false)}>
                <IconSparkles size={18} stroke={1.8} style={{ marginRight: '10px', color: 'var(--teal-primary)' }} />
                <span>Events &amp; Festivals</span>
              </Link>
              <Link href="/articles" className="by-mobile-link" onClick={() => setMobileMenuOpen(false)}>
                <IconBookOpen size={18} stroke={1.8} style={{ marginRight: '10px', color: 'var(--teal-primary)' }} />
                <span>Blog &amp; Travel Guides</span>
              </Link>
              <Link href="/states" className="by-mobile-link" onClick={() => setMobileMenuOpen(false)}>
                <IconMap size={18} stroke={1.8} style={{ marginRight: '10px', color: 'var(--teal-primary)' }} />
                <span>36 States &amp; UTs</span>
              </Link>
            </div>

            <div className="by-mobile-footer-action">
              <button
                type="button"
                className="by-mobile-fav-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setFavDrawerOpen(true);
                }}
              >
                <IconHeart size={18} stroke={1.8} style={{ marginRight: '8px', color: '#B9653F' }} />
                <span>Saved Places ({favCount})</span>
              </button>
              <Link href="/trip-planner" className="btn-gold-pill" style={{ display: 'block', textAlign: 'center', marginTop: '0.75rem' }} onClick={() => setMobileMenuOpen(false)}>
                Plan Your Journey →
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Favorites Drawer Popup */}
      <FavoritesDrawer isOpen={favDrawerOpen} onClose={() => setFavDrawerOpen(false)} />
    </>
  );
}
