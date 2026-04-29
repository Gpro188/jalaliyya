import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Platform, Image, Share, Alert } from 'react-native';
import { 
  Menu, Heart, Share2, BookOpenText, CircleDot, HandHeart, MoonStar, 
  Lamp, Music, Shield, Sparkles, LayoutGrid, MoreHorizontal
} from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ThemeContext } from '../context/ThemeContext';

export default function HomeScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const recents = ["Surah Yaseen", "Badar Moulid", "Manqoos Moulid"];

  const gridItems = [
    { name: "Dikr", icon: CircleDot, id: 1 },
    { name: "Dua", icon: HandHeart, id: 2 },
    { name: "Swalath", icon: MoonStar, id: 3 },
    { name: "Moulid", icon: Lamp, id: 4 },
    { name: "Baith", icon: Music, id: 5 },
    { name: "Ratheeb", icon: Shield, id: 6 },
    { name: "Others", icon: Sparkles, id: 7 },
    { name: "", icon: LayoutGrid, id: 8 },
    { name: "", icon: MoreHorizontal, id: 9 },
  ];

  const onShare = async () => {
    try {
      await Share.share({
        message: 'Check out the Jalaliyya PDF Reader app for a beautiful collection of Awrad and Manaqib!',
      });
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.BACKGROUND }]}>
      {/* Header Area (1/4 of screen) */}
      <View style={[styles.headerContainer, { backgroundColor: theme.BACKGROUND }]}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.toggleDrawer()}>
            <Menu color={theme.NAVY} size={28} />
          </TouchableOpacity>
          <View style={styles.rightIcons}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Favorites')}>
              <Heart color={theme.NAVY} size={24} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={onShare}>
              <Share2 color={theme.NAVY} size={24} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.logoWrapper}>
          <Image 
            source={require('../../assets/jalaliyya-logo.png')} 
            style={styles.headerLogo} 
            resizeMode="contain" 
          />
        </View>
      </View>

      <View style={styles.contentContainer}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Recent Carousels */}
        <View style={styles.recentSection}>
          <Text style={[styles.sectionTitle, { color: theme.NAVY }]}>Recent</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recentScroll}>
            {recents.map((item, index) => (
              <TouchableOpacity key={index} style={[styles.recentPill, { backgroundColor: theme.TURQUOISE, shadowColor: theme.NAVY }]}>
                <Text style={[styles.recentPillText, { color: theme.NAVY }]}>{item}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Main Grid: Qur'an Primary Button */}
        <View style={styles.mainGrid}>
          <Animated.View entering={FadeInDown.delay(100).duration(600).springify()}>
            <TouchableOpacity 
              style={[styles.primaryButton, { backgroundColor: theme.BACKGROUND, shadowColor: theme.NAVY }]}
              onPress={() => navigation.navigate('Category', { category: { name: "Qur'an" } })}
            >
              <View style={[styles.primaryIconContainer, { backgroundColor: theme.TURQUOISE }]}>
                <BookOpenText color={theme.NAVY} size={32} />
              </View>
              <Text style={[styles.primaryButtonText, { color: theme.NAVY }]}>Qur'an</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Secondary Grid (3x3) */}
          <View style={styles.secondaryGrid}>
            {gridItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Animated.View 
                  key={item.id} 
                  entering={FadeInDown.delay(200 + (index * 50)).duration(500).springify()}
                  style={styles.gridItemWrapper}
                >
                  <TouchableOpacity 
                    style={[styles.gridItem, { backgroundColor: theme.BACKGROUND, shadowColor: theme.NAVY }]}
                    onPress={() => item.name ? navigation.navigate('Category', { category: item }) : null}
                  >
                    <View style={[styles.gridIconContainer, { backgroundColor: theme.TURQUOISE }]}>
                      <Icon color={theme.NAVY} size={24} />
                    </View>
                    {item.name ? <Text style={[styles.gridItemText, { color: theme.NAVY }]}>{item.name}</Text> : null}
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
  },
  headerContainer: {
    flex: 0.25,
  },
  topBar: { 
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 10,
  },
  logoWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 10,
  },
  headerLogo: {
    width: 140,
    height: 90,
  },
  contentContainer: {
    flex: 0.75,
  },
  iconBtn: {
    padding: 5,
    marginLeft: 10,
  },
  rightIcons: {
    flexDirection: 'row',
  },

  scrollContent: {
    paddingBottom: 30,
  },
  recentSection: { 
    marginTop: 15,
    marginBottom: 25,
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: '700', 
    marginLeft: 20, 
    marginBottom: 15, 
  },
  recentScroll: { 
    paddingLeft: 20,
    paddingRight: 10,
  },
  recentPill: { 
    paddingVertical: 12,
    paddingHorizontal: 24, 
    borderRadius: 30, 
    marginRight: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  recentPillText: { 
    fontWeight: '600',
    fontSize: 15,
  },
  mainGrid: { 
    paddingHorizontal: 20 
  },
  primaryButton: {
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 15,
    elevation: 8,
  },
  primaryIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  primaryButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  secondaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItemWrapper: {
    width: '31%',
    marginBottom: 15,
  },
  gridItem: {
    width: '100%',
    aspectRatio: 1, // square buttons
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
  },
  gridIconContainer: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  gridItemText: { 
    fontSize: 12, 
    fontWeight: '600', 
    textAlign: 'center'
  }
});
