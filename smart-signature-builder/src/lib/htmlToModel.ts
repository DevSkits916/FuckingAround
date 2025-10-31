import { getDefaultSignatureState } from '../store/useSignatureStore';
import { ImportResult, SignatureElement } from '../types';

function createParser(): DOMParser {
  if (typeof window !== 'undefined' && typeof window.DOMParser !== 'undefined') {
    return new window.DOMParser();
  }
  return new DOMParser();
}

function extractTextContent(element: Element | null) {
  return element ? element.textContent?.trim() ?? '' : '';
}

function buildImageElement(img: HTMLImageElement): SignatureElement {
  return {
    id: crypto.randomUUID(),
    type: 'image',
    x: 0,
    y: 0,
    alt: img.alt || 'Signature image',
    dataUri: img.src,
    originalUrl: img.src,
    maxWidth: img.width || undefined,
  };
}

export function htmlToModel(html: string): ImportResult {
  const parser = createParser();
  const doc = parser.parseFromString(html, 'text/html');
  const state = getDefaultSignatureState();
  const warnings: string[] = [];

  const root = doc.body;
  const maybeName = root.querySelector('strong, b, h1, h2');
  const maybeTitle = root.querySelector('em, i, h3, h4');
  state.identity.name = extractTextContent(maybeName) || state.identity.name;
  state.identity.title = extractTextContent(maybeTitle) || state.identity.title;

  root.querySelectorAll('a[href]').forEach((anchor) => {
    const href = anchor.getAttribute('href') ?? '';
    const text = anchor.textContent?.trim() ?? '';
    if (href.startsWith('mailto:')) {
      state.identity.email = href.replace('mailto:', '');
    } else if (href.startsWith('tel:')) {
      state.identity.phone = text || href.replace('tel:', '');
    } else if (!state.identity.website) {
      state.identity.website = href;
    } else {
      state.social.push({
        id: crypto.randomUUID(),
        label: text || 'Link',
        platform: 'custom',
        url: href,
      });
    }
  });

  root.querySelectorAll('img').forEach((img) => {
    try {
      state.nodes.push(buildImageElement(img));
    } catch (error) {
      warnings.push('Failed to capture an image element; keeping original HTML.');
      state.nodes.push({
        id: crypto.randomUUID(),
        type: 'customHtml',
        x: 0,
        y: state.nodes.length * 20,
        html: img.outerHTML,
      });
    }
  });

  // capture paragraphs as custom text blocks when not part of identity
  root.querySelectorAll('p').forEach((p) => {
    const text = p.textContent?.trim();
    if (!text) return;
    if (!state.identity.tagline) {
      state.identity.tagline = text;
      return;
    }
    state.nodes.push({
      id: crypto.randomUUID(),
      type: 'text',
      x: 0,
      y: state.nodes.length * 24,
      text,
    });
  });

  if (!root.children.length) {
    warnings.push('The provided HTML did not contain recognizable elements.');
  } else {
    const preserved = Array.from(root.children)
      .filter((el) => el.tagName.toLowerCase() === 'table' || el.tagName.toLowerCase() === 'div')
      .map((el) => el.outerHTML)
      .join('');
    if (preserved) {
      state.nodes.push({
        id: crypto.randomUUID(),
        type: 'customHtml',
        x: 0,
        y: state.nodes.length * 20,
        html: preserved,
      });
    }
  }

  return { state, warnings };
}
