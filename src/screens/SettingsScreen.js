import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { Check } from 'lucide-react-native';
import IslamicBackground from '../components/IslamicBackground';

export default function SettingsScreen({ navigation }) {
  const { theme, themeName, changeTheme, THEMES, isCounterEnabled, toggleCounter } = useContext(ThemeContext);

  const renderThemeOption = (key, themeOption) => {
    const isSelected = themeName === key;
    
    return (
      <TouchableOpacity 
        key={key} 
        style={[styles.themeOption, { borderColor: isSelected ? themeOption.NAVY : theme.BORDER, backgroundColor: theme.CARD_BG }]}
        onPress={() => changeTheme(key)}
      >
        <View style={styles.themePreview}>
          <View style={[styles.colorBox, { backgroundColor: themeOption.NAVY }]} />
          <View style={[styles.colorBox, { backgroundColor: themeOption.TURQUOISE }]} />
          <View style={[styles.colorBox, { backgroundColor: themeOption.BACKGROUND, borderWidth: 1, borderColor: theme.BORDER }]} />
        </View>
        
        <View style={styles.themeInfo}>
          <Text style={[styles.themeName, { color: theme.TEXT_PRIMARY }]}>{themeOption.name}</Text>
          {isSelected && <Check color={theme.TEXT_PRIMARY} size={20} />}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <IslamicBackground theme={theme} intensity="light">
      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.TEXT_PRIMARY }]}>Appearance</Text>
          <Text style={[styles.sectionSubtitle, { color: theme.TEXT_SECONDARY }]}>Choose your preferred app theme</Text>
          
          <View style={styles.themeList}>
            {Object.keys(THEMES).map(key => renderThemeOption(key, THEMES[key]))}
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.TEXT_PRIMARY }]}>Features</Text>
          <Text style={[styles.sectionSubtitle, { color: theme.TEXT_SECONDARY }]}>Customize app features</Text>
          
          <View style={styles.featureRow}>
            <View style={styles.featureInfo}>
              <Text style={[styles.featureTitle, { color: theme.TEXT_PRIMARY }]}>PDF Tally Counter</Text>
              <Text style={[styles.featureDesc, { color: theme.TEXT_SECONDARY }]}>Enable floating counter on PDF view</Text>
            </View>
            <Switch
              trackColor={{ false: '#767577', true: theme.TURQUOISE }}
              thumbColor={isCounterEnabled ? theme.NAVY : '#f4f3f4'}
              onValueChange={toggleCounter}
              value={isCounterEnabled}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.TEXT_PRIMARY }]}>About</Text>
          <Text style={[styles.aboutText, { color: theme.TEXT_SECONDARY }]}>Jalaliyya PDF Reader v1.0</Text>
        </View>
      </ScrollView>
    </IslamicBackground>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 20,
  },
  themeList: {
    gap: 15,
  },
  themeOption: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 15,
    backgroundColor: '#fff',
  },
  themePreview: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  colorBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  themeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  themeName: {
    fontSize: 16,
    fontWeight: '600',
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  featureInfo: {
    flex: 1,
    paddingRight: 15,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 13,
    opacity: 0.7,
  },
  aboutText: {
    fontSize: 16,
  }
});
