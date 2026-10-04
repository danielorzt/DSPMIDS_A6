import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AnswerOption, type OptionState } from '../../components/AnswerOption';
import { Icon } from '../../components/Icon';
import { Illustration } from '../../components/Illustration';
import { PressableScale } from '../../components/PressableScale';
import { getCategory } from '../../data/categories';
import { error as hapticError, success as hapticSuccess } from '../../lib/feedback';
import { buildQuiz, SECONDS_PER_QUESTION } from '../../lib/quiz';
import { setLastResult, type ReviewItem } from '../../lib/session';
import { useCountdown, useEnter } from '../../motion';
import { fonts, radius, tones, useTheme } from '../../theme/theme';
import { useLayout } from '../../theme/useLayout';

const TIMED_OUT = -1;

const bestRun = (items: ReviewItem[]) => {
  let best = 0;
  let run = 0;
  for (const i of items) best = Math.max(best, (run = i.ok ? run + 1 : 0));
  return best;
};

export default function QuizScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const category = getCategory(id);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const t = useTheme();
  const L = useLayout();

  const [questions] = useState(() => buildQuiz(category.id));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [history, setHistory] = useState<ReviewItem[]>([]);
  const scroll = useRef<ScrollView>(null);

  const question = questions[index];
  const answered = selected !== null;
  const isLast = index === questions.length - 1;
  const streak = [...history].reverse().findIndex((h) => !h.ok);
  const currentStreak = streak === -1 ? history.length : streak;

  const answeredRef = useRef(false);
  const enter = useEnter({ deps: [index] });

  const resolve = useCallback(
    (choice: number) => {
      if (answeredRef.current) return;
      answeredRef.current = true;
      countdown.stop();
      setSelected(choice);

      const ok = choice === question.correctIndex;
      if (ok) hapticSuccess();
      else hapticError();
      setHistory((h) => [
        ...h,
        { text: question.text, correct: question.options[question.correctIndex], chosen: choice === TIMED_OUT ? null : question.options[choice], ok },
      ]);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [question],
  );

  const countdown = useCountdown({
    seconds: SECONDS_PER_QUESTION,
    runKey: index,
    color: t.ink,
    warnColor: t.danger,
    onDone: () => resolve(TIMED_OUT),
  });

  // Nueva pregunta: se reinicia el estado y el scroll vuelve arriba.
  useEffect(() => {
    answeredRef.current = false;
    scroll.current?.scrollTo({ y: 0, animated: false });
  }, [index]);

  // Tras responder, en pantallas bajas la explicación queda bajo el pliegue: se desplaza hasta ella.
  useEffect(() => {
    if (answered) requestAnimationFrame(() => scroll.current?.scrollToEnd({ animated: true }));
  }, [answered]);

  const next = () => {
    if (isLast) {
      setLastResult({ category: category.id, items: history, bestStreak: bestRun(history) });
      router.replace('/results');
    } else {
      setSelected(null);
      setIndex((i) => i + 1);
    }
  };

  const stateOf = (i: number): OptionState => {
    if (!answered) return 'idle';
    if (i === question.correctIndex) return 'correct';
    if (i === selected) return 'wrong';
    return 'dimmed';
  };

  const wasRight = selected === question.correctIndex;
  const verdict = wasRight ? 'Correcto' : selected === TIMED_OUT ? 'Se acabó el tiempo' : 'Incorrecto';
  const verdictColor = wasRight ? t.success : t.danger;

  const styles = useMemo(
    () =>
      StyleSheet.create({
        root: { flex: 1, backgroundColor: t.bg },
        container: { flex: 1, paddingHorizontal: L.gutter, paddingTop: insets.top + 4, paddingBottom: insets.bottom + 12, width: '100%', maxWidth: L.maxWidth, alignSelf: 'center' },
        top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
        close: { width: 48, height: 48, marginLeft: -12, alignItems: 'center', justifyContent: 'center' },
        counter: { flexShrink: 1, color: t.ink, fontSize: L.compact ? 14 : 15, fontFamily: fonts.medium, textAlign: 'center' },
        streak: { minWidth: 48, color: t.muted, fontSize: 14, textAlign: 'right', fontFamily: fonts.medium },
        segments: { flexDirection: 'row', gap: 4, marginTop: 2 },
        segment: { flex: 1, height: 3, borderRadius: 2, backgroundColor: t.line },
        timerTrack: { height: 3, backgroundColor: t.line, marginTop: 8, marginBottom: L.short ? 12 : 16, overflow: 'hidden', borderRadius: 2 },
        timerFill: { height: '100%', width: '100%' },
        art: { height: L.artHeight, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center', backgroundColor: category.tone + '22', marginBottom: L.short ? 14 : 20 },
        question: { color: t.ink, fontSize: L.questionSize, lineHeight: Math.round(L.questionSize * 1.22), fontFamily: fonts.display, marginBottom: L.short ? 14 : 20 },
        split: { flexDirection: 'row', gap: 24 },
        column: { flex: 1 },
        feedback: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: t.line, paddingTop: 14, marginTop: 6 },
        verdict: { fontSize: 16, fontFamily: fonts.bold },
        fact: { color: t.muted, fontSize: 15, lineHeight: 22, marginTop: 4, fontFamily: fonts.body },
        footer: { paddingTop: 10 },
        cta: { height: 56, borderRadius: radius.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: t.ink },
        ctaText: { color: t.inkOnInk, fontSize: 17, fontFamily: fonts.bold },
      }),
    [t, insets, category.tone, L],
  );

  return (
    <View style={styles.root}>
      <View style={styles.container}>
        <View style={styles.top}>
          <PressableScale onPress={() => router.back()} style={styles.close} accessibilityRole="button" accessibilityLabel="Salir del quiz">
            <Icon name="close" size={24} color={t.ink} />
          </PressableScale>
          <Text style={styles.counter} numberOfLines={1} accessibilityLabel={`Pregunta ${index + 1} de ${questions.length}`}>
            {category.title} · {index + 1}/{questions.length}
          </Text>
          <Text style={styles.streak}>{currentStreak >= 2 ? `Racha ${currentStreak}` : ''}</Text>
        </View>

        <View style={styles.segments} accessible={false}>
          {questions.map((_, i) => (
            <View key={i} style={[styles.segment, i < history.length && { backgroundColor: history[i].ok ? t.success : t.danger }, i === index && !answered && { backgroundColor: t.ink }]} />
          ))}
        </View>
        <View style={styles.timerTrack} accessible={false}>
          <Animated.View ref={countdown.ref} style={[styles.timerFill, countdown.style]} />
        </View>

        <ScrollView ref={scroll} style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 8 }}>
          <Animated.View ref={enter.ref} style={[enter.style, L.landscape && styles.split]}>
            <View style={L.landscape && styles.column}>
              <View style={styles.art}>
                <Illustration kind={question.art} tone={category.id === 'mix' ? tones.ochre : category.tone} size={L.artSize} />
              </View>
              <Text style={styles.question} accessibilityRole="header">{question.text}</Text>
            </View>
            <View style={L.landscape && styles.column}>
              {question.options.map((label, i) => (
                <AnswerOption key={`${question.id}-${i}`} index={i} label={label} state={stateOf(i)} disabled={answered} minHeight={L.optionHeight} onPress={() => resolve(i)} />
              ))}
            </View>
          </Animated.View>

          {answered && (
            <View style={styles.feedback} accessibilityLiveRegion="polite">
              <Text style={[styles.verdict, { color: verdictColor }]}>{verdict}</Text>
              <Text style={styles.fact}>{question.fact}</Text>
            </View>
          )}
        </ScrollView>

        {answered && (
          <View style={styles.footer}>
            <PressableScale onPress={next} style={styles.cta} accessibilityRole="button" accessibilityLabel={isLast ? 'Ver resultados' : 'Siguiente pregunta'}>
              <Text style={styles.ctaText}>{isLast ? 'Ver resultados' : 'Siguiente'}</Text>
              <Icon name="arrow-right" size={20} color={t.inkOnInk} />
            </PressableScale>
          </View>
        )}
      </View>
    </View>
  );
}
