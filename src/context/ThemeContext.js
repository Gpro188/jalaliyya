import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const THEMES = {
  blue: {
    name: 'Ocean Blue',
    NAVY: '#1976D2',
    TURQUOISE: '#E3F2FD',
    BACKGROUND: '#FFFFFF',
    SPLASH_BG: '#1976D2',
  },
  turquoise: {
    name: 'Turquoise & Navy',
    NAVY: '#0B1933',
    TURQUOISE: '#3DCCB1',
    BACKGROUND: '#F8F7F3',
    SPLASH_BG: '#0B1933',
  },
  emerald: {
    name: 'Emerald Green',
    NAVY: '#004D40',
    TURQUOISE: '#E8F5E9',
    BACKGROUND: '#F5F5F5',
    SPLASH_BG: '#004D40',
  }
};

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeName, setThemeName] = useState('blue');
  const [isCounterEnabled, setIsCounterEnabled] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('@app_theme');
        if (savedTheme && THEMES[savedTheme]) {
          setThemeName(savedTheme);
        }
        const savedCounter = await AsyncStorage.getItem('@counter_enabled');
        if (savedCounter !== null) {
          setIsCounterEnabled(savedCounter === 'true');
        }
      } catch (error) {
        console.error('Failed to load settings', error);
      } finally {
        setIsReady(true);
      }
    };
    loadSettings();
  }, []);

  const changeTheme = async (name) => {
    try {
      setThemeName(name);
      await AsyncStorage.setItem('@app_theme', name);
    } catch (error) {
      console.error('Failed to save theme', error);
    }
  };

  const toggleCounter = async () => {
    try {
      const newValue = !isCounterEnabled;
      setIsCounterEnabled(newValue);
      await AsyncStorage.setItem('@counter_enabled', newValue ? 'true' : 'false');
    } catch (error) {
      console.error('Failed to save counter setting', error);
    }
  };

  if (!isReady) return null; // Wait for theme to load before rendering children

  return (
    <ThemeContext.Provider value={{ 
      theme: THEMES[themeName], 
      themeName, 
      changeTheme, 
      THEMES,
      isCounterEnabled,
      toggleCounter
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
