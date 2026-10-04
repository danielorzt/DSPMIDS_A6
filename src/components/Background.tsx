import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { colors } from '../theme/theme';

type Props = { tint?: [string, string]; children: React.ReactNode; style?: ViewStyle };

/** Fondo oscuro con degradado y dos "orbes" de luz que dan profundidad. */
export function Background({ tint = ['#8B5CF6', '#EC4899'], children, style }: Props) {
  return (
    <View style={[styles.root, style]}>
      <LinearGradient colors={[colors.bg, colors.bgSoft, colors.bg]} style={StyleSheet.absoluteFill} />
      <LinearGradient
        colors={[tint[0], 'transparent']}
        style={[styles.orb, { top: -140, right: -120, opacity: 0.35 }]}
        start={{ x: 0.3, y: 0.3 }}
        end={{ x: 1, y: 1 }}
      />
      <LinearGradient
        colors={[tint[1], 'transparent']}
        style={[styles.orb, { bottom: -160, left: -140, opacity: 0.22 }]}
        start={{ x: 0.7, y: 0.7 }}
        end={{ x: 0, y: 0 }}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  orb: { position: 'absolute', width: 380, height: 380, borderRadius: 190 },
});
