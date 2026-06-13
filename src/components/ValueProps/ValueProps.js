'use client';
import { VALUE_PROPS, SITE } from '@/constants/site';
import { useDraft } from '@/contexts/ContentContext';
import styles from './ValueProps.module.scss';

export default function ValueProps() {
  const { sectionLabel, headline, copy, cta, pillars } = useDraft('VALUE_PROPS', VALUE_PROPS);
  const site = useDraft('SITE', SITE);

  return (
    <section id="value-props" className={styles.vp}>
      <div className={styles.vp__container}>

        <div className={`${styles.vp__heading} reveal`}>
          <span className="section-label">{sectionLabel}</span>
          <h2 className={styles.vp__headline}>{headline}</h2>
        </div>

        <div className={styles.vp__inner}>
          <div className={`${styles.vp__copy} reveal`}>
            <h3 className={styles.vp__subhead}>Local knowledge. Direct access. Results that show.</h3>
            <p className={styles.vp__body}>{copy}</p>
            <a href={site.phoneHref} className="btn btn--primary">{cta}</a>
          </div>

          <div className={`${styles.pillars} reveal`} style={{ transitionDelay: '100ms' }}>
            {pillars.map((p, i) => (
              <div
                key={p.number}
                className={`${styles.pillar} ${i === 0 ? styles['pillar--first'] : ''} ${i === pillars.length - 1 ? styles['pillar--last'] : ''}`}
              >
                <div className={styles.pillar__number}>{p.number}</div>
                <div className={styles.pillar__content}>
                  <h3 className={styles.pillar__title}>{p.title}</h3>
                  <p className={styles.pillar__body}>{p.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
