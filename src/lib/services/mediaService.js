// lib/services/mediaService.js
import { db } from '@/lib/firebase/client';
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

const MEDIA_COLLECTION = 'media';
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

export const getYouTubeId = (url) => {
  if (!url) return null;
  
  if (url.includes('youtu.be/')) {
    const match = url.match(/youtu\.be\/([^?&]+)/);
    return match ? match[1] : null;
  }
  
  if (url.includes('/shorts/')) {
    const match = url.match(/\/shorts\/([^?&]+)/);
    return match ? match[1] : null;
  }
  
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export const getYouTubeThumbnail = (videoId) => {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};

// ==================== CREATE MEDIA ====================

export const createMedia = async (mediaData) => {
  try {
    const mediaType = mediaData.mediaType || 'video';
    const videoId = mediaData.youtubeUrl ? getYouTubeId(mediaData.youtubeUrl) : null;
    
    const mediaRef = await addDoc(collection(db, MEDIA_COLLECTION), {
      mediaType: mediaType,
      title: mediaData.title,
      slug: mediaData.slug || generateSlug(mediaData.title),
      description: mediaData.description || '',
      category: mediaData.category || '',
      tags: mediaData.tags || [],
      status: mediaData.status || 'draft',
      isFeatured: mediaData.isFeatured || false,
      isTrending: mediaData.isTrending || false,
      publishDate: mediaData.publishDate || new Date().toISOString().split('T')[0],
      views: 0,
      likes: 0,
      youtubeUrl: mediaData.youtubeUrl || '',
      videoId: videoId,
      thumbnail: videoId ? getYouTubeThumbnail(videoId) : null,
      artist: mediaData.artist || '',
      album: mediaData.album || '',
      metatitle: mediaData.metatitle || mediaData.title,
      metadesc: mediaData.metadesc || mediaData.description?.substring(0, 160) || '',
      metakeywords: mediaData.metakeywords || '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      publishedAt: mediaData.status === 'published' ? serverTimestamp() : null,
    });
    
    return { success: true, id: mediaRef.id };
  } catch (error) {
    console.error('Error creating media:', error);
    return { success: false, error: error.message };
  }
};

// ==================== UPDATE MEDIA ====================

export const updateMedia = async (mediaId, mediaData) => {
  try {
    const mediaRef = doc(db, MEDIA_COLLECTION, mediaId);
    const videoId = mediaData.youtubeUrl ? getYouTubeId(mediaData.youtubeUrl) : null;
    
    const updateData = {
      mediaType: mediaData.mediaType,
      title: mediaData.title,
      slug: mediaData.slug || generateSlug(mediaData.title),
      description: mediaData.description || '',
      category: mediaData.category || '',
      tags: mediaData.tags || [],
      status: mediaData.status,
      isFeatured: mediaData.isFeatured || false,
      isTrending: mediaData.isTrending || false,
      publishDate: mediaData.publishDate || null,
      youtubeUrl: mediaData.youtubeUrl || '',
      videoId: videoId,
      thumbnail: videoId ? getYouTubeThumbnail(videoId) : null,
      artist: mediaData.artist || '',
      album: mediaData.album || '',
      metatitle: mediaData.metatitle || mediaData.title,
      metadesc: mediaData.metadesc || mediaData.description?.substring(0, 160) || '',
      metakeywords: mediaData.metakeywords || '',
      updatedAt: serverTimestamp(),
    };
    
    if (mediaData.status === 'published' && mediaData.oldStatus !== 'published') {
      updateData.publishedAt = serverTimestamp();
    }
    
    await updateDoc(mediaRef, updateData);
    
    return { success: true };
  } catch (error) {
    console.error('Error updating media:', error);
    return { success: false, error: error.message };
  }
};

// ==================== GET ALL MEDIA ====================

export const getMedia = async (page = 1, searchTerm = '', statusFilter = 'all', typeFilter = 'all', featuredFilter = 'all') => {
  try {
    const mediaRef = collection(db, MEDIA_COLLECTION);
    let constraints = [orderBy('createdAt', 'desc'), limit(100)];
    
    if (statusFilter !== 'all') {
      constraints.unshift(where('status', '==', statusFilter));
    }
    if (typeFilter !== 'all') {
      constraints.unshift(where('mediaType', '==', typeFilter));
    }
    
    const q = query(mediaRef, ...constraints);
    const snapshot = await getDocs(q);
    
    let media = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      media.push({
        id: doc.id,
        mediaType: data.mediaType || 'video',
        title: data.title || '',
        thumbnail: data.thumbnail || '',
        category: data.category || '',
        status: data.status || 'draft',
        isFeatured: data.isFeatured || false,
        isTrending: data.isTrending || false,
        views: data.views || 0,
        artist: data.artist || '',
        publishDate: data.publishDate || null,
        createdAt: data.createdAt?.toDate?.() || null,
        publishedAt: data.publishedAt?.toDate?.() || null,
      });
    });
    
    // Apply featured filters
    if (featuredFilter !== 'all') {
      const filterMap = {
        'featured': 'isFeatured',
        'trending': 'isTrending',
      };
      const filterKey = filterMap[featuredFilter];
      if (filterKey) {
        media = media.filter(item => item[filterKey] === true);
      }
    }
    
    if (searchTerm) {
      media = media.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.artist && item.artist.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    const totalItems = media.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const paginatedMedia = media.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    
    return {
      success: true,
      media: paginatedMedia,
      totalPages,
      totalItems,
    };
  } catch (error) {
    console.error('Error getting media:', error);
    return { success: false, error: error.message, media: [], totalPages: 1, totalItems: 0 };
  }
};

// ==================== GET MEDIA BY ID ====================

export const getMediaById = async (mediaId) => {
  try {
    const mediaRef = doc(db, MEDIA_COLLECTION, mediaId);
    const mediaSnap = await getDoc(mediaRef);
    
    if (!mediaSnap.exists()) {
      return { success: false, error: 'Media not found' };
    }
    
    const data = mediaSnap.data();
    return {
      success: true,
      media: {
        id: mediaSnap.id,
        mediaType: data.mediaType || 'video',
        title: data.title || '',
        slug: data.slug || '',
        description: data.description || '',
        category: data.category || '',
        tags: data.tags || [],
        status: data.status || 'draft',
        isFeatured: data.isFeatured || false,
        isTrending: data.isTrending || false,
        publishDate: data.publishDate || null,
        views: data.views || 0,
        likes: data.likes || 0,
        youtubeUrl: data.youtubeUrl || '',
        videoId: data.videoId || '',
        thumbnail: data.thumbnail || '',
        artist: data.artist || '',
        album: data.album || '',
        metatitle: data.metatitle || '',
        metadesc: data.metadesc || '',
        metakeywords: data.metakeywords || '',
        createdAt: data.createdAt?.toDate?.() || null,
        updatedAt: data.updatedAt?.toDate?.() || null,
        publishedAt: data.publishedAt?.toDate?.() || null,
      }
    };
  } catch (error) {
    console.error('Error getting media:', error);
    return { success: false, error: error.message };
  }
};

// ==================== DELETE MEDIA ====================

export const deleteMedia = async (mediaId) => {
  try {
    await deleteDoc(doc(db, MEDIA_COLLECTION, mediaId));
    return { success: true };
  } catch (error) {
    console.error('Error deleting media:', error);
    return { success: false, error: error.message };
  }
};

// ==================== FRONTEND FUNCTIONS ====================

export const getLatestMedia = async (type = null, limitCount = 20) => {
  try {
    const mediaRef = collection(db, MEDIA_COLLECTION);
    let constraints = [
      where('status', '==', 'published'),
      orderBy('publishDate', 'desc'),
      limit(limitCount)
    ];
    
    if (type) {
      constraints.unshift(where('mediaType', '==', type));
    }
    
    const q = query(mediaRef, ...constraints);
    const snapshot = await getDocs(q);
    
    const media = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      media.push({
        id: doc.id,
        title: data.title || '',
        slug: data.slug || '',
        thumbnail: data.thumbnail || '',
        views: data.views || 0,
        category: data.category || '',
        mediaType: data.mediaType || 'video',
        artist: data.artist || '',
        publishDate: data.publishDate || null,
      });
    });
    
    return { success: true, media };
  } catch (error) {
    console.error('Error getting latest media:', error);
    return { success: false, media: [] };
  }
};

export const getFeaturedMedia = async (type = null, limitCount = 8) => {
  try {
    const mediaRef = collection(db, MEDIA_COLLECTION);
    let constraints = [
      where('status', '==', 'published'),
      where('isFeatured', '==', true),
      orderBy('publishDate', 'desc'),
      limit(limitCount)
    ];
    
    if (type) {
      constraints.unshift(where('mediaType', '==', type));
    }
    
    const q = query(mediaRef, ...constraints);
    const snapshot = await getDocs(q);
    
    const media = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      media.push({
        id: doc.id,
        title: data.title || '',
        slug: data.slug || '',
        thumbnail: data.thumbnail || '',
        views: data.views || 0,
        category: data.category || '',
        mediaType: data.mediaType || 'video',
        artist: data.artist || '',
        publishDate: data.publishDate || null,
      });
    });
    
    return { success: true, media };
  } catch (error) {
    console.error('Error getting featured media:', error);
    return { success: false, media: [] };
  }
};

export const getTrendingMedia = async (type = null, limitCount = 8) => {
  try {
    const mediaRef = collection(db, MEDIA_COLLECTION);
    let constraints = [
      where('status', '==', 'published'),
      where('isTrending', '==', true),
      orderBy('publishDate', 'desc'),
      limit(limitCount)
    ];
    
    if (type) {
      constraints.unshift(where('mediaType', '==', type));
    }
    
    const q = query(mediaRef, ...constraints);
    const snapshot = await getDocs(q);
    
    const media = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      media.push({
        id: doc.id,
        title: data.title || '',
        slug: data.slug || '',
        thumbnail: data.thumbnail || '',
        views: data.views || 0,
        category: data.category || '',
        mediaType: data.mediaType || 'video',
        artist: data.artist || '',
        publishDate: data.publishDate || null,
      });
    });
    
    return { success: true, media };
  } catch (error) {
    console.error('Error getting trending media:', error);
    return { success: false, media: [] };
  }
};

// ==================== BHAJAN SPECIFIC FUNCTIONS ====================

export const getBhajans = async (limitCount = 20) => {
  try {
    const mediaRef = collection(db, MEDIA_COLLECTION);
    const q = query(
      mediaRef,
      where('mediaType', '==', 'bhajan'),
      where('status', '==', 'published'),
      orderBy('publishDate', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    
    const bhajans = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      bhajans.push({
        id: doc.id,
        title: data.title || '',
        slug: data.slug || '',
        thumbnail: data.thumbnail || '',
        youtubeUrl: data.youtubeUrl || '',
        videoId: data.videoId || '',
        duration: data.duration || '',
        category: data.category || '',
        artist: data.artist || '',
        album: data.album || '',
        views: data.views || 0,
        likes: data.likes || 0,
        isFeatured: data.isFeatured || false,
        isTrending: data.isTrending || false,
        publishDate: data.publishDate || null,
        description: data.description || '',
        tags: data.tags || [],
      });
    });
    
    return { success: true, bhajans };
  } catch (error) {
    console.error('Error getting bhajans:', error);
    return { success: false, bhajans: [] };
  }
};

// Get featured bhajan
export const getFeaturedBhajan = async () => {
  try {
    const mediaRef = collection(db, MEDIA_COLLECTION);
    const q = query(
      mediaRef,
      where('mediaType', '==', 'bhajan'),
      where('status', '==', 'published'),
      where('isFeatured', '==', true),
      limit(1)
    );
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      // If no featured, get latest bhajan
      const latestQ = query(
        mediaRef,
        where('mediaType', '==', 'bhajan'),
        where('status', '==', 'published'),
        orderBy('publishDate', 'desc'),
        limit(1)
      );
      const latestSnapshot = await getDocs(latestQ);
      if (latestSnapshot.empty) {
        return { success: false, bhajan: null };
      }
      const doc = latestSnapshot.docs[0];
      const data = doc.data();
      return {
        success: true,
        bhajan: {
          id: doc.id,
          title: data.title || '',
          slug: data.slug || '',
          thumbnail: data.thumbnail || '',
          youtubeUrl: data.youtubeUrl || '',
          videoId: data.videoId || '',
          duration: data.duration || '',
          category: data.category || '',
          artist: data.artist || '',
          views: data.views || 0,
          likes: data.likes || 0,
          isFeatured: data.isFeatured || false,
          isTrending: data.isTrending || false,
          description: data.description || '',
        }
      };
    }
    
    const doc = snapshot.docs[0];
    const data = doc.data();
    return {
      success: true,
      bhajan: {
        id: doc.id,
        title: data.title || '',
        slug: data.slug || '',
        thumbnail: data.thumbnail || '',
        youtubeUrl: data.youtubeUrl || '',
        videoId: data.videoId || '',
        duration: data.duration || '',
        category: data.category || '',
        artist: data.artist || '',
        views: data.views || 0,
        likes: data.likes || 0,
        isFeatured: data.isFeatured || false,
        isTrending: data.isTrending || false,
        description: data.description || '',
      }
    };
  } catch (error) {
    console.error('Error getting featured bhajan:', error);
    return { success: false, bhajan: null };
  }
};

// Increment view count
export const incrementMediaView = async (mediaId) => {
  try {
    const mediaRef = doc(db, MEDIA_COLLECTION, mediaId);
    await updateDoc(mediaRef, {
      views: increment(1)
    });
    return { success: true };
  } catch (error) {
    console.error('Error incrementing view:', error);
    return { success: false, error: error.message };
  }
};

// Toggle like
export const toggleMediaLike = async (mediaId) => {
  try {
    const mediaRef = doc(db, MEDIA_COLLECTION, mediaId);
    const mediaSnap = await getDoc(mediaRef);
    
    if (!mediaSnap.exists()) {
      return { success: false, error: 'Media not found' };
    }
    
    const data = mediaSnap.data();
    const currentLikes = data.likes || 0;
    
    // Simple toggle - increment/decrement
    await updateDoc(mediaRef, {
      likes: currentLikes + 1
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error toggling like:', error);
    return { success: false, error: error.message };
  }
};