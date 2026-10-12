'use client';

import Link from 'next/link';

export default function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-v0">
      <div className="page-shell">
        <div className="footer-top-row">
          {/* Brand Left */}
          <div>
            <Link className="brand" href="/" aria-label="BharatYatra — Home">
              <div className="brand-mark-wrapper sm">
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
                <span className="brand-name" style={{ color: '#FFFDF8' }}>BharatYatra</span>
                <span className="brand-sub">TRAVEL INDIA</span>
              </div>
            </Link>
            <p className="footer-v0-tagline">
              Curated travel discovery across India's living heritage, sacred landscapes, and timeless cultures.
            </p>
          </div>

          {/* Newsletter Right */}
          <div className="newsletter-box">
            <h3 className="newsletter-title">A little inspiration for your inbox.</h3>
            <form
              className="newsletter-form-row"
              onSubmit={(e) => {
                e.preventDefault();
                alert('Thank you for subscribing to BharatYatra stories!');
              }}
            >
              <input
                type="email"
                placeholder="Your email address"
                className="newsletter-input"
                aria-label="Your email address"
                required
              />
              <button type="submit" className="newsletter-btn">
                Subscribe →
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Nav Links & Copyright */}
        <div className="footer-bottom-nav">
          <ul className="footer-links-inline">
            <li><Link href="/destinations">Destinations</Link></li>
            <li><Link href="/states">States & Regions</Link></li>
            <li><Link href="/attractions">Attractions</Link></li>
            <li><Link href="/articles">Travel Journal</Link></li>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/privacy">Privacy</Link></li>
            <li><Link href="/terms">Terms</Link></li>
          </ul>

          <p className="footer-copy-text">
            © {currentYear} BharatYatra. All rights reserved. Thoughtfully crafted for mindful travelers.
          </p>
        </div>
      </div>
    </footer>
  );
}
