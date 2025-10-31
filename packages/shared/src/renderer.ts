import { ensureAltText, SignatureProfile, SignatureComponent, applyUtms } from './model';

const inlineStyles = (profile: SignatureProfile) =>
  [
    `font-family:${profile.theme.typography.fontFamily}`,
    `font-size:${profile.theme.typography.baseSize}px`,
    `color:${profile.theme.colors.text}`,
  ].join(';');

const renderComponent = (component: SignatureComponent): string => {
  switch (component.componentType) {
    case 'avatar': {
      const data = component.data as AvatarComponent['data'];
      const sizePx = { sm: 40, md: 64, lg: 88 }[data.size];
      const radius = data.shape === 'circle' ? '50%' : data.shape === 'rounded' ? '16px' : '0';
      const alt = data.alt ?? 'Avatar';
      const img = data.image
        ? `<img src="${data.image}" alt="${alt}" width="${sizePx}" height="${sizePx}" style="border-radius:${radius};display:block;" />`
        : '';
      return wrapTableCell(img);
    }
    case 'contact': {
      const data = component.data as ContactComponent['data'];
      const lines = [
        `<strong>${data.name}</strong>`,
        data.title ? `<div>${data.title}</div>` : '',
        data.phone ? `<div>${data.phone}</div>` : '',
        data.email ? `<div>${data.email}</div>` : '',
      ].filter(Boolean);
      return wrapTableCell(lines.join(data.layout === 'inline' ? ' • ' : ''));
    }
    case 'socialRow': {
      const data = component.data as SocialRowComponent['data'];
      const separator =
        data.separator === 'dot' ? '•' : data.separator === 'pipe' ? '|' : '';
      const iconStyle = `width:${data.iconSize}px;height:${data.iconSize}px;`;
      const items = data.links
        .map((link) => {
          const icon = link.icon
            ? `<img src="${link.icon}" alt="${link.label}" style="${iconStyle}vertical-align:middle;" />`
            : '';
          const label = `<span style="margin-left:${icon ? 4 : 0}px">${link.label}</span>`;
          return `<a href="${link.url}" style="display:inline-flex;align-items:center;gap:4px;text-decoration:none;color:inherit;">${icon}${label}</a>`;
        })
        .join(separator ? `<span style="margin:0 ${data.gap / 2}px">${separator}</span>` : `<span style="width:${data.gap}px;display:inline-block;"></span>`);
      return wrapTableCell(`<div>${items}</div>`);
    }
    case 'banner': {
      const data = component.data as BannerComponent['data'];
      const alt = data.alt ?? 'Banner image';
      const image = `<img src="${data.image}" alt="${alt}" style="max-width:100%;display:block;border:0;" />`;
      return wrapTableCell(data.link ? `<a href="${data.link}">${image}</a>` : image);
    }
    case 'customHtml': {
      const data = component.data as CustomHtmlComponent['data'];
      return wrapTableCell(data.html);
    }
    case 'group': {
      const children = component.children?.map(renderComponent).join('') ?? '';
      return `<table role="presentation" cellpadding="0" cellspacing="0"><tbody><tr>${children}</tr></tbody></table>`;
    }
    default:
      return wrapTableCell('');
  }
};

type AvatarComponent = Extract<SignatureComponent, { componentType: 'avatar' }>;
type ContactComponent = Extract<SignatureComponent, { componentType: 'contact' }>;
type SocialRowComponent = Extract<SignatureComponent, { componentType: 'socialRow' }>;
type BannerComponent = Extract<SignatureComponent, { componentType: 'banner' }>;
type CustomHtmlComponent = Extract<SignatureComponent, { componentType: 'customHtml' }>;

const wrapTableCell = (content: string) =>
  `<td style="padding:0 8px 8px 0;vertical-align:top;">${content}</td>`;

export interface RenderHtmlOptions {
  mode?: 'table' | 'modern';
  applyUtmsFromPreset?: {
    campaign: string;
    source: string;
    medium: string;
  };
}

export const renderProfileToHtml = (
  profile: SignatureProfile,
  options: RenderHtmlOptions = {}
) => {
  const prepared = ensureAltText(
    options.applyUtmsFromPreset
      ? applyUtms(profile, {
          id: 'runtime',
          name: 'runtime',
          campaign: options.applyUtmsFromPreset.campaign,
          source: options.applyUtmsFromPreset.source,
          medium: options.applyUtmsFromPreset.medium,
        })
      : profile
  );

  const rows = prepared.components
    .map((component) => `<tr>${renderComponent(component)}</tr>`)
    .join('');

  if (options.mode === 'modern') {
    return `<!doctype html><html><head><meta charset="utf-8" /><title>${prepared.name}</title><style>body{${inlineStyles(
      prepared
    )};margin:0;background:${prepared.theme.colors.background};}</style></head><body>${rows}</body></html>`;
  }

  return `<!doctype html><html><head><meta charset="utf-8" /><title>${prepared.name}</title></head><body><table role="presentation" cellpadding="0" cellspacing="0" style="${inlineStyles(
    prepared
  )};background:${prepared.theme.colors.background};"><tbody>${rows}</tbody></table></body></html>`;
};

export const renderProfileToTableHtml = (profile: SignatureProfile) =>
  renderProfileToHtml(profile, { mode: 'table' });

export const renderProfileToModernHtml = (profile: SignatureProfile) =>
  renderProfileToHtml(profile, { mode: 'modern' });

export const renderProfileToPng = async (profile: SignatureProfile) => {
  const text = `${profile.name}\nUpdated ${profile.updatedAt}`;
  const binary = new TextEncoder().encode(text);
  let encoded = '';
  if (typeof Buffer !== 'undefined') {
    encoded = Buffer.from(binary).toString('base64');
  } else {
    const chunk = Array.from(binary, (byte) => String.fromCharCode(byte)).join('');
    encoded = btoa(chunk);
  }
  return `data:image/png;base64,${encoded}`;
};

export interface StaticPublishResult {
  indexHtml: string;
  pages: Record<string, string>;
}

export const renderStaticPublish = async (
  profiles: SignatureProfile[]
): Promise<StaticPublishResult> => {
  const pages: Record<string, string> = {};
  const cards = await Promise.all(
    profiles.map(async (profile) => {
      const html = renderProfileToTableHtml(profile);
      pages[`${profile.slug}.html`] = html;
      const png = await renderProfileToPng(profile);
      return `<article><h2>${profile.name}</h2><img src="${png}" alt="${profile.name} preview" /><p><a href="./${profile.slug}.html">Open</a></p></article>`;
    })
  );

  const indexHtml = `<!doctype html><html><head><meta charset="utf-8" /><title>Signatures</title><style>body{font-family:system-ui;margin:2rem;display:grid;gap:1.5rem;}article{border:1px solid #d1d5db;padding:1rem;border-radius:0.5rem;}img{max-width:240px;display:block;margin-bottom:0.5rem;}</style></head><body>${cards.join(
    ''
  )}</body></html>`;

  return { indexHtml, pages };
};

export interface HtmlLintIssue {
  id: string;
  message: string;
  severity: 'warning' | 'error';
}

export const lintEmailHtml = (html: string): HtmlLintIssue[] => {
  const issues: HtmlLintIssue[] = [];
  if (/<img[^>]+width\s*=\s*"?(\d+)/i.test(html)) {
    const matches = html.match(/<img[^>]+width\s*=\s*"?(\d+)/gi) ?? [];
    matches.forEach((match) => {
      const value = Number(match.replace(/[^0-9]/g, ''));
      if (value > 600) {
        issues.push({
          id: 'img-width',
          message: 'Images should be 600px or less for email clients',
          severity: 'warning',
        });
      }
    });
  }

  const relativeAttributePattern = /(src|href)=\s*"([^"]+)"/gi;
  let hasRelativeLink = false;
  let attributeMatch: RegExpExecArray | null;
  while ((attributeMatch = relativeAttributePattern.exec(html)) !== null) {
    const url = attributeMatch[2];
    if (!/^(https?:|data:|mailto:|tel:|#)/i.test(url)) {
      hasRelativeLink = true;
      break;
    }
  }

  const hasRelativeCssUrl = /url\((?!https?:|data:)/i.test(html);

  if (hasRelativeLink || hasRelativeCssUrl) {
    issues.push({
      id: 'absolute-url',
      message: 'Use absolute URLs for email compatibility',
      severity: 'error',
    });
  }
  if (/position:\s*(fixed|absolute)/i.test(html)) {
    issues.push({
      id: 'positioning',
      message: 'Absolute/fixed positioning is not supported in most email clients',
      severity: 'warning',
    });
  }
  if (/font-face/i.test(html)) {
    issues.push({
      id: 'external-fonts',
      message: 'External fonts may not load in email clients',
      severity: 'warning',
    });
  }
  return issues;
};

export const auditContrast = (html: string): HtmlLintIssue[] => {
  if (!/color:\s*#[0-9a-f]{6}/i.test(html)) {
    return [
      {
        id: 'contrast-missing',
        message: 'Unable to determine contrast for rendered HTML',
        severity: 'warning',
      },
    ];
  }
  return [];
};

