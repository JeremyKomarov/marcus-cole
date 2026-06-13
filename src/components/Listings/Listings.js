import { LISTINGS } from '@/constants/site';
import styles from './Listings.module.scss';

function ListingCard({ listing }) {
  return (
    <div className={styles.card}>
      <div className={styles.card__img}>
        <span className={styles.card__status}>Active</span>
      </div>
      <div className={styles.card__body}>
        <div className={styles.card__price}>{listing.price}</div>
        <div className={styles.card__address}>{listing.address} · {listing.cityState}</div>
        <div className={styles.card__meta}>
          <span>{listing.beds} bd</span>
          <span>{listing.baths} ba</span>
          <span>{listing.sqft} sqft</span>
        </div>
      </div>
    </div>
  );
}

export default function Listings() {
  return (
    <section id="listings" className={styles.listings}>
      <div className={styles.listings__container}>
        <div className={`${styles.listings__header} reveal`}>
          <span className="section-label">Current Listings</span>
          <h2 className={styles.listings__headline}>Homes Represented by Marcus Cole</h2>
          <p className={styles.listings__sub}>A curated selection of active Austin properties. Contact Marcus for private showings or off-market access.</p>
        </div>
        <div className={styles.listings__grid}>
          {LISTINGS.map((l, i) => (
            <div key={l.address} className="reveal" style={{ transitionDelay: `${i * 80}ms` }}>
              <ListingCard listing={l} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
