'use client';

import { useState } from 'react';
import Link from 'next/link';
import BrandLogo from './brand-logo.js';
import { IconArrowRight, IconCheck } from './icons.js';

export default function SiteFooter() {
  const currentYear = new Date().getFullYear();
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  const adminUrl =
    process.env.NEXT_PUBLIC_ADMIN_URL ||
    (typeof window !== 'undefined' && window.location.hostname === 'localhost'
      ? 'http://localhost:3001'
      : 'https://bharat-yatra-admin.vercel.app');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="footer-v0">
      <div className="page-shell">
        <div className="footer-top-row">
          {/* Brand Left */}
          <div>
            <BrandLogo size="default" light={true} showSubtitle={true} />
            <p className="footer-v0-tagline">
              Curated travel discovery across India&apos;s living heritage, sacred landscapes, and timeless cultures.
            </p>
          </div>

          {/* Newsletter Right */}
          <div className="newsletter-box">
            <h3 className="newsletter-title">A little inspiration for your inbox.</h3>
            {subscribed ? (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(233, 154, 36, 0.15)',
                  border: '1px solid var(--gold-muted)',
                  borderRadius: '999px',
                  padding: '0.65rem 1.25rem',
                  color: '#FFFDF8',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                }}
              >
                <IconCheck size={18} color="var(--gold-muted)" stroke={2.2} />
                <span>Thank you for subscribing to BharatYatra stories!</span>
              </div>
            ) : (
              <form className="newsletter-form-row" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  placeholder="Your email address"
                  className="newsletter-input"
                  aria-label="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="newsletter-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <span>Subscribe</span>
                  <IconArrowRight size={14} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Directory columns */}
        <div className="footer-columns-grid">
          <div>
            <h4>Discover</h4>
            <ul>
              <li><Link href="/destinations">All Destinations</Link></li>
              <li><Link href="/states">36 States &amp; UTs</Link></li>
              <li><Link href="/attractions">Historic Monuments</Link></li>
              <li><Link href="/itineraries">Suggested Itineraries</Link></li>
              <li><Link href="/events">Events &amp; Festivals</Link></li>
            </ul>
          </div>
          <div>
            <h4>Trip Planning Tools</h4>
            <ul>
              <li><Link href="/trip-planner">Interactive Trip Planner</Link></li>
              <li><Link href="/routes">Route &amp; Transport Finder</Link></li>
              <li><Link href="/budget-calculator">Trip Budget Calculator</Link></li>
              <li><Link href="/checklist">Packing Checklist</Link></li>
              <li><Link href="/weather">Season Weather Guide</Link></li>
            </ul>
          </div>
          <div>
            <h4>Travel Help &amp; Safety</h4>
            <ul>
              <li><Link href="/travel-help#visa">Visa &amp; Entry Rules</Link></li>
              <li><Link href="/travel-help#emergency">Emergency Helplines (112 / 1363)</Link></li>
              <li><Link href="/travel-help#tourism-portals">State Tourism Portals</Link></li>
              <li><Link href="/travel-help#currency">Currency &amp; Payments</Link></li>
              <li><Link href="/travel-help#safety">Safe Travel Advice</Link></li>
            </ul>
          </div>
          <div>
            <h4>About BharatYatra</h4>
            <ul>
              <li><Link href="/about">Our Editorial Mission</Link></li>
              <li><Link href="/contact">Editorial Inquiries</Link></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms of Service</Link></li>
              <li><a href={adminUrl} target="_blank" rel="noopener noreferrer">Content Studio (Admin) ↗</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Nav Links & Copyright */}
        <div className="footer-bottom-nav">
          <p className="footer-copy-text">
            © {currentYear} BharatYatra. All rights reserved. Thoughtfully crafted for mindful travelers across India.
          </p>
        </div>
      </div>
    </footer>
  );
}
