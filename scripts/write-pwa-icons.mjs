import { promises as fs } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const baseDir = join(__dirname, '../apps/web/pwa/icons');
const outputDir = join(__dirname, '../apps/web/public/icons');

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function writeIcon(baseName) {
  const base64Path = join(baseDir, `${baseName}.base64.txt`);
  const raw = await fs.readFile(base64Path, 'utf8');
  const base64 = raw.replace(/\s+/g, '');
  const buffer = Buffer.from(base64, 'base64');
  const outPath = join(outputDir, `${baseName}.png`);
  await fs.writeFile(outPath, buffer);
  return outPath;
}

async function ensureIcons() {
  await ensureDir(outputDir);
  const written = await Promise.all([
    writeIcon('icon-192'),
    writeIcon('icon-512')
  ]);
  for (const path of written) {
    console.log(`PWA icon written to ${path}`);
  }
}

ensureIcons().catch((error) => {
  console.error('Failed to write PWA icons', error);
  process.exitCode = 1;
});
