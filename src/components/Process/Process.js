'use client';
import { PROCESS, SITE } from '@/constants/site';
import { useDraft } from '@/contexts/ContentContext';
import styles from './Process.module.scss';

export default function Process() {
  const { sectionLabel, headline, cta, steps } = useDraft('PROCESS', PROCESS);
  const site = useDraft('SITE', SITE);

  return (
    <section id="process" className={styles.process}>
      <div className={styles.process__container}>
        <div className={`${styles.process__header} reveal`}>
          <span className="section-label">{sectionLabel}</span>
          <h2 className={styles.process__headline}>{headline}</h2>
        </div>
        <div className={`${styles.process__grid} reveal`} style={{ transitionDelay: '80ms' }}>
          {steps.map((step) => (
            <div key={step.number} className={styles.step}>
              <div className={styles.step__number}>{step.number}</div>
              <h3 className={styles.step__title}>{step.title}</h3>
              <p className={styles.step__body}>{step.body}</p>
            </div>
          ))}
        </div>
        <div className={styles.process__cta}>
          <a href={site.phoneHref} className="btn btn--primary">{cta}</a>
        </div>
      </div>
    </section>
  );
}
