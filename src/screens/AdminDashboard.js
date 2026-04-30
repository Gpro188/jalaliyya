import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, Modal, TextInput, ActivityIndicator, Platform } from 'react-native';
import { FileText, Plus, Trash2, LogOut, X, Upload, Key } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import { getPdfFiles, uploadPdf, deletePdf } from '../services/dbService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ADMIN_CREDENTIALS_KEY = '@admin_credentials';

// Fixed categories - cannot be modified
const CATEGORIES = [
  "Qur'an",
  "Dikr",
  "Dua",
  "Swalath",
  "Moulid",
  "Baith",
  "Ratheeb",
  "Others"
];

export default function AdminDashboard({ navigation }) {
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState("Qur'an");
  const [selectedFile, setSelectedFile] = useState(null);
  
  // Credentials Change State
  const [credentialsModalVisible, setCredentialsModalVisible] = useState(false);
  const [currentUsername, setCurrentUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingCredentials, setChangingCredentials] = useState(false);

  useEffect(() => {
    fetchPdfs();
  }, []);



  const fetchPdfs = async () => {
    setLoading(true);
    const data = await getPdfFiles();
    setPdfs(data);
    setLoading(false);
  };

  const handleLogout = () => {
    navigation.replace('AdminLogin');
  };

  const handleChangeCredentials = async () => {
    // Validation
    if (!currentUsername.trim() || !currentPassword.trim()) {
      Alert.alert('Missing Fields', 'Please enter your current username and password.');
      return;
    }

    if (!newUsername.trim() || !newPassword.trim()) {
      Alert.alert('Missing Fields', 'Please enter new username and password.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Password Mismatch', 'New password and confirmation do not match.');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters long.');
      return;
    }

    // Verify current credentials
    const defaultCredentials = [
      { username: 'admin', password: 'admin123' },
      { username: 'admin', password: '188JALALIYYA188' },
      { username: 'jalaliyya', password: 'admin123' }
    ];

    const stored = await AsyncStorage.getItem(ADMIN_CREDENTIALS_KEY);
    const storedCreds = stored ? JSON.parse(stored) : null;
    
    const allCredentials = storedCreds 
      ? [storedCreds, ...defaultCredentials]
      : defaultCredentials;

    const isCurrentValid = allCredentials.some(cred =>
      currentUsername.trim().toLowerCase() === cred.username.toLowerCase() &&
      currentPassword.trim() === cred.password
    );

    if (!isCurrentValid) {
      Alert.alert('Invalid Credentials', 'Current username or password is incorrect.');
      return;
    }

    // Save new credentials
    setChangingCredentials(true);
    try {
      const newCreds = {
        username: newUsername.trim().toLowerCase(),
        password: newPassword.trim()
      };

      await AsyncStorage.setItem(ADMIN_CREDENTIALS_KEY, JSON.stringify(newCreds));
      
      Alert.alert(
        'Success',
        'Credentials changed successfully! Please use your new credentials next time.',
        [
          {
            text: 'OK',
            onPress: () => {
              setCredentialsModalVisible(false);
              setCurrentUsername('');
              setCurrentPassword('');
              setNewUsername('');
              setNewPassword('');
              setConfirmPassword('');
              handleLogout();
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save credentials. Please try again.');
      console.error('Error saving credentials:', error);
    } finally {
      setChangingCredentials(false);
    }
  };

  const handleResetCredentials = async () => {
    Alert.alert(
      'Reset Credentials',
      'Are you sure you want to reset to default credentials (admin/admin123)?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem(ADMIN_CREDENTIALS_KEY);
              Alert.alert('Success', 'Credentials reset to default. Please login again.');
              handleLogout();
            } catch (error) {
              Alert.alert('Error', 'Failed to reset credentials.');
            }
          }
        }
      ]
    );
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
    if (!title.trim() || !selectedFile) {
      Alert.alert("Missing Fields", "Please provide a title and select a PDF file.");
      return;
    }

    setUploading(true);
    console.log('Starting upload:', { title, category: selectedCategory, fileName: selectedFile.name });
    
    const response = await uploadPdf(
      selectedFile.uri, 
      selectedFile.name, 
      selectedFile.mimeType, 
      title.trim(), 
      selectedCategory
    );

    setUploading(false);

    if (response.success) {
      Alert.alert("Success", "PDF uploaded successfully!");
      setModalVisible(false);
      setTitle('');
      setSelectedFile(null);
      setSelectedCategory("Qur'an");
      fetchPdfs(); // Refresh the list
    } else {
      console.error('Upload error:', response.error);
      Alert.alert("Upload Failed", response.error || "Failed to upload PDF. Please try again.");
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
      <View style={styles.sectionHeader}>
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
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.credentialsButton}
            onPress={() => setCredentialsModalVisible(true)}
          >
            <Key color="#fff" size={20} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut color="#fff" size={20} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
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

            <Text style={styles.label}>Select Category</Text>
            <View style={styles.categoryChips}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity 
                  key={cat} 
                  style={[styles.chip, selectedCategory === cat && styles.chipActive]}
                  onPress={() => setSelectedCategory(cat)}
                  disabled={uploading}
                >
                  <Text style={[styles.chipText, selectedCategory === cat && styles.chipTextActive]}>{cat}</Text>
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

      {/* Change Credentials Modal */}
      <Modal
        visible={credentialsModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => !changingCredentials && setCredentialsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Change Credentials</Text>
            {!changingCredentials && (
              <TouchableOpacity onPress={() => setCredentialsModalVisible(false)}>
                <X color="#333" size={28} />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.label}>Current Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter current username"
              value={currentUsername}
              onChangeText={setCurrentUsername}
              editable={!changingCredentials}
              autoCapitalize="none"
            />

            <Text style={styles.label}>Current Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter current password"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              editable={!changingCredentials}
              secureTextEntry
            />

            <Text style={styles.label}>New Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter new username"
              value={newUsername}
              onChangeText={setNewUsername}
              editable={!changingCredentials}
              autoCapitalize="none"
            />

            <Text style={styles.label}>New Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter new password (min 6 characters)"
              value={newPassword}
              onChangeText={setNewPassword}
              editable={!changingCredentials}
              secureTextEntry
            />

            <Text style={styles.label}>Confirm New Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              editable={!changingCredentials}
              secureTextEntry
            />

            <TouchableOpacity 
              style={[styles.submitButton, changingCredentials && styles.submitButtonDisabled]} 
              onPress={handleChangeCredentials}
              disabled={changingCredentials}
            >
              {changingCredentials ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitText}>Update Credentials</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.resetButton} 
              onPress={handleResetCredentials}
              disabled={changingCredentials}
            >
              <Text style={styles.resetText}>Reset to Default</Text>
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
    flex: 1,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  credentialsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
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
    marginBottom: 15,
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
  },
  resetButton: {
    backgroundColor: '#FFF0F0',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  resetText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
