import React, { useRef } from 'react';
import { useProfilesStore } from '../store/useProfilesStore';
import { useI18n } from '../i18n';

const download = (filename: string, content: string) => {
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
};

export const ProfilesDrawer: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    library,
    activeProfileId,
    setActiveProfile,
    createProfile,
    duplicateProfile,
    renameProfile,
    deleteProfile,
    exportProfiles,
    importProfiles,
  } = useProfilesStore();
  const { t } = useI18n();

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    importProfiles(text);
  };

  const profiles: typeof library.profiles = library.profiles;

  return (
    <aside className="drawer" aria-label={t('profiles.heading')} data-testid="profiles-drawer">
      <header className="drawer-header">
        <h2>{t('profiles.heading')}</h2>
        <button onClick={() => createProfile()}>{t('profiles.create')}</button>
      </header>
      <ul className="profile-list">
        {profiles.map((profile: typeof profiles[number]) => (
          <li key={profile.id} className={profile.id === activeProfileId ? 'active' : ''}>
            <button
              type="button"
              onClick={() => setActiveProfile(profile.id)}
              className="profile-name"
            >
              {profile.name}
            </button>
            <div className="profile-actions">
              <button type="button" onClick={() => duplicateProfile(profile.id)}>
                {t('profiles.duplicate')}
              </button>
              <button
                type="button"
                onClick={() => {
                  const name = prompt(t('profiles.rename'), profile.name);
                  if (name) renameProfile(profile.id, name);
                }}
              >
                {t('profiles.rename')}
              </button>
              <button type="button" onClick={() => deleteProfile(profile.id)}>
                {t('profiles.delete')}
              </button>
            </div>
          </li>
        ))}
      </ul>
      <footer className="drawer-footer">
        <button onClick={() => download('profiles.profiles.json', exportProfiles())}>
          {t('profiles.export')}
        </button>
        <button onClick={() => fileInputRef.current?.click()}>{t('profiles.import')}</button>
        <input
          type="file"
          accept="application/json"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleImport}
        />
      </footer>
    </aside>
  );
};

export default ProfilesDrawer;
