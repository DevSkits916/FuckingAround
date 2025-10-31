export type SocialPlatform =
  | 'facebook'
  | 'x'
  | 'reddit'
  | 'instagram'
  | 'tiktok'
  | 'github'
  | 'linkedin'
  | 'paypal'
  | 'venmo'
  | 'cashapp'
  | 'chime'
  | 'gofundme';

export interface SocialLink {
  id: string;
  platform: SocialPlatform;
  url: string;
}

export interface BannerConfig {
  enabled: boolean;
  text: string;
  url: string;
}

export interface SignatureData {
  name: string;
  title: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  showAddress: boolean;
  brandColor: string;
  fontFamily: string;
  textSize: number;
  socialLinks: SocialLink[];
  logoDataUrl?: string;
  banner: BannerConfig;
  terminalTheme: boolean;
}

export type PaletteKey = 'light' | 'dark';

export interface Palette {
  name: string;
  background: string;
  text: string;
  subtleText: string;
  divider: string;
}

export interface Preset {
  id: string;
  name: string;
  signature: SignatureData;
  palette: PaletteKey;
}
