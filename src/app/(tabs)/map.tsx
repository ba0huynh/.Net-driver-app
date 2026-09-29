import { StyleSheet } from 'react-native';

import { AppMap } from '@/components/app-map';

export default function MapScreen() {
  return <AppMap style={styles.map} />;
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
