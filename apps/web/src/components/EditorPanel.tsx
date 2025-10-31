import React from 'react';
import Canvas from './Canvas';
import Preview from './Preview';

export const EditorPanel: React.FC = () => (
  <div className="editor-panel" data-testid="editor-panel">
    <Canvas />
    <Preview />
  </div>
);

export default EditorPanel;
