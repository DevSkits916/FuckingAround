import { useState } from 'react';
import { exportHtml } from '../lib/exportHtml';
import { exportPng } from '../lib/exportPng';
import { useSignatureStore } from '../store/useSignatureStore';
import { SignatureConfigExport } from '../types';

interface ExportBarProps {
  previewRef: React.RefObject<HTMLDivElement>;
}

function download(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

export function ExportBar({ previewRef }: ExportBarProps) {
  const state = useSignatureStore((store) => store.state);
  const [status, setStatus] = useState<string>('');

  const handleHtmlExport = (mode: 'modern' | 'table' | 'single') => {
    const result = exportHtml(state);
    if (mode === 'modern') {
      download('signature-modern.html', result.modern, 'text/html');
    } else if (mode === 'table') {
      download('signature-table.html', result.table, 'text/html');
    } else {
      download('signature-single.html', result.singleFile, 'text/html');
    }
    setStatus(`Exported ${mode} HTML.`);
  };

  const handlePngExport = async (scale: number) => {
    if (!previewRef.current) {
      setStatus('Preview not ready for PNG export.');
      return;
    }
    try {
      const uri = await exportPng(previewRef.current, state, {
        scale,
        watermark: true,
      });
      const link = document.createElement('a');
      link.href = uri;
      link.download = `signature-${scale}x.png`;
      link.click();
      setStatus(`Exported ${scale}x PNG.`);
    } catch (error) {
      setStatus('Failed to export PNG.');
    }
  };

  const handleConfigExport = () => {
    const payload: SignatureConfigExport = {
      schemaVersion: '2.0.0',
      exportedAt: new Date().toISOString(),
      data: state,
    };
    download('signature.signature.json', JSON.stringify(payload, null, 2), 'application/json');
    setStatus('Exported .signature.json');
  };

  return (
    <div className="panel-card">
      <h2>Export</h2>
      <div className="toolbar" style={{ flexWrap: 'wrap' }}>
        <button type="button" onClick={() => handleHtmlExport('table')}>
          HTML (Table)
        </button>
        <button type="button" onClick={() => handleHtmlExport('modern')}>
          HTML (Modern)
        </button>
        <button type="button" onClick={() => handleHtmlExport('single')}>
          Single-file HTML
        </button>
        <button type="button" onClick={() => handlePngExport(2)}>
          PNG 2x
        </button>
        <button type="button" onClick={() => handlePngExport(3)}>
          PNG 3x
        </button>
        <button type="button" onClick={handleConfigExport}>
          Config JSON
        </button>
      </div>
      {status && <div className="shortcut-label">{status}</div>}
    </div>
  );
}
