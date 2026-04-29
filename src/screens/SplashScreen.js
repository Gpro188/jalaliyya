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

  const navigateToMain = () => {
    navigation.replace('MainApp');
  };

  useEffect(() => {
    // Elegant Fade In: Fade from 0 to 1 over 1 second
    opacity.value = withTiming(1, { duration: 1000 });

    // Fade out smoothly just before navigating
    opacity.value = withDelay(2500, withTiming(0, { duration: 800 }));

    // Reliable navigation fallback: switch screen after exactly 3.5 seconds
    const timer = setTimeout(() => {
      navigateToMain();
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.SPLASH_BG }]}>
      <Animated.Image 
        source={require('../../assets/jalaliyya-logo.png')} 
        style={[styles.logo, animatedStyle, { tintColor: '#ffffff' }]} 
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
