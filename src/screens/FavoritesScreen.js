import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { FileText, Heart, Trash2 } from 'lucide-react-native';
import { ThemeContext } from '../context/ThemeContext';
import { getFavoritePDFs, toggleFavoritePDF } from '../services/localStorage';
import IslamicBackground from '../components/IslamicBackground';

export default function FavoritesScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    setLoading(true);
    const favs = await getFavoritePDFs();
    setFavorites(favs);
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFavorites();
    setRefreshing(false);
  };

  const openPdf = (pdf) => {
    navigation.navigate('PdfViewer', { pdf });
  };

  const handleRemoveFavorite = async (pdf) => {
    await toggleFavoritePDF(pdf);
    await loadFavorites();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.pdfItem, { backgroundColor: theme.CARD_BG, shadowColor: theme.NAVY, borderColor: theme.BORDER }]}
      onPress={() => openPdf(item)}
    >
      <View style={[styles.pdfIconContainer, { backgroundColor: theme.TURQUOISE }]}>
        <FileText color={theme.TEXT_PRIMARY} size={28} />
      </View>
      <View style={styles.pdfInfo}>
        <Text style={[styles.pdfTitle, { color: theme.TEXT_PRIMARY }]}>{item.title}</Text>
        <Text style={[styles.pdfSubtitle, { color: theme.TEXT_SECONDARY }]}>{item.category}</Text>
      </View>
      <TouchableOpacity 
        style={styles.removeBtn}
        onPress={() => handleRemoveFavorite(item)}
      >
        <Trash2 color="#FF3B30" size={20} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <IslamicBackground theme={theme} intensity="light">
        <View style={styles.container}>
          <ActivityIndicator size="large" color={theme.TEXT_PRIMARY} />
        </View>
      </IslamicBackground>
    );
  }

  return (
    <IslamicBackground theme={theme} intensity="light">
      <View style={styles.container}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.NAVY }]}>
          <Text style={styles.headerTitle}>Favorites</Text>
          <Text style={styles.headerSubtitle}>{favorites.length} PDF(s)</Text>
        </View>

        {favorites.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Heart color={theme.TEXT_PRIMARY} size={80} opacity={0.3} />
            <Text style={[styles.emptyText, { color: theme.TEXT_PRIMARY }]}>No favorites yet</Text>
            <Text style={[styles.emptySubtext, { color: theme.TEXT_SECONDARY }]}>Tap the heart icon on any PDF to add it here</Text>
          </View>
        ) : (
          <FlatList
            data={favorites}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
            onRefresh={onRefresh}
            refreshing={refreshing}
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
  header: {
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginTop: 5,
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
  removeBtn: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
    opacity: 0.6,
  },
});
