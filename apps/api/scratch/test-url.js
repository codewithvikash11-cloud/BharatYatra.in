const url = 'postgresql://postgres.xxuldgkwfrpdxayihvzr:Y@w-G6DqwPVf?9e@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true';
try {
  const parsed = new URL(url);
  console.log('Host:', parsed.host);
  console.log('Hostname:', parsed.hostname);
  console.log('Password:', parsed.password);
} catch (e) {
  console.error('URL parse error:', e.message);
}
