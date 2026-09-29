import type { StyleProp, ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

type AppMapProps = {
  center?: [number, number];
  zoom?: number;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
};

// @maplibre/maplibre-react-native has no web implementation.
export function AppMap({ style }: AppMapProps) {
  return (
    <ThemedView type="backgroundElement" style={[styles.container, style]}>
      <ThemedText type="small" themeColor="textSecondary">
        The map is available on iOS and Android.
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
  },
});
