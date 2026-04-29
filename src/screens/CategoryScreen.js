import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Download, CheckCircle, FileText } from 'lucide-react-native';
import { getPdfFilesByCategory } from '../services/dbService';

export default function CategoryScreen({ route, navigation }) {
  const { category } = route.params || { category: { name: 'Unknown' } };
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const fetchCategoryPdfs = async () => {
    const data = await getPdfFilesByCategory(category.name);
    setPdfs(data);
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
    navigation.navigate('PdfViewer', { pdf });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.pdfItem} onPress={() => openPdf(item)}>
      <View style={styles.pdfIconContainer}>
        <FileText color="#1E88E5" size={30} />
      </View>
      <View style={styles.pdfInfo}>
        <Text style={styles.pdfTitle}>{item.title}</Text>
        <Text style={styles.pdfSubtitle}>Version {item.version || '1.0'}</Text>
      </View>
      <View style={styles.actionContainer}>
        {item.updateAvailable && (
          <View style={styles.updateBadge}>
            <Text style={styles.updateText}>Update</Text>
          </View>
        )}
        {item.isDownloaded ? (
          <CheckCircle color="#1976D2" size={24} />
        ) : (
          <Download color="#2196F3" size={24} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>{category.name} PDFs</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#1E88E5" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={pdfs}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          onRefresh={onRefresh}
          refreshing={refreshing}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', margin: 20, color: '#333' },
  listContainer: { paddingHorizontal: 15 },
  pdfItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  pdfIconContainer: { marginRight: 15 },
  pdfInfo: { flex: 1 },
  pdfTitle: { fontSize: 16, fontWeight: '600', color: '#333' },
  pdfSubtitle: { fontSize: 13, color: '#888', marginTop: 4 },
  actionContainer: { flexDirection: 'row', alignItems: 'center' },
  updateBadge: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 10
  },
  updateText: { color: '#fff', fontSize: 10, fontWeight: 'bold' }
});
