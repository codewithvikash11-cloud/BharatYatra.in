import { getLanguage } from '../lib/i18n.js';

export default async function Loading() {
  const lang = await getLanguage();
  return <main className="page-shell loading-state" aria-live="polite" aria-busy="true">
    <span className="eyebrow">BHARATYATRA</span><p>{lang === 'hi' ? 'प्रकाशित सामग्री लोड हो रही है…' : 'Loading published content…'}</p>
  </main>;
}
