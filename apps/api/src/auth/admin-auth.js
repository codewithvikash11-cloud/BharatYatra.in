import { hasAdminSessionSecret, verifyAdminSession } from '@bharatyatra/admin-auth';

export function resolveAdminSession(token, env = process.env) {
  if (!hasAdminSessionSecret(env)) return { state: 'unavailable' };
  const principal = verifyAdminSession(token, env);
  if (!principal) return { state: 'unauthorized' };
  return { state: 'authenticated', principal };
}

export function requireAdmin({ resolveUser = resolveAdminSession, roles = ['admin', 'editor'] } = {}) {
  return async (request, response, next) => {
    const authorization = request.get('authorization') || '';
    const match = /^Bearer\s+([^\s]+)$/i.exec(authorization);
    if (!match) return response.status(401).json({ error: 'Authentication required' });

    const result = await resolveUser(match[1]);
    if (result.state === 'unavailable') return response.status(503).json({ error: 'Authentication service unavailable' });
    if (result.state === 'unauthorized') return response.status(401).json({ error: 'Authentication required' });
    if (result.state !== 'authenticated' || !roles.includes(result.principal.role)) {
      return response.status(403).json({ error: 'Insufficient permissions' });
    }

    request.adminPrincipal = result.principal;
    return next();
  };
}
