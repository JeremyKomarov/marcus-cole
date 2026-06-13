'use client';

import { useState, useEffect } from 'react';
import { SITE } from '@/constants/site';
import styles from './Header.module.scss';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles['header--scrolled'] : ''}`}>
      <div className={styles.header__inner}>
        <a href="#" className={styles.header__logo}>
          Marcus Cole <span className={styles.header__logo_accent}>Group</span>
        </a>
        <ul className={styles.header__links}>
          <li><a href="#listings">Listings</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#reviews">Reviews</a></li>
          <li><a href="#market">Market</a></li>
        </ul>
        <div className={styles.header__cta}>
          <a href={SITE.phoneHref} className={styles.header__phone}>{SITE.phone}</a>
          <a href="#lead-form" className="btn btn--primary">Get a Valuation</a>
        </div>
      </div>
    </header>
  );
}
