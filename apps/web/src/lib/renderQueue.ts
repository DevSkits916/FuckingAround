import { nanoid } from 'nanoid';
import {
  SignatureProfile,
  renderProfileToTableHtml,
  renderProfileToPng,
  lintEmailHtml,
  auditContrast,
} from '@smart-signature/shared';

export interface RenderRequest {
  id: string;
  profile: SignatureProfile;
  mode: 'table' | 'modern';
  scrub: boolean;
}

export interface RenderResult {
  html: string;
  png: string;
  lint: ReturnType<typeof lintEmailHtml>;
  contrast: ReturnType<typeof auditContrast>;
}

export type ProgressHandler = (progress: number) => void;

let worker: Worker | null = null;

const ensureWorker = () => {
  if (typeof window === 'undefined') return null;
  if (!('Worker' in window)) return null;
  if (!worker) {
    const url = new URL('../workers/renderWorker.ts', import.meta.url);
    worker = new Worker(url, { type: 'module' });
  }
  return worker;
};

export const enqueueRender = async (
  request: RenderRequest,
  onProgress?: ProgressHandler
): Promise<RenderResult> => {
  const activeWorker = ensureWorker();
  if (!activeWorker) {
    onProgress?.(0.5);
    const html = renderProfileToTableHtml(request.profile);
    const png = await renderProfileToPng(request.profile);
    const lint = lintEmailHtml(html);
    const contrast = auditContrast(html);
    onProgress?.(1);
    return { html, png, lint, contrast };
  }

  return new Promise<RenderResult>((resolve, reject) => {
    const channel = new MessageChannel();
    const requestId = nanoid();
    channel.port1.onmessage = (event) => {
      const { type, payload } = event.data;
      if (type === 'progress') {
        onProgress?.(payload.progress);
      }
      if (type === 'result' && payload.id === requestId) {
        channel.port1.close();
        resolve(payload.result as RenderResult);
      }
      if (type === 'error') {
        channel.port1.close();
        reject(new Error(payload.message));
      }
    };
    activeWorker.postMessage({ id: requestId, request }, [channel.port2]);
  });
};

