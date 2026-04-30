import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Defs, Pattern, Rect } from 'react-native-svg';

export default function IslamicBackground({ children, theme, intensity = 'light' }) {
  const opacity = intensity === 'heavy' ? 0.15 : intensity === 'medium' ? 0.08 : 0.04;

  return (
    <View style={[styles.container, { backgroundColor: theme.BACKGROUND }]}>
      {/* Islamic Geometric Pattern Overlay */}
      <View style={styles.patternContainer} pointerEvents="none">
        <Svg
          width="100%"
          height="100%"
          style={styles.patternSvg}
        >
          <Defs>
            <Pattern
              id="islamicPattern"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              {/* Islamic star pattern */}
              <Path
                d="M30 0 L60 30 L30 60 L0 30 Z"
                fill="none"
                stroke={theme.NAVY}
                strokeWidth="0.5"
                opacity={opacity}
              />
              <Circle
                cx="30"
                cy="30"
                r="8"
                fill="none"
                stroke={theme.NAVY}
                strokeWidth="0.5"
                opacity={opacity}
              />
              <Path
                d="M30 22 L38 30 L30 38 L22 30 Z"
                fill="none"
                stroke={theme.NAVY}
                strokeWidth="0.3"
                opacity={opacity * 0.7}
              />
            </Pattern>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#islamicPattern)" />
        </Svg>
      </View>

      {/* Decorative Corner Elements */}
      <View style={[styles.cornerDecoration, styles.topLeft]} pointerEvents="none">
        <Svg width="100" height="100" style={styles.cornerSvg}>
          <Path
            d="M0 0 L100 0 L100 20 Q50 20 50 50 L20 50 L20 100 L0 100 Z"
            fill={theme.NAVY}
            opacity={opacity * 0.5}
          />
        </Svg>
      </View>

      <View style={[styles.cornerDecoration, styles.bottomRight]} pointerEvents="none">
        <Svg width="100" height="100" style={[styles.cornerSvg, { transform: [{ rotate: '180deg' }] }]}>
          <Path
            d="M0 0 L100 0 L100 20 Q50 20 50 50 L20 50 L20 100 L0 100 Z"
            fill={theme.NAVY}
            opacity={opacity * 0.5}
          />
        </Svg>
      </View>

      {/* Content */}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  patternContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  patternSvg: {
    width: '100%',
    height: '100%',
  },
  cornerDecoration: {
    position: 'absolute',
    width: 100,
    height: 100,
  },
  topLeft: {
    top: 0,
    left: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
  },
  cornerSvg: {
    width: '100%',
    height: '100%',
  },
});
