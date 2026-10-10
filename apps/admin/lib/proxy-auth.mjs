export async function hasValidAdminSession(token, env = process.env) {
  if (typeof token !== 'string' || !env.ADMIN_SESSION_SECRET || env.ADMIN_SESSION_SECRET.length < 32) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  const [b64Principal, issuedAtStr, signatureHex] = parts;
  const issuedAt = parseInt(issuedAtStr, 10);
  if (isNaN(issuedAt) || Date.now() / 1000 - issuedAt > 8 * 60 * 60) return false;

  try {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      enc.encode(env.ADMIN_SESSION_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );
    
    const signatureBytes = new Uint8Array(signatureHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    const data = enc.encode(`${b64Principal}.${issuedAtStr}`);
    
    return await crypto.subtle.verify('HMAC', key, signatureBytes, data);
  } catch {
    return false;
  }
}