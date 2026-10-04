import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import { Background } from '../components/Background';
import { PressableScale } from '../components/PressableScale';
import { getCategory } from '../data/categories';
import { success as hapticSuccess } from '../lib/feedback';
import { getRank } from '../lib/quiz';
import { saveScore } from '../lib/scores';
import { colors, radius, shadow } from '../theme/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const SIZE = 190;
const STROKE = 14;
const R = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * R;

export default function ResultsScreen() {
  const params = useLocalSearchParams<{ category: string; correct: string; total: string; streak: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const category = getCategory(params.category);
  const correct = Number(params.correct) || 0;
  const total = Number(params.total) || 1;
  const wrong = total - correct;
  const accuracy = Math.round((correct / total) * 100);
  const rank = getRank(accuracy);

  const progress = useRef(new Animated.Value(0)).current;
  const enter = useRef(new Animated.Value(0)).current;
  const [shownPct, setShownPct] = useState(0);
  const [isRecord, setIsRecord] = useState(false);

  useEffect(() => {
    const id = progress.addListener(({ value }) => setShownPct(Math.round(value * accuracy)));
    Animated.sequence([
      Animated.timing(enter, { toValue: 1, duration: 450, useNativeDriver: true }),
      Animated.timing(progress, { toValue: 1, duration: 1100, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
    ]).start();
    if (accuracy >= 50) hapticSuccess();
    saveScore(category.id, { correct, total }).then(setIsRecord);
    return () => progress.removeListener(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dashOffset = progress.interpolate({ inputRange: [0, 1], outputRange: [CIRCUMFERENCE, CIRCUMFERENCE * (1 - accuracy / 100)] });
  const rise = (delay: number) => ({
    opacity: enter,
    transform: [{ translateY: enter.interpolate({ inputRange: [0, 1], outputRange: [24 + delay, 0] }) }],
  });

  return (
    <Background tint={category.gradient}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 28, paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.center, rise(0)]}>
          <Text style={styles.kicker}>RESULTADOS · {category.title.toUpperCase()}</Text>
          <Text style={styles.emoji}>{rank.emoji}</Text>
          <Text style={styles.rank}>{rank.title}</Text>
          <Text style={styles.message}>{rank.message}</Text>
        </Animated.View>

        <Animated.View style={[styles.ringWrap, rise(10)]}>
          <Svg width={SIZE} height={SIZE} style={{ transform: [{ rotate: '-90deg' }] }}>
            <Defs>
              <SvgGradient id="ring" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor={category.gradient[0]} />
                <Stop offset="1" stopColor={category.gradient[1]} />
              </SvgGradient>
            </Defs>
            <Circle cx={SIZE / 2} cy={SIZE / 2} r={R} stroke="rgba(255,255,255,0.1)" strokeWidth={STROKE} fill="none" />
            <AnimatedCircle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={R}
              stroke="url(#ring)"
              strokeWidth={STROKE}
              strokeLinecap="round"
              fill="none"
              strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
              strokeDashoffset={dashOffset}
            />
          </Svg>
          <View style={styles.ringLabel}>
            <Text style={styles.pct}>{shownPct}%</Text>
            <Text style={styles.pctSub}>de aciertos</Text>
          </View>
        </Animated.View>

        {isRecord && (
          <Animated.View style={[styles.record, rise(0)]}>
            <MaterialCommunityIcons name="trophy" size={16} color={colors.gold} />
            <Text style={styles.recordText}>¡Nuevo récord en esta categoría!</Text>
          </Animated.View>
        )}

        <Animated.View style={[styles.stats, rise(20)]}>
          <Stat icon="check-circle" color={colors.success} value={correct} label="Correctas" />
          <Stat icon="close-circle" color={colors.danger} value={wrong} label="Incorrectas" />
          <Stat icon="fire" color={colors.gold} value={Number(params.streak) || 0} label="Mejor racha" />
        </Animated.View>

        <Animated.View style={[styles.actions, rise(30)]}>
          <PressableScale
            onPress={() => router.replace({ pathname: '/quiz/[id]', params: { id: category.id, run: String(Date.now()) } })}
            accessibilityRole="button"
            accessibilityLabel="Jugar de nuevo"
          >
            <LinearGradient colors={category.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.primary}>
              <MaterialCommunityIcons name="refresh" size={20} color="#fff" />
              <Text style={styles.primaryText}>Jugar de nuevo</Text>
            </LinearGradient>
          </PressableScale>
          <PressableScale onPress={() => router.replace('/')} style={styles.secondary} accessibilityRole="button" accessibilityLabel="Volver al inicio">
            <MaterialCommunityIcons name="home" size={20} color={colors.text} />
            <Text style={styles.secondaryText}>Elegir otra categoría</Text>
          </PressableScale>
        </Animated.View>
      </ScrollView>
    </Background>
  );
}

function Stat({ icon, color, value, label }: { icon: React.ComponentProps<typeof MaterialCommunityIcons>['name']; color: string; value: number; label: string }) {
  return (
    <View style={[styles.stat, shadow]}>
      <MaterialCommunityIcons name={icon} size={24} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 22, alignItems: 'center', width: '100%', maxWidth: 560, alignSelf: 'center' },
  center: { alignItems: 'center' },
  kicker: { color: colors.textMuted, fontSize: 12, fontWeight: '800', letterSpacing: 2.5 },
  emoji: { fontSize: 54, marginTop: 14 },
  rank: { color: colors.text, fontSize: 28, fontWeight: '900', marginTop: 6 },
  message: { color: colors.textMuted, fontSize: 15, marginTop: 6, textAlign: 'center' },
  ringWrap: { marginTop: 26, width: SIZE, height: SIZE, alignItems: 'center', justifyContent: 'center' },
  ringLabel: { position: 'absolute', alignItems: 'center' },
  pct: { color: colors.text, fontSize: 46, fontWeight: '900' },
  pctSub: { color: colors.textMuted, fontSize: 13, marginTop: -2 },
  record: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 20, paddingHorizontal: 14, height: 34, borderRadius: 17, borderWidth: 1, borderColor: colors.gold, backgroundColor: 'rgba(251,191,36,0.12)' },
  recordText: { color: colors.gold, fontWeight: '800', fontSize: 13 },
  stats: { flexDirection: 'row', gap: 10, marginTop: 26, width: '100%' },
  stat: { flex: 1, alignItems: 'center', gap: 4, paddingVertical: 16, borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  statValue: { color: colors.text, fontSize: 26, fontWeight: '900' },
  statLabel: { color: colors.textMuted, fontSize: 12, fontWeight: '600' },
  actions: { width: '100%', marginTop: 28, gap: 12 },
  primary: { height: 56, borderRadius: radius.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  primaryText: { color: '#fff', fontSize: 17, fontWeight: '800' },
  secondary: { height: 56, borderRadius: radius.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  secondaryText: { color: colors.text, fontSize: 16, fontWeight: '700' },
});
