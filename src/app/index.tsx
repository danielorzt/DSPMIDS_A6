import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CategoryRow } from '../components/CategoryRow';
import { Illustration } from '../components/Illustration';
import { PressableScale } from '../components/PressableScale';
import { CATEGORIES, MIX } from '../data/categories';
import { QUESTIONS_PER_QUIZ, SECONDS_PER_QUESTION } from '../lib/quiz';
import { getBestScores, type BestScore } from '../lib/scores';
import { fonts, radius, useTheme } from '../theme/theme';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const t = useTheme();
  const [best, setBest] = useState<Record<string, BestScore>>({});

  // Los récords se refrescan cada vez que se vuelve a esta pantalla.
  useFocusEffect(
    useCallback(() => {
      getBestScores().then(setBest);
    }, []),
  );

  const play = (id: string) => router.push({ pathname: '/quiz/[id]', params: { id } });

  const styles = useMemo(
    () =>
      StyleSheet.create({
        root: { flex: 1, backgroundColor: t.bg },
        content: { paddingTop: insets.top + 36, paddingBottom: insets.bottom + 32, paddingHorizontal: 24, width: '100%', maxWidth: 640, alignSelf: 'center' },
        title: { color: t.ink, fontSize: 56, lineHeight: 58, fontFamily: fonts.display, letterSpacing: -0.5 },
        lead: { color: t.muted, fontSize: 16, lineHeight: 24, marginTop: 10, fontFamily: fonts.body, maxWidth: 360 },
        mix: { flexDirection: 'row', alignItems: 'center', gap: 16, minHeight: 104, marginTop: 32, padding: 20, borderRadius: radius.lg, backgroundColor: t.ink },
        mixTitle: { color: t.inkOnInk, fontSize: 28, lineHeight: 32, fontFamily: fonts.display },
        mixSub: { color: t.inkOnInk, opacity: 0.72, fontSize: 14, marginTop: 2, fontFamily: fonts.body },
        mixArt: { width: 72, height: 72, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', backgroundColor: t.bg },
        section: { color: t.ink, fontSize: 22, fontFamily: fonts.displayItalic, marginTop: 36, marginBottom: 4 },
        footer: { color: t.muted, fontSize: 12, textAlign: 'center', marginTop: 36, fontFamily: fonts.body },
      }),
    [t, insets],
  );

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.title} accessibilityRole="header">Pixel Quest</Text>
      <Text style={styles.lead}>
        Trivia de videojuegos. {QUESTIONS_PER_QUIZ} preguntas por ronda, {SECONDS_PER_QUESTION} segundos para cada una.
      </Text>

      <PressableScale onPress={() => play(MIX.id)} style={styles.mix} accessibilityRole="button" accessibilityLabel={`${MIX.title}. ${MIX.subtitle}`}>
        <View style={{ flex: 1 }}>
          <Text style={styles.mixTitle}>{MIX.title}</Text>
          <Text style={styles.mixSub}>{MIX.subtitle}</Text>
        </View>
        <View style={styles.mixArt}>
          <Illustration kind={MIX.art} tone={MIX.tone} size={52} />
        </View>
      </PressableScale>

      <Text style={styles.section}>Por categoría</Text>
      <View>
        {CATEGORIES.map((c, i) => (
          <CategoryRow key={c.id} category={c} index={i} best={best[c.id]} onPress={() => play(c.id)} />
        ))}
      </View>

      <Text style={styles.footer}>Proyecto académico · Desarrollo de Software en Plataformas Móviles</Text>
    </ScrollView>
  );
}
