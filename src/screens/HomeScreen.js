import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Platform, Image, Share, Alert } from 'react-native';
import { 
  Menu, Heart, Share2, BookOpen, Disc, Hand, Moon, 
  Music, ScrollText, Grid, Lightbulb, MoreHorizontal
} from 'lucide-react-native';
import { ThemeContext } from '../context/ThemeContext';

export default function HomeScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const recents = ["Surah Yaseen", "Badar Moulid", "Manqoos Moulid"];

  const gridItems = [
    { name: "Dikr", icon: Disc, id: 1 },
    { name: "Dua", icon: Hand, id: 2 },
    { name: "Swalath", icon: Moon, id: 3 },
    { name: "Moulid", icon: BookOpen, id: 4 },
    { name: "Baith", icon: Music, id: 5 },
    { name: "Malappatt", icon: ScrollText, id: 6 },
    { name: "", icon: Grid, id: 7 }, // Prayer Rug
    { name: "", icon: Lightbulb, id: 8 }, // Lantern
    { name: "", icon: MoreHorizontal, id: 9 }, // Options
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
          <TouchableOpacity 
            style={[styles.primaryButton, { backgroundColor: theme.TURQUOISE, shadowColor: theme.NAVY }]}
            onPress={() => navigation.navigate('Category', { category: { name: "Qur'an" } })}
          >
            <View style={styles.primaryIconContainer}>
              <BookOpen color={theme.NAVY} size={30} />
            </View>
            <Text style={[styles.primaryButtonText, { color: theme.NAVY }]}>Qur'an</Text>
          </TouchableOpacity>

          {/* Secondary Grid (3x3) */}
          <View style={styles.secondaryGrid}>
            {gridItems.map((item) => {
              const Icon = item.icon;
              return (
                <TouchableOpacity 
                  key={item.id} 
                  style={[styles.gridItem, { backgroundColor: theme.TURQUOISE, shadowColor: theme.NAVY }]}
                  onPress={() => item.name ? navigation.navigate('Category', { category: item }) : null}
                >
                  <View style={styles.gridIconContainer}>
                    <Icon color={theme.NAVY} size={24} />
                  </View>
                  {item.name ? <Text style={[styles.gridItemText, { color: theme.NAVY }]}>{item.name}</Text> : null}
                </TouchableOpacity>
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
    borderRadius: 20,
    padding: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  primaryIconContainer: {
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
  gridItem: {
    width: '30%', // roughly 3 columns
    aspectRatio: 1, // square buttons
    borderRadius: 15,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  gridIconContainer: {
    marginBottom: 8,
  },
  gridItemText: { 
    fontSize: 13, 
    fontWeight: '600', 
    textAlign: 'center'
  }
});
