'use client';

import { useState, useEffect } from 'react';
import styles from './SectionNav.module.scss';

const SECTIONS = [
  { id: 'hero',        label: 'Home' },
  { id: 'listings',   label: 'Listings' },
  { id: 'value-props', label: 'Why Marcus' },
  { id: 'reviews',    label: 'Reviews' },
  { id: 'about',      label: 'About' },
  { id: 'market',     label: 'Market' },
  { id: 'process',    label: 'Process' },
  { id: 'lead-form',  label: 'Valuation' },
  { id: 'faq',        label: 'Questions' },
];

export default function SectionNav() {
  const [activeId, setActiveId] = useState('hero');
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    const map = new Map();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => map.set(e.target.id, e.isIntersecting));
        const first = SECTIONS.find((s) => map.get(s.id));
        if (first) setActiveId(first.id);
      },
      { rootMargin: '-45% 0px -45% 0px' }
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (collapsed) return;
    const onClickOutside = (e) => {
      if (!e.target.closest('[data-section-nav]')) setCollapsed(true);
    };
    document.addEventListener('click', onClickOutside);
    return () => document.removeEventListener('click', onClickOutside);
  }, [collapsed]);

  return (
    <nav
      className={`${styles.nav} ${collapsed ? styles['nav--collapsed'] : ''}`}
      aria-label="Page sections"
      data-section-nav
    >
      <button
        className={styles.nav__toggle}
        onClick={(e) => { e.stopPropagation(); setCollapsed(false); }}
        aria-label="Open section navigator"
      >
        &#9776;
      </button>

      <ul className={styles.nav__list}>
        {SECTIONS.map(({ id, label }) => (
          <li key={id}>
            <a
              href={id === 'hero' ? '#' : `#${id}`}
              className={`${styles.nav__item} ${activeId === id ? styles['nav__item--active'] : ''}`}
              aria-label={label}
            >
              <span className={styles.nav__label}>{label}</span>
              <span className={styles.nav__pip} />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
