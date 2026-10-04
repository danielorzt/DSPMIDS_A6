import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import Svg, { Circle, G, Path, Rect } from 'react-native-svg';
import { useReduceMotion } from '../lib/useReduceMotion';
import { useTheme } from '../theme/theme';

export type ArtKind =
  | 'controller' | 'handheld' | 'dualscreen' | 'hybrid' | 'console' | 'disc' | 'cartridge' | 'cards'
  | 'motion' | 'person' | 'calendar' | 'cloud' | 'trophy' | 'stopwatch' | 'crosshair' | 'sword'
  | 'bubble' | 'cube' | 'blocks' | 'dots' | 'pong' | 'studio' | 'spikes' | 'sensor' | 'drive'
  | 'gear' | 'frames' | 'symbols' | 'sparkle';

/** Polígono de estrella/engranaje con n puntas entre dos radios. */
function burst(cx: number, cy: number, outer: number, inner: number, n: number) {
  const pts = Array.from({ length: n * 2 }, (_, i) => {
    const r = i % 2 === 0 ? outer : inner;
    const a = (Math.PI * i) / n - Math.PI / 2;
    return `${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`;
  });
  return `M${pts.join(' L')} Z`;
}

type Parts = { tint: React.ReactNode; line: React.ReactNode; fill?: React.ReactNode };

// Todas las piezas son dibujos propios sobre una cuadrícula de 120×120: sin marcas ni personajes de terceros.
function parts(kind: ArtKind, ink: string): Parts {
  switch (kind) {
    case 'controller':
      return {
        tint: <Rect x={20} y={46} width={92} height={46} rx={23} />,
        line: (
          <>
            <Rect x={12} y={40} width={92} height={46} rx={23} />
            <Path d="M34 52 v18 M25 61 h18" />
            <Circle cx={76} cy={55} r={4} />
            <Circle cx={87} cy={66} r={4} />
          </>
        ),
      };
    case 'handheld':
      return {
        tint: <Rect x={40} y={20} width={52} height={92} rx={8} />,
        line: (
          <>
            <Rect x={34} y={14} width={52} height={92} rx={8} />
            <Rect x={42} y={22} width={36} height={34} rx={3} />
            <Path d="M46 76 v14 M39 83 h14" />
            <Circle cx={70} cy={78} r={4} />
            <Circle cx={78} cy={70} r={4} />
          </>
        ),
      };
    case 'dualscreen':
      return {
        tint: <Rect x={34} y={70} width={64} height={42} rx={6} />,
        line: (
          <>
            <Rect x={28} y={10} width={64} height={42} rx={6} />
            <Rect x={28} y={64} width={64} height={42} rx={6} />
            <Path d="M28 58 h64" />
          </>
        ),
      };
    case 'hybrid':
      return {
        tint: <Rect x={36} y={40} width={60} height={46} rx={5} />,
        line: (
          <>
            <Rect x={30} y={34} width={60} height={46} rx={5} />
            <Rect x={12} y={32} width={14} height={50} rx={7} />
            <Rect x={94} y={32} width={14} height={50} rx={7} />
            <Circle cx={19} cy={46} r={3} />
            <Circle cx={101} cy={66} r={3} />
          </>
        ),
      };
    case 'console':
      return {
        tint: <Rect x={22} y={54} width={88} height={34} rx={6} />,
        line: (
          <>
            <Rect x={16} y={48} width={88} height={34} rx={6} />
            <Path d="M28 62 h40" />
            <Circle cx={88} cy={65} r={4} />
          </>
        ),
      };
    case 'disc':
      return {
        tint: <Circle cx={67} cy={67} r={40} />,
        line: (
          <>
            <Circle cx={60} cy={60} r={40} />
            <Circle cx={60} cy={60} r={10} />
            <Path d="M34 48 A30 30 0 0 1 56 30" />
          </>
        ),
      };
    case 'cartridge':
      return {
        tint: <Rect x={44} y={28} width={36} height={30} rx={3} />,
        line: (
          <>
            <Rect x={32} y={16} width={56} height={86} rx={6} />
            <Rect x={42} y={26} width={36} height={30} rx={3} />
            <Path d="M46 90 v8 M54 90 v8 M62 90 v8 M70 90 v8" />
          </>
        ),
      };
    case 'cards':
      return {
        tint: <Rect x={50} y={32} width={34} height={60} rx={5} />,
        line: (
          <>
            <Rect x={26} y={28} width={34} height={60} rx={5} transform="rotate(-16 43 88)" />
            <Rect x={60} y={28} width={34} height={60} rx={5} transform="rotate(16 77 88)" />
            <Rect x={43} y={26} width={34} height={60} rx={5} />
          </>
        ),
      };
    case 'motion':
      return {
        tint: <Rect x={50} y={36} width={24} height={60} rx={8} transform="rotate(-12 56 66)" />,
        line: (
          <>
            <Rect x={44} y={30} width={24} height={60} rx={8} transform="rotate(-12 56 60)" />
            <Circle cx={56} cy={48} r={4} />
            <Path d="M82 42 a22 22 0 0 1 0 36 M94 32 a36 36 0 0 1 0 56" />
          </>
        ),
      };
    case 'person':
      return {
        tint: <Path d="M32 106 C32 82 48 72 66 72 C84 72 100 82 100 106 Z" />,
        line: (
          <>
            <Circle cx={60} cy={40} r={16} />
            <Path d="M26 102 C26 78 42 68 60 68 C78 68 94 78 94 102 Z" />
          </>
        ),
      };
    case 'calendar':
      return {
        tint: <Rect x={28} y={32} width={76} height={72} rx={8} />,
        line: (
          <>
            <Rect x={22} y={26} width={76} height={72} rx={8} />
            <Path d="M22 46 H98 M42 18 v14 M78 18 v14" />
          </>
        ),
        fill: (
          <>
            <Circle cx={40} cy={62} r={2.5} />
            <Circle cx={60} cy={62} r={2.5} />
            <Circle cx={80} cy={62} r={2.5} />
            <Circle cx={40} cy={80} r={2.5} />
            <Circle cx={60} cy={80} r={2.5} />
          </>
        ),
      };
    case 'cloud':
      return {
        tint: <Path d="M42 90 a18 18 0 0 1 2 -36 a24 24 0 0 1 46 6 a15 15 0 0 1 -2 30 Z" />,
        line: (
          <>
            <Path d="M36 84 a18 18 0 0 1 2 -36 a24 24 0 0 1 46 6 a15 15 0 0 1 -2 30 Z" />
            <Path d="M60 58 v22 M50 70 l10 10 l10 -10" />
          </>
        ),
      };
    case 'trophy':
      return {
        tint: <Path d="M46 28 H86 V56 a20 20 0 0 1 -40 0 Z" />,
        line: (
          <>
            <Path d="M40 22 H80 V50 a20 20 0 0 1 -40 0 Z" />
            <Path d="M40 30 H28 a8 8 0 0 0 8 18 M80 30 H92 a8 8 0 0 1 -8 18 M60 70 V86" />
            <Rect x={44} y={86} width={32} height={10} rx={3} />
          </>
        ),
      };
    case 'stopwatch':
      return {
        tint: <Circle cx={66} cy={72} r={34} />,
        line: (
          <>
            <Circle cx={60} cy={66} r={34} />
            <Rect x={52} y={14} width={16} height={8} rx={2} />
            <Path d="M60 22 v10 M60 66 L74 50" />
          </>
        ),
      };
    case 'crosshair':
      return {
        tint: <Circle cx={66} cy={66} r={28} />,
        line: (
          <>
            <Circle cx={60} cy={60} r={28} />
            <Path d="M60 20 v24 M60 76 v24 M20 60 h24 M76 60 h24" />
          </>
        ),
        fill: <Circle cx={60} cy={60} r={3} />,
      };
    case 'sword':
      return {
        tint: <Path d="M96 22 L102 28 L62 72 L56 66 Z" />,
        line: (
          <>
            <Path d="M90 16 L96 22 L56 66 L50 60 Z" />
            <Path d="M40 56 L64 80 M46 76 L34 88" />
            <Circle cx={29} cy={93} r={5} />
          </>
        ),
      };
    case 'bubble':
      return {
        tint: <Rect x={28} y={32} width={80} height={50} rx={14} />,
        line: (
          <>
            <Rect x={20} y={26} width={80} height={50} rx={14} />
            <Path d="M44 76 L38 96 L62 76" />
          </>
        ),
        fill: (
          <>
            <Circle cx={44} cy={51} r={3.5} />
            <Circle cx={60} cy={51} r={3.5} />
            <Circle cx={76} cy={51} r={3.5} />
          </>
        ),
      };
    case 'cube':
      return {
        tint: <Path d="M66 22 L104 44 L66 66 L28 44 Z" />,
        line: (
          <>
            <Path d="M60 16 L98 38 V82 L60 104 L22 82 V38 Z" />
            <Path d="M22 38 L60 60 L98 38 M60 60 V104" />
          </>
        ),
      };
    case 'blocks':
      return {
        tint: (
          <>
            <Rect x={36} y={26} width={22} height={22} rx={3} />
            <Rect x={36} y={70} width={22} height={22} rx={3} />
          </>
        ),
        line: (
          <>
            <Rect x={30} y={20} width={22} height={22} rx={3} />
            <Rect x={30} y={42} width={22} height={22} rx={3} />
            <Rect x={30} y={64} width={22} height={22} rx={3} />
            <Rect x={52} y={64} width={22} height={22} rx={3} />
            <Rect x={74} y={64} width={22} height={22} rx={3} />
          </>
        ),
      };
    case 'dots':
      return {
        tint: <Circle cx={40} cy={66} r={12} />,
        line: (
          <>
            <Path d="M14 40 H106 M14 80 H106" />
            <Circle cx={34} cy={60} r={12} />
          </>
        ),
        fill: (
          <>
            <Circle cx={62} cy={60} r={3.5} />
            <Circle cx={76} cy={60} r={3.5} />
            <Circle cx={90} cy={60} r={3.5} />
          </>
        ),
      };
    case 'pong':
      return {
        tint: (
          <>
            <Rect x={24} y={40} width={8} height={40} rx={3} />
            <Rect x={100} y={52} width={8} height={40} rx={3} />
          </>
        ),
        line: (
          <>
            <Rect x={18} y={34} width={8} height={40} rx={3} />
            <Rect x={94} y={46} width={8} height={40} rx={3} />
            <Path d="M60 14 V106" strokeDasharray="4 9" />
          </>
        ),
        fill: <Circle cx={62} cy={58} r={5} />,
      };
    case 'studio':
      return {
        tint: <Rect x={32} y={42} width={68} height={66} />,
        line: (
          <>
            <Rect x={26} y={36} width={68} height={66} />
            <Path d="M20 36 L60 14 L100 36" />
            <Rect x={36} y={48} width={12} height={12} />
            <Rect x={72} y={48} width={12} height={12} />
            <Rect x={52} y={76} width={16} height={26} />
          </>
        ),
      };
    case 'spikes':
      return {
        tint: <Path d={burst(66, 66, 44, 26, 9)} />,
        line: (
          <>
            <Path d={burst(60, 60, 44, 26, 9)} />
            <Circle cx={60} cy={60} r={12} />
          </>
        ),
      };
    case 'sensor':
      return {
        tint: <Rect x={22} y={50} width={88} height={30} rx={15} />,
        line: (
          <>
            <Rect x={16} y={44} width={88} height={30} rx={15} />
            <Circle cx={36} cy={59} r={7} />
            <Circle cx={60} cy={59} r={4} />
            <Path d="M60 74 v14 M44 96 h32" />
          </>
        ),
      };
    case 'drive':
      return {
        tint: <Rect x={28} y={36} width={76} height={60} rx={8} />,
        line: (
          <>
            <Rect x={22} y={30} width={76} height={60} rx={8} />
            <Circle cx={50} cy={60} r={18} />
            <Path d="M50 60 L82 44" />
          </>
        ),
        fill: <Circle cx={86} cy={78} r={3} />,
      };
    case 'gear':
      return {
        tint: <Path d={burst(66, 66, 42, 32, 8)} />,
        line: (
          <>
            <Path d={burst(60, 60, 42, 32, 8)} />
            <Circle cx={60} cy={60} r={13} />
          </>
        ),
      };
    case 'frames':
      return {
        tint: <Rect x={50} y={60} width={56} height={36} rx={5} />,
        line: (
          <>
            <Rect x={14} y={18} width={56} height={36} rx={5} />
            <Rect x={28} y={38} width={56} height={36} rx={5} />
            <Rect x={42} y={58} width={56} height={36} rx={5} />
            <Path d="M64 68 L76 76 L64 84 Z" />
          </>
        ),
      };
    case 'symbols':
      return {
        tint: (
          <>
            <Circle cx={90} cy={38} r={14} />
            <Rect x={76} y={84} width={28} height={28} rx={2} />
          </>
        ),
        line: (
          <>
            <Path d="M36 18 L50 42 H22 Z" />
            <Circle cx={84} cy={32} r={14} />
            <Path d="M22 78 L50 106 M50 78 L22 106" />
            <Rect x={70} y={78} width={28} height={28} rx={2} />
          </>
        ),
      };
    case 'sparkle':
    default:
      return {
        tint: <Path d="M66 20 Q70 62 112 66 Q70 70 66 112 Q62 70 20 66 Q62 62 66 20 Z" />,
        line: (
          <>
            <Path d="M60 14 Q64 56 106 60 Q64 64 60 106 Q56 64 14 60 Q56 56 60 14 Z" />
            <Path d="M94 14 v14 M87 21 h14" />
          </>
        ),
      };
  }
}

type Props = { kind: ArtKind; tone: string; size?: number; animated?: boolean };

/** Ilustración vectorial original: trazo de tinta + una mancha de color levemente desplazada. */
export function Illustration({ kind, tone, size = 120, animated = true }: Props) {
  const t = useTheme();
  const reduce = useReduceMotion();
  const drift = useRef(new Animated.Value(0)).current;
  const { tint, line, fill } = parts(kind, t.ink);

  useEffect(() => {
    if (!animated || reduce) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(drift, { toValue: 1, duration: 2200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(drift, { toValue: 0, duration: 2200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [animated, reduce, drift]);

  return (
    <Animated.View
      accessible={false}
      style={{
        transform: [
          { translateY: drift.interpolate({ inputRange: [0, 1], outputRange: [3, -5] }) },
          { rotate: drift.interpolate({ inputRange: [0, 1], outputRange: ['-2deg', '2deg'] }) },
        ],
      }}
    >
      <Svg width={size} height={size} viewBox="0 0 120 120">
        <G fill={tone} opacity={0.85}>{tint}</G>
        <G fill="none" stroke={t.ink} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">{line}</G>
        {fill && <G fill={t.ink}>{fill}</G>}
      </Svg>
    </Animated.View>
  );
}
