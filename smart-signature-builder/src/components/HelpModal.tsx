interface HelpModalProps {
  open: boolean;
  onClose: () => void;
}

export function HelpModal({ open, onClose }: HelpModalProps) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <h2>Help & Shortcuts</h2>
        <button type="button" onClick={onClose} style={{ float: 'right' }}>
          Close
        </button>
        <section>
          <h3>Keyboard Shortcuts</h3>
          <ul>
            <li>Ctrl/Cmd + Z — Undo</li>
            <li>Ctrl/Cmd + Shift + Z — Redo</li>
            <li>Delete — Remove selected elements</li>
            <li>Arrow keys — Nudge 1px</li>
            <li>Shift + Arrow — Nudge 8px</li>
            <li>Ctrl/Cmd + D — Duplicate selection</li>
          </ul>
        </section>
        <section>
          <h3>Email Client Tips</h3>
          <ul>
            <li>Use table HTML for maximum compatibility with Outlook.</li>
            <li>Always include alt text on images.</li>
            <li>Prefer system fonts and inline styles.</li>
            <li>Keep signature width under 640px.</li>
          </ul>
        </section>
        <section>
          <h3>iPhone Mail Paste</h3>
          <ol>
            <li>Export the HTML signature.</li>
            <li>Send it to your phone via AirDrop or email.</li>
            <li>Copy the rendered signature from Safari.</li>
            <li>Paste into iOS Mail signature settings.</li>
          </ol>
        </section>
      </div>
    </div>
  );
}
