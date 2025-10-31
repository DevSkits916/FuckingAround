import React, { useState } from 'react';

const helpContent = `Phase Three introduces multi-profile libraries, component packs, offline publish, and optional cloud sync. Use the library drawer to add blocks and the render queue to export.`;

export const HelpModal: React.FC = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="help-modal">
      <button type="button" onClick={() => setOpen(true)}>
        Help
      </button>
      {open && (
        <div className="modal">
          <div className="modal-content">
            <p>{helpContent}</p>
            <button type="button" onClick={() => setOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpModal;
