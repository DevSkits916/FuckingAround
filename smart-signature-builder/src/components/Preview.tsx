import { useMemo } from 'react';
import { modelToHtml } from '../lib/modelToHtml';
import { useSignatureStore } from '../store/useSignatureStore';

interface PreviewProps {
  previewRef: React.RefObject<HTMLDivElement>;
}

export function Preview({ previewRef }: PreviewProps) {
  const state = useSignatureStore((store) => store.state);
  const html = useMemo(() => modelToHtml(state, { mode: 'table' }), [state]);
  const modernHtml = useMemo(() => modelToHtml(state, { mode: 'modern' }), [state]);

  return (
    <div className={`preview-card ${state.terminalTheme ? 'terminal' : ''}`}>
      <div
        ref={previewRef}
        dangerouslySetInnerHTML={{ __html: html }}
        style={{ pointerEvents: 'none' }}
      />
      <details style={{ marginTop: 16 }}>
        <summary>Modern HTML</summary>
        <div dangerouslySetInnerHTML={{ __html: modernHtml }} style={{ marginTop: 12 }} />
      </details>
      <details style={{ marginTop: 16 }}>
        <summary>Raw HTML</summary>
        <pre>{html}</pre>
      </details>
    </div>
  );
}
