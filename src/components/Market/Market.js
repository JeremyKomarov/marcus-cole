import { MARKET } from '@/constants/site';
import styles from './Market.module.scss';

export default function Market() {
  const { sectionLabel, headline, sub, stats } = MARKET;

  return (
    <section id="market" className={styles.market}>
      <div className={styles.market__container}>
        <div className={`${styles.market__header} reveal`}>
          <span className="section-label">{sectionLabel}</span>
          <h2 className={styles.market__headline}>{headline}</h2>
          <p className={styles.market__sub}>{sub}</p>
        </div>
        <div className={`${styles.market__grid} reveal`} style={{ transitionDelay: '80ms' }}>
          {stats.map((s) => (
            <div key={s.label} className={styles.stat}>
              <span className={styles.stat__value}>{s.value}</span>
              <span className={styles.stat__label}>{s.label}</span>
              <span className={styles.stat__sub}>{s.sub}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
