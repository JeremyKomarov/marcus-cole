'use client';

import { useDraft } from '@/contexts/ContentContext';
import { SECTIONS } from '@/constants/site';

export default function SectionGate({ section, children }) {
  const sections = useDraft('SECTIONS', SECTIONS);
  if (sections[section] === false) return null;
  return children;
}
