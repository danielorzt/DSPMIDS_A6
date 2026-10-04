import { useEffect, useMemo } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { useShake } from '../motion';
import { fonts, radius, useTheme } from '../theme/theme';
import { Icon } from './Icon';
import { PressableScale } from './PressableScale';
import { ShapeGlyph } from './ShapeGlyph';

export type OptionState = 'idle' | 'correct' | 'wrong' | 'dimmed';

type Props = {
  index: number;
  label: string;
  state: OptionState;
  disabled: boolean;
  minHeight?: number;
  onPress: () => void;
};

const SHAPE_NAMES = ['triángulo', 'rombo', 'círculo', 'cuadrado'];

export function AnswerOption({ index, label, state, disabled, minHeight = 58, onPress }: Props) {
  const t = useTheme();
  const { ref, style, shake } = useShake();

  useEffect(() => {
    if (state === 'wrong') shake();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        option: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 14,
          minHeight,
          borderWidth: 1.5,
          borderRadius: radius.md,
          paddingVertical: 12,
          paddingHorizontal: 16,
          marginBottom: 10,
        },
        label: { flex: 1, color: t.ink, fontSize: 17, lineHeight: 23, fontFamily: fonts.medium },
      }),
    [t, minHeight],
  );

  const tone =
    state === 'correct'
      ? { bg: t.successBg, border: t.success }
      : state === 'wrong'
        ? { bg: t.dangerBg, border: t.danger }
        : { bg: t.surface, border: t.line };

  return (
    <Animated.View ref={ref} style={[style, { opacity: state === 'dimmed' ? 0.45 : 1 }]}>
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
        {state === 'correct' && <Icon name="check" color={t.success} />}
        {state === 'wrong' && <Icon name="close" color={t.danger} />}
      </PressableScale>
    </Animated.View>
  );
}
