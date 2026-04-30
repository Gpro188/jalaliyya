import React from 'react';
import { Svg, Path, Circle } from 'react-native-svg';

// Moulid Icon - Traditional lamp (Fanous)
const MoulidIcon = ({ color, size }) => (
  <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <Path d="M32 8V12" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <Path d="M28 12H36" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <Path 
      d="M24 20C24 20 26 16 32 16C38 16 40 20 40 20V44C40 44 38 48 32 48C26 48 24 44 24 44V20Z" 
      stroke={color} 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <Path d="M20 48H44" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <Path d="M28 48V52C28 54 30 56 32 56C34 56 36 54 36 52V48" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <Circle cx="32" cy="32" r="4" fill={color} opacity="0.3" />
  </Svg>
);

export default MoulidIcon;
