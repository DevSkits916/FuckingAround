import React from 'react';
import {
  SignatureComponent,
  AvatarComponent,
  ContactComponent,
  SocialRowComponent,
  BannerComponent,
  CustomHtmlComponent,
} from '@smart-signature/shared';
import { useActiveProfile, useProfilesStore } from '../store/useProfilesStore';

const ComponentEditor: React.FC<{ component: SignatureComponent; onChange: (component: SignatureComponent) => void }> = ({
  component,
  onChange,
}) => {
  switch (component.componentType) {
    case 'avatar':
      const avatar = component as AvatarComponent;
      const avatarData = avatar.data;
      return (
        <div className="component-card" data-testid="component-avatar">
          <h4>Avatar</h4>
          <label>
            Image URL
            <input
              type="url"
              value={avatarData.image ?? ''}
              onChange={(event) => onChange({ ...avatar, data: { ...avatarData, image: event.target.value } })}
            />
          </label>
          <label>
            Alt text
            <input
              type="text"
              value={avatarData.alt ?? ''}
              onChange={(event) => onChange({ ...avatar, data: { ...avatarData, alt: event.target.value } })}
            />
          </label>
        </div>
      );
    case 'contact':
      const contact = component as ContactComponent;
      const contactData = contact.data;
      return (
        <div className="component-card" data-testid="component-contact">
          <h4>Contact</h4>
          <label>
            Name
            <input value={contactData.name ?? ''} onChange={(event) => onChange({ ...contact, data: { ...contactData, name: event.target.value } })} />
          </label>
          <label>
            Email
            <input value={contactData.email ?? ''} onChange={(event) => onChange({ ...contact, data: { ...contactData, email: event.target.value } })} />
          </label>
        </div>
      );
    case 'socialRow':
      const social = component as SocialRowComponent;
      const socialData = social.data;
      const links: SocialRowComponent['data']['links'] = socialData.links;
      return (
        <div className="component-card" data-testid="component-social">
          <h4>Social Links</h4>
          <button
            type="button"
            onClick={() => {
              const next = {
                ...socialData,
                links: [
                  ...socialData.links,
                  { id: Date.now().toString(), label: 'Link', url: 'https://example.com' },
                ],
              };
              onChange({ ...social, data: next });
            }}
          >
            Add link
          </button>
          <ul>
            {links.map((link: SocialRowComponent['data']['links'][number], index: number) => (
                <li key={link.id}>
                  <input
                    value={link.label}
                    onChange={(event) => {
                    const next = [...links];
                      next[index] = { ...link, label: event.target.value };
                    onChange({ ...social, data: { ...socialData, links: next } });
                    }}
                  />
                <input
                  value={link.url}
                  onChange={(event) => {
                    const next = [...links];
                    next[index] = { ...link, url: event.target.value };
                    onChange({ ...social, data: { ...socialData, links: next } });
                  }}
                />
              </li>
            ))}
          </ul>
        </div>
      );
    case 'banner':
      const banner = component as BannerComponent;
      const bannerData = banner.data;
      return (
        <div className="component-card" data-testid="component-banner">
          <h4>Banner</h4>
          <label>
            Image URL
            <input value={bannerData.image ?? ''} onChange={(event) => onChange({ ...banner, data: { ...bannerData, image: event.target.value } })} />
          </label>
          <label>
            Link URL
            <input value={bannerData.link ?? ''} onChange={(event) => onChange({ ...banner, data: { ...bannerData, link: event.target.value } })} />
          </label>
        </div>
      );
    case 'customHtml':
      const custom = component as CustomHtmlComponent;
      const customData = custom.data;
      return (
        <div className="component-card" data-testid="component-custom">
          <h4>Custom HTML</h4>
          <textarea
            value={customData.html ?? ''}
            onChange={(event) => onChange({ ...custom, data: { ...customData, html: event.target.value } })}
          />
        </div>
      );
    default:
      return null;
  }
};

export const Canvas: React.FC = () => {
  const profile = useActiveProfile();
  const updateProfile = useProfilesStore((state) => state.updateProfile);

  if (!profile) return null;

  return (
    <section className="canvas" data-testid="canvas">
      <h3>Canvas</h3>
      {profile.components.length === 0 && <p>No components yet. Use the library to add blocks.</p>}
      {profile.components.map((component: SignatureComponent) => (
        <ComponentEditor
          key={component.id}
          component={component}
          onChange={(updated) =>
            updateProfile(profile.id, (next) => {
              const index = next.components.findIndex((item: SignatureComponent) => item.id === component.id);
              if (index >= 0) {
                next.components[index] = updated;
              }
            })
          }
        />
      ))}
    </section>
  );
};

export default Canvas;
