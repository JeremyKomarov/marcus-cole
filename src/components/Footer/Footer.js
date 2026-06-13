'use client';
import { FOOTER, SITE } from '@/constants/site';
import { useDraft } from '@/contexts/ContentContext';
import styles from './Footer.module.scss';

export default function Footer() {
  const site = useDraft('SITE', SITE);
  const footer = useDraft('FOOTER', FOOTER);
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footer__container}>
        <div className={styles.footer__top}>
          <div className={styles.footer__brand}>
            <span className={styles.footer__name}>{site.name}</span>
            <span className={styles.footer__tagline}>Austin Luxury Real Estate</span>
            <a href={site.phoneHref} className={styles.footer__phone}>{site.phone}</a>
            <a href={`mailto:${site.email}`} className={styles.footer__email}>{site.email}</a>
          </div>

          <div className={styles.footer__col}>
            <span className={styles.footer__col_title}>Services</span>
            <ul>
              {footer.serviceLinks.map((l) => (
                <li key={l.label}><a href={l.href}>{l.label}</a></li>
              ))}
            </ul>
          </div>

          <div className={styles.footer__col}>
            <span className={styles.footer__col_title}>Navigate</span>
            <ul>
              {footer.pageLinks.map((l) => (
                <li key={l.label}><a href={l.href}>{l.label}</a></li>
              ))}
            </ul>
          </div>

          <div className={styles.footer__col}>
            <span className={styles.footer__col_title}>Connect</span>
            <ul>
              {footer.socialLinks.map((l) => (
                <li key={l.label}><a href={l.href} target="_blank" rel="noopener noreferrer">{l.label}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.footer__bottom}>
          <p className={styles.footer__legal}>
            {site.address.street}, {site.address.city}, {site.address.state} {site.address.zip}
            {' '}·{' '}{site.license}
          </p>
          <p className={styles.footer__copy}>
            © {year} {site.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
