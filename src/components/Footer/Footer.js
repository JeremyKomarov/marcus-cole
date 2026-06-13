import { FOOTER, SITE } from '@/constants/site';
import styles from './Footer.module.scss';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footer__container}>
        <div className={styles.footer__top}>
          <div className={styles.footer__brand}>
            <span className={styles.footer__name}>{SITE.name}</span>
            <span className={styles.footer__tagline}>Austin Luxury Real Estate</span>
            <a href={SITE.phoneHref} className={styles.footer__phone}>{SITE.phone}</a>
            <a href={`mailto:${SITE.email}`} className={styles.footer__email}>{SITE.email}</a>
          </div>

          <div className={styles.footer__col}>
            <span className={styles.footer__col_title}>Services</span>
            <ul>
              {FOOTER.serviceLinks.map((l) => (
                <li key={l.label}><a href={l.href}>{l.label}</a></li>
              ))}
            </ul>
          </div>

          <div className={styles.footer__col}>
            <span className={styles.footer__col_title}>Navigate</span>
            <ul>
              {FOOTER.pageLinks.map((l) => (
                <li key={l.label}><a href={l.href}>{l.label}</a></li>
              ))}
            </ul>
          </div>

          <div className={styles.footer__col}>
            <span className={styles.footer__col_title}>Connect</span>
            <ul>
              {FOOTER.socialLinks.map((l) => (
                <li key={l.label}><a href={l.href} target="_blank" rel="noopener noreferrer">{l.label}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.footer__bottom}>
          <p className={styles.footer__legal}>
            {SITE.address.street}, {SITE.address.city}, {SITE.address.state} {SITE.address.zip}
            {' '}·{' '}{SITE.license}
          </p>
          <p className={styles.footer__copy}>
            © {year} {SITE.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
