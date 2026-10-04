import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { tones } from '../theme/theme';

/** Una forma por opción de respuesta (triángulo, rombo, círculo, cuadrado), como en los quizzes de aula. */
export const SHAPE_TONES = [tones.terracotta, tones.ochre, tones.teal, tones.plum];

export function ShapeGlyph({ index, size = 22 }: { index: number; size?: number }) {
  const fill = SHAPE_TONES[index];
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessible={false}>
      {index === 0 && <Path d="M12 3 L22 21 H2 Z" fill={fill} />}
      {index === 1 && <Path d="M12 2 L22 12 L12 22 L2 12 Z" fill={fill} />}
      {index === 2 && <Circle cx={12} cy={12} r={10} fill={fill} />}
      {index === 3 && <Rect x={3} y={3} width={18} height={18} rx={2} fill={fill} />}
    </Svg>
  );
}
