import { PALETTES, useSignatureStore } from '../store/signatureStore';
import type { PaletteKey, SignatureData, SocialLink } from '../types';
import { getIconDataUri } from '../components/SocialIcon';

const SAFE_PROTOCOL = /^(https?:|mailto:|tel:)/i;

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const sanitizeUrl = (url: string) => {
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (!SAFE_PROTOCOL.test(trimmed)) {
    return `https://${trimmed.replace(/^\/+/, '')}`;
  }
  return trimmed;
};

const renderSocialLinks = (links: SocialLink[], color: string, textColor: string) => {
  if (!links.length) return '';
  const items = links
    .map((link) => {
      const url = sanitizeUrl(link.url);
      if (!url) return '';
      const iconUri = getIconDataUri(link.platform, color);
      return `<a href="${escapeHtml(url)}" style="display:inline-flex;align-items:center;gap:6px;margin-right:14px;margin-bottom:8px;color:${textColor};text-decoration:none;font-size:13px;">
        <img src="${iconUri}" alt="${link.platform}" width="16" height="16" style="display:block;"/>
        <span style="color:${textColor};">${link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}</span>
      </a>`;
    })
    .join('');
  if (!items.trim()) return '';
  return `<tr><td style="padding-top:12px;line-height:1.4;">${items}</td></tr>`;
};

const renderBanner = (signature: SignatureData, accent: string) => {
  if (!signature.banner.enabled || !signature.banner.text) return '';
  const url = sanitizeUrl(signature.banner.url || '#');
  const text = escapeHtml(signature.banner.text);
  return `<tr><td style="padding-top:16px;">
    <a href="${escapeHtml(url)}" style="display:block;padding:14px 18px;background:${accent};color:#0b1120;text-decoration:none;border-radius:8px;font-weight:600;text-align:center;">${text}</a>
  </td></tr>`;
};

export const buildSignatureHtml = (signature: SignatureData, paletteKey: PaletteKey) => {
  const palette = PALETTES[paletteKey];
  const fontFamily = signature.terminalTheme
    ? '"IBM Plex Mono", "Courier New", monospace'
    : signature.fontFamily;
  const baseTextColor = signature.terminalTheme ? '#21f38a' : palette.text;
  const subTextColor = signature.terminalTheme ? '#94f8c3' : palette.subtleText;
  const background = signature.terminalTheme ? '#00110b' : palette.background;
  const borderColor = signature.terminalTheme ? '#21f38a' : palette.divider;
  const accent = signature.brandColor;

  const logo = signature.logoDataUrl
    ? `<td style="padding-right:16px;vertical-align:top;">
        <img src="${signature.logoDataUrl}" alt="Logo" style="max-width:96px;border-radius:12px;display:block;"/>
      </td>`
    : '';

  const nameBlock = `
    <tr>
      <td style="font-size:${signature.textSize + 2}px;font-weight:700;color:${baseTextColor};padding-bottom:4px;">${escapeHtml(
        signature.name
      )}</td>
    </tr>
    <tr>
      <td style="font-size:${signature.textSize - 1}px;color:${subTextColor};padding-bottom:10px;">${escapeHtml(
        signature.title
      )}</td>
    </tr>
  `;

  const contactLines = [
    signature.phone && `<span style="display:block;color:${baseTextColor};">${escapeHtml(signature.phone)}</span>`,
    signature.email && `<a href="mailto:${escapeHtml(signature.email)}" style="color:${accent};text-decoration:none;">${escapeHtml(signature.email)}</a>`,
    signature.website && `<a href="${escapeHtml(sanitizeUrl(signature.website))}" style="color:${accent};text-decoration:none;">${escapeHtml(signature.website)}</a>`,
    signature.showAddress && signature.address
      ? `<span style="display:block;color:${subTextColor};">${escapeHtml(signature.address)}</span>`
      : '',
  ]
    .filter(Boolean)
    .join('');

  const body = `
  <table role="presentation" style="border-spacing:0;width:100%;max-width:620px;font-family:${fontFamily};font-size:${signature.textSize}px;color:${baseTextColor};">
    <tr>
      ${logo}
      <td style="padding:0;vertical-align:top;">
        <table role="presentation" style="border-spacing:0;width:100%;">
          ${nameBlock}
          <tr>
            <td style="padding-bottom:8px;line-height:1.5;border-bottom:1px solid ${borderColor};">
              ${contactLines}
            </td>
          </tr>
          ${renderSocialLinks(signature.socialLinks, accent, baseTextColor)}
          ${renderBanner(signature, accent)}
        </table>
      </td>
    </tr>
  </table>`;

  if (signature.terminalTheme) {
    return `
      <div style="background:${background};padding:18px;border:3px solid ${accent};border-radius:12px;box-shadow:0 0 30px rgba(33,243,138,0.18);">
        <div style="background:#000d08;padding:14px;border-radius:8px;border:1px solid rgba(33,243,138,0.4);">
          ${body}
        </div>
      </div>
    `;
  }

  return `
    <div style="background:${background};padding:18px;border-radius:16px;border:1px solid ${borderColor};box-shadow:0 12px 28px rgba(15,23,42,0.18);">
      ${body}
    </div>
  `;
};

export const useExportedHtml = () => {
  return useSignatureStore((state) => buildSignatureHtml(state.signature, state.palette));
};
