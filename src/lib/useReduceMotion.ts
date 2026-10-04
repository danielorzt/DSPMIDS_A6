import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

/** Respeta el ajuste "reducir movimiento / quitar animaciones" del sistema. */
export function useReduceMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduce).catch(() => {});
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduce);
    return () => sub.remove();
  }, []);
  return reduce;
}
