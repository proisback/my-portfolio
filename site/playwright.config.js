import { defineConfig } from '@playwright/test';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const PORT = 4317;

// Default: build into dist and preview it. Set E2E_OUT_DIR to an absolute
// directory to build and serve an isolated copy instead, so another process
// rebuilding dist mid-run can't swap the hashed chunks under the tests.
const OUT = process.env.E2E_OUT_DIR;
const command = OUT
  ? `npm run build -- --outDir "${OUT}" --emptyOutDir && npx vite preview --outDir "${OUT}" --port ${PORT} --strictPort`
  : `npm run build && npx vite preview --port ${PORT} --strictPort`;

// Headless Chromium has no GPU: SwiftShader gives it WebGL2 so the 3D tier runs.
const args = ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'];

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  retries: 0,
  workers: 2,
  reporter: 'list',
  use: {
    baseURL: `http://localhost:${PORT}/my-portfolio/`,
    screenshot: 'only-on-failure',
    trace: 'off',
    launchOptions: { args },
  },
  projects: [
    {
      name: 'desktop',
      use: { browserName: 'chromium', viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'mobile',
      use: {
        browserName: 'chromium',
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
        deviceScaleFactor: 2,
      },
    },
    {
      name: 'reduced',
      use: { browserName: 'chromium', viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' },
    },
  ],
  webServer: {
    command,
    cwd: here,
    url: `http://localhost:${PORT}/my-portfolio/`,
    reuseExistingServer: false,
    timeout: 180_000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
});
