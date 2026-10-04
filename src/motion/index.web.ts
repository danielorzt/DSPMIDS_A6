// Web: GSAP anima directamente los nodos del DOM (en react-native-web, la ref de una View es un HTMLElement).
// Así las animaciones corren con transforms en el compositor y no provocan un render de React por cuadro.
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';
import type { CountdownOptions, EnterOptions, Motion } from './types';

gsap.registerPlugin(useGSAP);
gsap.defaults({ ease: 'expo.out', duration: 0.5 });

const el = (ref: React.RefObject<unknown>) => ref.current as HTMLElement | null;
const MOTION_OK = '(prefers-reduced-motion: no-preference)';

/** Entrada: aparece subiendo levemente. Se repite cuando cambian las dependencias. */
export function useEnter({ delay = 0, distance = 14, deps = [] }: EnterOptions = {}): Motion {
  const ref = useRef<unknown>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(el(ref), { autoAlpha: 0, y: distance, delay, duration: 0.5 });
      });
      return () => mm.revert();
    },
    { dependencies: deps, revertOnUpdate: true },
  );
  return { ref };
}

/** Flotación lenta y continua para las ilustraciones. */
export function useFloat(enabled = true): Motion {
  const ref = useRef<unknown>(null);
  useGSAP(
    () => {
      if (!enabled) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          el(ref),
          { y: 3, rotation: -2 },
          { y: -5, rotation: 2, duration: 2.2, ease: 'sine.inOut', repeat: -1, yoyo: true },
        );
      });
      return () => mm.revert();
    },
    { dependencies: [enabled] },
  );
  return { ref };
}

/** Barra de tiempo: se encoge con scaleX (no con width) y cambia de color en el tramo final. */
export function useCountdown({ seconds, runKey, color, warnColor, warnAt = 0.25, onDone }: CountdownOptions) {
  const ref = useRef<unknown>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const done = useRef(onDone);
  done.current = onDone;

  useGSAP(
    () => {
      tl.current = gsap
        .timeline({ onComplete: () => done.current() })
        .fromTo(el(ref), { scaleX: 1, backgroundColor: color }, { scaleX: 0, duration: seconds, ease: 'none', transformOrigin: 'left center' })
        .set(el(ref), { backgroundColor: warnColor }, seconds * (1 - warnAt));
    },
    { dependencies: [runKey], revertOnUpdate: true },
  );
  return { ref, stop: () => tl.current?.pause() } as Motion & { stop: () => void };
}

/** Sacudida corta para la respuesta incorrecta. */
export function useShake() {
  const ref = useRef<unknown>(null);
  const { contextSafe } = useGSAP();
  const shake = contextSafe(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.to(el(ref), { keyframes: { x: [0, 6, -6, 4, -4, 0] }, duration: 0.28, ease: 'power1.out' });
  });
  return { ref, shake } as Motion & { shake: () => void };
}

/** Leve hundimiento al presionar. */
export function usePress() {
  const ref = useRef<unknown>(null);
  const { contextSafe } = useGSAP();
  const to = (scale: number) => contextSafe(() => gsap.to(el(ref), { scale, duration: 0.12, ease: 'power2.out', overwrite: 'auto' }));
  return { ref, onPressIn: to(0.98), onPressOut: to(1) } as Motion & { onPressIn: () => void; onPressOut: () => void };
}

/** Entrada escalonada de una lista de elementos (p. ej. la tira de aciertos). */
export function useStaggerIn(count: number, { delay = 0.15, each = 0.09 } = {}) {
  const refs = useRef<unknown[]>([]);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.from(refs.current.slice(0, count), { autoAlpha: 0, scaleY: 0.2, delay, stagger: each, duration: 0.32 });
    });
    return () => mm.revert();
  });
  return {
    setRef: (i: number) => (node: unknown) => {
      refs.current[i] = node;
    },
    styleFor: (_i: number) => undefined,
  };
}
