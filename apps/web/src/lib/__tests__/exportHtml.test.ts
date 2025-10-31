import { describe, it, expect } from 'vitest';
import { createProfile } from '@smart-signature/shared';
import { exportTableHtml } from '../exportHtml';

describe('exportHtml', () => {
  it('ensures alt text is included for avatars', () => {
    const profile = createProfile('Alt Test');
    profile.components.push({
      id: 'avatar-1',
      componentType: 'avatar',
      data: { image: 'data:image/png;base64,aaa', shape: 'circle', size: 'md', alt: '' },
    } as any);
    const html = exportTableHtml(profile);
    expect(html).toContain('alt=');
  });
});
