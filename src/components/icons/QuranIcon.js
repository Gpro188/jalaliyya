import React from 'react';
import { Svg, Path } from 'react-native-svg';

// Quran Icon - Open book with stylized S curve
const QuranIcon = ({ color, size }) => (
  <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <Path 
      d="M12 8C12 8 20 6 32 12C44 6 52 8 52 8V52C52 52 44 50 32 56C20 50 12 52 12 52V8Z" 
      stroke={color} 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <Path 
      d="M24 20C24 20 28 18 32 22C36 18 40 20 40 20" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round"
    />
    <Path 
      d="M24 28C24 28 28 26 32 30C36 26 40 28 40 28" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round"
    />
    <Path 
      d="M24 36C24 36 28 34 32 38C36 34 40 36 40 36" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round"
    />
  </Svg>
);

export default QuranIcon;
