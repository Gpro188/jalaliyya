// Update Popup Component - Shows when new PDFs are available
import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert
} from 'react-native';
import { downloadPDFToDevice } from '../services/localStorage';

const UpdatePopup = ({ visible, newPDFs, onClose, onDownloadComplete }) => {
  const [downloading, setDownloading] = useState({});
  const [downloaded, setDownloaded] = useState({});

  const handleDownload = async (pdf) => {
    if (downloaded[pdf.id]) {
      Alert.alert('Already Downloaded', 'This PDF is already downloaded');
      return;
    }

    setDownloading(prev => ({ ...prev, [pdf.id]: true }));

    try {
      const result = await downloadPDFToDevice(
        pdf.id,
        pdf.downloadURL,
        pdf.fileName || pdf.title
      );

      if (result.success) {
        setDownloaded(prev => ({ ...prev, [pdf.id]: true }));
        Alert.alert('Success', 'PDF downloaded successfully!');
        
        // Notify parent component
        if (onDownloadComplete) {
          onDownloadComplete(pdf);
        }
      } else {
        Alert.alert('Error', 'Failed to download PDF. Please try again.');
      }
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Error', 'Download failed. Please check your connection.');
    } finally {
      setDownloading(prev => ({ ...prev, [pdf.id]: false }));
    }
  };

  const handleDownloadAll = async () => {
    Alert.alert(
      'Download All',
      `Download ${newPDFs.length} PDF(s)?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Download',
          onPress: async () => {
            for (const pdf of newPDFs) {
              await handleDownload(pdf);
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }) => {
    const isDownloading = downloading[item.id];
    const isDownloaded = downloaded[item.id];

    return (
      <View style={styles.pdfItem}>
        <View style={styles.pdfIcon}>
          <Text style={styles.pdfIconText}>📄</Text>
        </View>
        <View style={styles.pdfDetails}>
          <Text style={styles.pdfTitle}>{item.title}</Text>
          {item.description && (
            <Text style={styles.pdfDescription}>{item.description}</Text>
          )}
          <Text style={styles.pdfDate}>
            {new Date(item.uploadedAt?.seconds * 1000).toLocaleDateString()}
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.downloadButton,
            isDownloaded && styles.downloadedButton,
            isDownloading && styles.downloadingButton
          ]}
          onPress={() => handleDownload(item)}
          disabled={isDownloading || isDownloaded}
        >
          {isDownloading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : isDownloaded ? (
            <Text style={styles.downloadedText}>✓</Text>
          ) : (
            <Text style={styles.downloadText}>⬇</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  if (!visible || newPDFs.length === 0) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerIcon}>🎉</Text>
            <Text style={styles.headerTitle}>New Updates Available!</Text>
            <Text style={styles.headerSubtitle}>
              {newPDFs.length} new PDF(s) ready to download
            </Text>
          </View>

          {/* PDF List */}
          <FlatList
            data={newPDFs}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            style={styles.list}
            contentContainerStyle={styles.listContainer}
          />

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.downloadAllButton]}
              onPress={handleDownloadAll}
            >
              <Text style={styles.downloadAllText}>Download All</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.closeButton]}
              onPress={onClose}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  list: {
    maxHeight: 400,
  },
  listContainer: {
    padding: 16,
  },
  pdfItem: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
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
  pdfDetails: {
    flex: 1,
  },
  pdfTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  pdfDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  pdfDate: {
    fontSize: 11,
    color: '#999',
  },
  downloadButton: {
    width: 40,
    height: 40,
    backgroundColor: '#1976D2',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadingButton: {
    backgroundColor: '#FF9800',
  },
  downloadedButton: {
    backgroundColor: '#2196F3',
  },
  downloadText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  downloadedText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  button: {
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 8,
  },
  downloadAllButton: {
    backgroundColor: '#1976D2',
  },
  downloadAllText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#f5f5f5',
  },
  closeText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default UpdatePopup;
