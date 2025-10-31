import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './specs',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run dev -- --host',
    cwd: '../apps/web',
    port: 5173,
    reuseExistingServer: !process.env.CI,
  },
});
