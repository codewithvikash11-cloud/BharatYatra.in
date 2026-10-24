import './globals.css';
import './articles/article.css';
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

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://bharat-yatra-in.vercel.app').replace(/\/+$/, '');

export const metadata = {
  title: {
    default: 'BharatYatra — India, through every journey',
    template: '%s | BharatYatra',
  },
  description: 'Discover authentic destinations, sacred monuments, cultural heritage, and curated travel guides across every state of India.',
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: './',
  },
  openGraph: {
    type: 'website',
    siteName: 'BharatYatra',
    title: 'BharatYatra — India, through every journey',
    description: 'Discover authentic destinations, sacred monuments, cultural heritage, and curated travel guides across every state of India.',
    url: siteUrl,
    images: [
      {
        url: `${siteUrl}/image.png`,
        width: 1200,
        height: 630,
        alt: 'BharatYatra — India Cultural Heritage and Travel Guide',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BharatYatra — India, through every journey',
    description: 'Discover authentic destinations, sacred monuments, cultural heritage, and curated travel guides across every state of India.',
    images: [`${siteUrl}/image.png`],
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    other: {
      ...(process.env.BING_SITE_VERIFICATION || process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
        ? { 'msvalidate.01': process.env.BING_SITE_VERIFICATION || process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
        : {}),
    },
  },
};

export default function RootLayout({ children }) {
  const jsonLdWebsite = {
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

  const jsonLdOrg = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'BharatYatra',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    sameAs: [
      'https://twitter.com/bharatyatra',
      'https://www.instagram.com/bharatyatra.in',
    ],
  };

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: "try{var t=localStorage.getItem('bharatyatra-theme');document.documentElement.dataset.theme=['light','dark','system'].includes(t)?t:'system'}catch(e){document.documentElement.dataset.theme='system'}",
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebsite) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
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
