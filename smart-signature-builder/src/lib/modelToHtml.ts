import { SignatureState, SocialLink, CustomField } from '../types';
import { sanitizeHtml } from './sanitize';
import { optimizeDataUri } from './dataUri';

export type HtmlMode = 'modern' | 'table';

const FONT_STACKS: Record<SignatureState['theme']['baseFont'], string> = {
  system:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
  sans: "'Helvetica Neue', Arial, 'Liberation Sans', sans-serif",
  monospace: "'SFMono-Regular', 'Fira Code', 'Roboto Mono', monospace",
};

function normalizeLink(link: string) {
  if (!link) return '';
  if (/^mailto:|^tel:|^https?:\/\//i.test(link)) {
    return link;
  }
  if (link.includes('@')) {
    return `mailto:${link}`;
  }
  if (/^[+\d()\s-]+$/.test(link)) {
    return `tel:${link.replace(/[^+\d]/g, '')}`;
  }
  return link.startsWith('//') ? `https:${link}` : `https://${link}`;
}

function renderSocialLinks(links: SocialLink[], color: string) {
  if (!links.length) return '';
  const items = links
    .map((link) => {
      const url = normalizeLink(link.url);
      const label = link.label || link.platform;
      return `<a href="${url}" style="color:${color};text-decoration:none;margin-right:8px;display:inline-flex;align-items:center;gap:6px;">${
        link.customIconDataUri
          ? `<img src="${optimizeDataUri(link.customIconDataUri)}" alt="${label}" width="16" height="16" style="display:inline-block;vertical-align:middle;" />`
          : ''
      }<span>${label}</span></a>`;
    })
    .join('');
  return `<div style="margin-top:8px;">${items}</div>`;
}

function renderCustomFields(fields: CustomField[], color: string) {
  if (!fields.length) return '';
  return `<div style="margin-top:8px;color:${color};">${fields
    .map((field) => `<div><strong>${field.key}:</strong> ${field.value}</div>`)
    .join('')}</div>`;
}

function renderIdentity(state: SignatureState) {
  const { identity, theme } = state;
  const segments = [
    `<div style="font-size:${state.theme.baseFontSize + 2}px;font-weight:600;color:${theme.text};">${
      identity.name
    }</div>`,
  ];
  if (identity.title) {
    segments.push(
      `<div style="color:${theme.subtleText};font-size:${state.theme.baseFontSize}px;">${identity.title}</div>`,
    );
  }
  if (identity.secondaryTitle) {
    segments.push(
      `<div style="color:${theme.subtleText};font-size:${state.theme.baseFontSize}px;">${identity.secondaryTitle}</div>`,
    );
  }
  if (identity.pronouns) {
    segments.push(
      `<div style="color:${theme.subtleText};font-size:${state.theme.baseFontSize - 1}px;">${identity.pronouns}</div>`,
    );
  }
  if (identity.tagline) {
    segments.push(
      `<div style="margin-top:6px;color:${theme.primary};font-size:${state.theme.baseFontSize}px;">${identity.tagline}</div>`,
    );
  }
  if (identity.phone) {
    segments.push(
      `<div style="margin-top:10px;color:${theme.text};"><strong>Phone:</strong> <a href="${normalizeLink(identity.phone)}" style="color:${theme.text};text-decoration:none;">${identity.phone}</a></div>`,
    );
  }
  if (identity.secondaryPhone) {
    segments.push(
      `<div style="color:${theme.text};"><strong>Alt:</strong> <a href="${normalizeLink(identity.secondaryPhone)}" style="color:${theme.text};text-decoration:none;">${identity.secondaryPhone}</a></div>`,
    );
  }
  if (identity.email) {
    segments.push(
      `<div style="color:${theme.text};"><strong>Email:</strong> <a href="${normalizeLink(identity.email)}" style="color:${theme.text};text-decoration:none;">${identity.email}</a></div>`,
    );
  }
  if (identity.website) {
    segments.push(
      `<div style="color:${theme.text};"><strong>Web:</strong> <a href="${normalizeLink(identity.website)}" style="color:${theme.text};text-decoration:none;">${identity.website}</a></div>`,
    );
  }
  if (identity.address) {
    segments.push(
      `<div style="color:${theme.subtleText};margin-top:10px;">${identity.address}</div>`,
    );
  }
  return segments.join('');
}

function renderDynamicNodes(state: SignatureState) {
  return state.nodes
    .map((node) => {
      if (node.type === 'image') {
        return `<div style="margin-top:12px;"><img src="${optimizeDataUri(node.dataUri)}" alt="${node.alt}" style="max-width:${node.maxWidth ?? 200}px; display:block;" /></div>`;
      }
      if (node.type === 'text') {
        return `<div style="margin-top:12px;color:${state.theme.text};font-size:${node.fontSize ?? state.theme.baseFontSize}px;">${node.text}</div>`;
      }
      if (node.type === 'link') {
        const href = normalizeLink(node.href);
        return `<div style="margin-top:12px;"><a href="${href}" style="color:${node.color ?? state.theme.primary};text-decoration:${node.underline ? 'underline' : 'none'};">${node.text}</a></div>`;
      }
      if (node.type === 'divider') {
        const thickness = node.thickness ?? 1;
        const length = node.length ?? 120;
        if (node.direction === 'horizontal') {
          return `<div style="margin:${node.margin?.top ?? 12}px 0;border-bottom:${thickness}px solid ${node.color};width:${length}px;"></div>`;
        }
        return `<div style="margin:${node.margin?.top ?? 12}px 0;border-right:${thickness}px solid ${node.color};height:${length}px;"></div>`;
      }
      if (node.type === 'customHtml') {
        return `<div style="margin-top:12px;">${node.html}</div>`;
      }
      return '';
    })
    .join('');
}

function renderTable(state: SignatureState) {
  const fontStack = FONT_STACKS[state.theme.baseFont];
  const identityHtml = renderIdentity(state);
  const socialHtml = renderSocialLinks(state.social, state.theme.primary);
  const customHtml = renderCustomFields(state.customFields, state.theme.text);
  const dynamic = renderDynamicNodes(state);
  const table = `
  <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;background:${state.theme.background};color:${state.theme.text};font-family:${fontStack};font-size:${state.theme.baseFontSize}px;line-height:${state.theme.lineHeight};">
    <tbody>
      <tr>
        <td style="padding:16px;border:1px solid ${state.theme.divider};">
          ${identityHtml}${socialHtml}${customHtml}${dynamic}
        </td>
      </tr>
    </tbody>
  </table>`;
  return sanitizeHtml(table);
}

function renderModern(state: SignatureState) {
  const fontStack = FONT_STACKS[state.theme.baseFont];
  const identityHtml = renderIdentity(state);
  const socialHtml = renderSocialLinks(state.social, state.theme.primary);
  const customHtml = renderCustomFields(state.customFields, state.theme.text);
  const dynamic = renderDynamicNodes(state);
  const container = `
    <div style="background:${state.theme.background};color:${state.theme.text};font-family:${fontStack};font-size:${state.theme.baseFontSize}px;line-height:${state.theme.lineHeight};padding:16px;border:1px solid ${state.theme.divider};max-width:600px;">
      ${identityHtml}${socialHtml}${customHtml}${dynamic}
    </div>
  `;
  return sanitizeHtml(container);
}

export interface RenderOptions {
  mode: HtmlMode;
}

/**
 * Converts the signature state to HTML in either modern div-based or table-based format.
 */
export function modelToHtml(state: SignatureState, options: RenderOptions): string {
  const html = options.mode === 'table' ? renderTable(state) : renderModern(state);
  return html;
}

export function normalizeLinkValue(value: string) {
  return normalizeLink(value);
}
