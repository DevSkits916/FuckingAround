import { useMemo } from 'react';
import { EditorPanel } from './components/EditorPanel';
import { Preview } from './components/Preview';
import { ExportBar } from './components/ExportBar';
import { useSignatureStore } from './store/signatureStore';
import { buildSignatureHtml } from './utils/exporters';
import './App.css';

export default function App() {
  const signature = useSignatureStore((state) => state.signature);
  const palette = useSignatureStore((state) => state.palette);

  const html = useMemo(() => buildSignatureHtml(signature, palette), [signature, palette]);

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Smart Signature Builder</h1>
        <p>Create email signatures with confidence.</p>
      </header>
      <main className="app-main">
        <EditorPanel />
        <section className="preview-column">
          <ExportBar html={html} />
          <Preview html={html} />
        </section>
      </main>
    </div>
  );
}
