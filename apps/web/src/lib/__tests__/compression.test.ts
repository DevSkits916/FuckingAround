import { describe, it, expect } from 'vitest';
import { encodeShareLink, decodeShareLink } from '../compression';
import { createProfile } from '@smart-signature/shared';

describe('compression', () => {
  it('round trips a profile via share link hash', () => {
    const profile = createProfile('Test Profile');
    const hash = encodeShareLink(profile, true);
    expect(hash).toBeTypeOf('string');
    const decoded = decodeShareLink(hash);
    expect(decoded?.name).toBe(profile.name);
  });
});
