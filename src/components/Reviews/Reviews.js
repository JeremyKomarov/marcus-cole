import { REVIEWS } from '@/constants/site';
import styles from './Reviews.module.scss';

function ReviewCard({ review }) {
  return (
    <div className={styles.card}>
      <div className={styles.card__stars}>★★★★★</div>
      <blockquote className={styles.card__quote}>&ldquo;{review.quote}&rdquo;</blockquote>
      <div className={styles.card__footer}>
        <span className={styles.card__name}>{review.name}</span>
        <span className={styles.card__context}>{review.context}</span>
      </div>
    </div>
  );
}

export default function Reviews() {
  return (
    <section id="reviews" className={styles.reviews}>
      <div className={styles.reviews__container}>
        <div className={`${styles.reviews__header} reveal`}>
          <span className="section-label">Client Reviews</span>
          <h2 className={styles.reviews__headline}>What clients say</h2>
          <p className={styles.reviews__note}>Reviews sourced from Google.</p>
        </div>
        <div className={styles.reviews__grid}>
          {REVIEWS.map((r, i) => (
            <div key={r.name} className="reveal" style={{ transitionDelay: `${i * 80}ms` }}>
              <ReviewCard review={r} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
