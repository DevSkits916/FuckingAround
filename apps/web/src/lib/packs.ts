import JSZip from 'jszip';
import {
  PackManifest,
  SignatureProfile,
  ThemeTokens,
} from '@smart-signature/shared';

const textDecoder = new TextDecoder();

const readJsonFiles = async <T>(zip: JSZip, folder: string) => {
  const files = zip.folder(folder);
  if (!files) return [] as T[];
  const entries = Object.values(files.files).filter((file) => !file.dir);
  const results: T[] = [];
  for (const entry of entries) {
    const buffer = await entry.async('uint8array');
    const json = JSON.parse(textDecoder.decode(buffer)) as T;
    results.push(json);
  }
  return results;
};

export const parsePackZip = async (file: File | Blob): Promise<PackManifest> => {
  const zip = await JSZip.loadAsync(file);
  const presets = await readJsonFiles<SignatureProfile>(zip, 'presets');
  const themes = await readJsonFiles<ThemeTokens>(zip, 'themes');
  const assetsFolder = zip.folder('assets');
  const assets: Record<string, string> = {};
  if (assetsFolder) {
    const entries = Object.values(assetsFolder.files).filter((file) => !file.dir);
    await Promise.all(
      entries.map(async (entry) => {
        const data = await entry.async('base64');
        assets[entry.name.replace(/^assets\//, '')] = `data:${guessMimeType(entry.name)};base64,${data}`;
      })
    );
  }
  return {
    id: `pack-${Date.now()}`,
    name: 'Imported Pack',
    presets,
    themes,
    assets,
  };
};

const guessMimeType = (name: string) => {
  if (name.endsWith('.png')) return 'image/png';
  if (name.endsWith('.svg')) return 'image/svg+xml';
  return 'application/octet-stream';
};

export const createPackZip = async (manifest: PackManifest): Promise<Blob> => {
  const zip = new JSZip();
  manifest.presets.forEach((preset: SignatureProfile) => {
    zip.file(`presets/${preset.slug}.json`, JSON.stringify(preset, null, 2));
  });
  manifest.themes.forEach((theme: ThemeTokens) => {
    zip.file(`themes/${theme.id}.json`, JSON.stringify(theme, null, 2));
  });
  Object.entries(manifest.assets).forEach(([key, value]) => {
    const assetValue = value as string;
    const [meta, data] = assetValue.split(',', 2);
    const mime = meta.replace(/^data:/, '').replace(/;base64$/, '');
    zip.file(`assets/${key}`, data, { base64: true, binary: true, compression: 'DEFLATE' });
    zip.file(`assets/${key}.mime`, mime);
  });
  return zip.generateAsync({ type: 'blob' });
};

export const applyPackAssets = (profile: SignatureProfile, manifest: PackManifest) => {
  profile.assets = { ...profile.assets, ...manifest.assets };
};

