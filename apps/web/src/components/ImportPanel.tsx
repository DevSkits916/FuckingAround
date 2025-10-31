import React from 'react';

export const ImportPanel: React.FC = () => (
  <section className="panel" data-testid="import-panel">
    <h3>Import</h3>
    <p>Drop `.profiles.json` bundles or `.pack.zip` files anywhere to import.</p>
  </section>
);

export default ImportPanel;
