// Local Storage Service - Handles local PDF storage and metadata
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';

const KEYS = {
  DOWNLOADED_PDFS: 'downloaded_pdfs',
  FAVORITE_PDFS: 'favorite_pdfs',
  RECENT_PDFS: 'recent_pdfs',
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

/**
 * Get list of favorite PDFs
 */
export const getFavoritePDFs = async () => {
  try {
    const pdfs = await AsyncStorage.getItem(KEYS.FAVORITE_PDFS);
    return pdfs ? JSON.parse(pdfs) : [];
  } catch (error) {
    console.error('Error getting favorite PDFs:', error);
    return [];
  }
};

/**
 * Add or remove a PDF from favorites
 */
export const toggleFavoritePDF = async (pdf) => {
  try {
    const pdfs = await getFavoritePDFs();
    const existingIndex = pdfs.findIndex(p => p.id === pdf.id);
    
    if (existingIndex >= 0) {
      // Remove from favorites
      pdfs.splice(existingIndex, 1);
    } else {
      // Add to favorites
      pdfs.push({
        id: pdf.id,
        title: pdf.title,
        category: pdf.category,
        url: pdf.url,
        localUri: pdf.localUri || null,
        isDownloaded: pdf.isDownloaded || false,
        favoritedAt: new Date().toISOString()
      });
    }
    
    await AsyncStorage.setItem(KEYS.FAVORITE_PDFS, JSON.stringify(pdfs));
    return existingIndex < 0; // Return true if added, false if removed
  } catch (error) {
    console.error('Error toggling favorite PDF:', error);
    return false;
  }
};

/**
 * Check if a PDF is in favorites
 */
export const isPDFFavorite = async (pdfId) => {
  try {
    const pdfs = await getFavoritePDFs();
    return pdfs.some(p => p.id === pdfId);
  } catch (error) {
    console.error('Error checking if PDF is favorite:', error);
    return false;
  }
};

/**
 * Add PDF to recent list
 */
export const addRecentPDF = async (pdf) => {
  try {
    if (!pdf || !pdf.id) {
      console.warn('Invalid PDF object:', pdf);
      return false;
    }

    console.log('Adding to recent:', pdf.title);
    
    const pdfs = await getRecentPDFs();
    
    // Remove if already exists
    const existingIndex = pdfs.findIndex(p => p.id === pdf.id);
    if (existingIndex >= 0) {
      pdfs.splice(existingIndex, 1);
    }
    
    // Add to beginning of list
    pdfs.unshift({
      id: pdf.id,
      title: pdf.title,
      category: pdf.category,
      url: pdf.url,
      localUri: pdf.localUri || null,
      isDownloaded: pdf.isDownloaded || false,
      viewedAt: new Date().toISOString()
    });
    
    // Keep only last 10 recent PDFs
    const limitedPdfs = pdfs.slice(0, 10);
    
    await AsyncStorage.setItem(KEYS.RECENT_PDFS, JSON.stringify(limitedPdfs));
    console.log('Recent PDFs saved, total:', limitedPdfs.length);
    return true;
  } catch (error) {
    console.error('Error adding recent PDF:', error);
    return false;
  }
};

/**
 * Get list of recent PDFs
 */
export const getRecentPDFs = async () => {
  try {
    const pdfs = await AsyncStorage.getItem(KEYS.RECENT_PDFS);
    return pdfs ? JSON.parse(pdfs) : [];
  } catch (error) {
    console.error('Error getting recent PDFs:', error);
    return [];
  }
};
