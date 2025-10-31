import { useEffect, useMemo, useRef, useState } from 'react';
import { EditorPanel } from './components/EditorPanel';
import { Canvas } from './components/Canvas';
import { AlignmentToolbar } from './components/AlignmentToolbar';
import { ExportBar } from './components/ExportBar';
import { Preview } from './components/Preview';
import { PresetManager } from './components/PresetManager';
import { ImportPanel } from './components/ImportPanel';
import { HelpModal } from './components/HelpModal';
import { ContrastBadge } from './components/ContrastBadge';
import { LinkWarnings } from './components/LinkWarnings';
import { evaluateThemeContrast } from './lib/contrast';
import { lintSignature } from './lib/emailLint';
import { useSignatureStore } from './store/useSignatureStore';
import './styles/globals.css';

export function App() {
  const [helpOpen, setHelpOpen] = useState(false);
  const state = useSignatureStore((store) => store.state);
  const undo = useSignatureStore((store) => store.undo);
  const redo = useSignatureStore((store) => store.redo);
  const nudgeSelected = useSignatureStore((store) => store.nudgeSelected);
  const duplicateSelected = useSignatureStore((store) => store.duplicateSelected);
  const deleteSelected = useSignatureStore((store) => store.deleteSelected);
  const previewRef = useRef<HTMLDivElement>(null);

  const contrast = useMemo(() => evaluateThemeContrast(state), [state]);
  const warnings = useMemo(() => lintSignature(state), [state]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      const { selectedIds, readOnlyPreview } = useSignatureStore.getState().state;
      if (readOnlyPreview) return;
      const isMeta = event.metaKey || event.ctrlKey;
      if (isMeta && event.key.toLowerCase() === 'z') {
        event.preventDefault();
        if (event.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
      if (isMeta && event.key.toLowerCase() === 'd') {
        event.preventDefault();
        duplicateSelected();
      }
      if (!selectedIds.length) return;
      if (event.key === 'Delete' || event.key === 'Backspace') {
        event.preventDefault();
        deleteSelected();
      }
      const step = event.shiftKey ? 8 : 1;
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        nudgeSelected(-step, 0);
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        nudgeSelected(step, 0);
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        nudgeSelected(0, -step);
      }
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        nudgeSelected(0, step);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [undo, redo, duplicateSelected, deleteSelected, nudgeSelected]);

  return (
    <div className="app-shell">
      <header>
        <div>
          <h1>Smart Signature Builder — Phase Two</h1>
          <p>Professional signatures without the backend.</p>
        </div>
        <button type="button" onClick={() => setHelpOpen(true)}>
          Help & Shortcuts
        </button>
      </header>
      <main>
        <div className="editor-column">
          <EditorPanel onOpenHelp={() => setHelpOpen(true)} />
          <ImportPanel />
          <PresetManager />
        </div>
        <div className="canvas-column">
          <AlignmentToolbar />
          <Canvas />
        </div>
        <div className="preview-column">
          <ExportBar previewRef={previewRef} />
          <Preview previewRef={previewRef} />
          <ContrastBadge results={contrast} />
          <LinkWarnings warnings={warnings} />
        </div>
      </main>
      <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  );
}
