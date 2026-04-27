// Firebase Service - Handles all Firebase operations
import { db, storage } from '../firebaseConfig';
import { collection, getDocs, query, orderBy, doc, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, getMetadata, listAll } from 'firebase/storage';

// PDF Collection name in Firestore
const PDF_COLLECTION = 'pdfs';
const STORAGE_FOLDER = 'pdfs';

/**
 * Fetch all PDFs from Firebase
 * Returns array of PDF objects with metadata
 */
export const fetchPDFs = async () => {
  try {
    const pdfsRef = collection(db, PDF_COLLECTION);
    const q = query(pdfsRef, orderBy('uploadedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const pdfs = [];
    querySnapshot.forEach((doc) => {
      pdfs.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return pdfs;
  } catch (error) {
    console.error('Error fetching PDFs:', error);
    throw error;
  }
};

/**
 * Get the latest version timestamp from Firebase
 * Used to check if there are updates
 */
export const getLatestVersion = async () => {
  try {
    const pdfs = await fetchPDFs();
    if (pdfs.length === 0) return null;
    
    // Get the most recent upload timestamp
    const latest = pdfs.reduce((max, pdf) => {
      const timestamp = pdf.uploadedAt?.seconds || 0;
      return timestamp > max ? timestamp : max;
    }, 0);
    
    return latest;
  } catch (error) {
    console.error('Error getting latest version:', error);
    return null;
  }
};

/**
 * Get PDFs that are newer than the last checked version
 * Returns only new/updated PDFs
 */
export const getNewPDFs = async (lastCheckedVersion) => {
  try {
    const pdfs = await fetchPDFs();
    
    if (!lastCheckedVersion) {
      return pdfs; // Return all if no previous version
    }
    
    // Filter PDFs uploaded after last checked version
    const newPdfs = pdfs.filter(pdf => {
      const timestamp = pdf.uploadedAt?.seconds || 0;
      return timestamp > lastCheckedVersion;
    });
    
    return newPdfs;
  } catch (error) {
    console.error('Error getting new PDFs:', error);
    return [];
  }
};

/**
 * Get download URL for a PDF from Firebase Storage
 */
export const getPDFDownloadURL = async (pdfPath) => {
  try {
    const storageRef = ref(storage, pdfPath);
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.error('Error getting download URL:', error);
    throw error;
  }
};

// ===== ADMIN FUNCTIONS (For uploading PDFs) =====

/**
 * Upload a new PDF to Firebase (Admin only)
 */
export const uploadPDF = async (file, title, description = '') => {
  try {
    // Upload to Storage
    const storageRef = ref(storage, `${STORAGE_FOLDER}/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    // Save metadata to Firestore
    const docRef = await addDoc(collection(db, PDF_COLLECTION), {
      title: title || file.name,
      description,
      fileName: file.name,
      filePath: snapshot.ref.fullPath,
      downloadURL: downloadURL,
      uploadedAt: serverTimestamp(),
      size: file.size
    });
    
    return {
      success: true,
      id: docRef.id,
      url: downloadURL
    };
  } catch (error) {
    console.error('Error uploading PDF:', error);
    throw error;
  }
};

/**
 * List all PDFs in Firebase Storage
 */
export const listAllPDFs = async () => {
  try {
    const storageRef = ref(storage, STORAGE_FOLDER);
    const result = await listAll(storageRef);
    
    const files = result.items.map(item => ({
      name: item.name,
      fullPath: item.fullPath,
      ref: item
    }));
    
    return files;
  } catch (error) {
    console.error('Error listing PDFs:', error);
    throw error;
  }
};
