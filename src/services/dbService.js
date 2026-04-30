import { supabase } from '../config/supabase';
import * as FileSystem from 'expo-file-system/legacy';
import { decode } from 'base64-arraybuffer';

// Fetch all categories, ordered by display_order
export const getCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

// Add a new category
export const addCategory = async (name) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .insert([{ name, display_order: 99 }])
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error adding category:', error);
    return { success: false, error: error.message };
  }
};

// Delete a category
export const deleteCategory = async (id) => {
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting category:', error);
    return { success: false, error: error.message };
  }
};

// Fetch all PDF files
export const getPdfFiles = async () => {
  try {
    const { data, error } = await supabase
      .from('pdf_files')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching PDF files:', error);
    return [];
  }
};

// Fetch PDF files for a specific category
export const getPdfFilesByCategory = async (categoryName) => {
  try {
    const { data, error } = await supabase
      .from('pdf_files')
      .select('*')
      .eq('category', categoryName)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching PDF files for category:', error);
    return [];
  }
};

// Upload a PDF to Supabase Storage and insert into DB
export const uploadPdf = async (fileUri, fileName, mimeType, title, category) => {
  try {
    console.log('Starting upload...', { fileUri, fileName, mimeType, title, category });
    
    // Read the file securely from the device as a Base64 string
    const base64 = await FileSystem.readAsStringAsync(fileUri, {
      encoding: 'base64',
    });
    
    console.log('File read successfully, size:', base64.length);
    
    // Convert Base64 into an ArrayBuffer for Supabase upload
    const arrayBuffer = decode(base64);

    // Create a unique file path (sanitize to prevent Invalid Key error with Arabic/special characters)
    const safeFileName = fileName.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const uniqueFileName = `${Date.now()}_${safeFileName}`;
    const filePath = `public/${uniqueFileName}`;

    console.log('Uploading to path:', filePath);

    // Upload to Storage bucket 'pdfs'
    const { data: storageData, error: storageError } = await supabase.storage
      .from('pdfs')
      .upload(filePath, arrayBuffer, {
        contentType: mimeType || 'application/pdf',
        upsert: false,
      });

    if (storageError) {
      console.error('Storage upload error:', storageError);
      throw storageError;
    }

    console.log('Storage upload successful:', storageData);

    // Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from('pdfs')
      .getPublicUrl(filePath);

    const publicURL = publicUrlData.publicUrl;
    console.log('Public URL:', publicURL);

    // Insert into database
    const { data: dbData, error: dbError } = await supabase
      .from('pdf_files')
      .insert([
        {
          title: title,
          category: category,
          url: publicURL,
        }
      ])
      .select();

    if (dbError) {
      console.error('Database insert error:', dbError);
      throw dbError;
    }

    console.log('Database insert successful:', dbData);
    return { success: true, data: dbData };
  } catch (error) {
    console.error('Upload failed:', error);
    return { success: false, error: error.message };
  }
};

// Delete a PDF
export const deletePdf = async (pdfId, fileUrl) => {
  try {
    console.log('Deleting PDF:', { pdfId, fileUrl });
    
    // 1. Extract file path from URL if needed
    // The public URL looks like: .../storage/v1/object/public/pdfs/public/filename.pdf
    if (fileUrl) {
      const urlParts = fileUrl.split('/pdfs/');
      if (urlParts.length > 1) {
        const filePath = urlParts[1];
        
        console.log('Deleting from storage:', filePath);
        
        // Delete from Storage
        const { error: storageError } = await supabase.storage
          .from('pdfs')
          .remove([filePath]);
          
        if (storageError) {
          console.error('Storage deletion error:', storageError);
        } else {
          console.log('Storage deletion successful');
        }
      }
    }

    // 2. Delete from DB
    console.log('Deleting from database:', pdfId);
    const { error: dbError } = await supabase
      .from('pdf_files')
      .delete()
      .eq('id', pdfId);

    if (dbError) {
      console.error('Database deletion error:', dbError);
      throw dbError;
    }
    
    console.log('Database deletion successful');
    return { success: true };
  } catch (error) {
    console.error('Delete failed:', error);
    return { success: false, error: error.message };
  }
};
