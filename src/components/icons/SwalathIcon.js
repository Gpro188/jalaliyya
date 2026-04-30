import React from 'react';
import { Svg, Path } from 'react-native-svg';

// Swalath Icon - Minimalist dome with crescent and heart
const SwalathIcon = ({ color, size }) => (
  <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <Path 
      d="M12 48C12 48 16 32 32 28C48 32 52 48 52 48" 
      stroke={color} 
      strokeWidth="2.5" 
      strokeLinecap="round"
    />
    <Path d="M12 48H52" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <Path d="M32 28V24" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <Path 
      d="M28 18C28 18 30 16 32 18C34 16 36 18 36 18" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round"
    />
    <Path 
      d="M32 38C32 38 34 40 36 40C38 40 38 36 36 34C34 32 32 34 32 34C32 34 30 32 28 34C26 36 26 40 28 40C30 40 32 38 32 38Z" 
      stroke={color} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

export default SwalathIcon;
