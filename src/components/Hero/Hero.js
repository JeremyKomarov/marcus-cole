import Image from 'next/image';
import { HERO, STATS, SITE } from '@/constants/site';
import styles from './Hero.module.scss';

export default function Hero() {
  return (
    <section id="hero" className={styles.hero}>
      <div className={styles.hero__container}>
        <div className={styles.hero__inner}>

          {/* Left: content */}
          <div className={`${styles.hero__content} reveal`}>
            <div className={styles.hero__top}>
              <div className={styles.hero__eyebrow}>{HERO.eyebrow}</div>
              <h1 className={styles.hero__title}>
                {HERO.headline}<br />
                <em>{HERO.headlineEm}</em>
              </h1>
              <p className={styles.hero__sub}>{HERO.sub}</p>
            </div>

            <div className={styles.hero__ctas}>
              <a href="#lead-form" className="btn btn--primary">{HERO.ctaPrimary}</a>
              <a href={SITE.phoneHref} className="btn btn--ghost">{HERO.ctaSecondary}</a>
            </div>

            {/* Stats row inside hero */}
            <div className={styles.hero__stats}>
              {STATS.map((s) => (
                <div key={s.label} className={styles.hero__stat}>
                  <span className={styles.hero__stat_value}>{s.value}</span>
                  <span className={styles.hero__stat_label}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: property image */}
          <div className={`${styles.hero__visual} reveal`} style={{ transitionDelay: '100ms' }}>
            <div className={styles.hero__image}>
              <Image
                src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=900&q=85"
                alt="Luxury Austin home represented by Marcus Cole Group"
                fill
                priority
                sizes="(max-width: 899px) 100vw, 50vw"
                className={styles.hero__img}
              />
            </div>
            <div className={styles.hero__badge}>
              <div>
                <strong className={styles.hero__badge_price}>{HERO.imageBadgePrice}</strong>
                <span className={styles.hero__badge_addr}>{HERO.imageBadgeAddress}</span>
              </div>
              <span className={styles.hero__badge_pill}>
                <span className={styles.hero__badge_dot} />
                Active
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
