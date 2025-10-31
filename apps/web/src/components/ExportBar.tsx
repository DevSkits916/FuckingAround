import React, { useMemo, useState } from 'react';
import { useProfilesStore, useActiveProfile } from '../store/useProfilesStore';
import { encodeShareLink } from '../lib/compression';
import { createQrPlaceholder } from '../lib/qr';
import { writeCacheFile } from '../lib/opfs';
import { renderStaticPublish, applyUtms, SignatureProfile, UTMPreset } from '@smart-signature/shared';
import { useI18n } from '../i18n';

export const ExportBar: React.FC = () => {
  const profile = useActiveProfile();
  const { library, shareScrub, setShareScrub } = useProfilesStore((state) => ({
    library: state.library,
    shareScrub: state.shareScrub,
    setShareScrub: state.setShareScrub,
  }));
  const { t } = useI18n();
  const [shareUrl, setShareUrl] = useState('');
  const qr = useMemo(() => (shareUrl ? createQrPlaceholder(shareUrl) : ''), [shareUrl]);
  const [publishMessage, setPublishMessage] = useState('');

  if (!profile) return null;

  const handleShare = () => {
    const preset = library.settings.utmPresets.find(
      (item: UTMPreset) => item.id === profile.settings.utmPresetId
    );
    const prepared = preset ? applyUtms(profile, preset) : profile;
    const hash = encodeShareLink(prepared, shareScrub);
    const url = `${window.location.origin}/#${hash}`;
    setShareUrl(url);
    navigator.clipboard?.writeText(url).catch(() => {});
  };

  const handlePublish = async () => {
    const preparedProfiles = library.profiles.map((item: SignatureProfile) => {
      const preset = library.settings.utmPresets.find(
        (candidate: UTMPreset) => candidate.id === item.settings.utmPresetId
      );
      return preset ? applyUtms(item, preset) : item;
    });
    const result = await renderStaticPublish(preparedProfiles);
    await writeCacheFile('publish/index.html', result.indexHtml);
    await Promise.all(
      Object.entries(result.pages as Record<string, string>).map(([slug, html]) =>
        writeCacheFile(`publish/${slug}`, html)
      )
    );
    setPublishMessage(`Generated ${Object.keys(result.pages).length} pages to offline cache.`);
  };

  return (
    <section className="export-bar" data-testid="export-bar">
      <div className="actions">
        <button type="button" onClick={handleShare}>
          {t('export.share')}
        </button>
        <label className="scrub-toggle">
          <input type="checkbox" checked={shareScrub} onChange={(event) => setShareScrub(event.target.checked)} />
          {t('share.scrub')}
        </label>
        <button type="button" onClick={handlePublish}>
          {t('export.publish')}
        </button>
      </div>
      {shareUrl && (
        <div className="share-output">
          <p>
            {shareUrl}
            <button onClick={() => navigator.clipboard?.writeText(shareUrl)}>{t('export.share')}</button>
          </p>
          {qr && <img src={qr} alt="QR" width={128} height={128} />}
        </div>
      )}
      {publishMessage && <p>{publishMessage}</p>}
    </section>
  );
};

export default ExportBar;
