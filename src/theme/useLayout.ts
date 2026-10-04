import { useWindowDimensions } from 'react-native';

const clamp = (min: number, v: number, max: number) => Math.min(max, Math.max(min, v));

/**
 * Medidas que se adaptan a la pantalla: teléfonos estrechos (≤ 360 px), pantallas bajas
 * (navegador móvil con barras visibles, teléfonos pequeños) y tabletas.
 */
export function useLayout() {
  const { width, height } = useWindowDimensions();
  const compact = width < 380;
  const short = height < 720;
  // Teléfono en horizontal: poca altura, mucho ancho → el quiz pasa a dos columnas.
  const landscape = width > height && height < 600;

  return {
    width,
    height,
    compact,
    short,
    landscape,
    gutter: compact ? 18 : 24,
    maxWidth: landscape ? 960 : 640,
    titleSize: clamp(40, width * 0.14, 64),
    headingSize: compact ? 44 : 52,
    questionSize: compact || short ? 23 : 28,
    artHeight: Math.round(landscape ? clamp(80, height * 0.34, 150) : clamp(96, height * 0.2, 180)),
    artSize: Math.round(landscape ? clamp(64, height * 0.28, 120) : clamp(76, height * 0.17, 150)),
    optionHeight: short ? 50 : 58,
  };
}
