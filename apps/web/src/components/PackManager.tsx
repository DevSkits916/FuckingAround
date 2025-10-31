import React, { useRef, useState } from 'react';
import { useProfilesStore } from '../store/useProfilesStore';
import { useI18n } from '../i18n';

export const PackManager: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { library, importPack, exportPack } = useProfilesStore((state) => ({
    library: state.library,
    importPack: state.importPack,
    exportPack: state.exportPack,
  }));
  const { t } = useI18n();
  const [message, setMessage] = useState('');

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const { manifest, warnings } = await importPack(file);
    setMessage(`Imported ${manifest.presets.length} presets. ${warnings.join(' ')}`);
  };

  const handleExport = async () => {
    const blob = await exportPack(library.profiles);
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'pack.zip';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const packs: typeof library.packs = library.packs;

  return (
    <section className="panel" data-testid="pack-manager">
      <h3>{t('pack.manager')}</h3>
      <div className="actions">
        <button type="button" onClick={() => fileInputRef.current?.click()}>
          {t('profiles.import')}
        </button>
        <button type="button" onClick={handleExport}>
          {t('profiles.export')}
        </button>
      </div>
      <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleImport} accept="application/zip" />
      <ul>
        {packs.map((pack: typeof packs[number]) => (
          <li key={pack.id}>
            <strong>{pack.name}</strong> ({pack.presets.length} presets / {pack.themes.length} themes)
          </li>
        ))}
      </ul>
      {message && <p>{message}</p>}
    </section>
  );
};

export default PackManager;
