export type ElementKind =
  | 'text'
  | 'image'
  | 'link'
  | 'divider'
  | 'customHtml'
  | 'group';

export interface BaseElement {
  id: string;
  type: ElementKind;
  locked?: boolean;
  parentId?: string | null;
  zIndex?: number;
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation?: number;
  margin?: Partial<Record<'top' | 'right' | 'bottom' | 'left', number>>;
  padding?: Partial<Record<'top' | 'right' | 'bottom' | 'left', number>>;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  alignSelf?: 'start' | 'center' | 'end' | 'stretch';
}

export interface TextElement extends BaseElement {
  type: 'text';
  text: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: number | 'bold' | 'normal';
  lineHeight?: number;
  color?: string;
  letterSpacing?: number;
  maxWidth?: number;
}

export interface LinkElement extends BaseElement {
  type: 'link';
  text: string;
  href: string;
  display?: 'text' | 'button';
  color?: string;
  underline?: boolean;
}

export interface ImageElement extends BaseElement {
  type: 'image';
  alt: string;
  dataUri: string;
  originalUrl?: string;
  maxWidth?: number;
  objectFit?: 'contain' | 'cover';
}

export interface DividerElement extends BaseElement {
  type: 'divider';
  thickness: number;
  color: string;
  length: number;
  direction: 'horizontal' | 'vertical';
}

export interface CustomHtmlElement extends BaseElement {
  type: 'customHtml';
  html: string;
}

export interface GroupElement extends BaseElement {
  type: 'group';
  children: string[];
  layout: 'row' | 'column';
  gap?: number;
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'space-between';
}

export type SignatureElement =
  | TextElement
  | LinkElement
  | ImageElement
  | DividerElement
  | CustomHtmlElement
  | GroupElement;

export interface SocialLink {
  id: string;
  label: string;
  platform: string;
  url: string;
  username?: string;
  icon?: string;
  customIconDataUri?: string;
}

export interface CustomField {
  id: string;
  key: string;
  value: string;
}

export interface ThemeTokens {
  baseFont: 'system' | 'sans' | 'monospace';
  baseFontSize: number;
  lineHeight: number;
  primary: string;
  text: string;
  subtleText: string;
  divider: string;
  background: string;
}

export interface SignatureIdentity {
  name: string;
  title?: string;
  secondaryTitle?: string;
  tagline?: string;
  pronouns?: string;
  phone?: string;
  secondaryPhone?: string;
  email?: string;
  website?: string;
  address?: string;
}

export interface WatermarkConfig {
  text: string;
  enabled: boolean;
}

export interface SignatureState {
  version: string;
  identity: SignatureIdentity;
  social: SocialLink[];
  customFields: CustomField[];
  theme: ThemeTokens;
  nodes: SignatureElement[];
  selectedIds: string[];
  showGrid: boolean;
  snapToGrid: boolean;
  snapToAlignment: boolean;
  spacingInspector: boolean;
  readOnlyPreview: boolean;
  watermark: WatermarkConfig;
  terminalTheme: boolean;
}

export interface PresetMeta {
  id: string;
  name: string;
  description?: string;
  previewColor?: string;
  signature: SignatureState;
}

export interface UndoRedoState<T> {
  past: T[];
  future: T[];
  limit: number;
}

export interface SignatureConfigExport {
  schemaVersion: string;
  exportedAt: string;
  data: SignatureState;
}

export interface EmailLintWarning {
  id: string;
  message: string;
  fix?: string;
  severity: 'info' | 'warning' | 'error';
}

export interface ContrastResult {
  id: string;
  ratio: number;
  meetsAA: boolean;
  textColor: string;
  backgroundColor: string;
  recommendation?: string;
}

export interface ImportResult {
  state: SignatureState;
  warnings: string[];
}

export interface PresetFile {
  version: string;
  preset: PresetMeta;
}
