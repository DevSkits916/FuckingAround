import { SignatureState, SignatureConfigExport } from '../types';
import { modelToHtml } from './modelToHtml';

const APP_VERSION = '2.0.0';

export interface HtmlExportResult {
  modern: string;
  table: string;
  singleFile: string;
}

function wrapDocument(body: string, title: string, state: SignatureState) {
  const exportData: SignatureConfigExport = {
    schemaVersion: '2.0.0',
    exportedAt: new Date().toISOString(),
    data: state,
  };
  const metaComment = `<!-- smart-signature-builder ${APP_VERSION} | ${exportData.exportedAt} | config:${
    encodeURIComponent(JSON.stringify(exportData))
  } -->`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8" /><title>${title}</title></head><body>${metaComment}${body}</body></html>`;
}

export function exportHtml(state: SignatureState): HtmlExportResult {
  const modern = modelToHtml(state, { mode: 'modern' });
  const table = modelToHtml(state, { mode: 'table' });
  const singleFile = wrapDocument(table, `${state.identity.name} signature`, state);
  return { modern, table, singleFile };
}
