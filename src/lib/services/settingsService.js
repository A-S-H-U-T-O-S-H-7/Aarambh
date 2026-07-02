// lib/services/settingsService.js
import { db } from '@/lib/firebase/client';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { logActivity, ActivityActions, ActivityEntityTypes } from './activityLogService';

const SETTINGS_COLLECTION = 'settings';
const SETTINGS_DOC_ID = 'site_settings';

// Default settings structure for Aarambh TV
const DEFAULT_SETTINGS = {
  seo: {
    metaTitle: 'Aarambh TV - Your Daily Spiritual Destination',
    metaDescription: 'Experience devotion, spiritual education, horoscope services, live darshan, temples, festivals, bhajans, and video-first experiences.',
    metaKeywords: 'spiritual, devotion, horoscope, temples, bhajans, live darshan, aarambh tv',
    googleAnalyticsId: '',
    googleSiteVerification: '',
  },
  social: {
    facebook: '',
    twitter: '',
    instagram: '',
    youtube: '',
    whatsapp: '',
    telegram: '',
  },
  contact: {
    phone1: '+91 99999 99999',
    phone2: '',
    contactEmail: 'info@aarambhtv.com',
    address: 'Mumbai, India',
  },
};

// Get all settings
export const getSettings = async () => {
  try {
    const settingsRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
    const settingsSnap = await getDoc(settingsRef);
    
    if (settingsSnap.exists()) {
      return { success: true, settings: settingsSnap.data() };
    } else {
      // Create default settings if not exists
      await setDoc(settingsRef, DEFAULT_SETTINGS);
      return { success: true, settings: DEFAULT_SETTINGS };
    }
  } catch (error) {
    console.error('Error getting settings:', error);
    return { success: false, error: error.message, settings: DEFAULT_SETTINGS };
  }
};

// Update SEO settings
export const updateSeoSettings = async (seoData, adminData) => {
  try {
    const settingsRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
    await updateDoc(settingsRef, {
      seo: seoData,
      updatedAt: serverTimestamp(),
      updatedBy: adminData?.id,
    });
    
    await logActivity({
      action: ActivityActions.UPDATE,
      entityType: ActivityEntityTypes.SETTINGS,
      entityId: SETTINGS_DOC_ID,
      entityTitle: 'SEO Settings',
      details: 'Updated SEO settings',
      adminId: adminData.id,
      adminName: adminData.name,
      adminRole: adminData.role,
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating SEO settings:', error);
    return { success: false, error: error.message };
  }
};

// Update social links
export const updateSocialLinks = async (socialData, adminData) => {
  try {
    const settingsRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
    await updateDoc(settingsRef, {
      social: socialData,
      updatedAt: serverTimestamp(),
      updatedBy: adminData?.id,
    });
    
    await logActivity({
      action: ActivityActions.UPDATE,
      entityType: ActivityEntityTypes.SETTINGS,
      entityId: SETTINGS_DOC_ID,
      entityTitle: 'Social Links',
      details: 'Updated social media links',
      adminId: adminData.id,
      adminName: adminData.name,
      adminRole: adminData.role,
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating social links:', error);
    return { success: false, error: error.message };
  }
};

// Update contact settings
export const updateContactSettings = async (contactData, adminData) => {
  try {
    const settingsRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
    await updateDoc(settingsRef, {
      contact: contactData,
      updatedAt: serverTimestamp(),
      updatedBy: adminData?.id,
    });
    
    await logActivity({
      action: ActivityActions.UPDATE,
      entityType: ActivityEntityTypes.SETTINGS,
      entityId: SETTINGS_DOC_ID,
      entityTitle: 'Contact Settings',
      details: 'Updated contact information',
      adminId: adminData.id,
      adminName: adminData.name,
      adminRole: adminData.role,
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating contact settings:', error);
    return { success: false, error: error.message };
  }
};

// Get public settings for frontend
export const getPublicSettings = async () => {
  try {
    const settingsRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
    const settingsSnap = await getDoc(settingsRef);
    
    if (settingsSnap.exists()) {
      const data = settingsSnap.data();
      return {
        success: true,
        data: {
          seo: data.seo,
          social: data.social,
          contact: data.contact,
        }
      };
    }
    return { success: true, data: DEFAULT_SETTINGS };
  } catch (error) {
    console.error('Error getting public settings:', error);
    return { success: false, error: error.message };
  }
};


// Get contact info for Contact page
export const getContactInfo = async () => {
  try {
    const settingsRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
    const settingsSnap = await getDoc(settingsRef);
    
    if (settingsSnap.exists()) {
      const data = settingsSnap.data();
      return {
        success: true,
        contact: data.contact || {
          phone1: '+91 99999 99999',
          phone2: '',
          contactEmail: 'info@aarambhtv.com',
          address: 'Mumbai, India',
        },
        social: data.social || {},
      };
    }
    return {
      success: true,
      contact: {
        phone1: '+91 99999 99999',
        phone2: '',
        contactEmail: 'info@aarambhtv.com',
        address: 'Mumbai, India',
      },
      social: {},
    };
  } catch (error) {
    console.error('Error getting contact info:', error);
    return { success: false, contact: null, social: null };
  }
};