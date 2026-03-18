import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { storage } from './firebaseConfig';

// Upload a single file
export const uploadFile = async (file, folder) => {
  try {
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name}`;
    const storageRef = ref(storage, `${folder}/${fileName}`);

    // Upload file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

// Upload multiple files
export const uploadFiles = async (files, folder) => {
  try {
    const uploadPromises = Array.from(files).map((file) =>
      uploadFile(file, folder)
    );
    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.error('Error uploading files:', error);
    throw error;
  }
};

// Upload photo
export const uploadPhoto = async (file) => {
  return uploadFile(file, 'photos');
};

// Upload multiple photos
export const uploadPhotos = async (files) => {
  return uploadFiles(files, 'photos');
};

// Upload video
export const uploadVideo = async (file) => {
  // Validate video size (max 100MB)
  if (file.size > 100 * 1024 * 1024) {
    throw new Error('Video file size should not exceed 100MB');
  }
  return uploadFile(file, 'videos');
};

// Upload music
export const uploadMusic = async (file) => {
  // Validate music size (max 20MB)
  if (file.size > 20 * 1024 * 1024) {
    throw new Error('Music file size should not exceed 20MB');
  }
  return uploadFile(file, 'music');
};

// Delete file from storage
export const deleteFile = async (fileURL) => {
  try {
    const fileRef = ref(storage, fileURL);
    await deleteObject(fileRef);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

// Delete multiple files
export const deleteFiles = async (fileURLs) => {
  try {
    const deletePromises = fileURLs.map((url) => deleteFile(url));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Error deleting files:', error);
    throw error;
  }
};
