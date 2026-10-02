import test from 'node:test';
import assert from 'node:assert/strict';
import { createAdminActorId, issueAdminSession } from '@bharatyatra/admin-auth';
import { resolveAdminSession } from '../src/auth/admin-auth.js';

const env={ADMIN_EMAIL:'admin@example.invalid',ADMIN_SESSION_SECRET:'test-only-session-secret-which-is-long-enough'};

test('API accepts a valid signed admin session without calling Supabase Auth',()=>{
  const principal={id:createAdminActorId(env.ADMIN_EMAIL),email:env.ADMIN_EMAIL,role:'admin'};
  const token=issueAdminSession(principal,env);
  const result=resolveAdminSession(token,env);
  assert.equal(result.state,'authenticated');
  assert.deepEqual(result.principal,{...principal,expiresAt:result.principal.expiresAt});
});

test('API rejects invalid, expired, and misconfigured sessions',()=>{
  assert.equal(resolveAdminSession('not-a-session',env).state,'unauthorized');
  const expired=issueAdminSession({id:createAdminActorId(env.ADMIN_EMAIL),email:env.ADMIN_EMAIL,role:'admin'},env,0);
  assert.equal(resolveAdminSession(expired,env).state,'unauthorized');
  assert.equal(resolveAdminSession('anything',{}).state,'unavailable');
});

test('session identity remains a UUID for existing database audit records',()=>{
  const id=createAdminActorId(env.ADMIN_EMAIL);
  assert.match(id,/^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
});
