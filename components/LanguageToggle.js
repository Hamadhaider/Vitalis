'use client';

import { useEffect, useState } from 'react';

export const LANGUAGE_KEY = 'vitalis_language_v1';

export function getStoredLanguage() {
  if (typeof window === 'undefined') return 'en';
  return window.localStorage.getItem(LANGUAGE_KEY) || 'en';
}

export default function LanguageToggle() {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    setLang(getStoredLanguage());
  }, []);

  function toggle() {
    const next = lang === 'en' ? 'ur' : 'en';
    setLang(next);
    window.localStorage.setItem(LANGUAGE_KEY, next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle response language between English and Urdu"
      title="AI responses language"
      className="focus-ring px-3 h-9 shrink-0 rounded-full border border-line text-xs font-medium text-ink/70 hover:text-ink hover:bg-pine-50 transition-colors"
    >
      {lang === 'en' ? 'EN' : 'اردو'}
    </button>
  );
}

