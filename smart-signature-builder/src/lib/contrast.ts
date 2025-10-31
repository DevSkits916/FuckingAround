import { ContrastResult, SignatureState } from '../types';

function luminance(hex: string) {
  const value = hex.replace('#', '');
  const rgb = value.length === 3
    ? value.split('').map((c) => parseInt(c + c, 16))
    : [
        parseInt(value.substring(0, 2), 16),
        parseInt(value.substring(2, 4), 16),
        parseInt(value.substring(4, 6), 16),
      ];
  const channel = rgb.map((component) => {
    const normalized = component / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : Math.pow((normalized + 0.055) / 1.055, 2.4);
  });
  return channel[0] * 0.2126 + channel[1] * 0.7152 + channel[2] * 0.0722;
}

export function contrastRatio(foreground: string, background: string) {
  const l1 = luminance(foreground);
  const l2 = luminance(background);
  const brightest = Math.max(l1, l2) + 0.05;
  const darkest = Math.min(l1, l2) + 0.05;
  return +(brightest / darkest).toFixed(2);
}

export function evaluateThemeContrast(state: SignatureState): ContrastResult[] {
  const results: ContrastResult[] = [];
  const { theme } = state;
  const textContrast = contrastRatio(theme.text, theme.background);
  results.push({
    id: 'text',
    ratio: textContrast,
    meetsAA: textContrast >= 4.5,
    textColor: theme.text,
    backgroundColor: theme.background,
    recommendation:
      textContrast >= 4.5
        ? undefined
        : 'Increase the contrast between text and background colors.',
  });

  const subtleContrast = contrastRatio(theme.subtleText, theme.background);
  results.push({
    id: 'subtle',
    ratio: subtleContrast,
    meetsAA: subtleContrast >= 3,
    textColor: theme.subtleText,
    backgroundColor: theme.background,
    recommendation:
      subtleContrast >= 3
        ? undefined
        : 'Consider using a darker shade for subtle text to maintain readability.',
  });

  const dividerContrast = contrastRatio(theme.divider, theme.background);
  results.push({
    id: 'divider',
    ratio: dividerContrast,
    meetsAA: dividerContrast >= 3,
    textColor: theme.divider,
    backgroundColor: theme.background,
    recommendation:
      dividerContrast >= 3
        ? undefined
        : 'Use a slightly darker divider color for better visibility.',
  });

  return results;
}
