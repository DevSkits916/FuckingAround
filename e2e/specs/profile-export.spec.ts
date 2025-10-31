import { test, expect } from '@playwright/test';

test('create profile add block export queue', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'New profile' }).click();
  await page.getByRole('button', { name: 'Avatar' }).click();
  await page.getByRole('button', { name: 'Export all profiles' }).click();
  await expect(page.getByTestId('render-queue')).toContainText('queued');
});
