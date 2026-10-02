'use client';

import { useEffect, useState } from 'react';

export default function ErrorPage({reset}){
  const [lang, setLang] = useState('en');
  useEffect(() => {
    if (typeof document !== 'undefined') {
      setLang(document.cookie.includes('NEXT_LOCALE=hi') ? 'hi' : 'en');
    }
  }, []);
  const showHi = lang === 'hi';
  return <main className="page-shell not-found-page"><p className="eyebrow">BHARATYATRA · RETRY</p><h1>{showHi ? 'अभी यह पेज लोड नहीं हो सका।' : 'Page could not be loaded.'}</h1><p>{showHi ? 'कृपया connection जाँचकर फिर कोशिश करें।' : 'Please check your connection and try again.'}</p><button className="button-link" onClick={()=>reset()}>{showHi ? 'फिर कोशिश करें' : 'Try again'}</button></main>;
}
