import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import type { Category } from '../data/categories';
import type { BestScore } from '../lib/scores';
import { useReduceMotion } from '../lib/useReduceMotion';
import { fonts, radius, useTheme } from '../theme/theme';
import { Illustration } from './Illustration';
import { PressableScale } from './PressableScale';

type Props = { category: Category; best?: BestScore; index: number; onPress: () => void };

/** Fila de índice editorial: miniatura, título y mejor puntaje, separadas por una línea fina. */
export function CategoryRow({ category, best, index, onPress }: Props) {
  const t = useTheme();
  const reduce = useReduceMotion();
  const enter = useRef(new Animated.Value(reduce ? 1 : 0)).current;

  useEffect(() => {
    if (reduce) return enter.setValue(1);
    Animated.timing(enter, { toValue: 1, duration: 520, delay: 80 + index * 60, easing: Easing.out(Easing.exp), useNativeDriver: true }).start();
  }, [enter, index, reduce]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        row: { flexDirection: 'row', alignItems: 'center', gap: 16, minHeight: 88, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: t.line },
        thumb: { width: 64, height: 64, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', backgroundColor: category.tone + '24' },
        text: { flex: 1 },
        title: { color: t.ink, fontSize: 26, lineHeight: 30, fontFamily: fonts.display },
        sub: { color: t.muted, fontSize: 14, marginTop: 2, fontFamily: fonts.body },
        score: { color: best ? t.ink : t.muted, fontSize: 14, fontFamily: fonts.medium },
        right: { alignItems: 'flex-end', gap: 2 },
      }),
    [t, category.tone, best],
  );

  return (
    <Animated.View style={{ opacity: enter, transform: [{ translateY: enter.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) }] }}>
      <PressableScale
        onPress={onPress}
        style={styles.row}
        accessibilityRole="button"
        accessibilityLabel={`${category.title}. ${category.subtitle}. ${best ? `Mejor puntaje ${best.correct} de ${best.total}` : 'Sin jugar'}`}
      >
        <View style={styles.thumb}>
          <Illustration kind={category.art} tone={category.tone} size={54} animated={false} />
        </View>
        <View style={styles.text}>
          <Text style={styles.title}>{category.title}</Text>
          <Text style={styles.sub}>{category.subtitle}</Text>
        </View>
        <View style={styles.right}>
          <Text style={styles.score}>{best ? `${best.correct}/${best.total}` : '—'}</Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={22} color={t.muted} />
      </PressableScale>
    </Animated.View>
  );
}
