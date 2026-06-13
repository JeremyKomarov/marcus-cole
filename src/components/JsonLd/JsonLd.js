import { SITE } from '@/constants/site';

function escapeJsonLd(str) {
  return String(str).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');
}

export default function JsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: SITE.name,
    description: "Austin's luxury real estate specialist. 15 years, $98M+ closed. Direct access to Marcus Cole from first call to closing.",
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://marcuscolegroup.com',
    telephone: SITE.phone,
    email: SITE.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.state,
      postalCode: SITE.address.zip,
      addressCountry: 'US',
    },
    areaServed: { '@type': 'City', name: 'Austin', 'address.addressRegion': 'TX' },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '200',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: escapeJsonLd(JSON.stringify(schema)) }}
    />
  );
}
