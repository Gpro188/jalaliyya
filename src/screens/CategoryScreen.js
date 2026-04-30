import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, ScrollView, Platform } from 'react-native';
import { Download, CheckCircle, FileText, ArrowLeft, Heart } from 'lucide-react-native';
import { getPdfFilesByCategory } from '../services/dbService';
import { SyncService } from '../services/SyncService';
import { ThemeContext } from '../context/ThemeContext';
import { toggleFavoritePDF, isPDFFavorite } from '../services/localStorage';
import IslamicBackground from '../components/IslamicBackground';

export default function CategoryScreen({ route, navigation }) {
  const { theme } = useContext(ThemeContext);
  const { category } = route.params || { category: { name: 'Unknown' } };
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [downloading, setDownloading] = useState({});
  const [favorites, setFavorites] = useState({});

  const fetchCategoryPdfs = async () => {
    const data = await getPdfFilesByCategory(category.name);
    
    // Check which PDFs are already downloaded and favorited
    const updatedPdfs = await Promise.all(data.map(async (pdf) => {
      const localUri = await SyncService.getLocalUri(pdf.id);
      const isFavorite = await isPDFFavorite(pdf.id);
      return {
        ...pdf,
        isDownloaded: !!localUri,
        localUri: localUri,
        isFavorite: isFavorite
      };
    }));
    
    setPdfs(updatedPdfs);
    
    // Update favorites state
    const favState = {};
    updatedPdfs.forEach(pdf => {
      favState[pdf.id] = pdf.isFavorite;
    });
    setFavorites(favState);
  };

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      if (category.name) await fetchCategoryPdfs();
      setLoading(false);
    };
    loadInitialData();
  }, [category]);

  const onRefresh = async () => {
    setRefreshing(true);
    if (category.name) await fetchCategoryPdfs();
    setRefreshing(false);
  };

  const openPdf = (pdf) => {
    if (pdf.isDownloaded && pdf.localUri) {
      navigation.navigate('PdfViewer', { pdf });
    } else {
      Alert.alert(
        'Download Required',
        'Please download this PDF first to view it.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Download', onPress: () => handleDownload(pdf) }
        ]
      );
    }
  };

  const handleDownload = async (pdf) => {
    if (downloading[pdf.id]) return;

    setDownloading(prev => ({ ...prev, [pdf.id]: true }));
    
    try {
      const result = await SyncService.downloadPdf(pdf);
      
      if (result.success) {
        Alert.alert('Success', 'PDF downloaded successfully!');
        // Refresh the list to show updated status
        await fetchCategoryPdfs();
      } else {
        Alert.alert('Error', result.error || 'Failed to download PDF');
      }
    } catch (error) {
      Alert.alert('Error', 'Download failed. Please check your connection.');
    } finally {
      setDownloading(prev => ({ ...prev, [pdf.id]: false }));
    }
  };

  const handleToggleFavorite = async (pdf) => {
    const added = await toggleFavoritePDF(pdf);
    setFavorites(prev => ({
      ...prev,
      [pdf.id]: added
    }));
  };

  const renderItem = ({ item }) => {
    const isDownloading = downloading[item.id];
    const isFavorite = favorites[item.id] || false;
    
    return (
      <TouchableOpacity style={[styles.pdfItem, { backgroundColor: theme.CARD_BG, shadowColor: theme.NAVY, borderColor: theme.BORDER }]} onPress={() => openPdf(item)}>
        <View style={[styles.pdfIconContainer, { backgroundColor: theme.TURQUOISE }]}>
          <FileText color={theme.TEXT_PRIMARY} size={28} />
        </View>
        <View style={styles.pdfInfo}>
          <Text style={[styles.pdfTitle, { color: theme.TEXT_PRIMARY }]}>{item.title}</Text>
          <Text style={[styles.pdfSubtitle, { color: theme.TEXT_SECONDARY }]}>{item.category}</Text>
        </View>
        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={styles.favoriteBtn}
            onPress={() => handleToggleFavorite(item)}
          >
            <Heart 
              color={isFavorite ? '#FF3B30' : theme.TEXT_PRIMARY} 
              size={22}
              fill={isFavorite ? '#FF3B30' : 'none'}
            />
          </TouchableOpacity>
          {isDownloading ? (
            <ActivityIndicator size="small" color={theme.TEXT_PRIMARY} />
          ) : item.isDownloaded ? (
            <View style={[styles.downloadedBadge, { backgroundColor: theme.TURQUOISE }]}>
              <CheckCircle color={theme.TEXT_PRIMARY} size={20} />
            </View>
          ) : (
            <TouchableOpacity 
              style={[styles.downloadBtn, { backgroundColor: theme.NAVY }]}
              onPress={() => handleDownload(item)}
            >
              <Download color="#fff" size={20} />
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <IslamicBackground theme={theme} intensity="light">
      <View style={styles.container}>
        {/* Islamic Architecture Header */}
        <View style={[styles.islamicHeader, { backgroundColor: theme.NAVY }]}>
          <View style={styles.archPattern} />
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft color="#fff" size={24} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>{category.name}</Text>
          </View>
          <View style={styles.domeDecoration} />
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.TEXT_PRIMARY} />
            <Text style={[styles.loadingText, { color: theme.TEXT_PRIMARY }]}>Loading PDFs...</Text>
          </View>
        ) : (
          <FlatList
            data={pdfs}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
            onRefresh={onRefresh}
            refreshing={refreshing}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>📚</Text>
                <Text style={[styles.emptyText, { color: theme.TEXT_PRIMARY }]}>No PDFs in this category yet</Text>
              </View>
            }
          />
        )}
      </View>
    </IslamicBackground>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  // Islamic Architecture Header
  islamicHeader: {
    paddingTop: Platform.OS === 'android' ? 50 : 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    borderBottomWidth: 3,
    borderBottomColor: 'rgba(255,255,255,0.2)',
  },
  archPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 40,
  },
  backButton: {
    marginRight: 15,
    zIndex: 1,
  },
  headerContent: {
    flex: 1,
    zIndex: 1,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  domeDecoration: {
    position: 'absolute',
    right: -20,
    top: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
  },
  listContainer: { 
    padding: 20,
  },
  pdfItem: {
    flexDirection: 'row',
    padding: 18,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  pdfIconContainer: { 
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  pdfInfo: { 
    flex: 1,
  },
  pdfTitle: { 
    fontSize: 17, 
    fontWeight: '700',
    marginBottom: 5,
  },
  pdfSubtitle: { 
    fontSize: 13,
    opacity: 0.7,
  },
  actionContainer: { 
    flexDirection: 'row', 
    alignItems: 'center',
    gap: 10
  },
  favoriteBtn: {
    padding: 6,
    marginRight: 5,
  },
  downloadedBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 80,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
    opacity: 0.3,
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    opacity: 0.6,
  }
});
