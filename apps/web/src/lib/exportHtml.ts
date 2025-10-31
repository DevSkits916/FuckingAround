import { renderProfileToTableHtml, renderProfileToModernHtml, SignatureProfile } from '@smart-signature/shared';

export const exportTableHtml = (profile: SignatureProfile) => renderProfileToTableHtml(profile);
export const exportModernHtml = (profile: SignatureProfile) => renderProfileToModernHtml(profile);
