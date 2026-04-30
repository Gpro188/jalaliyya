import React from 'react';
import { Svg, Path } from 'react-native-svg';

// Dua Icon - Two joined palms, elegant thin lines
const DuaIcon = ({ color, size }) => (
  <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <Path 
      d="M16 40C16 40 20 28 32 24C44 28 48 40 48 40" 
      stroke={color} 
      strokeWidth="2.5" 
      strokeLinecap="round"
    />
    <Path 
      d="M20 44C20 44 24 34 32 30C40 34 44 44 44 44" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round"
    />
    <Path 
      d="M24 48C24 48 28 40 32 36C36 40 40 48 40 48" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round"
    />
    <Path d="M32 24V16" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
  </Svg>
);

export default DuaIcon;
