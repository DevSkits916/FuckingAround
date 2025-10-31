import { create } from 'zustand';
import { nanoid } from 'nanoid';
import type {
  Palette,
  PaletteKey,
  Preset,
  SignatureData,
  SocialLink,
  SocialPlatform,
} from '../types';

const STORAGE_KEY = 'smart-signature-builder-state-v1';

const PALETTES: Record<PaletteKey, Palette> = {
  light: {
    name: 'Light Safe',
    background: '#ffffff',
    text: '#111827',
    subtleText: '#4b5563',
    divider: '#e5e7eb',
  },
  dark: {
    name: 'Midnight Safe',
    background: '#0f172a',
    text: '#e2e8f0',
    subtleText: '#cbd5f5',
    divider: '#1f2937',
  },
};

const baseSignature = (): SignatureData => ({
  name: 'Avery Quinn',
  title: 'Strategic Partnerships',
  phone: '+1 (555) 123-4567',
  email: 'avery@company.com',
  website: 'https://company.com',
  address: '500 Market Street, Suite 12B, San Francisco, CA',
  showAddress: false,
  brandColor: '#2563eb',
  fontFamily: 'Inter, Arial, sans-serif',
  textSize: 15,
  socialLinks: [],
  banner: {
    enabled: false,
    text: 'Support our community fundraiser',
    url: 'https://gofund.me/example',
  },
  terminalTheme: false,
});

const presetData: Preset[] = [
  {
    id: nanoid(),
    name: 'Clean',
    signature: {
      ...baseSignature(),
      brandColor: '#2563eb',
      textSize: 15,
      fontFamily: 'Inter, Arial, sans-serif',
      socialLinks: [
        { id: nanoid(), platform: 'linkedin', url: 'https://linkedin.com/in/avery' },
        { id: nanoid(), platform: 'github', url: 'https://github.com/avery' },
      ],
    },
    palette: 'light',
  },
  {
    id: nanoid(),
    name: 'Terminal Green',
    signature: {
      ...baseSignature(),
      brandColor: '#21f38a',
      fontFamily: '"IBM Plex Mono", monospace',
      textSize: 16,
      terminalTheme: true,
      socialLinks: [{ id: nanoid(), platform: 'github', url: 'https://github.com/avery' }],
    },
    palette: 'dark',
  },
  {
    id: nanoid(),
    name: 'Card Left',
    signature: {
      ...baseSignature(),
      brandColor: '#d97706',
      textSize: 15,
      socialLinks: [{ id: nanoid(), platform: 'x', url: 'https://x.com/avery' }],
      showAddress: true,
    },
    palette: 'light',
  },
  {
    id: nanoid(),
    name: 'Centered Minimal',
    signature: {
      ...baseSignature(),
      brandColor: '#9333ea',
      textSize: 14,
      socialLinks: [{ id: nanoid(), platform: 'instagram', url: 'https://instagram.com/avery' }],
    },
    palette: 'light',
  },
];

interface SignatureState {
  signature: SignatureData;
  palette: PaletteKey;
  palettes: Record<PaletteKey, Palette>;
  presets: Preset[];
  activePresetId?: string;
  setSignature: (patch: Partial<SignatureData>) => void;
  setField: <K extends keyof SignatureData>(key: K, value: SignatureData[K]) => void;
  addSocialLink: () => void;
  updateSocialLink: (id: string, patch: Partial<SocialLink>) => void;
  removeSocialLink: (id: string) => void;
  setLogoDataUrl: (dataUrl?: string) => void;
  setPalette: (palette: PaletteKey) => void;
  applyPreset: (presetId: string) => void;
  reset: () => void;
  duplicatePreset: (name?: string) => void;
}

const getInitialState = () => {
  const stored = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as Pick<
        SignatureState,
        'signature' | 'palette' | 'presets' | 'activePresetId'
      >;
      return {
        signature: parsed.signature,
        palette: parsed.palette,
        presets: parsed.presets ?? presetData,
        activePresetId: parsed.activePresetId,
      };
    } catch (error) {
      console.warn('Failed to parse stored signature state', error);
    }
  }
  return {
    signature: presetData[0].signature,
    palette: presetData[0].palette,
    presets: presetData,
    activePresetId: presetData[0].id,
  };
};

export const useSignatureStore = create<SignatureState>((set, get) => ({
  signature: getInitialState().signature,
  palette: getInitialState().palette,
  palettes: PALETTES,
  presets: getInitialState().presets,
  activePresetId: getInitialState().activePresetId,
  setSignature: (patch) =>
    set((state) => ({
      signature: { ...state.signature, ...patch },
      activePresetId: undefined,
    })),
  setField: (key, value) =>
    set((state) => ({
      signature: { ...state.signature, [key]: value },
      activePresetId: undefined,
    })),
  addSocialLink: () =>
    set((state) => ({
      signature: {
        ...state.signature,
        socialLinks: [
          ...state.signature.socialLinks,
          { id: nanoid(), platform: 'linkedin', url: 'https://linkedin.com' },
        ],
      },
      activePresetId: undefined,
    })),
  updateSocialLink: (id, patch) =>
    set((state) => ({
      signature: {
        ...state.signature,
        socialLinks: state.signature.socialLinks.map((link) =>
          link.id === id ? { ...link, ...patch } : link
        ),
      },
      activePresetId: undefined,
    })),
  removeSocialLink: (id) =>
    set((state) => ({
      signature: {
        ...state.signature,
        socialLinks: state.signature.socialLinks.filter((link) => link.id !== id),
      },
      activePresetId: undefined,
    })),
  setLogoDataUrl: (dataUrl) =>
    set((state) => ({
      signature: { ...state.signature, logoDataUrl: dataUrl },
      activePresetId: undefined,
    })),
  setPalette: (palette) => set({ palette, activePresetId: undefined }),
  applyPreset: (presetId) => {
    const preset = get().presets.find((p) => p.id === presetId);
    if (!preset) return;
    set({
      signature: JSON.parse(JSON.stringify(preset.signature)),
      palette: preset.palette,
      activePresetId: presetId,
    });
  },
  reset: () => {
    const defaults = presetData[0];
    set({
      signature: JSON.parse(JSON.stringify(defaults.signature)),
      palette: defaults.palette,
      activePresetId: defaults.id,
    });
  },
  duplicatePreset: (name) => {
    const state = get();
    const clone: Preset = {
      id: nanoid(),
      name: name || `${state.presets.find((p) => p.id === state.activePresetId)?.name || 'Custom'} Copy`,
      signature: JSON.parse(JSON.stringify(state.signature)),
      palette: state.palette,
    };
    set({ presets: [...state.presets, clone], activePresetId: clone.id });
  },
}));

if (typeof window !== 'undefined') {
  const save = () => {
    const state = useSignatureStore.getState();
    const payload = {
      signature: state.signature,
      palette: state.palette,
      presets: state.presets,
      activePresetId: state.activePresetId,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  };

  useSignatureStore.subscribe(save);
}

export { PALETTES };
