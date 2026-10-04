import { Redirect, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '../components/Icon';
import { PressableScale } from '../components/PressableScale';
import { getCategory } from '../data/categories';
import { success as hapticSuccess } from '../lib/feedback';
import { getRank } from '../lib/quiz';
import { saveScore } from '../lib/scores';
import { getLastResult } from '../lib/session';
import { useEnter, useStaggerIn } from '../motion';
import { fonts, radius, useTheme } from '../theme/theme';
import { useLayout } from '../theme/useLayout';

export default function ResultsScreen() {
  const result = getLastResult();
  if (!result) return <Redirect href="/" />;
  return <Results result={result} />;
}

function Results({ result }: { result: NonNullable<ReturnType<typeof getLastResult>> }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const t = useTheme();
  const L = useLayout();

  const category = getCategory(result.category);
  const total = result.items.length;
  const correct = result.items.filter((i) => i.ok).length;
  const wrong = total - correct;
  const rank = getRank(Math.round((correct / total) * 100));
  const [isRecord, setIsRecord] = useState(false);

  // El momento animado de la pantalla: el titular aparece y la tira de aciertos se rellena de izquierda a derecha.
  const heading = useEnter();
  const strip = useStaggerIn(total);

  useEffect(() => {
    if (correct / total >= 0.5) hapticSuccess();
    saveScore(category.id, { correct, total }).then(setIsRecord);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        root: { flex: 1, backgroundColor: t.bg },
        content: { paddingTop: insets.top + (L.short ? 24 : 40), paddingBottom: insets.bottom + 28, paddingHorizontal: L.gutter, width: '100%', maxWidth: L.maxWidth, alignSelf: 'center' },
        heading: { color: t.ink, fontSize: L.headingSize, lineHeight: L.headingSize * 1.04, fontFamily: fonts.display },
        rank: { color: t.muted, fontSize: L.compact ? 21 : 24, fontFamily: fonts.displayItalic, marginTop: 6 },
        message: { color: t.muted, fontSize: 16, lineHeight: 24, marginTop: 8, fontFamily: fonts.body },
        record: { color: t.success, fontSize: 14, fontFamily: fonts.bold, marginTop: 14 },
        strip: { flexDirection: 'row', gap: 5, marginTop: 28 },
        tick: { flex: 1, height: 10, borderRadius: 3 },
        summary: { color: t.muted, fontSize: 14, marginTop: 10, fontFamily: fonts.medium },
        review: { marginTop: 28 },
        item: { flexDirection: 'row', gap: 12, paddingVertical: 14, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: t.line },
        itemText: { flex: 1 },
        q: { color: t.ink, fontSize: 15.5, lineHeight: 22, fontFamily: fonts.medium },
        a: { color: t.muted, fontSize: 14, lineHeight: 20, marginTop: 3, fontFamily: fonts.body },
        actions: { gap: 10, marginTop: 24 },
        primary: { height: 56, borderRadius: radius.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: t.ink },
        primaryText: { color: t.inkOnInk, fontSize: 17, fontFamily: fonts.bold },
        secondary: { height: 56, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: t.line },
        secondaryText: { color: t.ink, fontSize: 16, fontFamily: fonts.medium },
      }),
    [t, insets, L],
  );

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Animated.View ref={heading.ref} style={heading.style}>
        <Text style={styles.heading} accessibilityRole="header">
          {correct} de {total}
        </Text>
        <Text style={styles.rank}>{rank.title}</Text>
        <Text style={styles.message}>{rank.message}</Text>
        {isRecord && <Text style={styles.record}>Nuevo récord en {category.title}</Text>}
      </Animated.View>

      <View style={styles.strip} accessible accessibilityLabel={`${correct} de ${total} correctas`}>
        {result.items.map((item, i) => (
          <Animated.View key={i} ref={strip.setRef(i)} style={[styles.tick, { backgroundColor: item.ok ? t.success : t.danger }, strip.styleFor(i)]} />
        ))}
      </View>
      <Text style={styles.summary}>
        {correct} {correct === 1 ? 'correcta' : 'correctas'} · {wrong} {wrong === 1 ? 'incorrecta' : 'incorrectas'} · mejor racha {result.bestStreak}
      </Text>

      <View style={styles.review}>
        {result.items.map((item, i) => (
          <View key={i} style={styles.item}>
            <Icon name={item.ok ? 'check' : 'close'} size={20} color={item.ok ? t.success : t.danger} />
            <View style={styles.itemText}>
              <Text style={styles.q}>{item.text}</Text>
              <Text style={styles.a}>
                {item.ok ? item.correct : `${item.chosen ?? 'Sin responder'} → ${item.correct}`}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.actions}>
        <PressableScale
          onPress={() => router.replace({ pathname: '/quiz/[id]', params: { id: category.id, run: String(Date.now()) } })}
          style={styles.primary}
          accessibilityRole="button"
          accessibilityLabel="Jugar de nuevo"
        >
          <Icon name="refresh" size={20} color={t.inkOnInk} />
          <Text style={styles.primaryText}>Jugar de nuevo</Text>
        </PressableScale>
        <PressableScale onPress={() => router.replace('/')} style={styles.secondary} accessibilityRole="button" accessibilityLabel="Elegir otra categoría">
          <Text style={styles.secondaryText}>Elegir otra categoría</Text>
        </PressableScale>
      </View>
    </ScrollView>
  );
}
