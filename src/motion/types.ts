import type { Animated, StyleProp, ViewStyle } from 'react-native';

/** Lo que devuelve cada hook: una ref para el elemento y, en nativo, el estilo animado. */
export type Motion = {
  ref: React.RefObject<any>;
  style?: StyleProp<Animated.WithAnimatedValue<ViewStyle>>;
};

export type EnterOptions = { delay?: number; distance?: number; deps?: unknown[] };

export type CountdownOptions = {
  seconds: number;
  /** Cambiar este valor reinicia la cuenta (p. ej. el índice de la pregunta). */
  runKey: unknown;
  color: string;
  warnColor: string;
  /** Fracción final del tiempo en la que la barra cambia a warnColor. */
  warnAt?: number;
  onDone: () => void;
};
