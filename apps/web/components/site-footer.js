import Link from 'next/link';

export default function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="page-shell footer-inner">
        <div className="footer-grid">
          {/* Brand Col */}
          <div className="footer-col brand-col">
            <Link className="footer-brand" href="/" aria-label="BharatYatra — Home">
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
                </svg>
              </div>
              <span className="brand-name">BharatYatra</span>
            </Link>
            <p className="footer-description">
              An editorial travel discovery platform for India. Explore timeless heritage, Himalayan passes, sacred ghats, and living cultural traditions across every state and union territory.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="footer-col">
            <h3 className="footer-heading">Discover</h3>
            <ul className="footer-links-list">
              <li><Link href="/destinations">All Destinations</Link></li>
              <li><Link href="/states">States & Union Territories</Link></li>
              <li><Link href="/attractions">Monuments & Attractions</Link></li>
              <li><Link href="/articles">Travel Stories & Guides</Link></li>
            </ul>
          </div>

          {/* Regional Highlights */}
          <div className="footer-col">
            <h3 className="footer-heading">Explore India</h3>
            <ul className="footer-links-list">
              <li><Link href="/destinations?q=Rajasthan">Rajasthan & Forts</Link></li>
              <li><Link href="/destinations?q=Kerala">Kerala & Backwaters</Link></li>
              <li><Link href="/destinations?q=Himachal">Himalayas & Hills</Link></li>
              <li><Link href="/destinations?q=Varanasi">Spiritual Centers</Link></li>
              <li><Link href="/destinations?q=Goa">Coastal Getaways</Link></li>
            </ul>
          </div>

          {/* About & Legal */}
          <div className="footer-col">
            <h3 className="footer-heading">About</h3>
            <ul className="footer-links-list">
              <li><Link href="/about">About BharatYatra</Link></li>
              <li><Link href="/contact">Contact & Feedback</Link></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} BharatYatra. All rights reserved. Thoughtfully crafted for Indian travel discovery.
          </p>
          <p className="footer-subtext">
            Preserving India’s heritage and natural beauty through respectful exploration.
          </p>
        </div>
      </div>
    </footer>
  );
}
