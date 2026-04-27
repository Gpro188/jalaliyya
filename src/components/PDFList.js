// PDF List Component - Displays all downloaded and available PDFs
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { getAllLocalPDFs } from '../services/localStorage';
import { checkInternetConnection } from '../services/networkService';

const PDFList = ({ onPDFPress, onRefresh }) => {
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPDFs();
    checkConnection();
  }, []);

  const checkConnection = async () => {
    const online = await checkInternetConnection();
    setIsOnline(online);
  };

  const loadPDFs = async () => {
    try {
      setLoading(true);
      const localPDFs = await getAllLocalPDFs();
      setPdfs(localPDFs);
    } catch (error) {
      console.error('Error loading PDFs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPDFs();
    await checkConnection();
    if (onRefresh) {
      await onRefresh();
    }
    setRefreshing(false);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.pdfCard}
      onPress={() => onPDFPress(item)}
    >
      <View style={styles.pdfIcon}>
        <Text style={styles.pdfIconText}>📄</Text>
      </View>
      <View style={styles.pdfInfo}>
        <Text style={styles.pdfTitle}>{item.name}</Text>
        <Text style={styles.pdfDate}>
          Downloaded: {new Date(item.downloadedAt).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.statusBadge}>
        <Text style={styles.statusText}>✓</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#1976D2" />
        <Text style={styles.loadingText}>Loading PDFs...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!isOnline && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>📴 Offline Mode</Text>
        </View>
      )}
      
      <FlatList
        data={pdfs}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📚</Text>
            <Text style={styles.emptyText}>
              {isOnline 
                ? 'No PDFs downloaded yet. Check for updates!' 
                : 'No PDFs available. Connect to internet to download.'}
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  offlineBanner: {
    backgroundColor: '#FF9800',
    padding: 10,
    alignItems: 'center',
  },
  offlineText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
  },
  pdfCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pdfIcon: {
    width: 50,
    height: 50,
    backgroundColor: '#E3F2FD',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  pdfIconText: {
    fontSize: 28,
  },
  pdfInfo: {
    flex: 1,
  },
  pdfTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  pdfDate: {
    fontSize: 12,
    color: '#999',
  },
  statusBadge: {
    width: 30,
    height: 30,
    backgroundColor: '#1976D2',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});

export default PDFList;
