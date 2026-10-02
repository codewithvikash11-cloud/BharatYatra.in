'use server';

import { cookies } from 'next/headers';

export async function setLanguage(lang) {
  const cookieStore = await cookies();
  cookieStore.set('NEXT_LOCALE', lang === 'hi' ? 'hi' : 'en', {
    path: '/',
    maxAge: 31536000,
    sameSite: 'lax',
  });
}
