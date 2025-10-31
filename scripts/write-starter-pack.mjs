import { promises as fs } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const base64Path = join(__dirname, '../apps/web/sample-packs/starter/pack.base64.txt');
const outputPath = join(__dirname, '../apps/web/starter.pack.zip');

async function ensureStarterPack() {
  const base64Raw = await fs.readFile(base64Path, 'utf8');
  const base64 = base64Raw.replace(/\s+/g, '');
  const buffer = Buffer.from(base64, 'base64');
  await fs.writeFile(outputPath, buffer);
  console.log(`Starter pack written to ${outputPath}`);
}

ensureStarterPack().catch((error) => {
  console.error('Failed to write starter pack zip', error);
  process.exitCode = 1;
});
