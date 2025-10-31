/**
 * Removes unnecessary whitespace, line breaks, and duplicate semicolons
 * from a data URI string to keep exports compact.
 */
export function optimizeDataUri(uri: string): string {
  if (!uri.startsWith('data:')) return uri.trim();
  const [meta, data] = uri.split(',', 2);
  const normalizedMeta = meta
    .replace(/;+/g, ';')
    .replace(/\s+/g, '')
    .replace(/;$/, '');
  const normalizedData = data.replace(/\s+/g, '');
  return `${normalizedMeta},${normalizedData}`;
}

export function toDataUri(mime: string, base64: string) {
  return optimizeDataUri(`data:${mime};base64,${base64}`);
}
