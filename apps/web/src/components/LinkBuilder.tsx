import React, { useState } from 'react';
import { useActiveProfile, useProfilesStore } from '../store/useProfilesStore';
import { useI18n } from '../i18n';

export const LinkBuilder: React.FC = () => {
  const profile = useActiveProfile();
  const { t } = useI18n();
  const { library, addUtmPreset, removeUtmPreset, selectUtmPresetForProfile } = useProfilesStore(
    (state) => ({
      library: state.library,
      addUtmPreset: state.addUtmPreset,
      removeUtmPreset: state.removeUtmPreset,
      selectUtmPresetForProfile: state.selectUtmPresetForProfile,
    })
  );
  const [form, setForm] = useState({ name: '', campaign: '', source: '', medium: '' });

  if (!profile) return null;

  const presets: typeof library.settings.utmPresets = library.settings.utmPresets;

  return (
    <section className="panel" data-testid="link-builder">
      <h3>{t('link.builder')}</h3>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (!form.name) return;
          addUtmPreset(form);
          setForm({ name: '', campaign: '', source: '', medium: '' });
        }}
      >
        <div className="grid">
          <input
            placeholder="Name"
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
          />
          <input
            placeholder="Campaign"
            value={form.campaign}
            onChange={(event) => setForm((prev) => ({ ...prev, campaign: event.target.value }))}
          />
          <input
            placeholder="Source"
            value={form.source}
            onChange={(event) => setForm((prev) => ({ ...prev, source: event.target.value }))}
          />
          <input
            placeholder="Medium"
            value={form.medium}
            onChange={(event) => setForm((prev) => ({ ...prev, medium: event.target.value }))}
          />
        </div>
        <button type="submit">{t('link.apply')}</button>
      </form>
      <ul className="utm-list">
        {presets.map((preset: typeof presets[number]) => (
          <li key={preset.id}>
            <button
              type="button"
              onClick={() => selectUtmPresetForProfile(profile.id, preset.id)}
              className={profile.settings.utmPresetId === preset.id ? 'active' : ''}
            >
              {preset.name} - {preset.campaign}
            </button>
            <button type="button" onClick={() => removeUtmPreset(preset.id)}>
              ×
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default LinkBuilder;
