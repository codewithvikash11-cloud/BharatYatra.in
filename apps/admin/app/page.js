'use client';
import { useActionState } from 'react';
import { signInAction } from './actions.js';

export default function SignInPage(){
  const [state,action,pending]=useActionState(signInAction,null);
  return <main className="login-wrap"><section className="login-card">
    <p className="eyebrow">BHARATYATRA · CONTENT STUDIO</p><h1>Good work<br/><em>travels far.</em></h1>
    <p className="lead">Sign in with your invited staff account to manage destination guides and stories.</p>
    <form action={action} className="form-stack">
      <label>Work email<input name="email" type="email" autoComplete="username" required maxLength={254}/></label>
      <label>Password<input name="password" type="password" autoComplete="current-password" required maxLength={256}/></label>
      {state?.error&&<p className="error" role="alert">{state.error}</p>}
      <button className="button primary" disabled={pending}>{pending?'Signing in…':'Sign in securely'}</button>
    </form>
    <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px dashed #e2e8f0', textAlign: 'center' }}>
      <a
        href="/api/auth/dev-session?next=/articles/new"
        className="button subtle"
        style={{ display: 'block', width: '100%', textAlign: 'center', textDecoration: 'none', background: '#ecfdf5', color: '#065f46', borderColor: '#a7f3d0', fontWeight: 600, padding: '0.65rem 1rem', borderRadius: '8px' }}
      >
        ⚡ 1-Click Dev Sign-In → Open Article Studio
      </a>
    </div>
    <p className="hint">Staff access is invitation-only. Contact your BharatYatra administrator if you need an account.</p>
  </section></main>;
}
