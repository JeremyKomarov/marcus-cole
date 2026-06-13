'use client';

import { useEffect } from 'react';

export default function ScrollReveal() {
  useEffect(() => {
    const isPreview = new URLSearchParams(window.location.search).get('preview') === '1';

    if (isPreview) {
      // In preview, reveal immediately and watch for sections toggled back on.
      document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in-view'));
      const mo = new MutationObserver(() => {
        document.querySelectorAll('.reveal:not(.in-view)').forEach((el) => el.classList.add('in-view'));
      });
      mo.observe(document.body, { childList: true, subtree: true });
      return () => mo.disconnect();
    }

    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in-view');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.05 },
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
