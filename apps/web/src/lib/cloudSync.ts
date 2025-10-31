import { SignatureLibrary } from '@smart-signature/shared';

const enabled = import.meta.env.VITE_CLOUD_SYNC === 'true';

export const isCloudSyncEnabled = () => enabled;

export interface CloudSyncProvider {
  push: (library: SignatureLibrary) => Promise<void>;
  pull: () => Promise<SignatureLibrary | null>;
}

class ConsoleSync implements CloudSyncProvider {
  async push(library: SignatureLibrary) {
    console.info('[cloud-sync] push', library.profiles.length);
  }
  async pull() {
    console.info('[cloud-sync] pull');
    return null;
  }
}

const provider: CloudSyncProvider | null = enabled ? new ConsoleSync() : null;

export const syncLibrary = async (library: SignatureLibrary) => {
  if (!provider) return;
  await provider.push(library);
};

export const fetchLibrary = async () => {
  if (!provider) return null;
  return provider.pull();
};

