import { memo } from 'react';
import { ICONS, iconToDataUri } from '../assets/icons';

interface SocialIconProps {
  platform: string;
  color?: string;
}

export const SocialIcon = memo(({ platform, color = '#0ea5e9' }: SocialIconProps) => {
  const svg = ICONS[platform] ?? ICONS.link;
  const uri = iconToDataUri(svg, color);
  return <img src={uri} width={16} height={16} alt={`${platform} icon`} />;
});
