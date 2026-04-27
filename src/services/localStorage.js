// Local Storage Service - Handles local PDF storage and metadata
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

const KEYS = {
  DOWNLOADED_PDFS: 'downloaded_pdfs',
  LAST_CHECKED_VERSION: 'last_checked_version',
  APP_VERSION: 'app_version'
};

/**
 * Get list of downloaded PDFs from local storage
 */
export const getDownloadedPDFs = async () => {
  try {
    const pdfs = await AsyncStorage.getItem(KEYS.DOWNLOADED_PDFS);
    return pdfs ? JSON.parse(pdfs) : [];
  } catch (error) {
    console.error('Error getting downloaded PDFs:', error);
    return [];
  }
};

/**
 * Save downloaded PDF info to local storage
 */
export const saveDownloadedPDF = async (pdfInfo) => {
  try {
    const pdfs = await getDownloadedPDFs();
    
    // Check if PDF already exists, update if so
    const existingIndex = pdfs.findIndex(p => p.id === pdfInfo.id);
    if (existingIndex >= 0) {
      pdfs[existingIndex] = pdfInfo;
    } else {
      pdfs.push(pdfInfo);
    }
    
    await AsyncStorage.setItem(KEYS.DOWNLOADED_PDFS, JSON.stringify(pdfs));
    return true;
  } catch (error) {
    console.error('Error saving downloaded PDF:', error);
    return false;
  }
};

/**
 * Remove a PDF from local storage
 */
export const removeDownloadedPDF = async (pdfId) => {
  try {
    const pdfs = await getDownloadedPDFs();
    const filtered = pdfs.filter(p => p.id !== pdfId);
    await AsyncStorage.setItem(KEYS.DOWNLOADED_PDFS, JSON.stringify(filtered));
    
    return true;
  } catch (error) {
    console.error('Error removing PDF:', error);
    return false;
  }
};

/**
 * Download PDF from URL and save to device
 */
export const downloadPDFToDevice = async (pdfId, pdfUrl, pdfName) => {
  try {
    // Create directory if it doesn't exist
    const dirPath = `${FileSystem.documentDirectory}pdfs/`;
    const dirInfo = await FileSystem.getInfoAsync(dirPath);
    
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(dirPath, { intermediates: true });
    }
    
    // File path
    const filePath = `${dirPath}${pdfId}_${pdfName}`;
    
    // Download the file
    const downloadResumable = FileSystem.createDownloadResumable(
      pdfUrl,
      filePath,
      {},
      (downloadProgress) => {
        const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
        console.log(`Download progress: ${Math.round(progress * 100)}%`);
      }
    );
    
    const result = await downloadResumable.downloadAsync();
    
    if (result && result.uri) {
      // Save PDF info to AsyncStorage
      await saveDownloadedPDF({
        id: pdfId,
        name: pdfName,
        localPath: result.uri,
        downloadedAt: new Date().toISOString()
      });
      
      return {
        success: true,
        localPath: result.uri
      };
    } else {
      return {
        success: false,
        error: 'Download failed'
      };
    }
  } catch (error) {
    console.error('Error downloading PDF:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get local file path for a PDF
 */
export const getLocalPDFPath = async (pdfId) => {
  try {
    const pdfs = await getDownloadedPDFs();
    const pdf = pdfs.find(p => p.id === pdfId);
    return pdf ? pdf.localPath : null;
  } catch (error) {
    console.error('Error getting local PDF path:', error);
    return null;
  }
};

/**
 * Check if a PDF is already downloaded
 */
export const isPDFDownloaded = async (pdfId) => {
  try {
    const path = await getLocalPDFPath(pdfId);
    if (!path) return false;
    
    // Check if file exists
    const fileInfo = await FileSystem.getInfoAsync(path);
    return fileInfo.exists;
  } catch (error) {
    console.error('Error checking if PDF downloaded:', error);
    return false;
  }
};

/**
 * Get last checked version timestamp
 */
export const getLastCheckedVersion = async () => {
  try {
    const version = await AsyncStorage.getItem(KEYS.LAST_CHECKED_VERSION);
    return version ? parseFloat(version) : 0;
  } catch (error) {
    console.error('Error getting last checked version:', error);
    return 0;
  }
};

/**
 * Update last checked version timestamp
 */
export const updateLastCheckedVersion = async (version) => {
  try {
    await AsyncStorage.setItem(KEYS.LAST_CHECKED_VERSION, version.toString());
    return true;
  } catch (error) {
    console.error('Error updating version:', error);
    return false;
  }
};

/**
 * Delete a local PDF file
 */
export const deleteLocalPDF = async (pdfId) => {
  try {
    const pdfs = await getDownloadedPDFs();
    const pdf = pdfs.find(p => p.id === pdfId);
    
    if (pdf && pdf.localPath) {
      const fileInfo = await FileSystem.getInfoAsync(pdf.localPath);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(pdf.localPath);
      }
    }
    
    await removeDownloadedPDF(pdfId);
    return true;
  } catch (error) {
    console.error('Error deleting local PDF:', error);
    return false;
  }
};

/**
 * Get all locally available PDFs with their paths
 */
export const getAllLocalPDFs = async () => {
  return await getDownloadedPDFs();
};
