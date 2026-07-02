// lib/services/templeService.js
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

const TEMPLES_COLLECTION = 'temples';
const ITEMS_PER_PAGE = 10;
const STORAGE_PATH = 'temples/images';

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

// ==================== CREATE TEMPLE ====================

export const createTemple = async (templeData, imageFiles) => {
  try {
    const slug = templeData.slug || generateSlug(templeData.title);
    const fileName = generateSlug(templeData.title);
    
    // Upload images
    let imageUrls = [];
    if (imageFiles && imageFiles.length > 0) {
      imageUrls = await uploadMultipleImages(imageFiles, fileName);
    }

    const templeRef = await addDoc(collection(db, TEMPLES_COLLECTION), {
      title: templeData.title,
      slug: slug,
      location: templeData.location || '',
      shortDescription: templeData.shortDescription || '',
      fullDescription: templeData.fullDescription || '',
      category: templeData.category || '',
      deity: templeData.deity || '',
      established: templeData.established || '',
      significance: templeData.significance || '',
      festivals: templeData.festivals || [],
      images: imageUrls,
      featuredImage: imageUrls[0] || '',
      status: templeData.status || 'draft',
      featured: templeData.featured || false,
      views: 0,
      likes: 0,
      metatitle: templeData.metatitle || templeData.title,
      metadesc: templeData.metadesc || templeData.shortDescription?.substring(0, 160) || '',
      metakeywords: templeData.metakeywords || '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      publishedAt: templeData.status === 'published' ? serverTimestamp() : null,
    });
    
    return { success: true, id: templeRef.id };
  } catch (error) {
    console.error('Error creating temple:', error);
    return { success: false, error: error.message };
  }
};

// ==================== UPDATE TEMPLE ====================

export const updateTemple = async (templeId, templeData, imageFiles, existingImages) => {
  try {
    const templeRef = doc(db, TEMPLES_COLLECTION, templeId);
    const fileName = generateSlug(templeData.title);
    
    // Handle images
    let imageUrls = existingImages || [];
    if (imageFiles && imageFiles.length > 0) {
      const newImages = await uploadMultipleImages(imageFiles, fileName);
      imageUrls = [...imageUrls, ...newImages];
    }
    
    const updateData = {
      title: templeData.title,
      slug: templeData.slug || generateSlug(templeData.title),
      location: templeData.location || '',
      shortDescription: templeData.shortDescription || '',
      fullDescription: templeData.fullDescription || '',
      category: templeData.category || '',
      deity: templeData.deity || '',
      established: templeData.established || '',
      significance: templeData.significance || '',
      festivals: templeData.festivals || [],
      images: imageUrls,
      featuredImage: imageUrls[0] || '',
      status: templeData.status || 'draft',
      featured: templeData.featured || false,
      metatitle: templeData.metatitle || templeData.title,
      metadesc: templeData.metadesc || templeData.shortDescription?.substring(0, 160) || '',
      metakeywords: templeData.metakeywords || '',
      updatedAt: serverTimestamp(),
    };
    
    if (templeData.status === 'published' && templeData.oldStatus !== 'published') {
      updateData.publishedAt = serverTimestamp();
    }
    
    await updateDoc(templeRef, updateData);
    
    return { success: true };
  } catch (error) {
    console.error('Error updating temple:', error);
    return { success: false, error: error.message };
  }
};

// ==================== GET TEMPLES ====================

export const getTemples = async (page = 1, searchTerm = '', statusFilter = 'all', categoryFilter = 'all', featuredFilter = 'all') => {
  try {
    const templesRef = collection(db, TEMPLES_COLLECTION);
    let constraints = [orderBy('createdAt', 'desc'), limit(100)];
    
    if (statusFilter !== 'all') {
      constraints.unshift(where('status', '==', statusFilter));
    }
    if (categoryFilter !== 'all') {
      constraints.unshift(where('category', '==', categoryFilter));
    }
    
    const q = query(templesRef, ...constraints);
    const snapshot = await getDocs(q);
    
    let temples = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      temples.push({
        id: doc.id,
        title: data.title || '',
        slug: data.slug || '',
        location: data.location || '',
        shortDescription: data.shortDescription || '',
        category: data.category || '',
        deity: data.deity || '',
        established: data.established || '',
        featuredImage: data.featuredImage || '',
        images: data.images || [],
        status: data.status || 'draft',
        featured: data.featured || false,
        views: data.views || 0,
        likes: data.likes || 0,
        createdAt: data.createdAt?.toDate?.() || null,
        publishedAt: data.publishedAt?.toDate?.() || null,
      });
    });
    
    // Apply featured filter
    if (featuredFilter !== 'all') {
      if (featuredFilter === 'featured') {
        temples = temples.filter(item => item.featured === true);
      } else if (featuredFilter === 'normal') {
        temples = temples.filter(item => item.featured === false);
      }
    }
    
    if (searchTerm) {
      temples = temples.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.deity.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    const totalItems = temples.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const paginatedTemples = temples.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    
    return {
      success: true,
      temples: paginatedTemples,
      totalPages,
      totalItems,
    };
  } catch (error) {
    console.error('Error getting temples:', error);
    return { success: false, error: error.message, temples: [], totalPages: 1, totalItems: 0 };
  }
};

// ==================== GET TEMPLE BY ID ====================

export const getTempleById = async (templeId) => {
  try {
    const templeRef = doc(db, TEMPLES_COLLECTION, templeId);
    const templeSnap = await getDoc(templeRef);
    
    if (!templeSnap.exists()) {
      return { success: false, error: 'Temple not found' };
    }
    
    const data = templeSnap.data();
    return {
      success: true,
      temple: {
        id: templeSnap.id,
        title: data.title || '',
        slug: data.slug || '',
        location: data.location || '',
        shortDescription: data.shortDescription || '',
        fullDescription: data.fullDescription || '',
        category: data.category || '',
        deity: data.deity || '',
        established: data.established || '',
        significance: data.significance || '',
        festivals: data.festivals || [],
        images: data.images || [],
        featuredImage: data.featuredImage || '',
        status: data.status || 'draft',
        featured: data.featured || false,
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
    console.error('Error getting temple:', error);
    return { success: false, error: error.message };
  }
};

// ==================== GET TEMPLE BY SLUG ====================

export const getTempleBySlug = async (slug) => {
  try {
    const templesRef = collection(db, TEMPLES_COLLECTION);
    const q = query(templesRef, where('slug', '==', slug), where('status', '==', 'published'));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return { success: false, error: 'Temple not found' };
    }
    
    const doc = snapshot.docs[0];
    const data = doc.data();
    return {
      success: true,
      temple: {
        id: doc.id,
        title: data.title || '',
        slug: data.slug || '',
        location: data.location || '',
        shortDescription: data.shortDescription || '',
        fullDescription: data.fullDescription || '',
        category: data.category || '',
        deity: data.deity || '',
        established: data.established || '',
        significance: data.significance || '',
        festivals: data.festivals || [],
        images: data.images || [],
        featuredImage: data.featuredImage || '',
        featured: data.featured || false,
        views: data.views || 0,
        likes: data.likes || 0,
        publishedAt: data.publishedAt?.toDate?.() || null,
      }
    };
  } catch (error) {
    console.error('Error getting temple by slug:', error);
    return { success: false, error: error.message };
  }
};

// ==================== DELETE TEMPLE ====================

export const deleteTemple = async (templeId, imageUrls) => {
  try {
    // Delete images from storage
    if (imageUrls && imageUrls.length > 0) {
      await deleteMultipleImages(imageUrls);
    }
    
    await deleteDoc(doc(db, TEMPLES_COLLECTION, templeId));
    return { success: true };
  } catch (error) {
    console.error('Error deleting temple:', error);
    return { success: false, error: error.message };
  }
};

// ==================== INCREMENT VIEWS ====================

export const incrementTempleView = async (templeId) => {
  try {
    const templeRef = doc(db, TEMPLES_COLLECTION, templeId);
    await updateDoc(templeRef, {
      views: increment(1)
    });
    return { success: true };
  } catch (error) {
    console.error('Error incrementing view:', error);
    return { success: false, error: error.message };
  }
};

// ==================== TOGGLE LIKE ====================

export const toggleTempleLike = async (templeId) => {
  try {
    const templeRef = doc(db, TEMPLES_COLLECTION, templeId);
    const templeSnap = await getDoc(templeRef);
    
    if (!templeSnap.exists()) {
      return { success: false, error: 'Temple not found' };
    }
    
    const data = templeSnap.data();
    const currentLikes = data.likes || 0;
    
    await updateDoc(templeRef, {
      likes: currentLikes + 1
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error toggling like:', error);
    return { success: false, error: error.message };
  }
};

// ==================== FRONTEND FUNCTIONS ====================

// Get featured temples for homepage
export const getFeaturedTemples = async (limitCount = 6) => {
  try {
    const templesRef = collection(db, TEMPLES_COLLECTION);
    const q = query(
      templesRef,
      where('status', '==', 'published'),
      where('featured', '==', true),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    
    const temples = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      temples.push({
        id: doc.id,
        title: data.title || '',
        slug: data.slug || '',
        location: data.location || '',
        shortDescription: data.shortDescription || '',
        category: data.category || '',
        deity: data.deity || '',
        established: data.established || '',
        featuredImage: data.featuredImage || '',
        images: data.images || [],
        featured: data.featured || false,
        views: data.views || 0,
        likes: data.likes || 0,
      });
    });
    
    return { success: true, temples };
  } catch (error) {
    console.error('Error getting featured temples:', error);
    return { success: false, temples: [] };
  }
};

// Get all published temples for homepage
export const getPublishedTemples = async (limitCount = 30) => {
  try {
    const templesRef = collection(db, TEMPLES_COLLECTION);
    const q = query(
      templesRef,
      where('status', '==', 'published'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    
    const temples = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      temples.push({
        id: doc.id,
        title: data.title || '',
        slug: data.slug || '',
        location: data.location || '',
        shortDescription: data.shortDescription || '',
        category: data.category || '',
        deity: data.deity || '',
        established: data.established || '',
        featuredImage: data.featuredImage || '',
        images: data.images || [],
        featured: data.featured || false,
        views: data.views || 0,
        likes: data.likes || 0,
      });
    });
    
    return { success: true, temples };
  } catch (error) {
    console.error('Error getting published temples:', error);
    return { success: false, temples: [] };
  }
};

// Get temples by category
export const getTemplesByCategory = async (category, limitCount = 20) => {
  try {
    const templesRef = collection(db, TEMPLES_COLLECTION);
    const q = query(
      templesRef,
      where('status', '==', 'published'),
      where('category', '==', category),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    
    const temples = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      temples.push({
        id: doc.id,
        title: data.title || '',
        slug: data.slug || '',
        location: data.location || '',
        shortDescription: data.shortDescription || '',
        category: data.category || '',
        deity: data.deity || '',
        featuredImage: data.featuredImage || '',
        images: data.images || [],
        views: data.views || 0,
        likes: data.likes || 0,
      });
    });
    
    return { success: true, temples };
  } catch (error) {
    console.error('Error getting temples by category:', error);
    return { success: false, temples: [] };
  }
};