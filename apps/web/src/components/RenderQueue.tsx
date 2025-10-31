import React from 'react';
import { nanoid } from 'nanoid';
import { useProfilesStore, RenderJob } from '../store/useProfilesStore';
import { useI18n } from '../i18n';

export const RenderQueue: React.FC = () => {
  const { t } = useI18n();
  const { library, renderJobs, queueRender, shareScrub } = useProfilesStore((state) => ({
    library: state.library,
    renderJobs: state.renderJobs,
    queueRender: state.queueRender,
    shareScrub: state.shareScrub,
  }));

  const handleExportAll = async () => {
    for (const profile of library.profiles) {
      await queueRender({ id: nanoid(), profile, mode: 'table', scrub: shareScrub });
    }
  };

  return (
    <section className="panel render-queue" data-testid="render-queue">
      <h3>{t('export.queue')}</h3>
      <button type="button" onClick={handleExportAll}>
        Export all profiles
      </button>
      <ul>
        {renderJobs.map((job: RenderJob) => (
          <li key={job.id}>
            <strong>{job.profileId}</strong> – {job.status} ({Math.round(job.progress * 100)}%)
            {job.result && (
              <details>
                <summary>Details</summary>
                <div>
                  <p>HTML bytes: {job.result.html.length}</p>
                  <p>PNG bytes: {job.result.png.length}</p>
                  <p>Lint issues: {job.result.lint.length}</p>
                </div>
              </details>
            )}
            {job.error && <p>Error: {job.error}</p>}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default RenderQueue;
