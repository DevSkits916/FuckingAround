export const ICONS: Record<string, string> = {
  email:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M4 5h16a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V7a2 2 0 012-2zm0 2v.511l8 5.333 8-5.333V7H4zm16 10V9.689l-7.422 4.945a1 1 0 01-1.156 0L4 9.69V17h16z"/></svg>',
  phone:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M6.654 1.49l2.326-.465a2 2 0 012.302 1.216l1.094 2.55a2 2 0 01-.618 2.33l-1.518 1.23a12.044 12.044 0 005.422 5.423l1.23-1.52a2 2 0 012.33-.618l2.55 1.094a2 2 0 011.216 2.302l-.465 2.326a2 2 0 01-1.956 1.622C11.297 19.28 4.72 12.703 4.068 4.446A2 2 0 016.654 1.49z"/></svg>',
  link:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M13.828 10.172a4 4 0 015.656 5.656l-3.535 3.535a4 4 0 01-5.657 0l-1.414-1.414 1.414-1.414 1.414 1.414a2 2 0 002.829 0l3.535-3.535a2 2 0 00-2.828-2.829l-1.415 1.415-1.414-1.415 1.415-1.414z"/><path d="M10.172 13.828a4 4 0 01-5.656-5.656l3.535-3.535a4 4 0 015.657 0l1.414 1.414-1.414 1.414-1.414-1.414a2 2 0 00-2.829 0L6.93 8.586a2 2 0 102.828 2.829l1.415-1.415 1.414 1.415-1.415 1.414z"/></svg>',
  preset:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M4 5a2 2 0 012-2h3.5a2 2 0 011.6.8l1.2 1.6H18a2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm2 0v11h12V8h-5.5a2 2 0 01-1.6-.8L9.7 5H6z"/></svg>',
  import:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3a1 1 0 011 1v9.586l2.293-2.293 1.414 1.414L12 17.414l-4.707-4.707 1.414-1.414L11 13.586V4a1 1 0 011-1z"/><path d="M5 19a2 2 0 01-2-2v-2h2v2h14v-2h2v2a2 2 0 01-2 2H5z"/></svg>',
};

export function iconToDataUri(svg: string, color = '#0ea5e9') {
  const optimized = svg
    .replace(/\s+/g, ' ')
    .replace(/currentColor/g, color)
    .trim();
  const encoded = encodeURIComponent(optimized);
  return `data:image/svg+xml,${encoded}`;
}
