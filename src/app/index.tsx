import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Background } from '../components/Background';
import { CategoryCard } from '../components/CategoryCard';
import { CATEGORIES, MIX } from '../data/categories';
import { QUESTIONS_PER_QUIZ } from '../lib/quiz';
import { getBestScores, type BestScore } from '../lib/scores';
import { colors } from '../theme/theme';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [best, setBest] = useState<Record<string, BestScore>>({});
  const intro = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(intro, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, [intro]);

  // Se refrescan los récords cada vez que se vuelve a esta pantalla.
  useFocusEffect(
    useCallback(() => {
      getBestScores().then(setBest);
    }, []),
  );

  const play = (id: string) => router.push({ pathname: '/quiz/[id]', params: { id } });

  return (
    <Background>
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 20, paddingBottom: insets.bottom + 32, paddingHorizontal: 14 }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.header,
            { opacity: intro, transform: [{ translateY: intro.interpolate({ inputRange: [0, 1], outputRange: [-14, 0] }) }] },
          ]}
        >
          <View style={styles.logo}>
            <MaterialCommunityIcons name="gamepad-variant" size={26} color="#fff" />
          </View>
          <Text style={styles.kicker}>PIXEL QUEST</Text>
          <Text style={styles.title}>Trivia de Videojuegos</Text>
          <Text style={styles.subtitle}>
            Elige una categoría y demuestra cuánto sabes. {QUESTIONS_PER_QUIZ} preguntas, 20 segundos cada una.
          </Text>
        </Animated.View>

        <CategoryCard category={MIX} index={0} featured onPress={() => play(MIX.id)} best={best[MIX.id]} />

        <Text style={styles.section}>Categorías</Text>
        <View style={styles.grid}>
          {CATEGORIES.map((c, i) => (
            <CategoryCard key={c.id} category={c} index={i + 1} best={best[c.id]} onPress={() => play(c.id)} />
          ))}
        </View>

        <Text style={styles.footer}>Proyecto académico · Desarrollo de Software en Plataformas Móviles</Text>
      </ScrollView>
    </Background>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 6, marginBottom: 22 },
  logo: {
    width: 52,
    height: 52,
    borderRadius: 17,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  kicker: { color: colors.accent, fontWeight: '800', letterSpacing: 3, fontSize: 12 },
  title: { color: colors.text, fontSize: 34, fontWeight: '900', marginTop: 4, letterSpacing: -0.5 },
  subtitle: { color: colors.textMuted, fontSize: 15, lineHeight: 22, marginTop: 8 },
  section: { color: colors.text, fontSize: 18, fontWeight: '800', marginTop: 26, marginBottom: 8, marginLeft: 6 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  footer: { color: colors.textMuted, fontSize: 12, textAlign: 'center', marginTop: 28, opacity: 0.7 },
});
