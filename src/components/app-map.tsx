import { Camera, Map, type LngLat, type StyleSpecification } from '@maplibre/maplibre-react-native';
import type { StyleProp, ViewStyle } from 'react-native';

import mapStyleJson from '@/constants/map-style.json';

// OpenFreeMap "liberty"-style vector tiles (see src/constants/map-style.json)
export const mapStyle = mapStyleJson as unknown as StyleSpecification;

// Ho Chi Minh City
const DEFAULT_CENTER: LngLat = [106.6297, 10.8231];
const DEFAULT_ZOOM = 12;

type AppMapProps = {
  center?: LngLat;
  zoom?: number;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
};

export function AppMap({ center = DEFAULT_CENTER, zoom = DEFAULT_ZOOM, style, children }: AppMapProps) {
  return (
    <Map mapStyle={mapStyle} style={style}>
      <Camera initialViewState={{ center, zoom }} />
      {children}
    </Map>
  );
}
