import './globals.css';
import SiteHeader from '../components/site-header.js';
import SiteFooter from '../components/site-footer.js';
import { getLanguage } from '../lib/i18n.js';

export const metadata = {
  title: { default: 'BharatYatra — India, thoughtfully discovered', template: '%s | BharatYatra' },
  description: 'Discover published India destination guides, attractions, and travel stories.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: { type: 'website', siteName: 'BharatYatra', title: 'BharatYatra — India, thoughtfully discovered', description: 'Discover published India destination guides, attractions, and travel stories.' },
  twitter: { card: 'summary', title: 'BharatYatra — India, thoughtfully discovered', description: 'Discover published India destination guides, attractions, and travel stories.' },
};

export default async function RootLayout({ children }) {
  const lang = await getLanguage();
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'BharatYatra',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    potentialAction: {
      '@type': 'SearchAction',
      target: '{search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <html lang={lang}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
