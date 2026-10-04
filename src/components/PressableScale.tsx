import { useRef } from 'react';
import { Animated, Easing, Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import { tap } from '../lib/feedback';

type Props = Omit<PressableProps, 'style'> & { style?: StyleProp<ViewStyle>; haptic?: boolean };

/** Pressable con un leve hundimiento al tocar (ease-out corto, sin rebote). */
export function PressableScale({ style, onPressIn, onPressOut, onPress, haptic = true, children, ...rest }: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const to = (v: number) =>
    Animated.timing(scale, { toValue: v, duration: 110, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();

  return (
    <Pressable
      {...rest}
      onPressIn={(e) => {
        to(0.98);
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        to(1);
        onPressOut?.(e);
      }}
      onPress={(e) => {
        if (haptic) tap();
        onPress?.(e);
      }}
    >
      <Animated.View style={[style, { transform: [{ scale }] }]}>{children as React.ReactNode}</Animated.View>
    </Pressable>
  );
}
