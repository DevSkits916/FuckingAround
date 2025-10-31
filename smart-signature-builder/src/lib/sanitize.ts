/**
 * Removes editor specific attributes before export to ensure HTML stays clean.
 */
export function sanitizeHtml(html: string): string {
  return html
    .replace(/\sdata-[^=]+="[^"]*"/g, '')
    .replace(/\scontenteditable="(?:true|false)"/g, '')
    .replace(/\sdraggable="(?:true|false)"/g, '')
    .replace(/\sstyle="\s*"/g, '');
}
