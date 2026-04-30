import React from 'react';
import { Svg, Circle, Path } from 'react-native-svg';

// Dikr Icon - Single glowing bead / Tasbih circle
const DikrIcon = ({ color, size }) => (
  <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <Circle cx="32" cy="32" r="24" stroke={color} strokeWidth="2.5" strokeDasharray="4 4" />
    <Circle cx="32" cy="8" r="4" fill={color} />
    <Circle cx="32" cy="56" r="4" fill={color} />
    <Path d="M32 12V20" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M32 44V52" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

export default DikrIcon;
