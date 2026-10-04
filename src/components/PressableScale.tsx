import { Animated, Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import { tap } from '../lib/feedback';
import { usePress } from '../motion';

type Props = Omit<PressableProps, 'style'> & { style?: StyleProp<ViewStyle>; haptic?: boolean };

/** Pressable con un leve hundimiento al tocar (GSAP en web, Animated nativo en el teléfono). */
export function PressableScale({ style, onPressIn, onPressOut, onPress, haptic = true, children, ...rest }: Props) {
  const press = usePress();

  return (
    <Pressable
      {...rest}
      onPressIn={(e) => {
        press.onPressIn();
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        press.onPressOut();
        onPressOut?.(e);
      }}
      onPress={(e) => {
        if (haptic) tap();
        onPress?.(e);
      }}
    >
      <Animated.View ref={press.ref} style={[style, press.style]}>
        {children as React.ReactNode}
      </Animated.View>
    </Pressable>
  );
}
