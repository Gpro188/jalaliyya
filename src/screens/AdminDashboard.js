import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, Modal, TextInput, ActivityIndicator, Platform } from 'react-native';
import { FileText, Plus, Trash2, LogOut, X, Upload } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import { getPdfFiles, uploadPdf, deletePdf, getCategories, addCategory, deleteCategory } from '../services/dbService';

export default function AdminDashboard({ navigation }) {
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState("Qur'an");
  const [selectedFile, setSelectedFile] = useState(null);

  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categoryLoading, setCategoryLoading] = useState(true);

  useEffect(() => {
    fetchPdfs();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setCategoryLoading(true);
    const data = await getCategories();
    setCategories(data);
    // If no category selected but we have categories, select first one
    if (!category && data.length > 0) {
      setCategory(data[0].name);
    }
    setCategoryLoading(false);
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    const response = await addCategory(newCategoryName.trim());
    if (response.success) {
      setNewCategoryName('');
      fetchCategories();
    } else {
      Alert.alert("Error", response.error);
    }
  };

  const handleDeleteCategory = (id, name) => {
    Alert.alert(
      "Delete Category",
      `Are you sure you want to delete "${name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            const response = await deleteCategory(id);
            if (response.success) {
              fetchCategories();
              if (category === name) setCategory('');
            } else {
              Alert.alert("Error", response.error);
            }
          }
        }
      ]
    );
  };

  const fetchPdfs = async () => {
    setLoading(true);
    const data = await getPdfFiles();
    setPdfs(data);
    setLoading(false);
  };

  const handleLogout = () => {
    navigation.replace('AdminLogin');
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedFile(result.assets[0]);
      }
    } catch (err) {
      console.error("Error picking document", err);
      Alert.alert("Error", "Failed to pick document");
    }
  };

  const handleUpload = async () => {
    if (!title || !category || !selectedFile) {
      Alert.alert("Missing Fields", "Please provide a title, category, and select a PDF file.");
      return;
    }

    setUploading(true);
    const response = await uploadPdf(
      selectedFile.uri, 
      selectedFile.name, 
      selectedFile.mimeType, 
      title, 
      category
    );

    setUploading(false);

    if (response.success) {
      Alert.alert("Success", "PDF uploaded successfully!");
      setModalVisible(false);
      setTitle('');
      setSelectedFile(null);
      fetchPdfs(); // Refresh the list
    } else {
      Alert.alert("Upload Failed", response.error);
    }
  };

  const handleDelete = (id, url) => {
    Alert.alert(
      "Delete PDF",
      "Are you sure you want to permanently delete this PDF?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            const response = await deletePdf(id, url);
            if (response.success) {
              fetchPdfs();
            } else {
              Alert.alert("Error", "Failed to delete PDF.");
            }
          }
        }
      ]
    );
  };

  const renderPdfItem = ({ item }) => (
    <View style={styles.pdfItem}>
      <View style={styles.pdfInfo}>
        <FileText color="#1976D2" size={24} />
        <View style={styles.pdfTextContainer}>
          <Text style={styles.pdfTitle}>{item.title}</Text>
          <Text style={styles.pdfCategory}>{item.category}</Text>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => handleDelete(item.id, item.url)}
      >
        <Trash2 color="#FF3B30" size={20} />
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerSection}>
      {/* Category Management */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Manage Categories</Text>
      </View>
      <View style={styles.addCategoryContainer}>
        <TextInput 
          style={styles.addCategoryInput} 
          placeholder="New Category Name" 
          value={newCategoryName} 
          onChangeText={setNewCategoryName} 
        />
        <TouchableOpacity style={styles.addCategoryButton} onPress={handleAddCategory}>
          <Text style={styles.addCategoryButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.categoryListContainer}>
        {categoryLoading ? <ActivityIndicator color="#1976D2" /> : categories.map(cat => (
          <View key={cat.id} style={styles.categoryItem}>
            <Text style={styles.categoryItemText}>{cat.name}</Text>
            <TouchableOpacity onPress={() => handleDeleteCategory(cat.id, cat.name)}>
              <Trash2 color="#FF3B30" size={18} />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* PDF Management Header */}
      <View style={[styles.sectionHeader, { marginTop: 30 }]}>
        <Text style={styles.sectionTitle}>Manage PDFs</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Plus color="#fff" size={20} />
          <Text style={styles.addButtonText}>Upload New</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut color="#fff" size={20} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>

        {loading ? (
          <ActivityIndicator size="large" color="#1976D2" style={{ marginTop: 50 }} />
        ) : (
          <FlatList
            data={pdfs}
            renderItem={renderPdfItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
            ListHeaderComponent={renderHeader}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No PDFs uploaded yet. Click "Upload New" to add one.</Text>
            }
          />
        )}
      </View>

      {/* Upload Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => !uploading && setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Upload PDF</Text>
            {!uploading && (
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X color="#333" size={28} />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Surah Yaseen"
              value={title}
              onChangeText={setTitle}
              editable={!uploading}
            />

            <Text style={styles.label}>Category</Text>
            <View style={styles.categoryChips}>
              {categories.map(cat => (
                <TouchableOpacity 
                  key={cat.id} 
                  style={[styles.chip, category === cat.name && styles.chipActive]}
                  onPress={() => setCategory(cat.name)}
                  disabled={uploading}
                >
                  <Text style={[styles.chipText, category === cat.name && styles.chipTextActive]}>{cat.name}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>PDF File</Text>
            <TouchableOpacity 
              style={styles.filePickerButton} 
              onPress={pickDocument}
              disabled={uploading}
            >
              <Upload color="#1976D2" size={24} />
              <Text style={styles.filePickerText}>
                {selectedFile ? selectedFile.name : "Tap to browse files"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.submitButton, uploading && styles.submitButtonDisabled]} 
              onPress={handleUpload}
              disabled={uploading}
            >
              {uploading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitText}>Upload Document</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F7F3',
  },
  header: {
    backgroundColor: '#0B1933',
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 50 : 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    marginLeft: 5,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0B1933',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3DCCB1',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 40,
    fontSize: 16,
  },
  pdfItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  pdfInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  pdfTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  pdfTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  pdfCategory: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  deleteButton: {
    padding: 8,
    backgroundColor: '#FFF0F0',
    borderRadius: 8,
    marginLeft: 10,
  },
  
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 50 : 30,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0B1933',
  },
  formContainer: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  categoryChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#eee',
  },
  chipActive: {
    backgroundColor: '#1976D2',
    borderColor: '#1976D2',
  },
  chipText: {
    color: '#666',
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#fff',
  },
  filePickerButton: {
    backgroundColor: '#E3F2FD',
    borderWidth: 1,
    borderColor: '#1976D2',
    borderStyle: 'dashed',
    borderRadius: 10,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  filePickerText: {
    color: '#1976D2',
    marginTop: 10,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#3DCCB1',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 40,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSection: {
    marginBottom: 10,
  },
  addCategoryContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  addCategoryInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
  },
  addCategoryButton: {
    backgroundColor: '#0B1933',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  addCategoryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  categoryListContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  categoryItemText: {
    marginRight: 8,
    color: '#333',
    fontWeight: '500',
  }
});
