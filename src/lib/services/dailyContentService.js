// lib/services/dailyContentService.js
import { db } from "@/lib/firebase/client";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

const COLLECTION = "dailyContent";

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

// Save/Update hero
export const saveHero = async (data) => {
  try {
    await setDoc(doc(db, COLLECTION, "hero"), {
      ...data,
      updatedAt: new Date().toISOString(),
    });
    return { success: true };
  } catch (error) {
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
    await setDoc(doc(db, COLLECTION, "song"), {
      ...data,
      updatedAt: new Date().toISOString(),
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};