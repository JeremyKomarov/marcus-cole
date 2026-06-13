'use client';

import { useEffect, useRef, useState } from 'react';
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
  const headerRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const el = headerRef.current;
    const onScroll = () => {
      const p = Math.min(window.scrollY / 80, 1);
      el.style.setProperty('--scroll-p', p.toFixed(3));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const visibleLinks = NAV_LINKS.filter(l => !l.key || sections[l.key] !== false);

  function closeMenu() { setMenuOpen(false); }

  return (
    <header ref={headerRef} className={`${styles.header} ${menuOpen ? styles['header--open'] : ''}`}>
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
          <button
            className={`${styles.header__burger} ${menuOpen ? styles['header__burger--open'] : ''}`}
            onClick={() => setMenuOpen(v => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className={styles.header__mobile_nav} aria-label="Mobile navigation">
          {visibleLinks.map(({ href, label }) => (
            <a key={href} href={href} className={styles.header__mobile_link} onClick={closeMenu}>
              {label}
            </a>
          ))}
          <a href="#lead-form" className={styles.header__mobile_cta} onClick={closeMenu}>
            Get a Free Valuation
          </a>
        </nav>
      )}
    </header>
  );
}
