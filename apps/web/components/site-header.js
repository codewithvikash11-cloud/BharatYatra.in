'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Handle ESC key to close mobile drawer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { href: '/destinations', label: 'Destinations' },
    { href: '/states', label: 'States & UTs' },
    { href: '/attractions', label: 'Attractions' },
    { href: '/articles', label: 'Travel Guides' },
    { href: '/about', label: 'About' },
  ];

  return (
    <header className="site-header-wrapper">
      <nav className="site-nav" aria-label="Main navigation">
        <Link className="brand" href="/" aria-label="BharatYatra — Home">
          <div className="brand-mark-wrapper">
            <svg
              className="brand-mark-svg"
              viewBox="0 0 96 96"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <circle cx="48" cy="48" r="43" fill="#153E3A" />
              <path
                d="M22 69V50c0-15 11-27 26-27s26 12 26 27v19"
                stroke="#F7F3E8"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M32 69V52c0-9 7-16 16-16s16 7 16 16v17"
                stroke="#6E9CA0"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d="M42 69V55a6 6 0 0 1 12 0v14"
                stroke="#C58B32"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <circle cx="48" cy="18" r="5" fill="#C58B32" />
              <path d="M17 69h62" stroke="#C58B32" strokeWidth="3.5" strokeLinecap="round" />
              <circle cx="48" cy="78" r="2.5" fill="#F7F3E8" />
            </svg>
          </div>
          <div className="brand-text">
            <span className="brand-name">BharatYatra</span>
            <span className="brand-sub">TRAVEL INDIA</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="desktop-nav-group">
          <div className="nav-links" role="menubar">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-link-item ${isActive ? 'active' : ''}`}
                  role="menuitem"
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="nav-cta-wrapper">
            <Link href="/destinations" className="nav-cta-btn">
              Explore India
            </Link>
          </div>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          className="mobile-menu-btn"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open navigation menu'}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-drawer"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className={`hamburger-bar ${mobileMenuOpen ? 'open' : ''}`} />
          <span className={`hamburger-bar ${mobileMenuOpen ? 'open' : ''}`} />
          <span className={`hamburger-bar ${mobileMenuOpen ? 'open' : ''}`} />
        </button>
      </nav>

      {/* Accessible Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="mobile-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer */}
      <div
        id="mobile-drawer"
        className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
      >
        <div className="mobile-drawer-header">
          <div className="brand-mobile-inner">
            <div className="brand-mark-wrapper sm">
              <svg viewBox="0 0 96 96" fill="none" className="brand-mark-svg" aria-hidden="true">
                <circle cx="48" cy="48" r="43" fill="#153E3A" />
                <path d="M22 69V50c0-15 11-27 26-27s26 12 26 27v19" stroke="#F7F3E8" strokeWidth="4" strokeLinecap="round" />
                <path d="M42 69V55a6 6 0 0 1 12 0v14" stroke="#C58B32" strokeWidth="3.5" strokeLinecap="round" />
                <circle cx="48" cy="18" r="5" fill="#C58B32" />
              </svg>
            </div>
            <span className="brand-name">BharatYatra</span>
          </div>
          <button
            type="button"
            className="mobile-close-btn"
            aria-label="Close menu"
            onClick={() => setMobileMenuOpen(false)}
          >
            ✕
          </button>
        </div>

        <div className="mobile-nav-links">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`mobile-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>{link.label}</span>
                <span className="arrow" aria-hidden="true">→</span>
              </Link>
            );
          })}
        </div>

        <div className="mobile-drawer-footer">
          <Link
            href="/destinations"
            className="button-link mobile-cta-full"
            onClick={() => setMobileMenuOpen(false)}
          >
            Start Exploring Destinations
          </Link>
          <p className="mobile-drawer-tagline">
            Thoughtfully curated journeys across India
          </p>
        </div>
      </div>
    </header>
  );
}
