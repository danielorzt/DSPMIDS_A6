import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Easing, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AnswerOption, type OptionState } from '../../components/AnswerOption';
import { Background } from '../../components/Background';
import { PressableScale } from '../../components/PressableScale';
import { getCategory } from '../../data/categories';
import { error as hapticError, success as hapticSuccess } from '../../lib/feedback';
import { buildQuiz, SECONDS_PER_QUESTION } from '../../lib/quiz';
import { colors, radius } from '../../theme/theme';

const LETTERS = ['A', 'B', 'C', 'D'];
const TIMED_OUT = -1;

export default function QuizScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const category = getCategory(id);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [questions] = useState(() => buildQuiz(category.id));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const question = questions[index];
  const answered = selected !== null;
  const isLast = index === questions.length - 1;

  const timer = useRef(new Animated.Value(1)).current;
  const enter = useRef(new Animated.Value(0)).current;
  const feedbackAnim = useRef(new Animated.Value(0)).current;
  const answeredRef = useRef(false);

  const resolve = useCallback(
    (choice: number) => {
      if (answeredRef.current) return;
      answeredRef.current = true;
      timer.stopAnimation();
      setSelected(choice);

      const ok = choice === question.correctIndex;
      if (ok) {
        hapticSuccess();
        setCorrect((c) => c + 1);
        setStreak(streak + 1);
        setBestStreak((b) => Math.max(b, streak + 1));
      } else {
        hapticError();
        setStreak(0);
      }
      Animated.spring(feedbackAnim, { toValue: 1, useNativeDriver: true, speed: 14, bounciness: 8 }).start();
    },
    [question, streak, timer, feedbackAnim],
  );

  // Cada pregunta: entrada animada + cuenta regresiva.
  useEffect(() => {
    answeredRef.current = false;
    feedbackAnim.setValue(0);
    enter.setValue(0);
    timer.setValue(1);
    Animated.timing(enter, { toValue: 1, duration: 380, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
    const countdown = Animated.timing(timer, {
      toValue: 0,
      duration: SECONDS_PER_QUESTION * 1000,
      easing: Easing.linear,
      useNativeDriver: false,
    });
    countdown.start(({ finished }) => finished && resolve(TIMED_OUT));
    return () => countdown.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const next = () => {
    if (isLast) {
      router.replace({
        pathname: '/results',
        params: { category: category.id, correct: String(correct), total: String(questions.length), streak: String(bestStreak) },
      });
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

  const timedOut = selected === TIMED_OUT;
  const wasRight = selected === question.correctIndex;
  const banner = wasRight
    ? { icon: 'check-circle' as const, color: colors.success, title: '¡Correcto!' }
    : { icon: 'close-circle' as const, color: colors.danger, title: timedOut ? '¡Se acabó el tiempo!' : 'Incorrecto' };

  const barWidth = timer.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });
  const barColor = timer.interpolate({ inputRange: [0, 0.3, 0.6, 1], outputRange: [colors.danger, colors.danger, colors.gold, colors.success] });

  return (
    <Background tint={category.gradient}>
      <View style={[styles.container, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 12 }]}>
        <View style={styles.topBar}>
          <PressableScale onPress={() => router.back()} style={styles.iconBtn} accessibilityRole="button" accessibilityLabel="Salir del quiz">
            <MaterialCommunityIcons name="close" size={22} color={colors.text} />
          </PressableScale>
          <View style={styles.chip}>
            <MaterialCommunityIcons name={category.icon} size={16} color={category.gradient[1]} />
            <Text style={styles.chipText}>{category.title}</Text>
          </View>
          <View style={[styles.chip, streak >= 2 && { borderColor: colors.gold }]}>
            <MaterialCommunityIcons name="fire" size={16} color={streak >= 2 ? colors.gold : colors.textMuted} />
            <Text style={[styles.chipText, streak >= 2 && { color: colors.gold }]}>{streak}</Text>
          </View>
        </View>

        <View style={styles.progressRow}>
          <Text style={styles.counter}>
            Pregunta {index + 1}<Text style={{ color: colors.textMuted }}> / {questions.length}</Text>
          </Text>
          <View style={styles.dots}>
            {questions.map((_, i) => (
              <View key={i} style={[styles.dot, i < index && { backgroundColor: category.gradient[1] }, i === index && { backgroundColor: '#fff', width: 18 }]} />
            ))}
          </View>
        </View>

        <View style={styles.timerTrack}>
          <Animated.View style={[styles.timerFill, { width: barWidth, backgroundColor: barColor }]} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 16 }}>
          <Animated.View
            style={{
              opacity: enter,
              transform: [{ translateX: enter.interpolate({ inputRange: [0, 1], outputRange: [36, 0] }) }],
            }}
          >
            <LinearGradient colors={category.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.questionCard}>
              <Text style={styles.questionText} accessibilityRole="header">{question.text}</Text>
            </LinearGradient>

            {question.options.map((label, i) => (
              <AnswerOption key={`${question.id}-${i}`} letter={LETTERS[i]} label={label} state={stateOf(i)} disabled={answered} onPress={() => resolve(i)} />
            ))}
          </Animated.View>

          {answered && (
            <Animated.View
              style={[
                styles.feedback,
                { borderColor: banner.color, opacity: feedbackAnim, transform: [{ translateY: feedbackAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] },
              ]}
            >
              <View style={styles.feedbackHead}>
                <MaterialCommunityIcons name={banner.icon} size={22} color={banner.color} />
                <Text style={[styles.feedbackTitle, { color: banner.color }]}>{banner.title}</Text>
              </View>
              <Text style={styles.fact}>💡 {question.fact}</Text>
            </Animated.View>
          )}
        </ScrollView>

        <View style={{ minHeight: 56 }}>
          {answered && (
            <Animated.View style={{ opacity: feedbackAnim }}>
              <PressableScale onPress={next} accessibilityRole="button" accessibilityLabel={isLast ? 'Ver resultados' : 'Siguiente pregunta'}>
                <LinearGradient colors={category.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.cta}>
                  <Text style={styles.ctaText}>{isLast ? 'Ver resultados' : 'Siguiente'}</Text>
                  <MaterialCommunityIcons name="arrow-right" size={20} color="#fff" />
                </LinearGradient>
              </PressableScale>
            </Animated.View>
          )}
        </View>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, width: '100%', maxWidth: 640, alignSelf: 'center' },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconBtn: { width: 42, height: 42, borderRadius: 14, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, height: 38, borderRadius: 19, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  chipText: { color: colors.text, fontWeight: '800', fontSize: 14 },
  progressRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 },
  counter: { color: colors.text, fontSize: 15, fontWeight: '800' },
  dots: { flexDirection: 'row', gap: 4, alignItems: 'center' },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.18)' },
  timerTrack: { height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.1)', overflow: 'hidden', marginTop: 12, marginBottom: 18 },
  timerFill: { height: '100%', borderRadius: 4 },
  questionCard: { borderRadius: radius.lg, padding: 22, minHeight: 130, justifyContent: 'center', marginBottom: 18 },
  questionText: { color: '#fff', fontSize: 21, fontWeight: '800', lineHeight: 29 },
  feedback: { backgroundColor: colors.surface, borderWidth: 1.5, borderRadius: radius.md, padding: 16, marginTop: 4 },
  feedbackHead: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  feedbackTitle: { fontSize: 17, fontWeight: '800' },
  fact: { color: colors.textMuted, fontSize: 14.5, lineHeight: 21 },
  cta: { height: 56, borderRadius: radius.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  ctaText: { color: '#fff', fontSize: 17, fontWeight: '800' },
});
