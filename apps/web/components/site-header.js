import Link from 'next/link';
import { getDictionary, getLanguage } from '../lib/i18n.js';
import LanguageSwitcher from './language-switcher.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getNavbarImage() {
  try {
    const asset = await prisma.media_assets.findUnique({
      where: { storage_path: 'site/home/navbar' }
    });
    return asset?.public_url || null;
  } catch {
    return null;
  }
}

export default async function SiteHeader() {
  const dict = await getDictionary();
  const lang = await getLanguage();
  const navbarImage = await getNavbarImage();

  const navStyle = navbarImage ? {
    backgroundImage: `linear-gradient(rgba(247, 245, 237, 0.85), rgba(247, 245, 237, 0.95)), url(${navbarImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
  } : {};

  return (
    <nav className="site-nav" style={navStyle} aria-label={lang === 'hi' ? 'मुख्य नेविगेशन' : 'Main navigation'}>
      <Link className="brand" href="/" aria-label="BharatYatra — Home">
        <picture>
          <source media="(min-width: 768px)" srcSet="/logo-horizontal.svg" />
          <img src="/logo-compact.svg" alt="BharatYatra" width="160" height="40" className="brand-logo" />
        </picture>
      </Link>
      <div className="nav-links">
        <Link href="/states">{dict.nav.states}</Link>
        <Link href="/destinations">{dict.nav.destinations}</Link>
        <Link href="/attractions">{dict.nav.attractions}</Link>
        <Link href="/articles">{dict.nav.articles}</Link>
        <Link href="/about">{dict.nav.about}</Link>
        <LanguageSwitcher currentLang={lang} />
      </div>
    </nav>
  );
}
