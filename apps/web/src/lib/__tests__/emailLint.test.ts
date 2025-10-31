import { describe, it, expect } from 'vitest';
import { lintEmailHtml } from '@smart-signature/shared';

describe('email lint', () => {
  it('flags large images and relative links', () => {
    const html = '<img src="/logo.png" width="800" />';
    const issues: ReturnType<typeof lintEmailHtml> = lintEmailHtml(html);
    expect(issues.some((issue: (typeof issues)[number]) => issue.id === 'img-width')).toBe(true);
    expect(issues.some((issue: (typeof issues)[number]) => issue.id === 'absolute-url')).toBe(true);
  });
});
