import { nanoid } from 'nanoid';

export type SchemaVersion = 'v1' | 'v2' | 'v3';

export type ComponentType =
  | 'avatar'
  | 'contact'
  | 'socialRow'
  | 'banner'
  | 'customHtml'
  | 'group';

export interface MasterStyle {
  key: string;
  componentType: ComponentType;
  locked: boolean;
  styles: Record<string, string | number>;
}

export interface BaseComponent {
  id: string;
  componentType: ComponentType;
  masterStyleKey?: string;
  children?: SignatureComponent[];
  styles?: Record<string, string | number>;
  data?: Record<string, unknown>;
}

export interface AvatarComponent extends BaseComponent {
  componentType: 'avatar';
  data: {
    image?: string;
    alt?: string;
    size: 'sm' | 'md' | 'lg';
    shape: 'circle' | 'rounded' | 'square';
  };
}

export interface ContactComponent extends BaseComponent {
  componentType: 'contact';
  data: {
    name: string;
    title?: string;
    phone?: string;
    email?: string;
    layout: 'stacked' | 'inline';
  };
}

export interface SocialRowComponent extends BaseComponent {
  componentType: 'socialRow';
  data: {
    links: { id: string; label: string; url: string; icon?: string }[];
    iconSize: number;
    gap: number;
    separator?: 'dot' | 'pipe' | 'none';
  };
}

export interface BannerComponent extends BaseComponent {
  componentType: 'banner';
  data: {
    image: string;
    alt?: string;
    link?: string;
  };
}

export interface CustomHtmlComponent extends BaseComponent {
  componentType: 'customHtml';
  data: {
    html: string;
  };
}

export interface GroupComponent extends BaseComponent {
  componentType: 'group';
  children: SignatureComponent[];
}

export type SignatureComponent =
  | AvatarComponent
  | ContactComponent
  | SocialRowComponent
  | BannerComponent
  | CustomHtmlComponent
  | GroupComponent;

export interface ThemeTokens {
  id: string;
  name: string;
  colors: {
    background: string;
    text: string;
    accent: string;
  };
  typography: {
    fontFamily: string;
    baseSize: number;
  };
}

export interface UTMPreset {
  id: string;
  name: string;
  campaign: string;
  source: string;
  medium: string;
}

export interface SignatureProfile {
  id: string;
  name: string;
  slug: string;
  updatedAt: string;
  theme: ThemeTokens;
  components: SignatureComponent[];
  masterStyles: Record<string, MasterStyle>;
  settings: {
    language: string;
    shareScrub: boolean;
    utmPresetId?: string;
  };
  assets: Record<string, string>;
}

export interface SignatureLibrary {
  version: SchemaVersion;
  profiles: SignatureProfile[];
  packs: PackManifest[];
  masterStyles: Record<ComponentType, MasterStyle[]>;
  settings: {
    language: string;
    telemetry: boolean;
    utmPresets: UTMPreset[];
  };
}

export interface PackManifest {
  id: string;
  name: string;
  description?: string;
  presets: SignatureProfile[];
  themes: ThemeTokens[];
  assets: Record<string, string>;
}

export interface ProfilesBundle {
  version: 'profiles.v1';
  exportedAt: string;
  profiles: SignatureProfile[];
}

export const DEFAULT_THEME: ThemeTokens = {
  id: 'default',
  name: 'Default',
  colors: {
    background: '#ffffff',
    text: '#1f2933',
    accent: '#2563eb',
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    baseSize: 14,
  },
};

export const DEFAULT_LIBRARY: SignatureLibrary = {
  version: 'v3',
  profiles: [],
  packs: [],
  masterStyles: {
    avatar: [],
    contact: [],
    socialRow: [],
    banner: [],
    customHtml: [],
    group: [],
  },
  settings: {
    language: 'en',
    telemetry: true,
    utmPresets: [],
  },
};

export interface LegacyV1Profile {
  id: string;
  name: string;
  blocks: unknown[];
  theme?: Partial<ThemeTokens>;
}

export interface LegacyV2Library {
  version: 'v2';
  signatures: LegacyV1Profile[];
  settings?: Partial<SignatureLibrary['settings']>;
}

export type ImportableLibrary = SignatureLibrary | LegacyV2Library | LegacyV1Profile;

const createSlug = (name: string) =>
  name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64) || 'signature';

export const createProfile = (name = 'Untitled'): SignatureProfile => {
  const id = nanoid();
  return {
    id,
    name,
    slug: createSlug(name) + '-' + id.slice(0, 6),
    updatedAt: new Date().toISOString(),
    theme: { ...DEFAULT_THEME, id: `theme-${id}` },
    components: [],
    masterStyles: {},
    settings: {
      language: 'en',
      shareScrub: false,
    },
    assets: {},
  };
};

export const createLibrary = (): SignatureLibrary => ({
  ...DEFAULT_LIBRARY,
  profiles: [createProfile('Primary Profile')],
});

const normalizeTheme = (theme?: Partial<ThemeTokens>): ThemeTokens => ({
  ...DEFAULT_THEME,
  ...theme,
  colors: {
    ...DEFAULT_THEME.colors,
    ...(theme?.colors ?? {}),
  },
  typography: {
    ...DEFAULT_THEME.typography,
    ...(theme?.typography ?? {}),
  },
});

export const migrateProfile = (input: LegacyV1Profile): SignatureProfile => {
  const id = input.id ?? nanoid();
  return {
    id,
    name: input.name || 'Imported Profile',
    slug: createSlug(input.name ?? 'imported') + '-' + id.slice(0, 6),
    updatedAt: new Date().toISOString(),
    theme: normalizeTheme(input.theme ?? {}),
    components: [],
    masterStyles: {},
    settings: {
      language: 'en',
      shareScrub: false,
    },
    assets: {},
  };
};

export const migrateToV3 = (input: ImportableLibrary): SignatureLibrary => {
  if ((input as SignatureLibrary).version === 'v3') {
    const lib = input as SignatureLibrary;
    return {
      ...lib,
      profiles: lib.profiles.map((profile) => ({
        ...profile,
        masterStyles: profile.masterStyles ?? {},
      })),
      settings: {
        language: lib.settings.language ?? 'en',
        telemetry: lib.settings.telemetry ?? true,
        utmPresets: lib.settings.utmPresets ?? [],
      },
    };
  }

  if ((input as LegacyV2Library).version === 'v2') {
    const legacy = input as LegacyV2Library;
    return {
      ...DEFAULT_LIBRARY,
      profiles: legacy.signatures.map(migrateProfile),
      settings: {
        language: legacy.settings?.language ?? 'en',
        telemetry: legacy.settings?.telemetry ?? true,
        utmPresets: legacy.settings?.utmPresets ?? [],
      },
    };
  }

  const single = input as LegacyV1Profile;
  return {
    ...DEFAULT_LIBRARY,
    profiles: [migrateProfile(single)],
  };
};

export const bundleProfiles = (profiles: SignatureProfile[]): ProfilesBundle => ({
  version: 'profiles.v1',
  exportedAt: new Date().toISOString(),
  profiles,
});

export const unbundleProfiles = (bundle: ProfilesBundle): SignatureProfile[] => {
  if (bundle.version !== 'profiles.v1') {
    throw new Error('Unsupported profiles bundle version');
  }
  return bundle.profiles;
};

export const sanitizeProfileForShare = (profile: SignatureProfile, scrub = false) => {
  if (!scrub) return profile;
  const scrubEmail = (value?: string) => (value ? value.replace(/[\w.-]+@[\w.-]+/g, 'hidden@example.com') : value);
  const scrubPhone = (value?: string) => (value ? value.replace(/\d/g, '•') : value);
  return {
    ...profile,
    components: profile.components.map((component) => {
      if (component.componentType === 'contact') {
        const contact = component as ContactComponent;
        return {
          ...contact,
          data: {
            ...contact.data,
            phone: scrubPhone(contact.data.phone),
            email: scrubEmail(contact.data.email),
          },
        };
      }
      return component;
    }),
  };
};

export const applyUtms = (
  profile: SignatureProfile,
  preset?: UTMPreset
): SignatureProfile => {
  if (!preset) return profile;
  const append = (url: string) => {
    try {
      const u = new URL(url);
      u.searchParams.set('utm_campaign', preset.campaign);
      u.searchParams.set('utm_source', preset.source);
      u.searchParams.set('utm_medium', preset.medium);
      return u.toString();
    } catch (error) {
      console.warn('Invalid URL for UTM application', url, error);
      return url;
    }
  };
  return {
    ...profile,
    components: profile.components.map((component) => {
      if (component.componentType === 'socialRow') {
        const social = component as SocialRowComponent;
        return {
          ...social,
          data: {
            ...social.data,
            links: social.data.links.map((link) => ({
              ...link,
              url: append(link.url),
            })),
          },
        };
      }
      if (component.componentType === 'banner') {
        const banner = component as BannerComponent;
        return {
          ...banner,
          data: {
            ...banner.data,
            link: banner.data.link ? append(banner.data.link) : undefined,
          },
        };
      }
      return component;
    }),
  };
};

export const ensureAltText = (profile: SignatureProfile) => {
  profile.components.forEach((component) => {
    if ('data' in component && component.data) {
      const data = component.data as Record<string, unknown>;
      if ('image' in data && data.image && !('alt' in data) && component.componentType !== 'customHtml') {
        (component.data as { alt?: string }).alt = 'Signature image';
      }
    }
  });
  return profile;
};

export const findProfileById = (library: SignatureLibrary, profileId: string) =>
  library.profiles.find((profile) => profile.id === profileId);

export const upsertProfile = (library: SignatureLibrary, profile: SignatureProfile): SignatureLibrary => {
  const existingIndex = library.profiles.findIndex((item) => item.id === profile.id);
  if (existingIndex >= 0) {
    const nextProfiles = [...library.profiles];
    nextProfiles[existingIndex] = {
      ...profile,
      updatedAt: new Date().toISOString(),
    };
    return { ...library, profiles: nextProfiles };
  }
  return {
    ...library,
    profiles: [...library.profiles, { ...profile, updatedAt: new Date().toISOString() }],
  };
};

export const deleteProfile = (library: SignatureLibrary, profileId: string): SignatureLibrary => ({
  ...library,
  profiles: library.profiles.filter((profile) => profile.id !== profileId),
});

const cloneComponent = (component: SignatureComponent): SignatureComponent => {
  const nextId = nanoid();
  if (component.componentType === 'group') {
    return {
      ...component,
      id: nextId,
      children: component.children.map((child) => cloneComponent(child)),
    } satisfies GroupComponent;
  }

  const clonedChildren = component.children?.map((child) => cloneComponent(child));
  return {
    ...component,
    id: nextId,
    ...(clonedChildren ? { children: clonedChildren } : {}),
  } as SignatureComponent;
};

export const duplicateProfile = (profile: SignatureProfile, overrides: Partial<SignatureProfile> = {}) => {
  const id = nanoid();
  const suffix = id.slice(0, 4);
  return {
    ...profile,
    ...overrides,
    id,
    name: overrides.name ?? `${profile.name} Copy`,
    slug: overrides.slug ?? `${profile.slug}-${suffix}`,
    updatedAt: new Date().toISOString(),
    components: profile.components.map((component) => cloneComponent(component)),
    masterStyles: Object.fromEntries(
      Object.entries(profile.masterStyles).map(([key, style]) => {
        const nextKey = `${key}-${suffix}`;
        return [nextKey, { ...style, key: nextKey }];
      })
    ),
  } satisfies SignatureProfile;
};

export const validatePack = (pack: PackManifest) => {
  const warnings: string[] = [];
  Object.entries(pack.assets).forEach(([key, value]) => {
    const size = typeof value === 'string' ? value.length : 0;
    if (size > 1024 * 1024 * 0.5) {
      warnings.push(`${key} exceeds 0.5MB after encoding`);
    }
    if (!/(data:image\/(png|svg\+xml);base64,|<svg)/.test(value)) {
      warnings.push(`${key} is not a recognised safe image format`);
    }
  });
  if (!pack.presets.length) {
    warnings.push('Pack contains no presets');
  }
  if (!pack.themes.length) {
    warnings.push('Pack contains no themes');
  }
  return warnings;
};

export const mergeLibrary = (
  library: SignatureLibrary,
  additions: Partial<SignatureLibrary>
): SignatureLibrary => ({
  ...library,
  ...additions,
  profiles: additions.profiles ?? library.profiles,
  packs: additions.packs ?? library.packs,
  masterStyles: additions.masterStyles ?? library.masterStyles,
  settings: {
    ...library.settings,
    ...(additions.settings ?? {}),
  },
});

export const serializeProfiles = (profiles: SignatureProfile[]) => JSON.stringify(bundleProfiles(profiles));

export const deserializeProfiles = (payload: string): SignatureProfile[] => {
  const parsed = JSON.parse(payload) as ProfilesBundle;
  return unbundleProfiles(parsed);
};

