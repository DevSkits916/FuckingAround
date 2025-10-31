import { SignatureLibrary, migrateToV3, ImportableLibrary } from '@smart-signature/shared';

const STORAGE_KEY = 'smartSignature.v3';

export const loadLibrary = (): SignatureLibrary | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ImportableLibrary;
    return migrateToV3(parsed);
  } catch (error) {
    console.warn('Failed to load library', error);
    return null;
  }
};

export const persistLibrary = (library: SignatureLibrary) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(library));
  } catch (error) {
    console.warn('Failed to persist library', error);
  }
};

