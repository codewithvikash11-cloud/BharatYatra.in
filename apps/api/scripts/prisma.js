import dotenv from 'dotenv';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const apiDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const workspaceRoot = path.resolve(apiDirectory, '../..');
dotenv.config({ path: path.join(workspaceRoot, '.env') });

// Database credentials for local Prisma commands must come from the root .env,
// not from unrelated inherited shell variables.
const localEnvironment = dotenv.parse(readFileSync(path.join(workspaceRoot, '.env')));
for (const key of ['DATABASE_URL', 'DIRECT_URL']) {
  if (localEnvironment[key]?.trim()) process.env[key] = localEnvironment[key];
  else delete process.env[key];
}

const prismaCli = path.join(workspaceRoot, 'node_modules', 'prisma', 'build', 'index.js');
const result = spawnSync(process.execPath, [prismaCli, ...process.argv.slice(2)], {
  cwd: workspaceRoot,
  env: process.env,
  stdio: 'inherit',
});

if (result.error) {
  console.error('Could not start Prisma CLI. Check that dependencies are installed.');
  process.exit(1);
}

process.exit(result.status ?? 1);
