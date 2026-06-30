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

const normalizePanchangStringValue = (value) => {
  if (value === undefined || value === null || value === '') return '';
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) return value.filter((item) => item !== undefined && item !== null && item !== '').join(', ');
  if (typeof value === 'object') {
    return (
      value.name ||
      value.title ||
      value.tithi_name ||
      value.tithiName ||
      value.nakshatra_name ||
      value.nakshatraName ||
      value.tithi_detail ||
      value.tithiDetail ||
      value.nakshatra_detail ||
      value.nakshatraDetail ||
      value.meaning ||
      value.special ||
      value.type ||
      value.start ||
      value.end ||
      ''
    );
  }
  return String(value);
};

const normalizeStoredPanchang = (stored = {}) => ({
  ...stored,
  month: normalizePanchangStringValue(stored.month),
  samvat: normalizePanchangStringValue(stored.samvat),
  tithi: normalizePanchangStringValue(stored.tithi),
  tithiDetails: normalizePanchangStringValue(stored.tithiDetails),
  nakshatra: normalizePanchangStringValue(stored.nakshatra),
  nakshatraDetails: normalizePanchangStringValue(stored.nakshatraDetails),
  yoga: normalizePanchangStringValue(stored.yoga),
  karana: normalizePanchangStringValue(stored.karana),
  sunrise: normalizePanchangStringValue(stored.sunrise),
  sunset: normalizePanchangStringValue(stored.sunset),
  rahuKaal: normalizePanchangStringValue(stored.rahuKaal),
  abhijitMuhurat: normalizePanchangStringValue(stored.abhijitMuhurat),
  amritKaal: normalizePanchangStringValue(stored.amritKaal),
  specialEvent: normalizePanchangStringValue(stored.specialEvent),
});

// Get panchang for a specific date
export const getPanchang = async (date = null) => {
  try {
    const panchangDate = date || new Date().toISOString().split('T')[0];
    const docRef = doc(db, PANCHANG_COLLECTION, panchangDate);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { success: true, panchang: normalizeStoredPanchang(docSnap.data()) };
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
      month: result.month || '',
      samvat: result.samvat || '',
      tithi: result.tithi || '',
      tithiDetails: result.tithiDetails || '',
      nakshatra: result.nakshatra || '',
      nakshatraDetails: result.nakshatraDetails || '',
      yoga: result.yoga || '',
      karana: result.karana || '',
      festivals: result.festivals,
      yogas: result.yogas,
      sunrise: result.sunrise,
      sunset: result.sunset,
      rahuKaal: result.rahuKaal || '',
      abhijitMuhurat: result.abhijitMuhurat || '',
      amritKaal: result.amritKaal || '',
      specialEvent: result.specialEvent || '',
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

const normalizePanchangString = (value) => {
  if (value === undefined || value === null || value === '') return '';
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) return value.filter((item) => item !== undefined && item !== null && item !== '').join(', ');
  if (typeof value === 'object') {
    return (
      value.name ||
      value.tithi_name ||
      value.tithiName ||
      value.nakshatra_name ||
      value.nakshatraName ||
      value.tithiDetails ||
      value.tithi_details ||
      value.nakshatraDetails ||
      value.nakshatra_details ||
      value.meaning ||
      value.special ||
      value.type ||
      value.start ||
      value.end ||
      ''
    );
  }
  return String(value);
};

// Get panchang for homepage
export const getPanchangForHomepage = async (date = null, lang = 'en') => {
  try {
    const panchangDate = date || new Date().toISOString().split('T')[0];
    const result = await getPanchang(panchangDate);

    if (lang && lang !== 'en') {
      const apiResult = await fetchAllPanchangData(panchangDate, result?.panchang?.location || 'delhi', lang);
      if (apiResult.success) {
        return { success: true, panchang: { date: panchangDate, ...apiResult } };
      }
    }

    if (result.success && result.panchang) {
      const stored = result.panchang;
      return {
        success: true,
        panchang: {
          date: panchangDate,
          month: normalizePanchangString(stored.month),
          samvat: normalizePanchangString(stored.samvat),
          tithi: normalizePanchangString(stored.tithi),
          tithiDetails: normalizePanchangString(stored.tithiDetails),
          nakshatra: normalizePanchangString(stored.nakshatra),
          nakshatraDetails: normalizePanchangString(stored.nakshatraDetails),
          yoga: normalizePanchangString(stored.yoga),
          karana: normalizePanchangString(stored.karana),
          sunrise: normalizePanchangString(stored.sunrise),
          sunset: normalizePanchangString(stored.sunset),
          rahuKaal: normalizePanchangString(stored.rahuKaal),
          abhijitMuhurat: normalizePanchangString(stored.abhijitMuhurat),
          amritKaal: normalizePanchangString(stored.amritKaal),
          specialEvent: normalizePanchangString(stored.specialEvent),
          festivals: stored.festivals || [],
          choghadiya: stored.choghadiya || {},
        }
      };
    }

    return { success: false, panchang: null };
  } catch (error) {
    console.error('Error getting panchang for homepage:', error);
    return { success: false, error: error.message };
  }
};