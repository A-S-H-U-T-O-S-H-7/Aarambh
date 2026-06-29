// lib/services/panchangService.js
import { db } from '@/lib/firebase/client';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc,
  query,
  where,
  serverTimestamp
} from 'firebase/firestore';
import { fetchAllPanchangData, LOCATIONS } from '@/lib/astro/vedicApi';

const PANCHANG_COLLECTION = 'panchang';

// Get panchang for a specific date
export const getPanchang = async (date = null) => {
  try {
    const panchangDate = date || new Date().toISOString().split('T')[0];
    const docRef = doc(db, PANCHANG_COLLECTION, panchangDate);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { success: true, panchang: docSnap.data() };
    }
    return { success: false, panchang: null };
  } catch (error) {
    console.error('Error getting panchang:', error);
    return { success: false, panchang: null };
  }
};

// Save panchang
export const savePanchang = async (panchangData, adminData, date = null) => {
  try {
    const panchangDate = date || new Date().toISOString().split('T')[0];
    const docRef = doc(db, PANCHANG_COLLECTION, panchangDate);
    
    await setDoc(docRef, {
      date: panchangDate,
      ...panchangData,
      isManualOverride: panchangData.isManualOverride || false,
      updatedAt: serverTimestamp(),
      updatedBy: adminData?.id || null,
    }, { merge: true });

    return { success: true };
  } catch (error) {
    console.error('Error saving panchang:', error);
    return { success: false, error: error.message };
  }
};

// Fetch and save panchang from API
export const fetchAndSavePanchang = async (location = 'delhi', lang = 'en', adminData, date = null) => {
  try {
    const panchangDate = date || new Date().toISOString().split('T')[0];
    
    // Get location data
    const locData = LOCATIONS[location] || LOCATIONS.delhi;
    
    // Fetch all panchang data
    const result = await fetchAllPanchangData(panchangDate, location, lang);
    
    if (!result.success) {
      return { success: false, error: 'Failed to fetch panchang data' };
    }

    // Prepare data for storage
    const panchangData = {
      location: location,
      locationLat: locData.lat,
      locationLon: locData.lon,
      locationTz: locData.tz,
      festivals: result.festivals,
      yogas: result.yogas,
      sunrise: result.sunrise,
      sunset: result.sunset,
      choghadiya: result.choghadiya,
      hora: result.hora,
      source: 'vedicastro',
      isManualOverride: false,
    };

    await savePanchang(panchangData, adminData, panchangDate);

    return { success: true, data: panchangData };
  } catch (error) {
    console.error('Error fetching panchang:', error);
    return { success: false, error: error.message };
  }
};

// Update panchang manually
export const updatePanchangManually = async (panchangData, adminData, date = null) => {
  try {
    const panchangDate = date || new Date().toISOString().split('T')[0];
    
    await savePanchang({
      ...panchangData,
      isManualOverride: true,
      source: 'manual',
    }, adminData, panchangDate);

    return { success: true };
  } catch (error) {
    console.error('Error updating panchang manually:', error);
    return { success: false, error: error.message };
  }
};

// Get panchang for homepage
export const getPanchangForHomepage = async (date = null) => {
  try {
    const panchangDate = date || new Date().toISOString().split('T')[0];
    const result = await getPanchang(panchangDate);

    if (result.success && result.panchang) {
      return {
        success: true,
        panchang: {
          date: panchangDate,
          sunrise: result.panchang.sunrise,
          sunset: result.panchang.sunset,
          festivals: result.panchang.festivals || [],
          choghadiya: result.panchang.choghadiya || {},
        }
      };
    }

    return { success: false, panchang: null };
  } catch (error) {
    console.error('Error getting panchang for homepage:', error);
    return { success: false, error: error.message };
  }
};