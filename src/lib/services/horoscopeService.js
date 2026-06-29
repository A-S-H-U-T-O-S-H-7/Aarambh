// lib/services/horoscopeService.js
import { db } from '@/lib/firebase/client';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  query,
  where,
  serverTimestamp
} from 'firebase/firestore';
import { fetchAllHoroscopes, fetchDailyHoroscope, zodiacNumbers } from '@/lib/astro/vedicApi';

const HOROSCOPE_COLLECTION = 'horoscopes';

// Zodiac signs data (keeping from original)
export const zodiacSigns = [
  { id: 'aries', name: 'Aries', symbol: '♈', date: 'Mar 21 - Apr 19', element: 'Fire' },
  { id: 'taurus', name: 'Taurus', symbol: '♉', date: 'Apr 20 - May 20', element: 'Earth' },
  { id: 'gemini', name: 'Gemini', symbol: '♊', date: 'May 21 - Jun 20', element: 'Air' },
  { id: 'cancer', name: 'Cancer', symbol: '♋', date: 'Jun 21 - Jul 22', element: 'Water' },
  { id: 'leo', name: 'Leo', symbol: '♌', date: 'Jul 23 - Aug 22', element: 'Fire' },
  { id: 'virgo', name: 'Virgo', symbol: '♍', date: 'Aug 23 - Sep 22', element: 'Earth' },
  { id: 'libra', name: 'Libra', symbol: '♎', date: 'Sep 23 - Oct 22', element: 'Air' },
  { id: 'scorpio', name: 'Scorpio', symbol: '♏', date: 'Oct 23 - Nov 21', element: 'Water' },
  { id: 'sagittarius', name: 'Sagittarius', symbol: '♐', date: 'Nov 22 - Dec 21', element: 'Fire' },
  { id: 'capricorn', name: 'Capricorn', symbol: '♑', date: 'Dec 22 - Jan 19', element: 'Earth' },
  { id: 'aquarius', name: 'Aquarius', symbol: '♒', date: 'Jan 20 - Feb 18', element: 'Air' },
  { id: 'pisces', name: 'Pisces', symbol: '♓', date: 'Feb 19 - Mar 20', element: 'Water' },
];

// Save horoscope for a sign
export const saveHoroscope = async (sign, horoscopeData, adminData, date = null) => {
  try {
    const horoscopeDate = date || new Date().toISOString().split('T')[0];
    const docId = `${sign}_${horoscopeDate}`;
    const docRef = doc(db, HOROSCOPE_COLLECTION, docId);

    await setDoc(docRef, {
      sign,
      date: horoscopeDate,
      ...horoscopeData,
      isManualOverride: horoscopeData.isManualOverride || false,
      updatedAt: serverTimestamp(),
      updatedBy: adminData?.id || null,
    }, { merge: true });

    return { success: true };
  } catch (error) {
    console.error('Error saving horoscope:', error);
    return { success: false, error: error.message };
  }
};

// Get horoscope for a sign
export const getHoroscope = async (sign, date = null) => {
  try {
    const horoscopeDate = date || new Date().toISOString().split('T')[0];
    const docRef = doc(db, HOROSCOPE_COLLECTION, `${sign}_${horoscopeDate}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { success: true, horoscope: docSnap.data() };
    }
    return { success: false, horoscope: null };
  } catch (error) {
    console.error('Error getting horoscope:', error);
    return { success: false, horoscope: null };
  }
};

// Get all horoscopes for a date
export const getAllHoroscopes = async (date = null) => {
  try {
    const horoscopeDate = date || new Date().toISOString().split('T')[0];
    const q = query(collection(db, HOROSCOPE_COLLECTION), where('date', '==', horoscopeDate));
    const snapshot = await getDocs(q);
    const horoscopes = {};

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      horoscopes[data.sign] = data;
    });

    return { success: true, horoscopes };
  } catch (error) {
    console.error('Error getting all horoscopes:', error);
    return { success: false, horoscopes: {} };
  }
};

// Update all horoscopes from API
export const updateAllHoroscopesFromAPI = async (adminData, lang = 'en', date = null, type = 'moon') => {
  try {
    const horoscopeDate = date || new Date().toISOString().split('T')[0];
    const apiResults = await fetchAllHoroscopes(lang, horoscopeDate, type);

    let successCount = 0;
    let failCount = 0;

    for (const sign of zodiacSigns) {
      const apiData = apiResults[sign.id];
      if (apiData && apiData.prediction) {
        await saveHoroscope(sign.id, {
          prediction: apiData.prediction,
          luckyColor: apiData.luckyColor,
          luckyNumber: apiData.luckyNumber,
          luckyTime: apiData.luckyTime || '',
          mood: apiData.mood || '',
          compatibility: apiData.compatibility || '',
          source: 'vedicastro',
          isManualOverride: false,
        }, adminData, horoscopeDate);
        successCount++;
      } else {
        failCount++;
        console.warn(`No data for ${sign.id}`);
      }
    }

    return { success: true, successCount, failCount };
  } catch (error) {
    console.error('Error updating all horoscopes:', error);
    return { success: false, error: error.message };
  }
};

// Update horoscope manually
export const updateHoroscopeManually = async (sign, horoscopeData, adminData, date = null) => {
  try {
    const horoscopeDate = date || new Date().toISOString().split('T')[0];
    
    await saveHoroscope(sign, {
      ...horoscopeData,
      isManualOverride: true,
      source: 'manual',
    }, adminData, horoscopeDate);

    return { success: true };
  } catch (error) {
    console.error('Error updating horoscope manually:', error);
    return { success: false, error: error.message };
  }
};

// Get horoscope for homepage
export const getHoroscopeForHomepage = async (sign, date = null) => {
  try {
    const horoscopeDate = date || new Date().toISOString().split('T')[0];
    const result = await getHoroscope(sign, horoscopeDate);

    if (result.success && result.horoscope) {
      return { success: true, horoscope: result.horoscope };
    }

    // Try fetching from API
    try {
      const apiData = await fetchDailyHoroscope(sign, 'en', horoscopeDate);
      if (apiData && apiData.prediction) {
        await saveHoroscope(sign, { ...apiData, source: 'vedicastro' }, null, horoscopeDate);
        return { success: true, horoscope: apiData };
      }
    } catch (apiError) {
      console.warn(`API fetch failed for ${sign}`);
    }

    return { success: false, horoscope: null };
  } catch (error) {
    console.error('Error getting horoscope for homepage:', error);
    return { success: false, horoscope: null };
  }
};