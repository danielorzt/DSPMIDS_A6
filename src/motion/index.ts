// Nativo (Android/iOS): GSAP no puede mover vistas nativas, así que aquí se usa Animated con
// useNativeDriver, que ejecuta la animación en el hilo de UI. Misma API que index.web.ts (GSAP).
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';
import { useReduceMotion } from '../lib/useReduceMotion';
import type { CountdownOptions, EnterOptions, Motion } from './types';

const OUT = Easing.out(Easing.exp);

export function useEnter({ delay = 0, distance = 14, deps = [] }: EnterOptions = {}): Motion {
  const reduce = useReduceMotion();
  const v = useRef(new Animated.Value(reduce ? 1 : 0)).current;
  useEffect(() => {
    if (reduce) return v.setValue(1);
    v.setValue(0);
    const a = Animated.timing(v, { toValue: 1, duration: 500, delay: delay * 1000, easing: OUT, useNativeDriver: true });
    a.start();
    return () => a.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce, ...deps]);
  return {
    ref: useRef(null),
    style: { opacity: v, transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [distance, 0] }) }] },
  };
}

export function useFloat(enabled = true): Motion {
  const reduce = useReduceMotion();
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!enabled || reduce) return;
    const ease = Easing.inOut(Easing.sin);
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(v, { toValue: 1, duration: 2200, easing: ease, useNativeDriver: true }),
        Animated.timing(v, { toValue: 0, duration: 2200, easing: ease, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [enabled, reduce, v]);
  return {
    ref: useRef(null),
    style: {
      transform: [
        { translateY: v.interpolate({ inputRange: [0, 1], outputRange: [3, -5] }) },
        { rotate: v.interpolate({ inputRange: [0, 1], outputRange: ['-2deg', '2deg'] }) },
      ],
    },
  };
}

export function useCountdown({ seconds, runKey, color, warnColor, warnAt = 0.25, onDone }: CountdownOptions) {
  const v = useRef(new Animated.Value(1)).current;
  const [warn, setWarn] = useState(false);
  const done = useRef(onDone);
  done.current = onDone;
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    v.setValue(1);
    setWarn(false);
    timer.current = setTimeout(() => setWarn(true), seconds * (1 - warnAt) * 1000);
    const a = Animated.timing(v, { toValue: 0, duration: seconds * 1000, easing: Easing.linear, useNativeDriver: true });
    a.start(({ finished }) => finished && done.current());
    return () => {
      a.stop();
      clearTimeout(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runKey]);

  return {
    ref: useRef(null),
    style: { backgroundColor: warn ? warnColor : color, transformOrigin: 'left', transform: [{ scaleX: v }] },
    stop: () => {
      v.stopAnimation();
      clearTimeout(timer.current);
    },
  } as Motion & { stop: () => void };
}

export function useShake() {
  const reduce = useReduceMotion();
  const v = useRef(new Animated.Value(0)).current;
  const shake = () => {
    if (reduce) return;
    Animated.sequence(
      [6, -6, 4, -4, 0].map((x) => Animated.timing(v, { toValue: x, duration: 50, useNativeDriver: true })),
    ).start();
  };
  return { ref: useRef(null), style: { transform: [{ translateX: v }] }, shake } as Motion & { shake: () => void };
}

export function usePress() {
  const v = useRef(new Animated.Value(1)).current;
  const to = (scale: number) => () =>
    Animated.timing(v, { toValue: scale, duration: 120, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  return { ref: useRef(null), style: { transform: [{ scale: v }] }, onPressIn: to(0.98), onPressOut: to(1) } as Motion & {
    onPressIn: () => void;
    onPressOut: () => void;
  };
}

export function useStaggerIn(count: number, { delay = 0.15, each = 0.09 } = {}) {
  const reduce = useReduceMotion();
  const values = useRef(Array.from({ length: count }, () => new Animated.Value(reduce ? 1 : 0))).current;
  useEffect(() => {
    if (reduce) return values.forEach((v) => v.setValue(1));
    Animated.sequence([
      Animated.delay(delay * 1000),
      Animated.stagger(each * 1000, values.map((v) => Animated.timing(v, { toValue: 1, duration: 320, easing: OUT, useNativeDriver: true }))),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);
  return {
    setRef: (_i: number) => (_node: unknown) => {},
    styleFor: (i: number) => ({
      opacity: values[i],
      transform: [{ scaleY: values[i].interpolate({ inputRange: [0, 1], outputRange: [0.2, 1] }) }],
    }),
  };
}
