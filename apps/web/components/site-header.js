import Link from 'next/link';
import { getDictionary, getLanguage } from '../lib/i18n.js';
import LanguageSwitcher from './language-switcher.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getSiteMedia() {
  try {
    const assets = await prisma.media_assets.findMany({
      where: { storage_path: { startsWith: 'site/home/' } }
    });
    return assets.reduce((acc, asset) => {
      acc[asset.storage_path.replace('site/home/', '')] = asset.public_url || null;
      return acc;
    }, {});
  } catch {
    return {};
  }
}

export default async function SiteHeader() {
  const dict = await getDictionary();
  const lang = await getLanguage();
  const siteMedia = await getSiteMedia();
  const navbarImage = siteMedia['navbar'] || null;
  const logoHorizontal = siteMedia['logo'] || '/logo-horizontal.svg';
  const logoCompact = siteMedia['logo-compact'] || '/logo-compact.svg';

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
          <source media="(min-width: 768px)" srcSet={logoHorizontal} />
          <img src={logoCompact} alt="BharatYatra" width="160" height="40" className="brand-logo" style={{ objectFit: 'contain' }} />
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
