import React from 'react';
import { Svg, Path, Polygon } from 'react-native-svg';

// Ratheeb Icon - Geometric star (spiritual protection shield)
const RatheebIcon = ({ color, size }) => (
  <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <Polygon 
      points="32,8 38,24 56,24 42,34 48,52 32,42 16,52 22,34 8,24 26,24" 
      stroke={color} 
      strokeWidth="2.5" 
      strokeLinejoin="round"
    />
    <Circle cx="32" cy="32" r="8" stroke={color} strokeWidth="2" />
    <Circle cx="32" cy="32" r="3" fill={color} />
  </Svg>
);

export default RatheebIcon;
