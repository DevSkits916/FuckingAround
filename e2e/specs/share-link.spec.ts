import { test, expect } from '@playwright/test';

test('share link round trip', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Share link' }).click();
  const shareOutput = await page.getByTestId('export-bar').textContent();
  expect(shareOutput).toContain('#');
});
