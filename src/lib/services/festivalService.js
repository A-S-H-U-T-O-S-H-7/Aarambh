// lib/services/festivalService.js
import { db, storage } from '@/lib/firebase/client';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  increment,
  writeBatch
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

const FESTIVALS_COLLECTION = 'festivals';
const ITEMS_PER_PAGE = 10;
const STORAGE_PATH = 'festivals/images';
const DEFAULT_FESTIVAL_IMAGE = 'https://images.unsplash.com/photo-1545243424-0ce743321e11?w=800&h=600&fit=crop';

// ==================== HELPER FUNCTIONS ====================

export const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Upload multiple images
const uploadMultipleImages = async (files, fileName) => {
  if (!files || files.length === 0) return [];
  
  const uploadPromises = files.map((file, index) => {
    const timestamp = Date.now();
    const extension = (file.name || 'jpg').split('.').pop().toLowerCase();
    const safeFileName = `${fileName}_${timestamp}_${index}.${extension}`;
    const storageRef = ref(storage, `${STORAGE_PATH}/${safeFileName}`);
    return uploadBytes(storageRef, file).then(result => getDownloadURL(result.ref));
  });
  
  try {
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading images:', error);
    return [];
  }
};

// Delete image
const deleteImage = async (imageUrl) => {
  if (!imageUrl) return;
  try {
    const storageRef = ref(storage, imageUrl);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
  }
};

// Delete multiple images
const deleteMultipleImages = async (imageUrls) => {
  if (!imageUrls || imageUrls.length === 0) return;
  for (const url of imageUrls) {
    await deleteImage(url);
  }
};

const getFestivalImage = (data) => {
  const imageCandidates = [data.featuredImage, ...(Array.isArray(data.images) ? data.images : [])];
  const validImage = imageCandidates.find(image => typeof image === 'string' && image.trim());

  return validImage || DEFAULT_FESTIVAL_IMAGE;
};

// ==================== DATE HELPERS ====================

// Get next occurrence of a date (handles passed dates)
export const getNextOccurrence = (dateStr) => {
  if (!dateStr) return null;
  
  const parts = dateStr.split('-');
  const month = parseInt(parts[1]) - 1;
  const day = parseInt(parts[2]);
  const year = parseInt(parts[0]);
  
  const today = new Date();
  let targetDate = new Date(year, month, day);
  
  // If date has passed this year, move to next year
  if (targetDate < today) {
    targetDate = new Date(year + 1, month, day);
  }
  
  return targetDate;
};

// Format date for display
export const formatFestivalDate = (dateStr) => {
  if (!dateStr) return 'TBD';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
};

// Get days until festival
export const getDaysUntil = (dateStr) => {
  if (!dateStr) return null;
  const target = getNextOccurrence(dateStr);
  if (!target) return null;
  const diff = target - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

// ==================== CREATE FESTIVAL ====================

export const createFestival = async (festivalData, imageFiles) => {
  try {
    const slug = festivalData.slug || generateSlug(festivalData.title);
    const fileName = generateSlug(festivalData.title);
    
    // Upload images
    let imageUrls = [];
    if (imageFiles && imageFiles.length > 0) {
      imageUrls = await uploadMultipleImages(imageFiles, fileName);
    }

    // Get next occurrence date
    const nextDate = getNextOccurrence(festivalData.date);
    
    const festivalRef = await addDoc(collection(db, FESTIVALS_COLLECTION), {
      title: festivalData.title,
      slug: slug,
      nameHindi: festivalData.nameHindi || '',
      description: festivalData.description || '',
      fullDescription: festivalData.fullDescription || '',
      date: festivalData.date, // Store original date (YYYY-MM-DD)
      nextDate: nextDate, // Store calculated next occurrence
      category: festivalData.category || '',
      significance: festivalData.significance || '',
      traditions: festivalData.traditions || [],
      colors: festivalData.colors || [],
      emoji: festivalData.emoji || '🎊',
      deity: festivalData.deity || '',
      region: festivalData.region || '',
      images: imageUrls,
      featuredImage: imageUrls[0] || '',
      featured: festivalData.featured || false,
      views: 0,
      likes: 0,
      status: festivalData.status || 'draft',
      metatitle: festivalData.metatitle || festivalData.title,
      metadesc: festivalData.metadesc || festivalData.description?.substring(0, 160) || '',
      metakeywords: festivalData.metakeywords || '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      publishedAt: festivalData.status === 'published' ? serverTimestamp() : null,
    });
    
    return { success: true, id: festivalRef.id };
  } catch (error) {
    console.error('Error creating festival:', error);
    return { success: false, error: error.message };
  }
};

// ==================== UPDATE FESTIVAL ====================

export const updateFestival = async (festivalId, festivalData, imageFiles, existingImages) => {
  try {
    const festivalRef = doc(db, FESTIVALS_COLLECTION, festivalId);
    const fileName = generateSlug(festivalData.title);
    
    // Handle images
    let imageUrls = existingImages || [];
    if (imageFiles && imageFiles.length > 0) {
      const newImages = await uploadMultipleImages(imageFiles, fileName);
      imageUrls = [...imageUrls, ...newImages];
    }
    
    // Get next occurrence date
    const nextDate = getNextOccurrence(festivalData.date);
    
    const updateData = {
      title: festivalData.title,
      slug: festivalData.slug || generateSlug(festivalData.title),
      nameHindi: festivalData.nameHindi || '',
      description: festivalData.description || '',
      fullDescription: festivalData.fullDescription || '',
      date: festivalData.date,
      nextDate: nextDate,
      category: festivalData.category || '',
      significance: festivalData.significance || '',
      traditions: festivalData.traditions || [],
      colors: festivalData.colors || [],
      emoji: festivalData.emoji || '🎊',
      deity: festivalData.deity || '',
      region: festivalData.region || '',
      images: imageUrls,
      featuredImage: imageUrls[0] || '',
      featured: festivalData.featured || false,
      status: festivalData.status || 'draft',
      metatitle: festivalData.metatitle || festivalData.title,
      metadesc: festivalData.metadesc || festivalData.description?.substring(0, 160) || '',
      metakeywords: festivalData.metakeywords || '',
      updatedAt: serverTimestamp(),
    };
    
    if (festivalData.status === 'published' && festivalData.oldStatus !== 'published') {
      updateData.publishedAt = serverTimestamp();
    }
    
    await updateDoc(festivalRef, updateData);
    
    return { success: true };
  } catch (error) {
    console.error('Error updating festival:', error);
    return { success: false, error: error.message };
  }
};

// ==================== GET FESTIVALS ====================

export const getFestivals = async (page = 1, searchTerm = '', statusFilter = 'all', featuredFilter = 'all') => {
  try {
    const festivalsRef = collection(db, FESTIVALS_COLLECTION);
    let constraints = [orderBy('createdAt', 'desc'), limit(100)];
    
    if (statusFilter !== 'all') {
      constraints.unshift(where('status', '==', statusFilter));
    }
    
    const q = query(festivalsRef, ...constraints);
    const snapshot = await getDocs(q);
    
    let festivals = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      festivals.push({
        id: doc.id,
        title: data.title || '',
        slug: data.slug || '',
        nameHindi: data.nameHindi || '',
        description: data.description || '',
        date: data.date || '',
        nextDate: data.nextDate?.toDate?.() || null,
        category: data.category || '',
        emoji: data.emoji || '🎊',
        deity: data.deity || '',
        region: data.region || '',
        featuredImage: data.featuredImage || '',
        images: data.images || [],
        featured: data.featured || false,
        status: data.status || 'draft',
        views: data.views || 0,
        likes: data.likes || 0,
        createdAt: data.createdAt?.toDate?.() || null,
        publishedAt: data.publishedAt?.toDate?.() || null,
      });
    });
    
    // Apply featured filter
    if (featuredFilter !== 'all') {
      if (featuredFilter === 'featured') {
        festivals = festivals.filter(item => item.featured === true);
      } else if (featuredFilter === 'normal') {
        festivals = festivals.filter(item => item.featured === false);
      }
    }
    
    if (searchTerm) {
      festivals = festivals.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    const totalItems = festivals.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const paginatedFestivals = festivals.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    
    return {
      success: true,
      festivals: paginatedFestivals,
      totalPages,
      totalItems,
    };
  } catch (error) {
    console.error('Error getting festivals:', error);
    return { success: false, error: error.message, festivals: [], totalPages: 1, totalItems: 0 };
  }
};

// ==================== GET FESTIVAL BY ID ====================

export const getFestivalById = async (festivalId) => {
  try {
    const festivalRef = doc(db, FESTIVALS_COLLECTION, festivalId);
    const festivalSnap = await getDoc(festivalRef);
    
    if (!festivalSnap.exists()) {
      return { success: false, error: 'Festival not found' };
    }
    
    const data = festivalSnap.data();
    return {
      success: true,
      festival: {
        id: festivalSnap.id,
        title: data.title || '',
        slug: data.slug || '',
        nameHindi: data.nameHindi || '',
        description: data.description || '',
        fullDescription: data.fullDescription || '',
        date: data.date || '',
        nextDate: data.nextDate?.toDate?.() || null,
        category: data.category || '',
        significance: data.significance || '',
        traditions: data.traditions || [],
        colors: data.colors || [],
        emoji: data.emoji || '🎊',
        deity: data.deity || '',
        region: data.region || '',
        images: data.images || [],
        featuredImage: data.featuredImage || '',
        featured: data.featured || false,
        status: data.status || 'draft',
        views: data.views || 0,
        likes: data.likes || 0,
        metatitle: data.metatitle || '',
        metadesc: data.metadesc || '',
        metakeywords: data.metakeywords || '',
        createdAt: data.createdAt?.toDate?.() || null,
        updatedAt: data.updatedAt?.toDate?.() || null,
        publishedAt: data.publishedAt?.toDate?.() || null,
      }
    };
  } catch (error) {
    console.error('Error getting festival:', error);
    return { success: false, error: error.message };
  }
};

// ==================== GET FESTIVAL BY SLUG ====================

export const getFestivalBySlug = async (slug) => {
  try {
    const festivalsRef = collection(db, FESTIVALS_COLLECTION);
    const q = query(festivalsRef, where('slug', '==', slug), where('status', '==', 'published'));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return { success: false, error: 'Festival not found' };
    }
    
    const doc = snapshot.docs[0];
    const data = doc.data();
    return {
      success: true,
      festival: {
        id: doc.id,
        title: data.title || '',
        slug: data.slug || '',
        nameHindi: data.nameHindi || '',
        description: data.description || '',
        fullDescription: data.fullDescription || '',
        date: data.date || '',
        nextDate: data.nextDate?.toDate?.() || null,
        category: data.category || '',
        significance: data.significance || '',
        traditions: data.traditions || [],
        colors: data.colors || [],
        emoji: data.emoji || '🎊',
        deity: data.deity || '',
        region: data.region || '',
        images: data.images || [],
        featuredImage: data.featuredImage || '',
        featured: data.featured || false,
        views: data.views || 0,
        likes: data.likes || 0,
        metatitle: data.metatitle || '',
        metadesc: data.metadesc || '',
        metakeywords: data.metakeywords || '',
        publishedAt: data.publishedAt?.toDate?.() || null,
      }
    };
  } catch (error) {
    console.error('Error getting festival by slug:', error);
    return { success: false, error: error.message };
  }
};

// ==================== DELETE FESTIVAL ====================

export const deleteFestival = async (festivalId, imageUrls) => {
  try {
    // Delete images from storage
    if (imageUrls && imageUrls.length > 0) {
      await deleteMultipleImages(imageUrls);
    }
    
    await deleteDoc(doc(db, FESTIVALS_COLLECTION, festivalId));
    return { success: true };
  } catch (error) {
    console.error('Error deleting festival:', error);
    return { success: false, error: error.message };
  }
};

// ==================== FRONTEND FUNCTIONS ====================

// Get featured festivals for homepage
export const getFeaturedFestivals = async (limitCount = 6) => {
  try {
    const festivalsRef = collection(db, FESTIVALS_COLLECTION);
    const q = query(
      festivalsRef,
      where('status', '==', 'published'),
      where('featured', '==', true),
      orderBy('nextDate', 'asc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    
    const festivals = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      festivals.push({
        id: doc.id,
        name: data.title || '',
        title: data.title || '',
        slug: data.slug || '',
        nameHindi: data.nameHindi || '',
        description: data.description || '',
        date: data.date || '',
        nextDate: data.nextDate?.toDate?.() || null,
        category: data.category || '',
        emoji: data.emoji || '🎊',
        deity: data.deity || '',
        region: data.region || '',
        image: getFestivalImage(data),
        imageAlt: data.imageAlt || data.title || 'Festival image',
        featuredImage: data.featuredImage || '',
        images: data.images || [],
        featured: data.featured || false,
        traditions: data.traditions || [],
        colors: data.colors || [],
        views: data.views || 0,
        likes: data.likes || 0,
      });
    });
    
    return { success: true, festivals };
  } catch (error) {
    console.error('Error getting featured festivals:', error);
    return { success: false, festivals: [] };
  }
};

// Get upcoming festivals for homepage
export const getUpcomingFestivals = async (limitCount = 10) => {
  try {
    const festivalsRef = collection(db, FESTIVALS_COLLECTION);
    const q = query(
      festivalsRef,
      where('status', '==', 'published'),
      orderBy('nextDate', 'asc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    
    const festivals = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      festivals.push({
        id: doc.id,
        name: data.title || '',
        title: data.title || '',
        slug: data.slug || '',
        nameHindi: data.nameHindi || '',
        description: data.description || '',
        date: data.date || '',
        nextDate: data.nextDate?.toDate?.() || null,
        category: data.category || '',
        emoji: data.emoji || '🎊',
        deity: data.deity || '',
        region: data.region || '',
        image: getFestivalImage(data),
        imageAlt: data.imageAlt || data.title || 'Festival image',
        featuredImage: data.featuredImage || '',
        featured: data.featured || false,
        traditions: data.traditions || [],
        colors: data.colors || [],
        views: data.views || 0,
        likes: data.likes || 0,
      });
    });
    
    return { success: true, festivals };
  } catch (error) {
    console.error('Error getting upcoming festivals:', error);
    return { success: false, festivals: [] };
  }
};

// Increment festival view
export const incrementFestivalView = async (festivalId) => {
  try {
    const festivalRef = doc(db, FESTIVALS_COLLECTION, festivalId);
    await updateDoc(festivalRef, {
      views: increment(1)
    });
    return { success: true };
  } catch (error) {
    console.error('Error incrementing view:', error);
    return { success: false, error: error.message };
  }
};
