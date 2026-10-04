import { DMSans_400Regular, DMSans_500Medium, DMSans_700Bold } from '@expo-google-fonts/dm-sans';
import { InstrumentSerif_400Regular, InstrumentSerif_400Regular_Italic } from '@expo-google-fonts/instrument-serif';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { useTheme } from '../theme/theme';

export default function RootLayout() {
  const t = useTheme();
  const [loaded] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
    InstrumentSerif_400Regular,
    InstrumentSerif_400Regular_Italic,
  });

  if (!loaded) return <View style={{ flex: 1, backgroundColor: t.bg }} />;

  return (
    <>
      <StatusBar style={t.scheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: t.bg },
          animation: 'slide_from_right',
          animationDuration: 280,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="quiz/[id]" options={{ animation: 'fade_from_bottom', gestureEnabled: false }} />
        <Stack.Screen name="results" options={{ animation: 'fade', gestureEnabled: false }} />
      </Stack>
    </>
  );
}
