export function createApiClient(baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api/v1') {
  return {
    async get(path, options = {}) {
      const response = await fetch(`${baseUrl}${path}`, { ...options, headers: { Accept: 'application/json', ...options.headers } });
      if (!response.ok) throw new Error(`API request failed (${response.status})`);
      return response.json();
    },
  };
}
