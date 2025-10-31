import { useMemo } from 'react';
import { useSignatureStore } from '../store/useSignatureStore';
import { SocialLink } from '../types';

interface EditorPanelProps {
  onOpenHelp: () => void;
}

export function EditorPanel({ onOpenHelp }: EditorPanelProps) {
  const state = useSignatureStore((store) => store.state);
  const setState = useSignatureStore((store) => store.setState);
  const addSocial = useSignatureStore((store) => store.addSocial);
  const updateSocial = useSignatureStore((store) => store.updateSocial);
  const removeSocial = useSignatureStore((store) => store.removeSocial);
  const addCustomField = useSignatureStore((store) => store.addCustomField);
  const updateCustomField = useSignatureStore((store) => store.updateCustomField);
  const removeCustomField = useSignatureStore((store) => store.removeCustomField);
  const toggleGrid = useSignatureStore((store) => store.toggleGrid);
  const toggleSnap = useSignatureStore((store) => store.toggleSnap);
  const toggleAlignmentGuides = useSignatureStore((store) => store.toggleAlignmentGuides);
  const toggleSpacingInspector = useSignatureStore((store) => store.toggleSpacingInspector);
  const toggleReadOnly = useSignatureStore((store) => store.toggleReadOnly);
  const setWatermark = useSignatureStore((store) => store.setWatermark);
  const setTerminalTheme = useSignatureStore((store) => store.setTerminalTheme);
  const undo = useSignatureStore((store) => store.undo);
  const redo = useSignatureStore((store) => store.redo);
  const reset = useSignatureStore((store) => store.reset);

  const handleIdentityChange = (key: keyof typeof state.identity, value: string) => {
    setState((draft) => {
      draft.identity[key] = value;
    });
  };

  const handleThemeChange = <K extends keyof typeof state.theme>(
    key: K,
    value: (typeof state.theme)[K],
  ) => {
    setState((draft) => {
      draft.theme[key] = value as (typeof draft.theme)[K];
    });
  };

  const watermarkEnabled = state.watermark.enabled;

  const socialCount = useMemo(() => state.social.length, [state.social.length]);

  const createSocial = () => {
    addSocial({ label: 'New link', platform: 'custom', url: '' });
  };

  return (
    <div className="panel-card">
      <h2>Identity</h2>
      <div className="field-group">
        <label htmlFor="name">Full Name</label>
        <input
          id="name"
          value={state.identity.name}
          onChange={(event) => handleIdentityChange('name', event.target.value)}
        />
      </div>
      <div className="field-inline">
        <div className="field-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            value={state.identity.title ?? ''}
            onChange={(event) => handleIdentityChange('title', event.target.value)}
          />
        </div>
        <div className="field-group">
          <label htmlFor="secondaryTitle">Secondary Title</label>
          <input
            id="secondaryTitle"
            value={state.identity.secondaryTitle ?? ''}
            onChange={(event) => handleIdentityChange('secondaryTitle', event.target.value)}
          />
        </div>
      </div>
      <div className="field-inline">
        <div className="field-group">
          <label htmlFor="pronouns">Pronouns</label>
          <input
            id="pronouns"
            value={state.identity.pronouns ?? ''}
            onChange={(event) => handleIdentityChange('pronouns', event.target.value)}
          />
        </div>
        <div className="field-group">
          <label htmlFor="tagline">Tagline</label>
          <input
            id="tagline"
            value={state.identity.tagline ?? ''}
            onChange={(event) => handleIdentityChange('tagline', event.target.value)}
          />
        </div>
      </div>
      <div className="field-inline">
        <div className="field-group">
          <label htmlFor="phone">Primary Phone</label>
          <input
            id="phone"
            value={state.identity.phone ?? ''}
            onChange={(event) => handleIdentityChange('phone', event.target.value)}
          />
        </div>
        <div className="field-group">
          <label htmlFor="secondaryPhone">Secondary Phone</label>
          <input
            id="secondaryPhone"
            value={state.identity.secondaryPhone ?? ''}
            onChange={(event) => handleIdentityChange('secondaryPhone', event.target.value)}
          />
        </div>
      </div>
      <div className="field-inline">
        <div className="field-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            value={state.identity.email ?? ''}
            onChange={(event) => handleIdentityChange('email', event.target.value)}
          />
        </div>
        <div className="field-group">
          <label htmlFor="website">Website</label>
          <input
            id="website"
            value={state.identity.website ?? ''}
            onChange={(event) => handleIdentityChange('website', event.target.value)}
          />
        </div>
      </div>
      <div className="field-group">
        <label htmlFor="address">Address</label>
        <textarea
          id="address"
          value={state.identity.address ?? ''}
          onChange={(event) => handleIdentityChange('address', event.target.value)}
        />
      </div>
      <hr style={{ opacity: 0.2, margin: '16px 0' }} />
      <h2>Theme</h2>
      <div className="field-inline">
        <div className="field-group">
          <label htmlFor="baseFont">Base Font</label>
          <select
            id="baseFont"
            value={state.theme.baseFont}
            onChange={(event) =>
              handleThemeChange('baseFont', event.target.value as typeof state.theme.baseFont)
            }
          >
            <option value="system">System UI</option>
            <option value="sans">Sans-serif</option>
            <option value="monospace">Monospace</option>
          </select>
        </div>
        <div className="field-group">
          <label htmlFor="fontSize">Base Size</label>
          <input
            id="fontSize"
            type="number"
            value={state.theme.baseFontSize}
            onChange={(event) => handleThemeChange('baseFontSize', Number(event.target.value))}
          />
        </div>
        <div className="field-group">
          <label htmlFor="lineHeight">Line Height</label>
          <input
            id="lineHeight"
            type="number"
            step="0.1"
            value={state.theme.lineHeight}
            onChange={(event) => handleThemeChange('lineHeight', Number(event.target.value))}
          />
        </div>
      </div>
      <div className="field-inline">
        <div className="field-group">
          <label htmlFor="primary">Primary</label>
          <input
            id="primary"
            type="color"
            value={state.theme.primary}
            onChange={(event) => handleThemeChange('primary', event.target.value)}
          />
        </div>
        <div className="field-group">
          <label htmlFor="textColor">Text</label>
          <input
            id="textColor"
            type="color"
            value={state.theme.text}
            onChange={(event) => handleThemeChange('text', event.target.value)}
          />
        </div>
        <div className="field-group">
          <label htmlFor="subtleText">Subtle Text</label>
          <input
            id="subtleText"
            type="color"
            value={state.theme.subtleText}
            onChange={(event) => handleThemeChange('subtleText', event.target.value)}
          />
        </div>
        <div className="field-group">
          <label htmlFor="divider">Divider</label>
          <input
            id="divider"
            type="color"
            value={state.theme.divider}
            onChange={(event) => handleThemeChange('divider', event.target.value)}
          />
        </div>
      </div>
      <div className="field-group">
        <label htmlFor="background">Background</label>
        <input
          id="background"
          type="color"
          value={state.theme.background}
          onChange={(event) => handleThemeChange('background', event.target.value)}
        />
      </div>
      <hr style={{ opacity: 0.2, margin: '16px 0' }} />
      <h2>Social Links ({socialCount})</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {state.social.map((link) => (
          <div key={link.id} className="panel-card" style={{ padding: '12px' }}>
            <div className="field-group">
              <label>Label</label>
              <input
                value={link.label}
                onChange={(event) =>
                  updateSocial(link.id, (prev: SocialLink) => ({
                    ...prev,
                    label: event.target.value,
                  }))
                }
              />
            </div>
            <div className="field-inline">
              <div className="field-group">
                <label>Platform</label>
                <input
                  value={link.platform}
                  onChange={(event) =>
                    updateSocial(link.id, (prev) => ({
                      ...prev,
                      platform: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="field-group">
                <label>URL</label>
                <input
                  value={link.url}
                  onChange={(event) =>
                    updateSocial(link.id, (prev) => ({
                      ...prev,
                      url: event.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <button type="button" onClick={() => removeSocial(link.id)}>
              Remove
            </button>
          </div>
        ))}
      </div>
      <button type="button" onClick={createSocial} style={{ marginTop: '12px' }}>
        Add Social Link
      </button>
      <hr style={{ opacity: 0.2, margin: '16px 0' }} />
      <h2>Custom Fields</h2>
      {state.customFields.map((field) => (
        <div key={field.id} className="field-inline">
          <div className="field-group">
            <label>Key</label>
            <input
              value={field.key}
              onChange={(event) =>
                updateCustomField(field.id, (prev) => ({
                  ...prev,
                  key: event.target.value,
                }))
              }
            />
          </div>
          <div className="field-group">
            <label>Value</label>
            <input
              value={field.value}
              onChange={(event) =>
                updateCustomField(field.id, (prev) => ({
                  ...prev,
                  value: event.target.value,
                }))
              }
            />
          </div>
          <button type="button" onClick={() => removeCustomField(field.id)}>
            Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={addCustomField} style={{ marginTop: '12px' }}>
        Add Custom Field
      </button>
      <hr style={{ opacity: 0.2, margin: '16px 0' }} />
      <h2>Settings</h2>
      <div className="field-group">
        <label>Canvas Options</label>
        <div className="toolbar">
          <button type="button" onClick={toggleGrid}>
            {state.showGrid ? 'Hide Grid' : 'Show Grid'}
          </button>
          <button type="button" onClick={toggleSnap}>
            {state.snapToGrid ? 'Disable Snap' : 'Enable Snap'}
          </button>
          <button type="button" onClick={toggleAlignmentGuides}>
            {state.snapToAlignment ? 'Hide Guides' : 'Show Guides'}
          </button>
          <button type="button" onClick={toggleSpacingInspector}>
            {state.spacingInspector ? 'Hide Spacing' : 'Show Spacing'}
          </button>
        </div>
      </div>
      <div className="field-group">
        <label>Preview Mode</label>
        <button type="button" onClick={toggleReadOnly}>
          {state.readOnlyPreview ? 'Disable Read-only Preview' : 'Enable Read-only Preview'}
        </button>
      </div>
      <div className="field-inline">
        <div className="field-group">
          <label>Watermark Text</label>
          <input
            value={state.watermark.text}
            onChange={(event) => setWatermark(event.target.value, watermarkEnabled)}
          />
        </div>
        <div className="field-group">
          <label>Watermark Enabled</label>
          <button
            type="button"
            onClick={() => setWatermark(state.watermark.text, !watermarkEnabled)}
          >
            {watermarkEnabled ? 'Disable' : 'Enable'}
          </button>
        </div>
      </div>
      <div className="field-group">
        <label>Terminal Theme</label>
        <button type="button" onClick={() => setTerminalTheme(!state.terminalTheme)}>
          {state.terminalTheme ? 'Disable Terminal' : 'Enable Terminal'}
        </button>
      </div>
      <div className="field-group">
        <label>Keyboard</label>
        <div className="toolbar">
          <button type="button" onClick={undo}>
            Undo (Ctrl+Z)
          </button>
          <button type="button" onClick={redo}>
            Redo (Ctrl+Shift+Z)
          </button>
          <button type="button" onClick={onOpenHelp}>
            Open Help
          </button>
          <button type="button" onClick={reset}>
            Reset App
          </button>
        </div>
      </div>
    </div>
  );
}
