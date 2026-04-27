import { supabase } from '../config/supabase';

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
    let fileBody;

    // In React Native Web, the file object itself might be available, 
    // but typically we fetch the URI to get a blob for both web and native.
    const response = await fetch(fileUri);
    fileBody = await response.blob();

    // Create a unique file path
    const uniqueFileName = `${Date.now()}_${fileName.replace(/\s+/g, '_')}`;
    const filePath = `public/${uniqueFileName}`;

    // Upload to Storage bucket 'pdfs'
    const { data: storageData, error: storageError } = await supabase.storage
      .from('pdfs')
      .upload(filePath, fileBody, {
        contentType: mimeType || 'application/pdf',
        upsert: false,
      });

    if (storageError) throw storageError;

    // Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from('pdfs')
      .getPublicUrl(filePath);

    const publicURL = publicUrlData.publicUrl;

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

    if (dbError) throw dbError;

    return { success: true, data: dbData };
  } catch (error) {
    console.error('Upload failed:', error);
    return { success: false, error: error.message };
  }
};

// Delete a PDF
export const deletePdf = async (pdfId, fileUrl) => {
  try {
    // 1. Extract file path from URL if needed
    // The public URL looks like: .../storage/v1/object/public/pdfs/public/filename.pdf
    const urlParts = fileUrl.split('/pdfs/');
    if (urlParts.length > 1) {
      const filePath = urlParts[1];
      
      // Delete from Storage
      const { error: storageError } = await supabase.storage
        .from('pdfs')
        .remove([filePath]);
        
      if (storageError) {
        console.error('Storage deletion error:', storageError);
      }
    }

    // 2. Delete from DB
    const { error: dbError } = await supabase
      .from('pdf_files')
      .delete()
      .eq('id', pdfId);

    if (dbError) throw dbError;
    
    return { success: true };
  } catch (error) {
    console.error('Delete failed:', error);
    return { success: false, error: error.message };
  }
};
