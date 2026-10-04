import { useRef } from 'react';
import { Animated, Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import { tap } from '../lib/feedback';

type Props = Omit<PressableProps, 'style'> & { style?: StyleProp<ViewStyle>; haptic?: boolean };

/** Pressable con resorte de escala al tocar: respuesta táctil inmediata. */
export function PressableScale({ style, onPressIn, onPressOut, onPress, haptic = true, children, ...rest }: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const to = (v: number) =>
    Animated.spring(scale, { toValue: v, useNativeDriver: true, speed: 40, bounciness: 6 }).start();

  return (
    <Pressable
      {...rest}
      onPressIn={(e) => {
        to(0.96);
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
