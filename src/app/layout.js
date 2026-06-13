import { Cormorant_Garamond, Jost } from 'next/font/google';
import Script from 'next/script';
import '../styles/globals.scss';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://marcuscolegroup.com';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Marcus Cole Group — Austin Luxury Real Estate',
    template: '%s | Marcus Cole Group',
  },
  description: "Austin's luxury real estate specialist. 15 years, $98M+ closed. Direct access to Marcus — from first call to closing.",
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'Marcus Cole Group',
    title: 'Marcus Cole Group — Austin Luxury Real Estate',
    description: "Austin's luxury real estate specialist. 15 years, $98M+ closed.",
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Marcus Cole Group' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Marcus Cole Group — Austin Luxury Real Estate',
    description: "Austin's luxury real estate specialist. 15 years, $98M+ closed.",
    images: ['/og-image.jpg'],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
      <body>
        {children}

        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `}</Script>
          </>
        )}

        {PIXEL_ID && (
          <Script id="meta-pixel" strategy="afterInteractive">{`
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
            n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
            document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init','${PIXEL_ID}');fbq('track','PageView');
          `}</Script>
        )}
      </body>
    </html>
  );
}
