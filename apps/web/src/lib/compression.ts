import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';
import { SignatureProfile, sanitizeProfileForShare } from '@smart-signature/shared';

export const encodeShareLink = (profile: SignatureProfile, scrub = false) => {
  const sanitized = sanitizeProfileForShare(profile, scrub);
  return compressToEncodedURIComponent(JSON.stringify(sanitized));
};

export const decodeShareLink = (hash: string): SignatureProfile | null => {
  try {
    const json = decompressFromEncodedURIComponent(hash);
    if (!json) return null;
    return JSON.parse(json) as SignatureProfile;
  } catch (error) {
    console.warn('Failed to decode share link', error);
    return null;
  }
};

