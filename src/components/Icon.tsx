import Svg, { Path } from 'react-native-svg';

const PATHS = {
  close: 'M6 6 L18 18 M18 6 L6 18',
  check: 'M5 12.5 L10 17.5 L19 7',
  'arrow-right': 'M5 12 H19 M13 6 L19 12 L13 18',
  'chevron-right': 'M9 5 L16 12 L9 19',
  refresh: 'M19 12 a7 7 0 1 1 -2.05 -4.95 M19 4 V8 H15',
};

export type IconName = keyof typeof PATHS;

/** Íconos de trazo propios (5 en total): evitan descargar una fuente de íconos completa. */
export function Icon({ name, size = 22, color }: { name: IconName; size?: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessible={false}>
      <Path d={PATHS[name]} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  );
}
