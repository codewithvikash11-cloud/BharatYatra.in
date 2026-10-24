'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { setLanguage } from '../app/actions.js';

export default function LanguageSwitcher({ currentLang: initialLang = 'en' }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [currentLang, setCurrentLang] = useState(initialLang);

  useEffect(() => {
    const match = document.cookie.match(/(?:^|;\s*)NEXT_LOCALE=(hi|en)(?:;|$)/);
    if (match) {
      setCurrentLang(match[1]);
      document.documentElement.lang = match[1];
    }
  }, []);

  const toggleLanguage = () => {
    const nextLang = currentLang === 'hi' ? 'en' : 'hi';
    document.documentElement.lang = nextLang;
    startTransition(async () => {
      await setLanguage(nextLang);
      setCurrentLang(nextLang);
      router.refresh();
    });
  };

  return (
    <button 
      onClick={toggleLanguage} 
      disabled={isPending}
      className="language-toggle"
      aria-label={currentLang === 'hi' ? 'Switch language to English' : 'भाषा हिंदी में बदलें'}
      title={currentLang === 'hi' ? 'Switch to English' : 'हिंदी में बदलें'}
      aria-busy={isPending}
    >
      {currentLang === 'hi' ? 'EN' : 'हिं'}
    </button>
  );
}
