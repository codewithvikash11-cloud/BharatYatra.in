import Link from 'next/link';
import { getDictionary, getLanguage } from '../lib/i18n.js';

export default async function SiteFooter() {
  const dict = await getDictionary();
  const lang = await getLanguage();

  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <img src="/logo-compact.svg" width="36" height="36" alt="" aria-hidden="true"/>
        <span>BharatYatra<small lang={lang === 'hi' ? 'en' : 'hi'}>{lang === 'hi' ? 'BharatYatra' : 'भारत यात्रा'}</small></span>
      </div>
      <p>{dict.footer.tagline}</p>
      <nav aria-label={lang === 'hi' ? 'नीति और जानकारी' : 'Policy and info'}>
        <Link href="/about">{dict.footer.about}</Link>
        <Link href="/contact">{dict.footer.contact}</Link>
        <Link href="/privacy">{dict.footer.privacy}</Link>
        <Link href="/terms">{dict.footer.terms}</Link>
      </nav>
      <small className="footer-note">{dict.footer.note}</small>
    </footer>
  );
}
