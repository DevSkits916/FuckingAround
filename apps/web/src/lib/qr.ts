export const createQrPlaceholder = (text: string) => {
  const encoded = encodeURIComponent(text);
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='128' height='128'><rect width='128' height='128' fill='#fff'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='monospace' font-size='12'>QR</text></svg>`;
  return `data:image/svg+xml,${svg.replace('#', '%23')}&data=${encoded}`;
};

