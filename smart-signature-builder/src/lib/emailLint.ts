import { EmailLintWarning, SignatureState } from '../types';

const MAX_IMAGE_WIDTH = 640;

function warn(id: string, message: string, fix?: string): EmailLintWarning {
  return { id, message, fix, severity: 'warning' };
}

export function lintSignature(state: SignatureState): EmailLintWarning[] {
  const warnings: EmailLintWarning[] = [];

  state.nodes.forEach((node) => {
    if (node.type === 'image') {
      if (node.maxWidth && node.maxWidth > MAX_IMAGE_WIDTH) {
        warnings.push(
          warn(
            `image-width-${node.id}`,
            'Images wider than 640px may be clipped in email clients.',
            'Reduce the image width or enable scaling.',
          ),
        );
      }
      if (!node.alt) {
        warnings.push(
          warn(
            `image-alt-${node.id}`,
            'Provide alt text for all images to improve accessibility.',
            'Add descriptive alt text in the media settings.',
          ),
        );
      }
    }

    if (node.type === 'customHtml' && /<(video|script)/i.test(node.html)) {
      warnings.push(
        warn(
          `html-block-${node.id}`,
          'Embedded <video> or <script> tags are blocked by most email clients.',
          'Replace with a static image or link to external content.',
        ),
      );
    }
  });

  state.social.forEach((link) => {
    if (/^https?:\/\//.test(link.url) === false && !/^mailto:|^tel:/.test(link.url)) {
      warnings.push(
        warn(
          `link-format-${link.id}`,
          'Links should start with https://, mailto:, or tel: to be email-safe.',
          'Update the link to use an explicit protocol.',
        ),
      );
    }
  });

  if (state.theme.baseFont !== 'system') {
    warnings.push({
      id: 'font-fallback',
      severity: 'info',
      message: 'Custom font stacks fall back to system fonts in email clients.',
      fix: 'Ensure your design still looks great with system defaults.',
    });
  }

  return warnings;
}
