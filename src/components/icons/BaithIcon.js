import React from 'react';
import { Svg, Path, Circle } from 'react-native-svg';

// Baith Icon - Musical note with Arabic calligraphy pen
const BaithIcon = ({ color, size }) => (
  <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <Path 
      d="M20 48V24C20 24 28 20 32 20C36 20 44 24 44 24V48" 
      stroke={color} 
      strokeWidth="2.5" 
      strokeLinecap="round"
    />
    <Circle cx="20" cy="48" r="4" fill={color} />
    <Circle cx="44" cy="48" r="4" fill={color} />
    <Path d="M32 20V16" stroke={color} strokeWidth="3" strokeLinecap="round" />
    <Path 
      d="M26 32C26 32 28 30 32 30C36 30 38 32 38 32" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round"
    />
    <Path 
      d="M26 38C26 38 28 36 32 36C36 36 38 38 38 38" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round"
    />
  </Svg>
);

export default BaithIcon;
