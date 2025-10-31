import React, { useEffect, useState } from 'react';
import ProfilesDrawer from './components/ProfilesDrawer';
import EditorPanel from './components/EditorPanel';
import AlignmentToolbar from './components/AlignmentToolbar';
import ExportBar from './components/ExportBar';
import LibraryPanel from './components/LibraryPanel';
import LinkBuilder from './components/LinkBuilder';
import PackManager from './components/PackManager';
import RenderQueue from './components/RenderQueue';
import ImportPanel from './components/ImportPanel';
import HelpModal from './components/HelpModal';
import { useProfilesStore } from './store/useProfilesStore';
import { useI18n } from './i18n';
import { isCloudSyncEnabled } from './lib/cloudSync';

const App: React.FC = () => {
  const { locale, setLocale, t } = useI18n();
  const telemetry = useProfilesStore((state) => state.telemetry);
  const [updateReady, setUpdateReady] = useState(false);

  useEffect(() => {
    const handler = () => setUpdateReady(true);
    document.addEventListener('ssb:update-ready', handler);
    return () => document.removeEventListener('ssb:update-ready', handler);
  }, []);

  return (
    <div className="app-shell">
      <ProfilesDrawer />
      <main>
        <header className="app-header">
          <div>
            <h1>{t('app.title')}</h1>
            <p>{t('app.offline')}</p>
          </div>
          <div className="header-actions">
            <label>
              {t('language.switch')}
              <select value={locale} onChange={(event) => setLocale(event.target.value as 'en' | 'es')}>
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
            </label>
            {isCloudSyncEnabled() && <span className="badge">{t('cloud.sync')}</span>}
            <HelpModal />
          </div>
        </header>
        {updateReady && (
          <div className="update-banner">
            <span>Update available</span>
            <button type="button" onClick={() => window.location.reload()}>
              Reload
            </button>
          </div>
        )}
        <EditorPanel />
        <AlignmentToolbar />
        <ExportBar />
        <LibraryPanel />
        <LinkBuilder />
        <PackManager />
        <ImportPanel />
        <RenderQueue />
        <section className="panel telemetry" data-testid="telemetry-panel">
          <h3>{t('telemetry.title')}</h3>
          <ul>
            {telemetry.map((entry) => (
              <li key={entry.id}>
                {entry.profileId} – {entry.renderDurationMs}ms – {entry.htmlBytes} HTML bytes
              </li>
            ))}
            {telemetry.length === 0 && <li>No telemetry recorded yet.</li>}
          </ul>
        </section>
      </main>
    </div>
  );
};

export default App;
