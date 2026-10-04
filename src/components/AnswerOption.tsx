import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { fonts, radius, useTheme } from '../theme/theme';
import { PressableScale } from './PressableScale';
import { ShapeGlyph } from './ShapeGlyph';

export type OptionState = 'idle' | 'correct' | 'wrong' | 'dimmed';

type Props = {
  index: number;
  label: string;
  state: OptionState;
  disabled: boolean;
  onPress: () => void;
};

const SHAPE_NAMES = ['triángulo', 'rombo', 'círculo', 'cuadrado'];

export function AnswerOption({ index, label, state, disabled, onPress }: Props) {
  const t = useTheme();
  const shake = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (state !== 'wrong') return;
    Animated.sequence(
      [6, -6, 4, -4, 0].map((v) => Animated.timing(shake, { toValue: v, duration: 50, easing: Easing.out(Easing.quad), useNativeDriver: true })),
    ).start();
  }, [state, shake]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        option: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 14,
          minHeight: 58,
          borderWidth: 1.5,
          borderRadius: radius.md,
          paddingVertical: 12,
          paddingHorizontal: 16,
          marginBottom: 10,
        },
        label: { flex: 1, color: t.ink, fontSize: 17, lineHeight: 23, fontFamily: fonts.medium },
      }),
    [t],
  );

  const tone =
    state === 'correct'
      ? { bg: t.successBg, border: t.success }
      : state === 'wrong'
        ? { bg: t.dangerBg, border: t.danger }
        : { bg: t.surface, border: t.line };

  return (
    <Animated.View style={{ transform: [{ translateX: shake }], opacity: state === 'dimmed' ? 0.45 : 1 }}>
      <PressableScale
        onPress={onPress}
        disabled={disabled}
        haptic={!disabled}
        accessibilityRole="button"
        accessibilityLabel={`Opción ${index + 1}, ${SHAPE_NAMES[index]}: ${label}`}
        accessibilityState={{ disabled }}
        style={[styles.option, { backgroundColor: tone.bg, borderColor: tone.border }]}
      >
        <ShapeGlyph index={index} />
        <Text style={styles.label}>{label}</Text>
        {state === 'correct' && <MaterialCommunityIcons name="check" size={22} color={t.success} />}
        {state === 'wrong' && <MaterialCommunityIcons name="close" size={22} color={t.danger} />}
      </PressableScale>
    </Animated.View>
  );
}
