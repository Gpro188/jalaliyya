import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';

export default function SplashScreen({ navigation }) {
  const { theme } = React.useContext(ThemeContext);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const navigateToMain = () => {
    navigation.replace('MainApp');
  };

  useEffect(() => {
    // Elegant Fade In
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Fade out smoothly just before navigating
    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }, 2500);

    // Reliable navigation fallback
    const timer = setTimeout(() => {
      navigateToMain();
    }, 3500);

    return () => clearTimeout(timer);
  }, [fadeAnim]);

  return (
    <View style={[styles.container, { backgroundColor: theme.SPLASH_BG }]}>
      <Animated.Image 
        source={require('../../assets/jalaliyya-logo.png')} 
        style={[styles.logo, { opacity: fadeAnim, tintColor: '#ffffff' }]} 
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
