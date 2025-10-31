import React from 'react';
import { nanoid } from 'nanoid';
import { useProfilesStore, useActiveProfile } from '../store/useProfilesStore';
import { useI18n } from '../i18n';

const componentFactories = {
  avatar: () => ({
    id: nanoid(),
    componentType: 'avatar' as const,
    data: { size: 'md' as const, shape: 'circle' as const, alt: 'Avatar' },
  }),
  contact: () => ({
    id: nanoid(),
    componentType: 'contact' as const,
    data: { name: 'Full Name', layout: 'stacked' as const },
  }),
  socialRow: () => ({
    id: nanoid(),
    componentType: 'socialRow' as const,
    data: { links: [], iconSize: 16, gap: 8, separator: 'dot' as const },
  }),
  banner: () => ({
    id: nanoid(),
    componentType: 'banner' as const,
    data: { image: '', alt: 'Banner', link: '' },
  }),
  customHtml: () => ({
    id: nanoid(),
    componentType: 'customHtml' as const,
    data: { html: '<p>Custom HTML</p>' },
  }),
};

export const LibraryPanel: React.FC = () => {
  const profile = useActiveProfile();
  const updateProfile = useProfilesStore((state) => state.updateProfile);
  const { t } = useI18n();

  if (!profile) return null;

  const addComponent = (type: keyof typeof componentFactories) => {
    updateProfile(profile.id, (next) => {
      next.components.push(componentFactories[type]());
    });
  };

  return (
    <section className="panel" data-testid="library-panel">
      <h3>{t('library.heading')}</h3>
      <div className="library-grid">
        <button type="button" onClick={() => addComponent('avatar')}>
          {t('library.avatar')}
        </button>
        <button type="button" onClick={() => addComponent('contact')}>
          {t('library.contact')}
        </button>
        <button type="button" onClick={() => addComponent('socialRow')}>
          {t('library.social')}
        </button>
        <button type="button" onClick={() => addComponent('banner')}>
          {t('library.banner')}
        </button>
        <button type="button" onClick={() => addComponent('customHtml')}>
          {t('library.custom')}
        </button>
      </div>
    </section>
  );
};

export default LibraryPanel;
