import { describe, expect, it } from 'vitest';
import { evaluateThemeContrast } from '../contrast';
import { getDefaultSignatureState } from '../../store/useSignatureStore';

describe('contrast checker', () => {
  it('flags low contrast combinations', () => {
    const state = getDefaultSignatureState();
    state.theme.text = '#f5f5f5';
    state.theme.background = '#f6f6f6';
    const results = evaluateThemeContrast(state);
    const textResult = results.find((result) => result.id === 'text');
    expect(textResult?.meetsAA).toBe(false);
  });
});
