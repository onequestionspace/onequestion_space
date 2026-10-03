#!/usr/bin/env node
/**
 * Guards against drift between `lib/identities.ts` and `convex/identities.ts`.
 *
 * The Convex bundler only includes files under `convex/`, so the admin and
 * founder user IDs cannot live in a single shared module. These two copies
 * previously drifted: billing and /api/stream lost Paraja, and
 * DashboardLayout lost Asym's production account. This script fails CI if
 * that happens again.
 *
 * Run: node scripts/check-identities.mjs
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const FILES = ['lib/identities.ts', 'convex/identities.ts'];

/** Pulls `export const NAME = <literal>;` and collects string literals in order. */
function extract(source) {
  const constants = {};
  const constRe = /^export const (\w+)(?::\s*readonly string\[\])?\s*=\s*(.*?);$/gm;
  let match;
  while ((match = constRe.exec(source)) !== null) {
    const [, name, rawValue] = match;
    const strings = [...rawValue.matchAll(/'([^']*)'/g)].map((m) => m[1]);
    constants[name] = strings.length > 0 ? strings : rawValue.trim();
  }
  return constants;
}

const [a, b] = FILES.map((file) => extract(readFileSync(join(ROOT, file), 'utf8')));
const keys = [...new Set([...Object.keys(a), ...Object.keys(b)])].sort();

const problems = [];
for (const key of keys) {
  const left = JSON.stringify(a[key]);
  const right = JSON.stringify(b[key]);
  if (left !== right) {
    problems.push(`  ${key}\n    ${FILES[0]}: ${left ?? 'MISSING'}\n    ${FILES[1]}: ${right ?? 'MISSING'}`);
  }
}

if (problems.length > 0) {
  console.error('✖ identity drift detected between lib/ and convex/:\n');
  console.error(problems.join('\n'));
  console.error('\nCopy the canonical values from lib/identities.ts into convex/identities.ts.');
  process.exit(1);
}

console.log(`✔ ${keys.length} identity constants match across ${FILES.length} files`);