'use client';

import { useState } from 'react';
import { LEAD_FORM, SITE } from '@/constants/site';
import styles from './LeadForm.module.scss';

export default function LeadForm() {
  const { sectionLabel, headline, body, trustPoints, submitCta, successMessage } = LEAD_FORM;

  const [form, setForm] = useState({ name: '', phone: '', email: '', intent: 'sell', hp: '' });
  const [status, setStatus] = useState('idle');

  function onChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (form.hp) return;
    setStatus('loading');

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Submit failed');
      setStatus('success');
      if (typeof window !== 'undefined') {
        window.gtag?.('event', 'generate_lead', { event_category: 'lead' });
        window.fbq?.('track', 'Lead');
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <section id="lead-form" className={styles.section}>
      <div className={styles.section__container}>
        <div className={`${styles.section__left} reveal`}>
          <span className="section-label">{sectionLabel}</span>
          <h2 className={styles.section__headline}>{headline}</h2>
          <p className={styles.section__body}>{body}</p>
          <ul className={styles.trust}>
            {trustPoints.map((t) => (
              <li key={t} className={styles.trust__item}>{t}</li>
            ))}
          </ul>
        </div>

        <div className={`${styles.form__wrap} reveal`} style={{ transitionDelay: '100ms' }}>
          {status === 'success' ? (
            <div className={styles.form__success}>
              <p className={styles.form__success_msg}>{successMessage}</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className={styles.form} noValidate>
              {/* Honeypot */}
              <input
                type="text"
                name="hp"
                value={form.hp}
                onChange={onChange}
                aria-hidden="true"
                tabIndex={-1}
                style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
              />

              <div className={styles.form__field}>
                <label htmlFor="name" className={styles.form__label}>Full Name</label>
                <input id="name" name="name" type="text" value={form.name} onChange={onChange}
                  required placeholder="Your full name" className={styles.form__input} autoComplete="name" />
              </div>

              <div className={styles.form__field}>
                <label htmlFor="phone" className={styles.form__label}>Phone Number</label>
                <input id="phone" name="phone" type="tel" value={form.phone} onChange={onChange}
                  required placeholder="(512) 000-0000" className={styles.form__input} autoComplete="tel" />
              </div>

              <div className={styles.form__field}>
                <label htmlFor="email" className={styles.form__label}>Email Address</label>
                <input id="email" name="email" type="email" value={form.email} onChange={onChange}
                  placeholder="you@example.com" className={styles.form__input} autoComplete="email" />
              </div>

              <fieldset className={styles.form__fieldset}>
                <legend className={styles.form__label}>I am looking to&hellip;</legend>
                <div className={styles.form__radios}>
                  {['buy', 'sell', 'both'].map((v) => (
                    <label key={v} className={styles.form__radio}>
                      <input type="radio" name="intent" value={v}
                        checked={form.intent === v} onChange={onChange} />
                      <span>{v.charAt(0).toUpperCase() + v.slice(1)}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {status === 'error' && (
                <p className={styles.form__error}>Something went wrong. Please try again or call us directly.</p>
              )}

              <button type="submit" className={`btn btn--primary ${styles.form__submit}`}
                disabled={status === 'loading'}>
                {status === 'loading' ? 'Sending…' : submitCta}
              </button>

              <p className={styles.form__disclaimer}>
                Your information is kept private and never shared or sold.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
