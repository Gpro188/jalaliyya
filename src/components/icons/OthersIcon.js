import React from 'react';
import { Svg, Circle, Path } from 'react-native-svg';

// Others Icon - Clean four-dot grid with sparkle
const OthersIcon = ({ color, size }) => (
  <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <Circle cx="20" cy="20" r="5" fill={color} />
    <Circle cx="44" cy="20" r="5" fill={color} />
    <Circle cx="20" cy="44" r="5" fill={color} />
    <Circle cx="44" cy="44" r="5" fill={color} />
    <Path 
      d="M32 28L34 32L38 32L35 35L36 39L32 37L28 39L29 35L26 32L30 32L32 28Z" 
      fill={color} 
      opacity="0.6"
    />
  </Svg>
);

export default OthersIcon;
