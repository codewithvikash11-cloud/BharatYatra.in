'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { setLanguage } from '../app/actions.js';

export default function LanguageSwitcher({ currentLang }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const toggleLanguage = () => {
    const nextLang = currentLang === 'hi' ? 'en' : 'hi';
    startTransition(async () => {
      await setLanguage(nextLang);
      router.refresh();
    });
  };

  return (
    <button 
      onClick={toggleLanguage} 
      disabled={isPending}
      className="language-toggle"
      aria-label="Toggle language"
      title={currentLang === 'hi' ? 'Switch to English' : 'हिंदी में बदलें'}
      style={{
        background: 'transparent',
        border: '1px solid var(--line)',
        padding: '4px 10px',
        borderRadius: '99px',
        fontSize: '0.75rem',
        fontWeight: '600',
        color: 'var(--ink)',
        cursor: isPending ? 'wait' : 'pointer',
        opacity: isPending ? 0.7 : 1,
        marginLeft: '12px'
      }}
    >
      {currentLang === 'hi' ? 'EN' : 'हिंदी'}
    </button>
  );
}
