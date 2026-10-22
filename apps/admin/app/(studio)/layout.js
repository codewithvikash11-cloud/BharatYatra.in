import Link from 'next/link';
import { getAdminSession } from '../../lib/admin-session.js';
import MobileNav from '../../components/mobile-nav.js';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function StudioLayout({ children }) {
  const session = await getAdminSession();

  return (
    <div className="studio">
      <aside className="sidebar">
        <Link className="brand" href="/dashboard" aria-label="BharatYatra Content Studio">
          <img
            src="/image.png"
            alt="BharatYatra"
            style={{
              height: '36px',
              width: 'auto',
              maxWidth: '150px',
              objectFit: 'contain',
              display: 'block',
              filter: 'brightness(0) invert(1)',
            }}
          />
          <small style={{ display: 'inline-block', padding: '2px 6px', background: 'rgba(255,255,255,0.12)', borderRadius: '4px', color: '#cfb787', fontSize: '0.6rem', letterSpacing: '0.14em', fontWeight: 700 }}>STUDIO</small>
        </Link>
        <nav aria-label="Admin navigation">
          <Link href="/dashboard">Overview</Link>
          <Link href="/articles">Articles</Link>
          <Link href="/articles/new" style={{ paddingLeft: '1.75rem', fontSize: '0.82rem', color: '#10b981' }}>+ New Article</Link>
          <Link href="/content/states">States</Link>
          <Link href="/content/districts">Districts</Link>
          <Link href="/content/tehsils">Tehsils</Link>
          <Link href="/content/destinations">Destinations</Link>
          <Link href="/content/attractions">Attractions</Link>
          <Link href="/content/itineraries">Itineraries</Link>
          <Link href="/media">Media library</Link>
          <Link href="/appearance">Appearance</Link>
          <Link href="/audit">Audit history</Link>
        </nav>
        <div className="sidebar-bottom">
          <span className="role-pill">{session.role}</span>
          <span style={{ fontSize: '0.78rem', color: '#10b981' }}>● Direct Access</span>
        </div>
      </aside>
      <main className="studio-main">
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img
              src="/image.png"
              alt="BharatYatra"
              className="topbar-logo"
              style={{
                height: '28px',
                width: 'auto',
                objectFit: 'contain',
                display: 'none',
              }}
            />
            <span>Content operations</span>
          </div>
          <span className="user-chip">{session.email}</span>
        </header>
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
