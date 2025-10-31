import { useEffect, useMemo, useState } from 'react';
import { PRESETS } from '../presets';
import { PresetMeta, PresetFile } from '../types';
import { useSignatureStore } from '../store/useSignatureStore';

const STORAGE_KEY = 'smartSignature.presets';

function download(filename: string, content: string, type = 'application/json') {
  const blob = new Blob([content], { type });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

export function PresetManager() {
  const [customPresets, setCustomPresets] = useState<PresetMeta[]>([]);
  const state = useSignatureStore((store) => store.state);
  const replaceState = useSignatureStore((store) => store.replaceState);

  const clone = <T,>(value: T): T => {
    if (typeof structuredClone === 'function') {
      return structuredClone(value);
    }
    return JSON.parse(JSON.stringify(value)) as T;
  };

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as PresetMeta[];
      setCustomPresets(parsed);
    } catch (error) {
      console.error('Failed to parse presets', error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customPresets));
  }, [customPresets]);

  const allPresets = useMemo(() => [...PRESETS, ...customPresets], [customPresets]);

  const savePreset = () => {
    const name = prompt('Preset name');
    if (!name) return;
    const preset: PresetMeta = {
      id: crypto.randomUUID(),
      name,
      signature: clone(state),
    };
    setCustomPresets((prev) => [...prev, preset]);
  };

  const duplicatePreset = (preset: PresetMeta) => {
    const copy: PresetMeta = {
      id: crypto.randomUUID(),
      name: `${preset.name} Copy`,
      signature: clone(preset.signature),
    };
    setCustomPresets((prev) => [...prev, copy]);
  };

  const exportPreset = (preset: PresetMeta) => {
    const file: PresetFile = {
      version: '2.0.0',
      preset,
    };
    download(`${preset.name.replace(/\s+/g, '-').toLowerCase()}.preset.json`, JSON.stringify(file, null, 2));
  };

  const importPreset = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    try {
      const parsed = JSON.parse(text) as PresetFile;
      setCustomPresets((prev) => [...prev, clone(parsed.preset)]);
    } catch (error) {
      alert('Failed to import preset.');
    }
    event.target.value = '';
  };

  const applyPreset = (preset: PresetMeta) => {
    replaceState(clone(preset.signature));
  };

  return (
    <div className="panel-card">
      <h2>Presets</h2>
      <div className="toolbar" style={{ marginBottom: 12 }}>
        <button type="button" onClick={savePreset}>
          Save Preset
        </button>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          Import
          <input type="file" accept=".preset.json" onChange={importPreset} style={{ display: 'none' }} />
        </label>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {allPresets.map((preset) => (
          <div key={preset.id} className="panel-card" style={{ padding: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{preset.name}</strong>
                {preset.description && (
                  <div style={{ fontSize: 12, color: 'rgba(148,163,184,0.8)' }}>{preset.description}</div>
                )}
              </div>
              <div className="toolbar">
                <button type="button" onClick={() => applyPreset(preset)}>
                  Load
                </button>
                <button type="button" onClick={() => duplicatePreset(preset)}>
                  Duplicate
                </button>
                <button type="button" onClick={() => exportPreset(preset)}>
                  Export
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
