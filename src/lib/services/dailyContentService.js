// lib/services/dailyContentService.js
import { db, storage } from "@/lib/firebase/client";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

const COLLECTION = "dailyContent";
const STORAGE_PATH = "daily-content/hero";

// Upload image to Firebase Storage
const uploadHeroImage = async (file, type) => {
  if (!file) return null;
  
  try {
    const timestamp = Date.now();
    const extension = (file.name || 'jpg').split('.').pop().toLowerCase();
    const fileName = `hero_${type}_${timestamp}.${extension}`;
    const storageRef = ref(storage, `${STORAGE_PATH}/${fileName}`);

    const uploadResult = await uploadBytes(storageRef, file);
    const imageUrl = await getDownloadURL(uploadResult.ref);
    return imageUrl;
  } catch (error) {
    console.error(`Error uploading ${type} image:`, error);
    throw error;
  }
};

// Delete image from Firebase Storage
const deleteHeroImage = async (imageUrl) => {
  if (!imageUrl) return;
  try {
    const storageRef = ref(storage, imageUrl);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
  }
};

// Get all daily content
export const getDailyContent = async () => {
  try {
    const [heroDoc, mantraDoc, wisdomDoc, songDoc] = await Promise.all([
      getDoc(doc(db, COLLECTION, "hero")),
      getDoc(doc(db, COLLECTION, "mantra")),
      getDoc(doc(db, COLLECTION, "wisdom")),
      getDoc(doc(db, COLLECTION, "song")),
    ]);

    return {
      success: true,
      data: {
        hero: heroDoc.exists() ? heroDoc.data() : null,
        mantra: mantraDoc.exists() ? mantraDoc.data() : null,
        wisdom: wisdomDoc.exists() ? wisdomDoc.data() : null,
        song: songDoc.exists() ? songDoc.data() : null,
      },
    };
  } catch (error) {
    console.error("Error getting daily content:", error);
    return { success: false, error: error.message };
  }
};

// Get single item
export const getDailyItem = async (key) => {
  try {
    const docRef = doc(db, COLLECTION, key);
    const docSnap = await getDoc(docRef);
    return {
      success: true,
      data: docSnap.exists() ? docSnap.data() : null,
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Save/Update hero with images
export const saveHero = async (data, desktopImage = null, mobileImage = null) => {
  try {
    let heroData = { ...data };
    
    // Upload desktop image
    if (desktopImage) {
      // Delete old desktop image if exists
      if (data.oldDesktopImage) {
        await deleteHeroImage(data.oldDesktopImage);
      }
      const desktopUrl = await uploadHeroImage(desktopImage, 'desktop');
      heroData.desktopImage = desktopUrl;
    }
    
    // Upload mobile image
    if (mobileImage) {
      // Delete old mobile image if exists
      if (data.oldMobileImage) {
        await deleteHeroImage(data.oldMobileImage);
      }
      const mobileUrl = await uploadHeroImage(mobileImage, 'mobile');
      heroData.mobileImage = mobileUrl;
    }
    
    // Remove temp fields
    delete heroData.oldDesktopImage;
    delete heroData.oldMobileImage;
    
    await setDoc(doc(db, COLLECTION, "hero"), {
      ...heroData,
      updatedAt: new Date().toISOString(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error saving hero:', error);
    return { success: false, error: error.message };
  }
};

// Save/Update mantra
export const saveMantra = async (data) => {
  try {
    await setDoc(doc(db, COLLECTION, "mantra"), {
      ...data,
      updatedAt: new Date().toISOString(),
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Save/Update wisdom
export const saveWisdom = async (data) => {
  try {
    await setDoc(doc(db, COLLECTION, "wisdom"), {
      ...data,
      updatedAt: new Date().toISOString(),
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Save/Update song
export const saveSong = async (data) => {
  try {
    const songData = {
      title: data.title || '',
      artist: data.artist || '',
      url: data.url || data.songUrl || '',  
      isPlaying: data.isPlaying !== undefined ? data.isPlaying : true,
      festival: data.festival || '',
      updatedAt: new Date().toISOString(),
    };
    
    await setDoc(doc(db, COLLECTION, "song"), songData);
    return { success: true };
  } catch (error) {
    console.error('Error saving song:', error);
    return { success: false, error: error.message };
  }
};