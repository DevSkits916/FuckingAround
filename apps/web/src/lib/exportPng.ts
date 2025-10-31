import { SignatureProfile, renderProfileToPng } from '@smart-signature/shared';

export const exportPng = (profile: SignatureProfile) => renderProfileToPng(profile);
