import { useProfilesStore } from './useProfilesStore';
import type { SignatureProfile } from '@smart-signature/shared';
import { useSettingsStore } from './settings';

export const useSignature = () => {
  const profile = useProfilesStore((state) =>
    state.library.profiles.find(
      (item: SignatureProfile) => item.id === state.activeProfileId
    )
  );
  const renderMode = useSettingsStore((state) => state.renderMode);
  return { profile, renderMode };
};
