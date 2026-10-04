import { useMemo } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import type { Category } from '../data/categories';
import type { BestScore } from '../lib/scores';
import { useEnter } from '../motion';
import { fonts, radius, useTheme } from '../theme/theme';
import { useLayout } from '../theme/useLayout';
import { Icon } from './Icon';
import { Illustration } from './Illustration';
import { PressableScale } from './PressableScale';

type Props = { category: Category; best?: BestScore; index: number; onPress: () => void };

/** Fila de índice editorial: miniatura, título y mejor puntaje, separadas por una línea fina. */
export function CategoryRow({ category, best, index, onPress }: Props) {
  const t = useTheme();
  const L = useLayout();
  const enter = useEnter({ delay: 0.08 + index * 0.06 });

  const styles = useMemo(
    () =>
      StyleSheet.create({
        row: { flexDirection: 'row', alignItems: 'center', gap: L.compact ? 12 : 16, minHeight: L.compact ? 76 : 88, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: t.line },
        thumb: { width: L.compact ? 54 : 64, height: L.compact ? 54 : 64, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', backgroundColor: category.tone + '24' },
        text: { flex: 1 },
        title: { color: t.ink, fontSize: L.compact ? 23 : 26, lineHeight: L.compact ? 27 : 30, fontFamily: fonts.display },
        sub: { color: t.muted, fontSize: L.compact ? 13 : 14, marginTop: 2, fontFamily: fonts.body },
        score: { color: best ? t.ink : t.muted, fontSize: 14, fontFamily: fonts.medium },
        right: { alignItems: 'flex-end', gap: 2 },
      }),
    [t, category.tone, best, L.compact],
  );

  return (
    <Animated.View ref={enter.ref} style={enter.style}>
      <PressableScale
        onPress={onPress}
        style={styles.row}
        accessibilityRole="button"
        accessibilityLabel={`${category.title}. ${category.subtitle}. ${best ? `Mejor puntaje ${best.correct} de ${best.total}` : 'Sin jugar'}`}
      >
        <View style={styles.thumb}>
          <Illustration kind={category.art} tone={category.tone} size={L.compact ? 44 : 54} animated={false} />
        </View>
        <View style={styles.text}>
          <Text style={styles.title}>{category.title}</Text>
          <Text style={styles.sub}>{category.subtitle}</Text>
        </View>
        <View style={styles.right}>
          <Text style={styles.score}>{best ? `${best.correct}/${best.total}` : '—'}</Text>
        </View>
        <Icon name="chevron-right" color={t.muted} />
      </PressableScale>
    </Animated.View>
  );
}
