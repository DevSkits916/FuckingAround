import { ChangeEvent, useState } from 'react';
import { htmlToModel } from '../lib/htmlToModel';
import { useSignatureStore } from '../store/useSignatureStore';
import { SignatureConfigExport, PresetFile } from '../types';

async function readFile(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

export function ImportPanel() {
  const replaceState = useSignatureStore((store) => store.replaceState);
  const [messages, setMessages] = useState<string[]>([]);

  const handleHtmlImport = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const html = event.target.value;
    if (!html.trim()) return;
    const result = htmlToModel(html);
    replaceState(result.state);
    setMessages([`Imported HTML with ${result.warnings.length} warnings.`]);
  };

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const content = await readFile(file);
    if (file.name.endsWith('.signature.json')) {
      try {
        const parsed = JSON.parse(content) as SignatureConfigExport;
        replaceState(parsed.data);
        setMessages([`Imported signature config v${parsed.schemaVersion}.`]);
      } catch (error) {
        setMessages(['Failed to parse signature JSON.']);
      }
    } else if (file.name.endsWith('.preset.json')) {
      try {
        const parsed = JSON.parse(content) as PresetFile;
        replaceState(parsed.preset.signature);
        setMessages([`Imported preset ${parsed.preset.name}.`]);
      } catch (error) {
        setMessages(['Failed to parse preset file.']);
      }
    } else if (file.name.endsWith('.html')) {
      const result = htmlToModel(content);
      replaceState(result.state);
      setMessages([`Imported HTML with ${result.warnings.length} warnings.`]);
    } else {
      setMessages(['Unsupported file format.']);
    }
    event.target.value = '';
  };

  return (
    <div className="panel-card">
      <h2>Import</h2>
      <div className="field-group">
        <label>Signature / Preset File</label>
        <input type="file" accept=".signature.json,.preset.json,.html" onChange={handleFile} />
      </div>
      <div className="field-group">
        <label>Paste HTML Signature</label>
        <textarea rows={6} placeholder="Paste signature HTML" onChange={handleHtmlImport} />
      </div>
      {messages.length > 0 && (
        <ul style={{ fontSize: 12, color: 'rgba(148,163,184,0.85)' }}>
          {messages.map((message) => (
            <li key={message}>{message}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
