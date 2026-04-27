import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSequence, 
  withDelay, 
  Easing,
  runOnJS
} from 'react-native-reanimated';

export default function SplashScreen({ navigation }) {
  const { theme } = React.useContext(ThemeContext);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);
  const rotation = useSharedValue(0);

  useEffect(() => {
    // Phase 1: The Emergence (0s - 0.8s)
    opacity.value = withTiming(1, { duration: 800 });
    scale.value = withTiming(1, { duration: 800 });

    // Phase 2: The Geometric Bloom (0.8s - 1.8s)
    // Rotate 10 degrees slowly
    rotation.value = withDelay(
      800, 
      withTiming(10, { duration: 1000, easing: Easing.out(Easing.exp) })
    );

    // Phase 3: The Spiritual Stillness (1.8s - 2.5s)
    // Subtle breathing effect (scale to 1.02 and back down)
    scale.value = withSequence(
      withTiming(1, { duration: 800 }), // Wait for phase 1 to finish
      withDelay(1000, withTiming(1.02, { duration: 350 })),
      withTiming(1, { duration: 350 }),
      // Phase 4: The Transition (2.5s - 3.0s)
      withTiming(20, { duration: 500, easing: Easing.in(Easing.exp) }, (finished) => {
        if (finished) {
          runOnJS(navigation.replace)('MainApp');
        }
      })
    );

    // Fade out during transition
    opacity.value = withDelay(2500, withTiming(0, { duration: 500 }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        { scale: scale.value },
        { rotate: `${rotation.value}deg` }
      ],
    };
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.SPLASH_BG }]}>
      <Animated.Image 
        source={require('../../assets/jalaliyya-logo.png')} 
        style={[styles.logo, animatedStyle]} 
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
});
