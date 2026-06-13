import { SITE } from '@/constants/site';
import styles from './MobileCtaBar.module.scss';

export default function MobileCtaBar() {
  return (
    <div className={styles.bar}>
      <a href={SITE.phoneHref} className={`${styles.bar__btn} ${styles['bar__btn--ghost']}`}>
        Call Now
      </a>
      <a href="#lead-form" className={`${styles.bar__btn} ${styles['bar__btn--primary']}`}>
        Free Valuation
      </a>
    </div>
  );
}
