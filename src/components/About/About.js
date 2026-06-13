'use client';
import { ABOUT, SITE } from '@/constants/site';
import { useDraft } from '@/contexts/ContentContext';
import styles from './About.module.scss';

export default function About() {
  const { sectionLabel, headline, body, cta, credentials } = useDraft('ABOUT', ABOUT);
  const site = useDraft('SITE', SITE);

  return (
    <section id="about" className={styles.about}>
      <div className={styles.about__container}>
        <div className={styles.about__inner}>
          <div className={`${styles.about__photo} reveal`} role="img" aria-label="Photo of Marcus Cole">
            [Professional photo of Marcus Cole]
          </div>
          <div className={`${styles.about__content} reveal`} style={{ transitionDelay: '100ms' }}>
            <span className="section-label">{sectionLabel}</span>
            <h2 className={styles.about__headline}>{headline}</h2>
            <p className={styles.about__body}>{body}</p>
            <div className={styles.about__creds}>
              {credentials.map((c) => (
                <div key={c} className={styles.about__cred}>{c}</div>
              ))}
            </div>
            <a href={site.phoneHref} className="btn btn--primary">{cta}</a>
          </div>
        </div>
      </div>
    </section>
  );
}
