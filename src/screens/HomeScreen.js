import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Platform, Image, Share, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { 
  Menu, Heart, Share2, RefreshCw, BookOpen, MoonStar, Stars, Music, Sparkles, Mic2, BookMarked
} from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ThemeContext } from '../context/ThemeContext';
import { checkForUpdates } from '../services/SyncService';
import { getRecentPDFs } from '../services/localStorage';
import IslamicBackground from '../components/IslamicBackground';

export default function HomeScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const [recentPDFs, setRecentPDFs] = useState([]);
  const [isCheckingUpdates, setIsCheckingUpdates] = useState(false);

  useEffect(() => {
    loadRecentPDFs();
    
    // Reload recent PDFs when screen comes into focus
    const unsubscribe = navigation.addListener('focus', () => {
      loadRecentPDFs();
    });
    
    return unsubscribe;
  }, []);

  const loadRecentPDFs = async () => {
    try {
      const recents = await getRecentPDFs();
      console.log('Loaded recent PDFs:', recents.length);
      setRecentPDFs(recents);
    } catch (error) {
      console.error('Error loading recent PDFs:', error);
    }
  };

  const gridItems = [
    { name: "Dikr", icon: MoonStar, id: 1 },
    { name: "Dua", icon: BookOpen, id: 2 },
    { name: "Swalath", icon: Stars, id: 3 },
    { name: "Moulid", icon: Sparkles, id: 4 },
    { name: "Baith", icon: Music, id: 5 },
    { name: "Ratheeb", icon: Mic2, id: 6 },
    { name: "Others", icon: BookMarked, id: 7 },
  ];

  const handleCheckForUpdates = async () => {
    setIsCheckingUpdates(true);
    try {
      const updates = await checkForUpdates();
      if (updates && updates.length > 0) {
        Alert.alert(
          'Updates Available',
          `${updates.length} new PDF(s) available for download. Go to the respective category to download.`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('No Updates', 'You have the latest PDFs!', [{ text: 'OK' }]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to check for updates. Please try again.');
    } finally {
      setIsCheckingUpdates(false);
    }
  };

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
    <IslamicBackground theme={theme} intensity="medium">
      <SafeAreaView style={styles.container}>
        {/* Header Area (1/4 of screen) */}
        <View style={styles.headerContainer}>
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.toggleDrawer()}>
              <Menu color={theme.TEXT_PRIMARY} size={28} />
            </TouchableOpacity>
            <View style={styles.rightIcons}>
              <TouchableOpacity style={styles.iconBtn} onPress={handleCheckForUpdates} disabled={isCheckingUpdates}>
                {isCheckingUpdates ? <ActivityIndicator color={theme.TEXT_PRIMARY} size="small" /> : <RefreshCw color={theme.TEXT_PRIMARY} size={24} />}
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Favorites')}>
                <Heart color={theme.TEXT_PRIMARY} size={24} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn} onPress={onShare}>
                <Share2 color={theme.TEXT_PRIMARY} size={24} />
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
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            refreshControl={
              <RefreshControl 
                refreshing={false}
                onRefresh={loadRecentPDFs}
                tintColor={theme.TEXT_PRIMARY}
                colors={[theme.TEXT_PRIMARY]}
              />
            }
          >
          {/* Recent Carousels */}
          {recentPDFs.length > 0 ? (
            <View style={styles.recentSection}>
              <Text style={[styles.sectionTitle, { color: theme.TEXT_PRIMARY }]}>Recent</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recentScroll}>
                {recentPDFs.map((item, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={[styles.recentPill, { backgroundColor: theme.TURQUOISE, shadowColor: theme.NAVY }]}
                    onPress={() => navigation.navigate('PdfViewer', { pdf: item })}
                  >
                    <Text style={[styles.recentPillText, { color: theme.TEXT_PRIMARY }]} numberOfLines={1}>{item.title}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          ) : (
            <View style={styles.recentSection}>
              <Text style={[styles.sectionTitle, { color: theme.TEXT_PRIMARY }]}>Recent</Text>
              <View style={styles.emptyRecentContainer}>
                <Text style={[styles.emptyRecentText, { color: theme.TEXT_SECONDARY }]}>No recent PDFs yet</Text>
                <Text style={[styles.emptyRecentSubtext, { color: theme.TEXT_SECONDARY }]}>Open a PDF to see it here</Text>
              </View>
            </View>
          )}

          {/* Main Grid: Qur'an Primary Button */}
          <View style={styles.mainGrid}>
            <Animated.View entering={FadeInDown.delay(100).duration(600).springify()}>
              <TouchableOpacity 
                style={[styles.primaryButton, { backgroundColor: theme.CARD_BG, shadowColor: theme.NAVY }]}
                onPress={() => navigation.navigate('Category', { category: { name: "Qur'an" } })}
              >
                <View style={[styles.primaryIconContainer, { backgroundColor: theme.TURQUOISE }]}>
                  <Text style={{ fontSize: 32 }}>📖</Text>
                </View>
                <Text style={[styles.primaryButtonText, { color: theme.TEXT_PRIMARY }]}>Qur'an</Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Secondary Grid (3x3) */}
            <View style={styles.secondaryGrid}>
              {gridItems.map((item, index) => {
                return (
                  <Animated.View 
                    key={item.id} 
                    entering={FadeInDown.delay(200 + (index * 50)).duration(500).springify()}
                    style={styles.gridItemWrapper}
                  >
                    <TouchableOpacity 
                      style={[styles.gridItem, { backgroundColor: theme.CARD_BG, shadowColor: theme.NAVY }]}
                      onPress={() => navigation.navigate('Category', { category: item })}
                    >
                      <View style={[styles.gridIconContainer, { backgroundColor: theme.TURQUOISE }]}>
                        <item.icon color={theme.TEXT_PRIMARY} size={28} />
                      </View>
                      <Text style={[styles.gridItemText, { color: theme.TEXT_PRIMARY }]}>{item.name}</Text>
                    </TouchableOpacity>
                  </Animated.View>
                );
              })}
            </View>
          </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </IslamicBackground>
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
  emptyRecentContainer: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  emptyRecentText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  emptyRecentSubtext: {
    fontSize: 12,
    opacity: 0.7,
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
