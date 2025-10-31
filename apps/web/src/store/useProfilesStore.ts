import create from 'zustand';
import { immer } from 'zustand/middleware/immer';
import {
  SignatureLibrary,
  SignatureProfile,
  createLibrary,
  createProfile,
  upsertProfile,
  deleteProfile as removeProfile,
  duplicateProfile,
  serializeProfiles,
  deserializeProfiles,
  PackManifest,
  validatePack,
  mergeLibrary,
  UTMPreset,
  applyUtms,
} from '@smart-signature/shared';
import { applyPackAssets, createPackZip, parsePackZip } from '../lib/packs';
import { persistLibrary, loadLibrary } from '../lib/storage';
import { enqueueRender, RenderRequest, RenderResult } from '../lib/renderQueue';
import { logTelemetry, TelemetryEntry } from '../lib/analyticsLocal';

export interface RenderJob {
  id: string;
  profileId: string;
  status: 'queued' | 'running' | 'complete' | 'error';
  progress: number;
  result?: RenderResult;
  error?: string;
}

interface ProfilesState {
  library: SignatureLibrary;
  activeProfileId: string;
  renderJobs: RenderJob[];
  telemetry: TelemetryEntry[];
  shareScrub: boolean;
  setActiveProfile: (profileId: string) => void;
  createProfile: (name?: string) => void;
  duplicateProfile: (profileId: string) => void;
  renameProfile: (profileId: string, name: string) => void;
  deleteProfile: (profileId: string) => void;
  updateProfile: (profileId: string, updater: (profile: SignatureProfile) => void) => void;
  exportProfiles: (profileIds?: string[]) => string;
  importProfiles: (payload: string) => void;
  exportPack: (profiles: SignatureProfile[]) => Promise<Blob>;
  importPack: (file: File | Blob) => Promise<{ manifest: PackManifest; warnings: string[] }>;
  setShareScrub: (value: boolean) => void;
  queueRender: (request: RenderRequest) => Promise<void>;
  addUtmPreset: (preset: Omit<UTMPreset, 'id'>) => void;
  removeUtmPreset: (presetId: string) => void;
  selectUtmPresetForProfile: (profileId: string, presetId: string | undefined) => void;
}

const defaultLibrary = loadLibrary() ?? createLibrary();
const defaultProfileId = defaultLibrary.profiles[0]?.id ?? createProfile().id;

export const useProfilesStore = create<ProfilesState>()(
  immer((set, get) => ({
    library: defaultLibrary,
    activeProfileId: defaultProfileId,
    renderJobs: [],
    telemetry: [],
    shareScrub: false,
    setActiveProfile: (profileId) => {
      set((state) => {
        state.activeProfileId = profileId;
      });
    },
    createProfile: (name) => {
      set((state) => {
        const profile = createProfile(name);
        state.library.profiles.push(profile);
        state.activeProfileId = profile.id;
        persistLibrary(state.library);
      });
    },
    duplicateProfile: (profileId) => {
      set((state) => {
        const profile = state.library.profiles.find(
          (item: SignatureProfile) => item.id === profileId
        );
        if (!profile) return;
        const copy = duplicateProfile(profile);
        state.library.profiles.push(copy);
        state.activeProfileId = copy.id;
        persistLibrary(state.library);
      });
    },
    renameProfile: (profileId, name) => {
      set((state) => {
        const profile = state.library.profiles.find(
          (item: SignatureProfile) => item.id === profileId
        );
        if (!profile) return;
        profile.name = name;
        persistLibrary(state.library);
      });
    },
    deleteProfile: (profileId) => {
      set((state) => {
        state.library = removeProfile(state.library, profileId);
        if (state.activeProfileId === profileId) {
          state.activeProfileId = state.library.profiles[0]?.id ?? createProfile().id;
        }
        persistLibrary(state.library);
      });
    },
    updateProfile: (profileId, updater) => {
      set((state) => {
        const profile = state.library.profiles.find(
          (item: SignatureProfile) => item.id === profileId
        );
        if (!profile) return;
        updater(profile);
        state.library = upsertProfile(state.library, profile);
        persistLibrary(state.library);
      });
    },
    exportProfiles: (profileIds) => {
      const { library } = get();
        const profiles = profileIds?.length
          ? library.profiles.filter((profile: SignatureProfile) => profileIds.includes(profile.id))
          : library.profiles;
      return serializeProfiles(profiles);
    },
    importProfiles: (payload) => {
      set((state) => {
        const imported = deserializeProfiles(payload);
        imported.forEach((profile: SignatureProfile) => {
          state.library = upsertProfile(state.library, profile);
        });
        persistLibrary(state.library);
      });
    },
    exportPack: async (profiles) => {
      const manifest: PackManifest = {
        id: `pack-${Date.now()}`,
        name: 'Custom Pack',
        presets: profiles,
        themes: profiles.map((profile) => profile.theme),
        assets: profiles.reduce((acc, profile) => ({ ...acc, ...profile.assets }), {}),
      };
      return createPackZip(manifest);
    },
    importPack: async (file) => {
      const manifest = await parsePackZip(file);
      const warnings = validatePack(manifest);
      set((state) => {
        state.library = mergeLibrary(state.library, {
          profiles: manifest.presets,
          packs: [...state.library.packs, manifest],
        });
        state.library.profiles.forEach((profile: SignatureProfile) => applyPackAssets(profile, manifest));
        persistLibrary(state.library);
      });
      return { manifest, warnings };
    },
    setShareScrub: (value) => {
      set((state) => {
        state.shareScrub = value;
      });
    },
    addUtmPreset: (preset) => {
      set((state) => {
        const id = `utm-${Date.now()}`;
        state.library.settings.utmPresets.push({ ...preset, id });
        persistLibrary(state.library);
      });
    },
    removeUtmPreset: (presetId) => {
      set((state) => {
        state.library.settings.utmPresets = state.library.settings.utmPresets.filter(
          (preset: UTMPreset) => preset.id !== presetId
        );
        state.library.profiles.forEach((profile: SignatureProfile) => {
          if (profile.settings.utmPresetId === presetId) {
            profile.settings.utmPresetId = undefined;
          }
        });
        persistLibrary(state.library);
      });
    },
    selectUtmPresetForProfile: (profileId, presetId) => {
      set((state) => {
        const profile = state.library.profiles.find(
          (item: SignatureProfile) => item.id === profileId
        );
        if (!profile) return;
        profile.settings.utmPresetId = presetId;
        persistLibrary(state.library);
      });
    },
    queueRender: async (request) => {
      const job: RenderJob = {
        id: request.id,
        profileId: request.profile.id,
        status: 'queued',
        progress: 0,
      };
      set((state) => {
        state.renderJobs.push(job);
      });
      try {
        const preset = request.profile.settings.utmPresetId
          ? get().library.settings.utmPresets.find(
              (item: UTMPreset) => item.id === request.profile.settings.utmPresetId
            )
          : undefined;
        const preparedProfile = preset ? applyUtms(request.profile, preset) : request.profile;
        const result = await enqueueRender({ ...request, profile: preparedProfile }, (progress) => {
          set((state) => {
            const current = state.renderJobs.find((item) => item.id === request.id);
            if (current) {
              current.status = 'running';
              current.progress = progress;
            }
          });
        });
        set((state) => {
          const current = state.renderJobs.find((item) => item.id === request.id);
          if (!current) return;
          current.status = 'complete';
          current.progress = 1;
          current.result = result;
          state.telemetry.push(logTelemetry(request.profile.id, result));
        });
      } catch (error) {
        set((state) => {
          const current = state.renderJobs.find((item) => item.id === request.id);
          if (!current) return;
          current.status = 'error';
          current.error = error instanceof Error ? error.message : String(error);
        });
      }
    },
  }))
);

export const selectActiveProfile = (state: ProfilesState) =>
  state.library.profiles.find(
    (profile: SignatureProfile) => profile.id === state.activeProfileId
  );

export const useActiveProfile = () => useProfilesStore(selectActiveProfile);

export const selectRenderJobs = (state: ProfilesState) => state.renderJobs;

