import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Image } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';

export default function SplashScreen({ navigation }) {
  const { theme } = React.useContext(ThemeContext);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const navigateToMain = () => {
    try {
      navigation.replace('MainApp');
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback: try navigating again
      setTimeout(() => {
        navigation.replace('MainApp');
      }, 500);
    }
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
      {/* Animated white background circle for logo */}
      <Animated.View style={[styles.logoBackground, { opacity: fadeAnim }]}>
        <Animated.Image 
          source={require('../../assets/jalaliyya-logo.png')} 
          style={[styles.logo, { opacity: fadeAnim }]} 
          resizeMode="contain"
          onError={(e) => console.log('Image load error:', e)}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoBackground: {
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 15,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logo: {
    width: 200,
    height: 200,
  },
});
