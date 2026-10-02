import Link from 'next/link';
import { getLanguage } from '../lib/i18n.js';

export default async function NotFound() {
  const lang = await getLanguage();
  const showHi = lang === 'hi';
  return <main className="page-shell not-found-page"><p className="eyebrow">404 · NOT FOUND</p><h1>{showHi ? 'यह पेज उपलब्ध नहीं है।' : 'Page not found.'}</h1><p>{showHi ? 'शायद यह सामग्री प्रकाशित नहीं है या पता बदल गया है।' : 'This content may not be published or the address has changed.'}</p><Link className="button-link" href="/destinations">{showHi ? 'स्थान देखें' : 'View destinations'}</Link></main>;
}
