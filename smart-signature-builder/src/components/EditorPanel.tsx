import { ChangeEvent } from 'react';
import { useSignatureStore } from '../store/signatureStore';
import type { SocialPlatform } from '../types';

const fonts = [
  'Inter, Arial, sans-serif',
  'Helvetica Neue, Arial, sans-serif',
  'Georgia, serif',
  'Roboto, Arial, sans-serif',
  '"IBM Plex Mono", monospace',
  '"Courier New", monospace',
];

const socialPlatforms: { value: SocialPlatform; label: string }[] = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'x', label: 'X / Twitter' },
  { value: 'reddit', label: 'Reddit' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'github', label: 'GitHub' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'venmo', label: 'Venmo' },
  { value: 'cashapp', label: 'Cash App' },
  { value: 'chime', label: 'Chime' },
  { value: 'gofundme', label: 'GoFundMe' },
];

export function EditorPanel() {
  const signature = useSignatureStore((state) => state.signature);
  const setField = useSignatureStore((state) => state.setField);
  const addSocial = useSignatureStore((state) => state.addSocialLink);
  const updateSocial = useSignatureStore((state) => state.updateSocialLink);
  const removeSocial = useSignatureStore((state) => state.removeSocialLink);
  const setLogo = useSignatureStore((state) => state.setLogoDataUrl);

  const handleLogoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setLogo(undefined);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setLogo(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <aside className="editor-panel">
      <h2>Identity</h2>
      <div className="field-group">
        <label htmlFor="name">Full name</label>
        <input
          id="name"
          value={signature.name}
          onChange={(event) => setField('name', event.target.value)}
          placeholder="Your name"
        />
      </div>
      <div className="field-group">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          value={signature.title}
          onChange={(event) => setField('title', event.target.value)}
          placeholder="Role or position"
        />
      </div>
      <div className="field-row">
        <div className="field-group">
          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            value={signature.phone}
            onChange={(event) => setField('phone', event.target.value)}
            placeholder="Phone number"
          />
        </div>
        <div className="field-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            value={signature.email}
            onChange={(event) => setField('email', event.target.value)}
            placeholder="Email address"
          />
        </div>
      </div>
      <div className="field-group">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          value={signature.website}
          onChange={(event) => setField('website', event.target.value)}
          placeholder="https://example.com"
        />
      </div>
      <div className="toggle-row">
        <label htmlFor="show-address">Include address</label>
        <input
          id="show-address"
          type="checkbox"
          className="checkbox"
          checked={signature.showAddress}
          onChange={(event) => setField('showAddress', event.target.checked)}
        />
      </div>
      {signature.showAddress && (
        <div className="field-group">
          <label htmlFor="address">Address</label>
          <textarea
            id="address"
            value={signature.address}
            onChange={(event) => setField('address', event.target.value)}
            rows={2}
          />
        </div>
      )}

      <h2>Brand</h2>
      <div className="field-row">
        <div className="field-group">
          <label htmlFor="brand-color">Accent color</label>
          <input
            id="brand-color"
            type="color"
            value={signature.brandColor}
            onChange={(event) => setField('brandColor', event.target.value)}
          />
        </div>
        <div className="field-group">
          <label htmlFor="text-size">Text size</label>
          <input
            id="text-size"
            type="number"
            min={12}
            max={20}
            value={signature.textSize}
            onChange={(event) => setField('textSize', Number(event.target.value))}
          />
        </div>
      </div>
      <div className="field-group">
        <label htmlFor="font-family">Font</label>
        <select
          id="font-family"
          value={signature.fontFamily}
          onChange={(event) => setField('fontFamily', event.target.value)}
        >
          {fonts.map((font) => (
            <option key={font} value={font}>
              {font}
            </option>
          ))}
        </select>
      </div>

      <h2>Logo</h2>
      <div className="logo-preview">
        <input type="file" accept="image/*" onChange={handleLogoUpload} />
        {signature.logoDataUrl && <img src={signature.logoDataUrl} alt="Logo preview" />}
        {signature.logoDataUrl && (
          <button type="button" onClick={() => setLogo(undefined)}>
            Remove
          </button>
        )}
      </div>

      <h2>Social Links</h2>
      <div className="social-list">
        {signature.socialLinks.map((link) => (
          <div key={link.id} className="social-item">
            <select
              value={link.platform}
              onChange={(event) =>
                updateSocial(link.id, { platform: event.target.value as SocialPlatform })
              }
            >
              {socialPlatforms.map((platform) => (
                <option key={platform.value} value={platform.value}>
                  {platform.label}
                </option>
              ))}
            </select>
            <input
              value={link.url}
              onChange={(event) => updateSocial(link.id, { url: event.target.value })}
              placeholder="https://"
            />
            <button type="button" onClick={() => removeSocial(link.id)}>
              ✕
            </button>
          </div>
        ))}
        <button type="button" className="add-social" onClick={addSocial}>
          ＋ Social Link
        </button>
      </div>

      <h2>Banner</h2>
      <div className="toggle-row">
        <label htmlFor="banner-enabled">Show banner</label>
        <input
          id="banner-enabled"
          type="checkbox"
          className="checkbox"
          checked={signature.banner.enabled}
          onChange={(event) =>
            setField('banner', { ...signature.banner, enabled: event.target.checked })
          }
        />
      </div>
      {signature.banner.enabled && (
        <div className="banner-preview">
          <input
            value={signature.banner.text}
            onChange={(event) =>
              setField('banner', { ...signature.banner, text: event.target.value })
            }
            placeholder="Banner text"
          />
          <input
            value={signature.banner.url}
            onChange={(event) =>
              setField('banner', { ...signature.banner, url: event.target.value })
            }
            placeholder="https://"
          />
        </div>
      )}

      <h2>Extras</h2>
      <div className="toggle-row">
        <label htmlFor="terminal-theme">Terminal theme</label>
        <input
          id="terminal-theme"
          type="checkbox"
          className="checkbox"
          checked={signature.terminalTheme}
          onChange={(event) => setField('terminalTheme', event.target.checked)}
        />
      </div>
    </aside>
  );
}
