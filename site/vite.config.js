import { defineConfig } from 'vite';
import { resolve, dirname, join, extname } from 'node:path';
import { readdirSync, existsSync, cpSync, statSync, createReadStream } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { SITE } from './src/content.js';

const root = dirname(fileURLToPath(import.meta.url));
const repo = resolve(root, '..');

// Files from the old site that must keep their public URLs.
const LEGACY = [
  'PRDs',
  'field-guides',
  'products',
  'images/comic-story',
  'Prateek-Mehta-AI-PM-Resume.pdf',
  'rethink-buildathon-2nd-place.pdf',
  'brand-visualizer-galpal.html',
  '.nojekyll',
];

// Old resume URLs that may still be shared around: each one now serves the
// current resume, so no outdated version stays online.
const RESUME = 'Prateek-Mehta-AI-PM-Resume.pdf';
const RESUME_ALIASES = ['Prateek-Mehta-PM-Resume.pdf', 'Prateek-Mehta-Product-Resume.pdf', 'Resume.pdf'];

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.pdf': 'application/pdf',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
};

function pageInputs() {
  const input = { main: resolve(root, 'index.html') };
  for (const page of ['read', 'comic']) {
    const file = resolve(root, page, 'index.html');
    if (existsSync(file)) input[page] = file;
  }
  const work = resolve(root, 'work');
  if (existsSync(work)) {
    for (const slug of readdirSync(work)) {
      const file = resolve(work, slug, 'index.html');
      if (existsSync(file)) input[`work-${slug}`] = file;
    }
  }
  return input;
}

// Serves legacy files during `vite dev`, copies them into dist on build.
function legacyAssets() {
  let outDir = resolve(root, 'dist');
  return {
    name: 'legacy-assets',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir);
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        let url = decodeURIComponent((req.url || '').split('?')[0]);
        // Vite's dev HTML transform prefixes the base onto absolute <img src>
        // that already carry it; undo the doubling (builds are unaffected).
        if (url.startsWith(SITE.base + SITE.base.slice(1))) url = url.slice(SITE.base.length - 1);
        if (!url.startsWith(SITE.base)) return next();
        let rel = url.slice(SITE.base.length);
        if (RESUME_ALIASES.includes(rel)) rel = RESUME;
        if (!LEGACY.some((p) => rel === p || rel.startsWith(p + '/'))) return next();
        let file = join(repo, rel);
        if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
        if (!existsSync(file)) return next();
        res.setHeader('Content-Type', MIME[extname(file).toLowerCase()] || 'application/octet-stream');
        createReadStream(file).pipe(res);
      });
    },
    closeBundle() {
      for (const p of LEGACY) {
        const src = join(repo, p);
        if (existsSync(src)) cpSync(src, join(outDir, p), { recursive: true });
      }
      for (const alias of RESUME_ALIASES) cpSync(join(repo, RESUME), join(outDir, alias));
    },
  };
}

// Fills <!--@name--> markers in index.html from src/render/index.js, so every
// word is in the HTML before any JavaScript runs.
function contentHtml() {
  let server;
  return {
    name: 'content-html',
    configureServer(s) {
      server = s;
    },
    async transformIndexHtml(html, ctx) {
      if (!html.includes('<!--@')) return html;
      const mod = server
        ? await server.ssrLoadModule('/src/render/index.js')
        : await import(pathToFileURL(resolve(root, 'src/render/index.js')).href + `?t=${Date.now()}`);
      const out = html.replace(/<!--@([a-z-]+)-->/g, (m, name) => {
        const fn = mod.blocks[name];
        if (!fn) throw new Error(`[content-html] unknown block "${name}" in ${ctx.filename}`);
        return fn();
      });
      // Same rule as the generated pages: no em-dashes anywhere in the copy.
      if (out.includes('—')) throw new Error(`[content-html] em-dash found in ${ctx.filename}; remove it from content.js`);
      return out;
    },
  };
}

export default defineConfig({
  base: SITE.base,
  plugins: [contentHtml(), legacyAssets()],
  build: {
    target: 'es2022',
    // The 3D chunk (three + gsap + scene) is ~200 KB gzipped and lazy-loaded.
    chunkSizeWarningLimit: 800,
    assetsInlineLimit: 2048,
    rollupOptions: { input: pageInputs() },
  },
  server: { port: 5173, strictPort: false },
  preview: { port: 4173, strictPort: false },
});
