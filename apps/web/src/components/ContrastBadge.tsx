import React from 'react';

export const ContrastBadge: React.FC<{ status: 'pass' | 'warn' }> = ({ status }) => (
  <span className={`contrast-badge ${status}`}>{status === 'pass' ? 'AA' : '⚠️'}</span>
);

export default ContrastBadge;
