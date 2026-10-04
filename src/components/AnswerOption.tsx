import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '../theme/theme';
import { PressableScale } from './PressableScale';

export type OptionState = 'idle' | 'correct' | 'wrong' | 'dimmed';

type Props = {
  letter: string;
  label: string;
  state: OptionState;
  disabled: boolean;
  onPress: () => void;
};

export function AnswerOption({ letter, label, state, disabled, onPress }: Props) {
  const shake = useRef(new Animated.Value(0)).current;
  const pop = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (state === 'wrong') {
      Animated.sequence(
        [10, -10, 7, -7, 3, 0].map((v) => Animated.timing(shake, { toValue: v, duration: 55, useNativeDriver: true })),
      ).start();
    } else if (state === 'correct') {
      Animated.sequence([
        Animated.spring(pop, { toValue: 1.04, useNativeDriver: true, speed: 30 }),
        Animated.spring(pop, { toValue: 1, useNativeDriver: true, speed: 20 }),
      ]).start();
    }
  }, [state, shake, pop]);

  const tone =
    state === 'correct'
      ? { bg: colors.successBg, border: colors.success, badge: colors.success }
      : state === 'wrong'
        ? { bg: colors.dangerBg, border: colors.danger, badge: colors.danger }
        : { bg: colors.surface, border: colors.border, badge: 'rgba(255,255,255,0.12)' };

  return (
    <Animated.View style={{ transform: [{ translateX: shake }, { scale: pop }], opacity: state === 'dimmed' ? 0.45 : 1 }}>
      <PressableScale
        onPress={onPress}
        disabled={disabled}
        haptic={!disabled}
        accessibilityRole="button"
        accessibilityLabel={`Opción ${letter}: ${label}`}
        accessibilityState={{ disabled }}
        style={[styles.option, { backgroundColor: tone.bg, borderColor: tone.border }]}
      >
        <View style={[styles.badge, { backgroundColor: tone.badge }]}>
          {state === 'correct' || state === 'wrong' ? (
            <MaterialCommunityIcons name={state === 'correct' ? 'check' : 'close'} size={18} color="#0B0A1A" />
          ) : (
            <Text style={styles.letter}>{letter}</Text>
          )}
        </View>
        <Text style={styles.label}>{label}</Text>
      </PressableScale>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1.5,
    borderRadius: radius.md,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  badge: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  letter: { color: colors.text, fontWeight: '800', fontSize: 15 },
  label: { flex: 1, color: colors.text, fontSize: 16.5, fontWeight: '600', lineHeight: 22 },
});
