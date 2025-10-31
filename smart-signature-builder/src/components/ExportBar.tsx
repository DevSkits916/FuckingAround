import { useState } from 'react';
import { toPng } from 'html-to-image';
import { useSignatureStore } from '../store/signatureStore';
import type { PaletteKey } from '../types';

interface ExportBarProps {
  html: string;
}

export function ExportBar({ html }: ExportBarProps) {
  const palettes = useSignatureStore((state) => state.palettes);
  const palette = useSignatureStore((state) => state.palette);
  const setPalette = useSignatureStore((state) => state.setPalette);
  const presets = useSignatureStore((state) => state.presets);
  const activePresetId = useSignatureStore((state) => state.activePresetId);
  const applyPreset = useSignatureStore((state) => state.applyPreset);
  const reset = useSignatureStore((state) => state.reset);
  const duplicatePreset = useSignatureStore((state) => state.duplicatePreset);
  const [status, setStatus] = useState<string | null>(null);

  const handleCopyHtml = async () => {
    try {
      await navigator.clipboard.writeText(html);
      setStatus('HTML copied to clipboard');
    } catch (error) {
      console.error(error);
      setStatus('Unable to copy HTML');
    }
  };

  const handleDownloadHtml = () => {
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'signature.html';
    link.click();
    URL.revokeObjectURL(link.href);
    setStatus('Downloaded signature.html');
  };

  const handleCopyBase64 = async () => {
    const node = document.querySelector('.preview-frame') as HTMLElement | null;
    if (!node) {
      setStatus('Preview not ready');
      return;
    }
    try {
      const dataUrl = await toPng(node, { pixelRatio: 2, skipAutoScale: false, cacheBust: true });
      await navigator.clipboard.writeText(dataUrl);
      setStatus('PNG data URL copied');
    } catch (error) {
      console.error(error);
      setStatus('Failed to render PNG');
    }
  };

  const handlePaletteChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPalette(event.target.value as PaletteKey);
  };

  const handlePresetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    applyPreset(event.target.value);
  };

  const handleDuplicatePreset = () => {
    const name = window.prompt('Name for duplicated preset? Leave blank to auto name.');
    duplicatePreset(name ?? undefined);
  };

  return (
    <div className="export-bar">
      <button type="button" onClick={handleCopyHtml}>
        Copy HTML
      </button>
      <button type="button" onClick={handleDownloadHtml}>
        Download .html
      </button>
      <button type="button" onClick={handleCopyBase64}>
        Copy as Base64 &lt;img&gt;
      </button>
      <select
        className="palette-select"
        value={palette}
        onChange={handlePaletteChange}
        aria-label="Palette"
      >
        {Object.entries(palettes).map(([key, value]) => (
          <option key={key} value={key}>
            {value.name}
          </option>
        ))}
      </select>
      <select value={activePresetId} onChange={handlePresetChange} aria-label="Presets">
        <option value="">Custom</option>
        {presets.map((preset) => (
          <option key={preset.id} value={preset.id}>
            {preset.name}
          </option>
        ))}
      </select>
      <button type="button" className="duplicate-button" onClick={handleDuplicatePreset}>
        Duplicate preset
      </button>
      <button type="button" className="reset-button" onClick={reset}>
        Reset
      </button>
      {status && <span>{status}</span>}
    </div>
  );
}
