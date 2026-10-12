import './globals.css';
import { Inter, Playfair_Display } from 'next/font/google';
import SiteHeader from '../components/site-header.js';
import SiteFooter from '../components/site-footer.js';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#153E3A',
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bharat-yatra-in.vercel.app';

export const metadata = {
  title: {
    default: 'BharatYatra — India, through every journey',
    template: '%s | BharatYatra',
  },
  description: 'Discover authentic destinations, sacred monuments, cultural heritage, and curated travel guides across every state of India.',
  metadataBase: new URL(siteUrl),
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
    url: siteUrl,
    description: 'Discover authentic destinations, sacred monuments, cultural heritage, and curated travel guides across India.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
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
