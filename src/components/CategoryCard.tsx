import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import type { Category } from '../data/categories';
import type { BestScore } from '../lib/scores';
import { colors, radius, shadow } from '../theme/theme';
import { PressableScale } from './PressableScale';

type Props = {
  category: Category;
  best?: BestScore;
  index: number;
  onPress: () => void;
  featured?: boolean;
};

export function CategoryCard({ category, best, index, onPress, featured }: Props) {
  const enter = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(enter, { toValue: 1, duration: 520, delay: 120 + index * 70, useNativeDriver: true }).start();
  }, [enter, index]);

  const animated = {
    opacity: enter,
    transform: [{ translateY: enter.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) }],
  };

  if (featured) {
    return (
      <Animated.View style={animated}>
        <PressableScale onPress={onPress} accessibilityRole="button" accessibilityLabel={`${category.title}. ${category.subtitle}`}>
          <LinearGradient colors={category.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.featured, shadow]}>
            <View style={styles.featuredIcon}>
              <MaterialCommunityIcons name={category.icon} size={30} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.featuredTitle}>{category.title}</Text>
              <Text style={styles.featuredSub}>{category.subtitle}</Text>
            </View>
            <MaterialCommunityIcons name="arrow-right" size={26} color="#fff" />
          </LinearGradient>
        </PressableScale>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[styles.cell, animated]}>
      <PressableScale
        onPress={onPress}
        style={[styles.card, shadow]}
        accessibilityRole="button"
        accessibilityLabel={`${category.title}. ${category.subtitle}`}
      >
        <LinearGradient colors={category.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.badge}>
          <MaterialCommunityIcons name={category.icon} size={28} color="#fff" />
        </LinearGradient>
        <Text style={styles.title} numberOfLines={1}>{category.title}</Text>
        <Text style={styles.sub} numberOfLines={2}>{category.subtitle}</Text>
        <View style={styles.bestRow}>
          <MaterialCommunityIcons name="trophy" size={14} color={best ? colors.gold : colors.textMuted} />
          <Text style={[styles.best, best && { color: colors.gold }]}>
            {best ? `${best.correct}/${best.total}` : 'Sin jugar'}
          </Text>
        </View>
      </PressableScale>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cell: { width: '50%', padding: 6 },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: 16,
    minHeight: 168,
  },
  badge: { width: 54, height: 54, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  title: { color: colors.text, fontSize: 17, fontWeight: '800' },
  sub: { color: colors.textMuted, fontSize: 12.5, marginTop: 3, lineHeight: 17, flexGrow: 1 },
  bestRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 10 },
  best: { color: colors.textMuted, fontSize: 12.5, fontWeight: '700' },
  featured: { flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: radius.lg, padding: 18, marginHorizontal: 6 },
  featuredIcon: { width: 54, height: 54, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.22)', alignItems: 'center', justifyContent: 'center' },
  featuredTitle: { color: '#fff', fontSize: 19, fontWeight: '800' },
  featuredSub: { color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 2 },
});
