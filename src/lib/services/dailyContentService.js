// lib/services/dailyContentService.js
import { db, storage } from "@/lib/firebase/client";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

const COLLECTION = "dailyContent";
const STORAGE_PATH = "daily-content/hero";
const SONG_STORAGE_PATH = "daily-content/songs";

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

// Upload video to Firebase Storage
const uploadHeroVideo = async (file, type) => {
  if (!file) return null;
  
  try {
    const timestamp = Date.now();
    const extension = (file.name || 'mp4').split('.').pop().toLowerCase();
    const fileName = `hero_${type}_video_${timestamp}.${extension}`;
    const storageRef = ref(storage, `${STORAGE_PATH}/${fileName}`);

    const uploadResult = await uploadBytes(storageRef, file);
    const videoUrl = await getDownloadURL(uploadResult.ref);
    return videoUrl;
  } catch (error) {
    console.error(`Error uploading ${type} video:`, error);
    throw error;
  }
};

// Delete media from Firebase Storage
const deleteHeroMedia = async (mediaUrl) => {
  if (!mediaUrl) return;
  try {
    const storageRef = ref(storage, mediaUrl);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting media:', error);
  }
};

// Upload audio file to Firebase Storage
const uploadSongAudio = async (file) => {
  if (!file) return null;

  try {
    const timestamp = Date.now();
    const extension = (file.name || 'mp3').split('.').pop().toLowerCase();
    const fileName = `song_${timestamp}.${extension}`;
    const storageRef = ref(storage, `${SONG_STORAGE_PATH}/${fileName}`);

    const uploadResult = await uploadBytes(storageRef, file);
    return getDownloadURL(uploadResult.ref);
  } catch (error) {
    console.error('Error uploading song audio:', error);
    throw error;
  }
};

// Delete audio from Firebase Storage
const deleteSongAudio = async (audioUrl) => {
  if (!audioUrl || !audioUrl.includes('firebasestorage.googleapis.com')) return;
  try {
    const storageRef = ref(storage, audioUrl);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting song audio:', error);
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

// Save/Update hero with images and videos
export const saveHero = async (data, desktopImage = null, desktopVideo = null, mobileImage = null, mobileVideo = null) => {
  try {
    let heroData = { ...data };
    
    // Upload desktop image
    if (desktopImage) {
      if (data.oldDesktopImage) {
        await deleteHeroMedia(data.oldDesktopImage);
      }
      const desktopImageUrl = await uploadHeroImage(desktopImage, 'desktop');
      heroData.desktopImage = desktopImageUrl;
    }
    
    // Upload desktop video
    if (desktopVideo) {
      if (data.oldDesktopVideo) {
        await deleteHeroMedia(data.oldDesktopVideo);
      }
      const desktopVideoUrl = await uploadHeroVideo(desktopVideo, 'desktop');
      heroData.desktopVideo = desktopVideoUrl;
    }
    
    // Upload mobile image
    if (mobileImage) {
      if (data.oldMobileImage) {
        await deleteHeroMedia(data.oldMobileImage);
      }
      const mobileImageUrl = await uploadHeroImage(mobileImage, 'mobile');
      heroData.mobileImage = mobileImageUrl;
    }
    
    // Upload mobile video
    if (mobileVideo) {
      if (data.oldMobileVideo) {
        await deleteHeroMedia(data.oldMobileVideo);
      }
      const mobileVideoUrl = await uploadHeroVideo(mobileVideo, 'mobile');
      heroData.mobileVideo = mobileVideoUrl;
    }
    
    // Remove temp fields
    delete heroData.oldDesktopImage;
    delete heroData.oldDesktopVideo;
    delete heroData.oldMobileImage;
    delete heroData.oldMobileVideo;
    
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
export const saveSong = async (data, audioFile = null) => {
  try {
    let audioUrl = '';

    if (audioFile) {
      if (data.oldAudioUrl) {
        await deleteSongAudio(data.oldAudioUrl);
      }
      audioUrl = await uploadSongAudio(audioFile);
    }

    if (!audioUrl?.trim()) {
      return { success: false, error: 'Please upload an audio file' };
    }

    const songData = {
      url: audioUrl,
      title: data.title || '',
      artist: data.artist || '',
      isPlaying: data.isPlaying !== undefined ? data.isPlaying : true,
      festival: data.festival || '',
      updatedAt: new Date().toISOString(),
    };

    await setDoc(doc(db, COLLECTION, "song"), songData);
    return { success: true, audioUrl };
  } catch (error) {
    console.error('Error saving song:', error);
    return { success: false, error: error.message };
  }
};