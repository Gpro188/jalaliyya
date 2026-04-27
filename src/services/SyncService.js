import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { getPdfFiles } from './dbService';

const LOCAL_PDFS_KEY = '@local_pdfs';

export const SyncService = {
  // Get the local state of PDFs
  getLocalState: async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(LOCAL_PDFS_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : {};
    } catch (e) {
      console.error('Error reading local state', e);
      return {};
    }
  },

  // Save the local state
  saveLocalState: async (state) => {
    try {
      const jsonValue = JSON.stringify(state);
      await AsyncStorage.setItem(LOCAL_PDFS_KEY, jsonValue);
    } catch (e) {
      console.error('Error saving local state', e);
    }
  },

  // Check for updates by comparing local state with server state
  checkForUpdates: async () => {
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      return { updatesAvailable: [], error: 'No internet connection' };
    }

    try {
      const serverFiles = await getPdfFiles();
      const localState = await SyncService.getLocalState();
      
      const updatesAvailable = serverFiles.filter(serverFile => {
        const localFile = localState[serverFile.id];
        // If not downloaded yet, or if server version is greater than local version
        if (!localFile) return true;
        return serverFile.version > localFile.version;
      });

      return { updatesAvailable, error: null };
    } catch (error) {
      return { updatesAvailable: [], error: error.message };
    }
  },

  // Download a PDF and update local state
  downloadPdf: async (pdfFile) => {
    try {
      const localState = await SyncService.getLocalState();
      
      // Determine file extension or just use .pdf
      const fileName = `${pdfFile.id}_v${pdfFile.version}.pdf`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      
      const downloadResumable = FileSystem.createDownloadResumable(
        pdfFile.file_url,
        fileUri,
        {},
        (downloadProgress) => {
          const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
          // You could pass a callback to track progress in the UI here
        }
      );

      const { uri } = await downloadResumable.downloadAsync();
      
      // If we had an older version, we could delete it here
      const oldFile = localState[pdfFile.id];
      if (oldFile && oldFile.localUri && oldFile.localUri !== uri) {
        try {
          await FileSystem.deleteAsync(oldFile.localUri);
        } catch (e) {
          console.log('Could not delete old file', e);
        }
      }

      // Update local state
      localState[pdfFile.id] = {
        id: pdfFile.id,
        version: pdfFile.version,
        localUri: uri,
        lastUpdated: new Date().toISOString()
      };
      
      await SyncService.saveLocalState(localState);
      
      return { success: true, uri };
    } catch (error) {
      console.error('Download error:', error);
      return { success: false, error: error.message };
    }
  },

  // Open/get local URI for a PDF if it exists, otherwise return null
  getLocalUri: async (pdfId) => {
    const localState = await SyncService.getLocalState();
    const file = localState[pdfId];
    if (file && file.localUri) {
      // Verify file actually exists
      const fileInfo = await FileSystem.getInfoAsync(file.localUri);
      if (fileInfo.exists) {
        return file.localUri;
      }
    }
    return null;
  }
};
