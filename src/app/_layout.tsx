import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../theme/theme';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg },
          animation: 'slide_from_right',
          animationDuration: 320,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="quiz/[id]" options={{ animation: 'fade_from_bottom', gestureEnabled: false }} />
        <Stack.Screen name="results" options={{ animation: 'fade', gestureEnabled: false }} />
      </Stack>
    </>
  );
}
