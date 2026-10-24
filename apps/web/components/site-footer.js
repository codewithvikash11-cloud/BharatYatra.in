'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import BrandLogo from './brand-logo.js';
import { IconArrowRight } from './icons.js';

const defaultAdminUrl =
  process.env.NEXT_PUBLIC_ADMIN_URL ||
  (process.env.NODE_ENV === 'development'
    ? 'http://localhost:3001'
    : 'https://bharat-yatra-admin.vercel.app');

export default function SiteFooter() {
  const currentYear = new Date().getFullYear();
  const [adminUrl, setAdminUrl] = useState(defaultAdminUrl);

  useEffect(() => {
    if (
      !process.env.NEXT_PUBLIC_ADMIN_URL &&
      typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ) {
      setAdminUrl('http://localhost:3001');
    }
  }, []);

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
            <h3 className="newsletter-title">A little inspiration for the road.</h3>
            <p className="footer-inspiration-copy">Browse thoughtful destination guides, stories and journeys from across India.</p>
            <Link href="/articles" className="footer-inspiration-action">
              <span>Explore travel guides</span>
              <IconArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* Directory columns */}
        <div className="footer-columns-grid">
          <div>
            <h4>Discover</h4>
            <ul>
              <li><Link href="/destinations">All Destinations</Link></li>
              <li><Link href="/articles">Travel Guides</Link></li>
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
              <li><a href={adminUrl} target="_blank" rel="noopener noreferrer" suppressHydrationWarning>Content Studio (Admin) ↗</a></li>
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
