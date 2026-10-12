import './globals.css';
import SiteHeader from '../components/site-header.js';
import SiteFooter from '../components/site-footer.js';

export const metadata = {
  title: {
    default: 'BharatYatra — India, through every journey',
    template: '%s | BharatYatra',
  },
  description: 'Discover authentic destinations, sacred monuments, cultural heritage, and curated travel guides across every state of India.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    siteName: 'BharatYatra',
    title: 'BharatYatra — India, through every journey',
    description: 'Discover authentic destinations, sacred monuments, cultural heritage, and curated travel guides across every state of India.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BharatYatra — India, through every journey',
    description: 'Discover authentic destinations, sacred monuments, cultural heritage, and curated travel guides across every state of India.',
  },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'BharatYatra',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    description: 'Discover authentic destinations, sacred monuments, cultural heritage, and curated travel guides across India.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/destinations?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
