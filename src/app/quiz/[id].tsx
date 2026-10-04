import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AnswerOption, type OptionState } from '../../components/AnswerOption';
import { Illustration } from '../../components/Illustration';
import { PressableScale } from '../../components/PressableScale';
import { getCategory } from '../../data/categories';
import { error as hapticError, success as hapticSuccess } from '../../lib/feedback';
import { buildQuiz, SECONDS_PER_QUESTION } from '../../lib/quiz';
import { setLastResult, type ReviewItem } from '../../lib/session';
import { useReduceMotion } from '../../lib/useReduceMotion';
import { fonts, radius, tones, useTheme } from '../../theme/theme';

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
  const reduce = useReduceMotion();

  const [questions] = useState(() => buildQuiz(category.id));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [history, setHistory] = useState<ReviewItem[]>([]);

  const question = questions[index];
  const answered = selected !== null;
  const isLast = index === questions.length - 1;
  const streak = [...history].reverse().findIndex((h) => !h.ok);
  const currentStreak = streak === -1 ? history.length : streak;

  const timer = useRef(new Animated.Value(1)).current;
  const enter = useRef(new Animated.Value(0)).current;
  const answeredRef = useRef(false);

  const resolve = useCallback(
    (choice: number) => {
      if (answeredRef.current) return;
      answeredRef.current = true;
      timer.stopAnimation();
      setSelected(choice);

      const ok = choice === question.correctIndex;
      if (ok) hapticSuccess();
      else hapticError();
      setHistory((h) => [
        ...h,
        { text: question.text, correct: question.options[question.correctIndex], chosen: choice === TIMED_OUT ? null : question.options[choice], ok },
      ]);
    },
    [question, timer],
  );

  // Cada pregunta: entrada suave + cuenta regresiva.
  useEffect(() => {
    answeredRef.current = false;
    enter.setValue(reduce ? 1 : 0);
    timer.setValue(1);
    if (!reduce) Animated.timing(enter, { toValue: 1, duration: 420, easing: Easing.out(Easing.exp), useNativeDriver: true }).start();
    const countdown = Animated.timing(timer, { toValue: 0, duration: SECONDS_PER_QUESTION * 1000, easing: Easing.linear, useNativeDriver: false });
    countdown.start(({ finished }) => finished && resolve(TIMED_OUT));
    return () => countdown.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

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

  const barWidth = timer.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });
  const barColor = timer.interpolate({ inputRange: [0, 0.25, 0.26, 1], outputRange: [t.danger, t.danger, t.ink, t.ink] });

  const styles = useMemo(
    () =>
      StyleSheet.create({
        root: { flex: 1, backgroundColor: t.bg },
        container: { flex: 1, paddingHorizontal: 24, paddingTop: insets.top + 8, paddingBottom: insets.bottom + 12, width: '100%', maxWidth: 640, alignSelf: 'center' },
        top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
        close: { width: 48, height: 48, marginLeft: -12, alignItems: 'center', justifyContent: 'center' },
        counter: { color: t.ink, fontSize: 15, fontFamily: fonts.medium },
        streak: { minWidth: 48, color: t.muted, fontSize: 14, textAlign: 'right', fontFamily: fonts.medium },
        segments: { flexDirection: 'row', gap: 4, marginTop: 4 },
        segment: { flex: 1, height: 3, borderRadius: 2, backgroundColor: t.line },
        timerTrack: { height: 2, backgroundColor: t.line, marginTop: 10, marginBottom: 16, overflow: 'hidden' },
        timerFill: { height: '100%' },
        art: { height: 176, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center', backgroundColor: category.tone + '22', marginBottom: 20 },
        question: { color: t.ink, fontSize: 28, lineHeight: 34, fontFamily: fonts.display, marginBottom: 20 },
        feedback: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: t.line, paddingTop: 14, marginTop: 6 },
        verdict: { fontSize: 16, fontFamily: fonts.bold },
        fact: { color: t.muted, fontSize: 15, lineHeight: 22, marginTop: 4, fontFamily: fonts.body },
        cta: { height: 56, borderRadius: radius.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: t.ink },
        ctaText: { color: t.inkOnInk, fontSize: 17, fontFamily: fonts.bold },
      }),
    [t, insets, category.tone],
  );

  return (
    <View style={styles.root}>
      <View style={styles.container}>
        <View style={styles.top}>
          <PressableScale onPress={() => router.back()} style={styles.close} accessibilityRole="button" accessibilityLabel="Salir del quiz">
            <MaterialCommunityIcons name="close" size={24} color={t.ink} />
          </PressableScale>
          <Text style={styles.counter} accessibilityLabel={`Pregunta ${index + 1} de ${questions.length}`}>
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
          <Animated.View style={[styles.timerFill, { width: barWidth, backgroundColor: barColor }]} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 16 }}>
          <Animated.View style={{ opacity: enter, transform: [{ translateY: enter.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }] }}>
            <View style={styles.art}>
              <Illustration kind={question.art} tone={category.id === 'mix' ? tones.ochre : category.tone} size={150} />
            </View>
            <Text style={styles.question} accessibilityRole="header">{question.text}</Text>
            {question.options.map((label, i) => (
              <AnswerOption key={`${question.id}-${i}`} index={i} label={label} state={stateOf(i)} disabled={answered} onPress={() => resolve(i)} />
            ))}
          </Animated.View>

          {answered && (
            <View style={styles.feedback} accessibilityLiveRegion="polite">
              <Text style={[styles.verdict, { color: verdictColor }]}>{verdict}</Text>
              <Text style={styles.fact}>{question.fact}</Text>
            </View>
          )}
        </ScrollView>

        <View style={{ minHeight: 56 }}>
          {answered && (
            <PressableScale onPress={next} style={styles.cta} accessibilityRole="button" accessibilityLabel={isLast ? 'Ver resultados' : 'Siguiente pregunta'}>
              <Text style={styles.ctaText}>{isLast ? 'Ver resultados' : 'Siguiente'}</Text>
              <MaterialCommunityIcons name="arrow-right" size={20} color={t.inkOnInk} />
            </PressableScale>
          )}
        </View>
      </View>
    </View>
  );
}
