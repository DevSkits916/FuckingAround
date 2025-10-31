import { promises as fs } from 'node:fs';
import path from 'node:path';

let ensurePromise: Promise<string> | undefined;

export function ensureStarterPack(): Promise<string> {
  if (!ensurePromise) {
    ensurePromise = (async () => {
      const repoRoot = path.resolve(__dirname, '..', '..');
      const base64Path = path.join(repoRoot, 'apps/web/sample-packs/starter/pack.base64.txt');
      const outputPath = path.join(repoRoot, 'apps/web/starter.pack.zip');
      const base64Raw = await fs.readFile(base64Path, 'utf8');
      const buffer = Buffer.from(base64Raw.replace(/\s+/g, ''), 'base64');
      await fs.writeFile(outputPath, buffer);
      return outputPath;
    })();
  }
  return ensurePromise;
}
