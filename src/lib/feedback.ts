import * as Haptics from 'expo-haptics';

// En web o dispositivos sin motor háptico las llamadas fallan en silencio.
const safe = (fn: () => Promise<void>) => {
  fn().catch(() => {});
};

export const tap = () => safe(() => Haptics.selectionAsync());
export const success = () => safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
export const error = () => safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error));
