import React from 'react';

export const AlignmentToolbar: React.FC = () => (
  <div className="alignment-toolbar" role="toolbar" aria-label="Alignment">
    <button type="button">Left</button>
    <button type="button">Center</button>
    <button type="button">Right</button>
  </div>
);

export default AlignmentToolbar;
