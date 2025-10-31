import { describe, expect, it } from 'vitest';
import { exportHtml } from '../exportHtml';
import { getDefaultSignatureState } from '../../store/useSignatureStore';

function createState() {
  const state = getDefaultSignatureState();
  state.identity.name = 'Test User';
  state.nodes.push({
    id: 'img',
    type: 'image',
    x: 0,
    y: 0,
    alt: 'Logo',
    dataUri: 'data:image/png;base64,ZmFrZQ==',
    maxWidth: 120,
  });
  return state;
}

describe('exportHtml', () => {
  it('includes inline data URIs and alt attributes in table export', () => {
    const state = createState();
    const result = exportHtml(state);
    expect(result.table).toContain('data:image/png;base64,ZmFrZQ==');
    expect(result.table).toContain('alt="Logo"');
  });
});
