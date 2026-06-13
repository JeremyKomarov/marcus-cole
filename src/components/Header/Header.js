'use client';

import { useState, useEffect } from 'react';
import { SITE, SECTIONS as SECTIONS_DEFAULT } from '@/constants/site';
import { useDraft } from '@/contexts/ContentContext';
import styles from './Header.module.scss';

const NAV_LINKS = [
  { href: '#listings', label: 'Listings', key: 'listings' },
  { href: '#about',    label: 'About',    key: null },
  { href: '#reviews',  label: 'Reviews',  key: 'reviews' },
  { href: '#market',   label: 'Market',   key: 'market' },
];

export default function Header() {
  const site = useDraft('SITE', SITE);
  const sections = useDraft('SECTIONS', SECTIONS_DEFAULT);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const visibleLinks = NAV_LINKS.filter(l => !l.key || sections[l.key] !== false);

  return (
    <header className={`${styles.header} ${scrolled ? styles['header--scrolled'] : ''}`}>
      <div className={styles.header__inner}>
        <a href="#" className={styles.header__logo}>
          Marcus Cole <span className={styles.header__logo_accent}>Group</span>
        </a>
        <ul className={styles.header__links}>
          {visibleLinks.map(({ href, label }) => (
            <li key={href}><a href={href}>{label}</a></li>
          ))}
        </ul>
        <div className={styles.header__cta}>
          <a href={site.phoneHref} className={styles.header__phone}>{site.phone}</a>
          <a href="#lead-form" className="btn btn--primary">Get a Valuation</a>
        </div>
      </div>
    </header>
  );
}
