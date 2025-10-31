import {
  renderProfileToTableHtml,
  renderProfileToPng,
  lintEmailHtml,
  auditContrast,
  sanitizeProfileForShare,
} from '@smart-signature/shared';

interface WorkerRequest {
  id: string;
  request: {
    id: string;
    profile: unknown;
    mode: 'table' | 'modern';
    scrub: boolean;
  };
}

self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  const port = event.ports[0];
  try {
    const { request } = event.data;
    port?.postMessage({ type: 'progress', payload: { progress: 0.2 } });
    const profile = request.scrub
      ? sanitizeProfileForShare(request.profile as any, true)
      : (request.profile as any);
    const html = renderProfileToTableHtml(profile);
    port?.postMessage({ type: 'progress', payload: { progress: 0.6 } });
    const png = await renderProfileToPng(profile);
    const lint = lintEmailHtml(html);
    const contrast = auditContrast(html);
    port?.postMessage({
      type: 'result',
      payload: {
        id: request.id,
        result: { html, png, lint, contrast },
      },
    });
  } catch (error) {
    port?.postMessage({
      type: 'error',
      payload: { message: error instanceof Error ? error.message : String(error) },
    });
  }
};

declare const self: DedicatedWorkerGlobalScope;
export {};
