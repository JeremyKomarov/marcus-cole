'use client';

import { useState, useEffect } from 'react';
import { useDraft } from '@/contexts/ContentContext';
import { SECTIONS as SECTIONS_DEFAULT } from '@/constants/site';
import styles from './SectionNav.module.scss';

const ALL_SECTIONS = [
  { id: 'hero',        label: 'Home',      key: null },
  { id: 'listings',   label: 'Listings',  key: 'listings' },
  { id: 'value-props', label: 'Why Marcus', key: 'valueProp' },
  { id: 'reviews',    label: 'Reviews',   key: 'reviews' },
  { id: 'about',      label: 'About',     key: null },
  { id: 'market',     label: 'Market',    key: 'market' },
  { id: 'process',    label: 'Process',   key: 'process' },
  { id: 'lead-form',  label: 'Valuation', key: null },
  { id: 'faq',        label: 'Questions', key: 'faq' },
];

export default function SectionNav() {
  const sections = useDraft('SECTIONS', SECTIONS_DEFAULT);
  const visible = ALL_SECTIONS.filter(s => !s.key || sections[s.key] !== false);

  const [activeId, setActiveId] = useState('hero');
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    const map = new Map();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => map.set(e.target.id, e.isIntersecting));
        const first = visible.find((s) => map.get(s.id));
        if (first) setActiveId(first.id);
      },
      { rootMargin: '-45% 0px -45% 0px' }
    );
    visible.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [sections]);

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
        {visible.map(({ id, label }) => (
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
