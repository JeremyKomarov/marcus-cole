'use client';

import { useState } from 'react';
import { FAQ } from '@/constants/site';
import { useDraft } from '@/contexts/ContentContext';
import styles from './Faq.module.scss';

function FaqItem({ item, open, onToggle }) {
  return (
    <div className={`${styles.item} ${open ? styles['item--open'] : ''}`}>
      <button className={styles.item__trigger} onClick={onToggle} aria-expanded={open}>
        <span className={styles.item__q}>{item.q}</span>
        <span className={styles.item__icon} aria-hidden="true">&#9660;</span>
      </button>
      <div className={styles.item__body}>
        <p className={styles.item__body_inner}>{item.a}</p>
      </div>
    </div>
  );
}

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(null);
  const { sectionLabel, headline, items } = useDraft('FAQ', FAQ);

  return (
    <section id="faq" className={styles.faq}>
      <div className={styles.faq__container}>
        <div className={`${styles.faq__header} reveal`}>
          <span className="section-label">{sectionLabel}</span>
          <h2 className={styles.faq__headline}>{headline}</h2>
        </div>
        <div className={`${styles.faq__list} reveal`} style={{ transitionDelay: '80ms' }}>
          {items.map((item, i) => (
            <FaqItem
              key={i}
              item={item}
              open={openIndex === i}
              onToggle={() => setOpenIndex((v) => (v === i ? null : i))}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
