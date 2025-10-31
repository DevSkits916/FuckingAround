import { create } from 'zustand';

interface SettingsState {
  renderMode: 'table' | 'modern';
  setRenderMode: (mode: 'table' | 'modern') => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  renderMode: 'table',
  setRenderMode: (mode) => set({ renderMode: mode }),
}));
