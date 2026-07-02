// lib/services/storyService.js
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

const STORIES_COLLECTION = 'stories';
const ITEMS_PER_PAGE = 10;

// ==================== HELPER FUNCTIONS ====================

export const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Upload single image
const uploadImage = async (file, fileName) => {
  if (!file) return null;
  
  try {
    const timestamp = Date.now();
    const extension = (file.name || 'jpg').split('.').pop().toLowerCase();
    const safeFileName = `${fileName}_${timestamp}.${extension}`;
    const storageRef = ref(storage, `stories/images/${safeFileName}`);

    const uploadResult = await uploadBytes(storageRef, file);
    const imageUrl = await getDownloadURL(uploadResult.ref);
    return imageUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Upload multiple images
const uploadMultipleImages = async (files, fileName) => {
  if (!files || files.length === 0) return [];
  
  const uploadPromises = files.map((file, index) => {
    const timestamp = Date.now();
    const extension = (file.name || 'jpg').split('.').pop().toLowerCase();
    const safeFileName = `${fileName}_${timestamp}_${index}.${extension}`;
    const storageRef = ref(storage, `stories/images/${safeFileName}`);
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
  
  const deletePromises = imageUrls.map(url => deleteImage(url));
  await Promise.all(deletePromises);
};

// ==================== CREATE ====================

export const createStory = async (storyData, imageFiles) => {
  try {
    let imageUrls = [];
    const fileName = generateSlug(storyData.title);
    
    // Upload multiple images
    if (imageFiles && imageFiles.length > 0) {
      imageUrls = await uploadMultipleImages(imageFiles, fileName);
    }
    
    const storyRef = await addDoc(collection(db, STORIES_COLLECTION), {
      title: storyData.title,
      slug: storyData.slug || generateSlug(storyData.title),
      content: storyData.content,
      excerpt: storyData.excerpt || storyData.description || storyData.content?.substring(0, 150).replace(/<[^>]*>/g, '') || '',
      description: storyData.description || storyData.excerpt || storyData.content?.substring(0, 160).replace(/<[^>]*>/g, '') || '',
      author: storyData.author || '',
      source: storyData.source || '',
      moral: storyData.moral || '',
      category: storyData.category || '',
      tags: storyData.tags || [],
      images: imageUrls,
      featuredImage: imageUrls[0] || null,
      metatitle: storyData.metatitle || storyData.title,
      metadesc: storyData.metadesc || storyData.content?.substring(0, 160).replace(/<[^>]*>/g, '') || '',
      metakeywords: storyData.metakeywords || '',
      status: storyData.status || 'draft',
      isFeatured: storyData.isFeatured || false,
      publishDate: storyData.publishDate || new Date().toISOString().split('T')[0],
      views: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      publishedAt: storyData.status === 'published' ? serverTimestamp() : null,
    });
    
    // If featured, remove featured from others
    if (storyData.isFeatured && storyRef.id) {
      await setStoryAsFeatured(storyRef.id);
    }
    
    return { success: true, id: storyRef.id };
  } catch (error) {
    console.error('Error creating story:', error);
    return { success: false, error: error.message };
  }
};

// ==================== SET STORY AS FEATURED ====================

const setStoryAsFeatured = async (storyId) => {
  try {
    const batch = writeBatch(db);
    
    const storiesQuery = query(collection(db, STORIES_COLLECTION), where('isFeatured', '==', true));
    const storiesSnapshot = await getDocs(storiesQuery);
    storiesSnapshot.forEach(doc => {
      if (doc.id !== storyId) {
        batch.update(doc.ref, { isFeatured: false });
      }
    });
    
    const storyRef = doc(db, STORIES_COLLECTION, storyId);
    batch.update(storyRef, { isFeatured: true });
    await batch.commit();
    
    return { success: true };
  } catch (error) {
    console.error('Error setting story as featured:', error);
    return { success: false, error: error.message };
  }
};

// ==================== UPDATE ====================

export const updateStory = async (storyId, storyData, imageFiles, existingImages) => {
  try {
    let imageUrls = existingImages || [];
    const fileName = generateSlug(storyData.title);
    
    // Upload new images
    if (imageFiles && imageFiles.length > 0) {
      const newImageUrls = await uploadMultipleImages(imageFiles, fileName);
      imageUrls = [...imageUrls, ...newImageUrls];
    }
    
    const storyRef = doc(db, STORIES_COLLECTION, storyId);
    const updateData = {
      title: storyData.title,
      slug: storyData.slug || generateSlug(storyData.title),
      content: storyData.content,
      excerpt: storyData.excerpt || storyData.description || storyData.content?.substring(0, 150).replace(/<[^>]*>/g, '') || '',
      description: storyData.description || storyData.excerpt || storyData.content?.substring(0, 160).replace(/<[^>]*>/g, '') || '',
      author: storyData.author || '',
      source: storyData.source || '',
      moral: storyData.moral || '',
      category: storyData.category || '',
      tags: storyData.tags || [],
      images: imageUrls,
      featuredImage: imageUrls[0] || null,
      metatitle: storyData.metatitle || storyData.title,
      metadesc: storyData.metadesc || storyData.content?.substring(0, 160).replace(/<[^>]*>/g, '') || '',
      metakeywords: storyData.metakeywords || '',
      status: storyData.status,
      isFeatured: storyData.isFeatured || false,
      publishDate: storyData.publishDate || null,
      updatedAt: serverTimestamp(),
    };
    
    // If status changed to published, set publishedAt
    if (storyData.status === 'published') {
      updateData.publishedAt = serverTimestamp();
    }
    
    await updateDoc(storyRef, updateData);
    
    // If featured, remove featured from others
    if (storyData.isFeatured && storyId) {
      await setStoryAsFeatured(storyId);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error updating story:', error);
    return { success: false, error: error.message };
  }
};

// ==================== GET ALL STORIES ====================

export const getStories = async (page = 1, searchTerm = '', statusFilter = 'all', featuredFilter = 'all') => {
  try {
    const storiesRef = collection(db, STORIES_COLLECTION);
    let constraints = [orderBy('createdAt', 'desc'), limit(100)];
    
    if (statusFilter !== 'all') {
      constraints.unshift(where('status', '==', statusFilter));
    }
    
    const q = query(storiesRef, ...constraints);
    const snapshot = await getDocs(q);
    
    let stories = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      stories.push({
        id: doc.id,
        title: data.title || '',
        excerpt: data.excerpt || data.description || '',
        description: data.description || data.excerpt || '',
        author: data.author || '',
        source: data.source || '',
        moral: data.moral || data.description || '',
        description: data.description || data.excerpt || '',
        author: data.author || '',
        source: data.source || '',
        moral: data.moral || '',
        category: data.category || '',
        images: data.images || [],
        featuredImage: data.featuredImage || null,
        status: data.status || 'draft',
        isFeatured: data.isFeatured || false,
        publishDate: data.publishDate || null,
        views: data.views || 0,
        createdAt: data.createdAt?.toDate?.() || null,
        publishedAt: data.publishedAt?.toDate?.() || null,
      });
    });
    
    // Apply featured filter
    if (featuredFilter !== 'all') {
      if (featuredFilter === 'featured') {
        stories = stories.filter(item => item.isFeatured === true);
      } else if (featuredFilter === 'normal') {
        stories = stories.filter(item => item.isFeatured === false);
      }
    }
    
    // Apply search filter
    if (searchTerm) {
      stories = stories.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    const totalItems = stories.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const paginatedStories = stories.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    
    return {
      success: true,
      stories: paginatedStories,
      totalPages,
      totalItems,
    };
  } catch (error) {
    console.error('Error getting stories:', error);
    return { success: false, error: error.message, stories: [], totalPages: 1, totalItems: 0 };
  }
};

// ==================== GET STORY BY ID ====================

export const getStoryById = async (storyId) => {
  try {
    const storyRef = doc(db, STORIES_COLLECTION, storyId);
    const storySnap = await getDoc(storyRef);
    
    if (!storySnap.exists()) {
      return { success: false, error: 'Story not found' };
    }
    
    const data = storySnap.data();
    return {
      success: true,
      story: {
        id: storySnap.id,
        title: data.title || '',
        slug: data.slug || '',
        content: data.content || '',
        excerpt: data.excerpt || data.description || '',
        description: data.description || data.excerpt || '',
        author: data.author || '',
        source: data.source || '',
        moral: data.moral || '',
        category: data.category || '',
        tags: data.tags || [],
        images: data.images || [],
        featuredImage: data.featuredImage || null,
        metatitle: data.metatitle || '',
        metadesc: data.metadesc || '',
        metakeywords: data.metakeywords || '',
        status: data.status || 'draft',
        isFeatured: data.isFeatured || false,
        publishDate: data.publishDate || null,
        views: data.views || 0,
        createdAt: data.createdAt?.toDate?.() || null,
        updatedAt: data.updatedAt?.toDate?.() || null,
        publishedAt: data.publishedAt?.toDate?.() || null,
      }
    };
  } catch (error) {
    console.error('Error getting story:', error);
    return { success: false, error: error.message };
  }
};

// ==================== GET STORY BY SLUG ====================

export const getStoryBySlug = async (slug) => {
  try {
    const storiesRef = collection(db, STORIES_COLLECTION);
    const q = query(storiesRef, where('slug', '==', slug), limit(1));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return { success: false, error: 'Story not found' };
    }

    const docSnap = snapshot.docs[0];
    const data = docSnap.data();
    return {
      success: true,
      story: {
        id: docSnap.id,
        title: data.title || '',
        slug: data.slug || '',
        content: data.content || '',
        excerpt: data.excerpt || data.description || '',
        description: data.description || data.excerpt || '',
        author: data.author || '',
        source: data.source || '',
        moral: data.moral || '',
        category: data.category || '',
        tags: data.tags || [],
        images: data.images || [],
        featuredImage: data.featuredImage || null,
        metatitle: data.metatitle || '',
        metadesc: data.metadesc || '',
        metakeywords: data.metakeywords || '',
        status: data.status || 'draft',
        isFeatured: data.isFeatured || false,
        publishDate: data.publishDate || null,
        views: data.views || 0,
        createdAt: data.createdAt?.toDate?.() || null,
        updatedAt: data.updatedAt?.toDate?.() || null,
        publishedAt: data.publishedAt?.toDate?.() || null,
      }
    };
  } catch (error) {
    console.error('Error getting story by slug:', error);
    return { success: false, error: error.message };
  }
};

// ==================== DELETE STORY ====================

export const deleteStory = async (storyId, storyTitle, imageUrls) => {
  try {
    // Delete all images from storage
    if (imageUrls && imageUrls.length > 0) {
      await deleteMultipleImages(imageUrls);
    }
    
    // Delete story from Firestore
    await deleteDoc(doc(db, STORIES_COLLECTION, storyId));
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting story:', error);
    return { success: false, error: error.message };
  }
};

// ==================== REMOVE SINGLE IMAGE ====================

export const removeStoryImage = async (storyId, imageUrl) => {
  try {
    const storyRef = doc(db, STORIES_COLLECTION, storyId);
    const storySnap = await getDoc(storyRef);
    
    if (!storySnap.exists()) {
      return { success: false, error: 'Story not found' };
    }
    
    const data = storySnap.data();
    const currentImages = data.images || [];
    const updatedImages = currentImages.filter(url => url !== imageUrl);
    
    // Delete from storage
    await deleteImage(imageUrl);
    
    // Update Firestore
    await updateDoc(storyRef, {
      images: updatedImages,
      featuredImage: updatedImages[0] || null,
      updatedAt: serverTimestamp(),
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error removing image:', error);
    return { success: false, error: error.message };
  }
};

// ==================== INCREMENT VIEWS ====================

export const incrementStoryViews = async (storyId) => {
  try {
    const storyRef = doc(db, STORIES_COLLECTION, storyId);
    await updateDoc(storyRef, {
      views: increment(1)
    });
    return { success: true };
  } catch (error) {
    console.error('Error incrementing views:', error);
    return { success: false, error: error.message };
  }
};

// ==================== GET FEATURED STORIES (Frontend) ====================

export const getFeaturedStories = async (limitCount = 3) => {
  try {
    const storiesRef = collection(db, STORIES_COLLECTION);
    const q = query(
      storiesRef,
      where('status', '==', 'published'),
      where('isFeatured', '==', true),
      orderBy('publishDate', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    
    const stories = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      stories.push({
        id: doc.id,
        title: data.title || '',
        slug: data.slug || '',
        excerpt: data.excerpt || data.description || '',
        description: data.description || data.excerpt || '',
        author: data.author || '',
        source: data.source || '',
        tags: data.tags || [],
        images: data.images || [],
        featuredImage: data.featuredImage || null,
        readingTime: data.readingTime || 5,
        category: data.category || '',
        views: data.views || 0,
        publishDate: data.publishDate || null,
      });
    });
    
    return { success: true, stories };
  } catch (error) {
    console.error('Error getting featured stories:', error);
    return { success: false, stories: [] };
  }
};

// ==================== GET LATEST STORIES (Frontend) ====================

export const getLatestStories = async (limitCount = 6) => {
  try {
    const storiesRef = collection(db, STORIES_COLLECTION);
    const q = query(
      storiesRef,
      where('status', '==', 'published'),
      orderBy('publishDate', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    
    const stories = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      stories.push({
        id: doc.id,
        title: data.title || '',
        slug: data.slug || '',
        excerpt: data.excerpt || data.description || '',
        description: data.description || data.excerpt || '',
        author: data.author || '',
        source: data.source || '',
        tags: data.tags || [],
        images: data.images || [],
        featuredImage: data.featuredImage || null,
        readingTime: data.readingTime || 5,
        category: data.category || '',
        views: data.views || 0,
        publishDate: data.publishDate || null,
      });
    });
    
    return { success: true, stories };
  } catch (error) {
    console.error('Error getting latest stories:', error);
    return { success: false, stories: [] };
  }
};

// ==================== GET STORIES BY CATEGORY (Frontend) ====================

export const getStoriesByCategory = async (category, limitCount = 6) => {
  try {
    const storiesRef = collection(db, STORIES_COLLECTION);
    const q = query(
      storiesRef,
      where('status', '==', 'published'),
      where('category', '==', category),
      orderBy('publishDate', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    
    const stories = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      stories.push({
        id: doc.id,
        title: data.title || '',
        slug: data.slug || '',
        excerpt: data.excerpt || '',
        featuredImage: data.featuredImage || null,
        category: data.category || '',
        views: data.views || 0,
        publishDate: data.publishDate || null,
      });
    });
    
    return { success: true, stories };
  } catch (error) {
    console.error('Error getting stories by category:', error);
    return { success: false, stories: [] };
  }
};