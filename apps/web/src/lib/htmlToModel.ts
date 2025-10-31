import { SignatureProfile } from '@smart-signature/shared';

export const htmlToModel = (html: string): SignatureProfile => {
  return JSON.parse(html) as SignatureProfile;
};
