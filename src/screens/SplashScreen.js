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
  const opacity = useSharedValue(1);
  const rotation = useSharedValue(0);

  const navigateToMain = () => {
    navigation.replace('MainApp');
  };

  useEffect(() => {
    // Executive Rotation: Smoothly rotate 15 degrees right over 1.5 seconds, then stop
    rotation.value = withTiming(15, { 
      duration: 1500, 
      easing: Easing.out(Easing.exp) 
    });

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
      transform: [
        { rotate: `${rotation.value}deg` }
      ],
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
