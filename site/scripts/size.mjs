// Checks the built bundle against the spec's budgets (run after `npm run build`):
//   entry JS < 30 KB gzipped, 3D chunk < 250 KB gzipped.
import { readdirSync, readFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const assets = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist', 'assets');
const gz = (f) => gzipSync(readFileSync(join(assets, f))).length / 1024;
const files = readdirSync(assets);
const pick = (prefix, ext) => files.filter((f) => f.startsWith(prefix) && f.endsWith(ext));

const rows = [
  ['entry JS (main-*.js)', pick('main-', '.js'), 30],
  ['3D chunk (flight-*.js)', pick('flight-', '.js'), 250],
  ['CSS (main-*.css)', pick('main-', '.css'), 40],
];
let fail = false;
for (const [label, list, budget] of rows) {
  const kb = list.reduce((a, f) => a + gz(f), 0);
  const ok = kb <= budget;
  if (!ok) fail = true;
  console.log(`${ok ? 'ok  ' : 'OVER'} ${label.padEnd(26)} ${kb.toFixed(1).padStart(6)} KB gz  (budget ${budget} KB)`);
}
process.exit(fail ? 1 : 0);
