import { useColorScheme } from 'react-native';

export type Palette = {
  scheme: 'light' | 'dark';
  bg: string;
  surface: string;
  ink: string;
  inkOnInk: string;
  muted: string;
  line: string;
  success: string;
  successBg: string;
  danger: string;
  dangerBg: string;
};

// Papel y tinta: neutros con matiz cálido, nunca gris puro.
const light: Palette = {
  scheme: 'light',
  bg: '#F4F0E8',
  surface: '#FBF8F2',
  ink: '#1B1A17',
  inkOnInk: '#F4F0E8',
  muted: '#6A6458',
  line: '#D8D0C0',
  success: '#2F7A4B',
  successBg: 'rgba(47,122,75,0.12)',
  danger: '#B83A2B',
  dangerBg: 'rgba(184,58,43,0.11)',
};

const dark: Palette = {
  scheme: 'dark',
  bg: '#14130F',
  surface: '#1D1B16',
  ink: '#F2EDE3',
  inkOnInk: '#14130F',
  muted: '#A39C8D',
  line: '#38342B',
  success: '#6DBB86',
  successBg: 'rgba(109,187,134,0.16)',
  danger: '#E5806F',
  dangerBg: 'rgba(229,128,111,0.15)',
};

export const useTheme = (): Palette => (useColorScheme() === 'dark' ? dark : light);

/** Tonos de acento: se usan en pocas dosis (ilustraciones y formas de respuesta). */
export const tones = {
  terracotta: '#C8553D',
  ochre: '#D9A441',
  teal: '#2F7F79',
  plum: '#7A5A9A',
  ultramarine: '#3B4FC4',
  moss: '#5E8C4A',
};

export const fonts = {
  display: 'InstrumentSerif_400Regular',
  displayItalic: 'InstrumentSerif_400Regular_Italic',
  body: 'DMSans_400Regular',
  medium: 'DMSans_500Medium',
  bold: 'DMSans_700Bold',
};

export const radius = { sm: 10, md: 14, lg: 20 };
