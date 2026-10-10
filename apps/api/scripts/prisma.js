import dotenv from 'dotenv';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const apiDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const workspaceRoot = apiDirectory;
dotenv.config({ path: path.join(workspaceRoot, '.env') });

// Database credentials for local Prisma commands must come from the root .env,
// not from unrelated inherited shell variables.
let localEnvironment = {};
try {
  localEnvironment = dotenv.parse(readFileSync(path.join(workspaceRoot, '.env')));
} catch {}
for (const key of ['DATABASE_URL', 'DIRECT_URL']) {
  if (localEnvironment[key]?.trim()) process.env[key] = localEnvironment[key];
  else delete process.env[key];
}

const result = spawnSync('npx', ['prisma', ...process.argv.slice(2)], {
  cwd: workspaceRoot,
  env: process.env,
  stdio: 'inherit',
  shell: true
});

if (result.error) {
  console.error('Could not start Prisma CLI. Check that dependencies are installed.');
  process.exit(1);
}

process.exit(result.status ?? 1);
