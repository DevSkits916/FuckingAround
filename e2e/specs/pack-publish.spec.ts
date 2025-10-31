import { test, expect } from '@playwright/test';
import path from 'node:path';
import { ensureStarterPack } from '../utils/starterPack';

test('pack import and publish message', async ({ page }) => {
  await page.goto('/');
  const fileChooserPromise = page.waitForEvent('filechooser');
  await page.getByTestId('pack-manager').getByRole('button', { name: /import/i }).click();
  const chooser = await fileChooserPromise;
  const starterPackPath = await ensureStarterPack();
  await chooser.setFiles(path.resolve(starterPackPath));
  await expect(page.getByTestId('pack-manager')).toContainText('Starter Signature');
  await page.getByRole('button', { name: 'Publish static' }).click();
  await expect(page.getByTestId('export-bar')).toContainText('Generated');
});
