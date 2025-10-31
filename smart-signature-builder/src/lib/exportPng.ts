import { toPng } from 'html-to-image';
import { SignatureState } from '../types';

export interface PngExportOptions {
  scale: number;
  watermark?: boolean;
}

export async function exportPng(
  element: HTMLElement,
  state: SignatureState,
  options: PngExportOptions,
): Promise<string> {
  const watermark = options.watermark && state.watermark.enabled;
  if (watermark) {
    const watermarkNode = document.createElement('div');
    watermarkNode.textContent = `© ${state.watermark.text}`;
    watermarkNode.style.position = 'absolute';
    watermarkNode.style.right = '12px';
    watermarkNode.style.bottom = '12px';
    watermarkNode.style.fontSize = '10px';
    watermarkNode.style.color = 'rgba(0,0,0,0.45)';
    watermarkNode.style.pointerEvents = 'none';
    element.appendChild(watermarkNode);
    try {
      const png = await toPng(element, {
        pixelRatio: options.scale,
        cacheBust: true,
        backgroundColor: state.theme.background,
      });
      element.removeChild(watermarkNode);
      return png;
    } catch (error) {
      element.removeChild(watermarkNode);
      throw error;
    }
  }

  return toPng(element, {
    pixelRatio: options.scale,
    cacheBust: true,
    backgroundColor: state.theme.background,
  });
}
