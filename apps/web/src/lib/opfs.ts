const CACHE_NAMESPACE = 'smartSignature.opfs';

let rootHandle: FileSystemDirectoryHandle | null = null;

const ensureRoot = async () => {
  if (rootHandle) return rootHandle;
  if ('storage' in navigator && 'getDirectory' in navigator.storage) {
    rootHandle = await navigator.storage.getDirectory();
    return rootHandle;
  }
  throw new Error('OPFS not supported');
};

export const writeCacheFile = async (path: string, content: string) => {
  try {
    const root = await ensureRoot();
    const fileHandle = await root.getFileHandle(`${CACHE_NAMESPACE}-${path}`, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(content);
    await writable.close();
  } catch (error) {
    localStorage.setItem(`${CACHE_NAMESPACE}-${path}`, content);
  }
};

export const readCacheFile = async (path: string): Promise<string | null> => {
  try {
    const root = await ensureRoot();
    const fileHandle = await root.getFileHandle(`${CACHE_NAMESPACE}-${path}`, { create: false });
    const file = await fileHandle.getFile();
    return await file.text();
  } catch (error) {
    return localStorage.getItem(`${CACHE_NAMESPACE}-${path}`);
  }
};

