// app/layout.jsx
import './globals.css';
import ClientProviders from '@/components/providers/ClientProviders';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Script from 'next/script';

const GA_ID = 'G-WZ4VRT822E';

export const metadata = {
  metadataBase: new URL('https://aarambhtv.com'),
  title: {
    default: 'Aarambh TV - Your Daily Spiritual Destination',
    template: '%s | Aarambh TV',
  },
  description: 'Experience devotion, spiritual education, horoscope services, live darshan, temples, festivals, bhajans, and video-first experiences.',
  keywords: [
    'spiritual',
    'devotion',
    'horoscope',
    'temples',
    'bhajans',
    'live darshan',
    'aarambh tv',
    'spiritual media',
  ],
  authors: [{ name: 'Aarambh TV', url: 'https://aarambhtv.com' }],
  creator: 'Aarambh TV',
  publisher: 'Aarambh TV',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://aarambhtv.com',
    title: 'Aarambh TV - Your Daily Spiritual Destination',
    description: 'Experience devotion, spiritual education, horoscope services, live darshan, temples, festivals, bhajans, and video-first experiences.',
    siteName: 'Aarambh TV',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Aarambh TV',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aarambh TV - Your Daily Spiritual Destination',
    description: 'Experience devotion, spiritual education, horoscope services, live darshan, temples, festivals, bhajans, and video-first experiences.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 't1W8RaiUcjUwuvuC-QLCPmfQGBz7zt2lWPq2S8CaYOk',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="font-sans antialiased">
        <ClientProviders>
          <div className="flex flex-col min-h-screen">
            
            <main className="flex-grow pt-16">
              {children}
            </main>
            
          </div>
        </ClientProviders>

        {/* Google Analytics (GA4) */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
      </body>
    </html>
  );
}
