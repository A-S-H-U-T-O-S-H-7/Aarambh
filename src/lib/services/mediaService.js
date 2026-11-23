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
  writeBatch,
  Timestamp,
  startAfter,
  getCountFromServer,
  setDoc,
  arrayUnion
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

const normalizeVideoType = (videoType) => {
  if (!videoType || videoType === 'all') return null;
  const normalized = String(videoType).toLowerCase();
  return ['standard', 'short', 'reel'].includes(normalized) ? normalized : 'standard';
};

const stripHtmlTags = (html) => {
  if (!html) return '';
  return html
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const mapVideoDocument = (doc) => {
  const data = doc.data();
  return {
    id: doc.id,
    title: data.title || '',
    slug: data.slug || '',
    description: stripHtmlTags(data.description || ''),
    category: data.category || '',
    thumbnail: data.thumbnail || '',
    youtubeUrl: data.youtubeUrl || '',
    videoId: data.videoId || '',
    duration: data.duration || '',
    views: data.views || 0,
    likes: data.likes || 0,
    isFeatured: data.isFeatured || false,
    isTrending: data.isTrending || false,
    videoType: data.videoType || 'standard',
    speaker: data.artist || data.speaker || '',
    publishDate: data.publishDate || null,
    tags: data.tags || [],
  };
};

// ==================== CREATE MEDIA ====================

export const createMedia = async (mediaData) => {
  try {
    const mediaType = mediaData.mediaType || 'video';
    const videoId = mediaData.youtubeUrl ? getYouTubeId(mediaData.youtubeUrl) : null;
    
    const mediaRef = await addDoc(collection(db, MEDIA_COLLECTION), {
      mediaType: mediaType,
      videoType: normalizeVideoType(mediaData.videoType || (mediaType === 'video' ? 'standard' : null)),
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
      videoType: normalizeVideoType(mediaData.videoType || (mediaData.mediaType === 'video' ? 'standard' : null)),
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
    let constraints = [orderBy('createdAt', 'desc')];
    
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
        videoType: data.videoType || 'standard',
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
        videoType: data.videoType || 'standard',
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
    const mediaRef = doc(db, MEDIA_COLLECTION, mediaId);
    const existing = await getDoc(mediaRef);
    const youtubeId = existing.exists() ? existing.data().videoId : null;

    await deleteDoc(mediaRef);

    // Remember it so YouTube auto-sync doesn't re-create it as a draft
    if (youtubeId) {
      setDoc(doc(db, 'settings', 'youtube_sync'), { dismissedIds: arrayUnion(youtubeId) }, { merge: true })
        .catch((err) => console.error('Could not record dismissed YouTube video:', err));
    }
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


// ==================== VIDEO SPECIFIC FUNCTIONS ====================

// Get all videos (full video, shorts, reels)
export const getVideos = async (limitCount = 20, videoType = null) => {
  try {
    const mediaRef = collection(db, MEDIA_COLLECTION);
    const normalizedVideoType = normalizeVideoType(videoType);
    let constraints = [
      where('mediaType', '==', 'video'),
      where('status', '==', 'published'),
      orderBy('publishDate', 'desc'),
      limit(limitCount)
    ];
    
    if (normalizedVideoType) {
      constraints.unshift(where('videoType', '==', normalizedVideoType));
    }
    
    const q = query(mediaRef, ...constraints);
    const snapshot = await getDocs(q);
    
    const videos = snapshot.docs.map(mapVideoDocument);
    return { success: true, videos };
  } catch (error) {
    console.error('Error getting videos:', error);
    try {
      const mediaRef = collection(db, MEDIA_COLLECTION);
      const fallbackQ = query(
        mediaRef,
        where('mediaType', '==', 'video'),
        where('status', '==', 'published'),
        orderBy('publishDate', 'desc'),
        limit(limitCount)
      );
      const fallbackSnapshot = await getDocs(fallbackQ);
      const videos = fallbackSnapshot.docs
        .map(mapVideoDocument)
        .filter((video) => !normalizeVideoType(videoType) || video.videoType === normalizeVideoType(videoType));
      return { success: true, videos };
    } catch (fallbackError) {
      console.error('Error getting videos with fallback query:', fallbackError);
      return { success: false, videos: [] };
    }
  }
};

// One page of published videos, newest first. Pass the returned cursor back in
// to get the next page. Uses the same index as getVideos.
export const getVideosPage = async (pageSize = 24, videoType = null, cursor = null) => {
  try {
    const normalizedVideoType = normalizeVideoType(videoType);
    const constraints = [
      ...(normalizedVideoType ? [where('videoType', '==', normalizedVideoType)] : []),
      where('mediaType', '==', 'video'),
      where('status', '==', 'published'),
      orderBy('publishDate', 'desc'),
      ...(cursor ? [startAfter(cursor)] : []),
      limit(pageSize),
    ];
    const snapshot = await getDocs(query(collection(db, MEDIA_COLLECTION), ...constraints));
    return {
      success: true,
      videos: snapshot.docs.map(mapVideoDocument),
      cursor: snapshot.docs[snapshot.docs.length - 1] || cursor,
      hasMore: snapshot.docs.length === pageSize,
    };
  } catch (error) {
    console.error('Error getting videos page:', error);
    return { success: false, videos: [], cursor, hasMore: false };
  }
};

// Total number of published videos (optionally of one videoType)
export const countPublishedVideos = async (videoType = null) => {
  try {
    const normalizedVideoType = normalizeVideoType(videoType);
    const q = query(
      collection(db, MEDIA_COLLECTION),
      ...(normalizedVideoType ? [where('videoType', '==', normalizedVideoType)] : []),
      where('mediaType', '==', 'video'),
      where('status', '==', 'published')
    );
    return (await getCountFromServer(q)).data().count;
  } catch (error) {
    console.error('Error counting videos:', error);
    return null;
  }
};

// Get trending videos
export const getTrendingVideos = async (limitCount = 6, videoType = 'standard') => {
  try {
    const mediaRef = collection(db, MEDIA_COLLECTION);
    const normalizedVideoType = normalizeVideoType(videoType);
    let constraints = [
      where('mediaType', '==', 'video'),
      where('status', '==', 'published'),
      where('isTrending', '==', true),
      orderBy('publishDate', 'desc'),
      limit(limitCount)
    ];

    if (normalizedVideoType) {
      constraints.unshift(where('videoType', '==', normalizedVideoType));
    }

    const q = query(mediaRef, ...constraints);
    const snapshot = await getDocs(q);

    const videos = snapshot.docs.map(mapVideoDocument);
    return { success: true, videos };
  } catch (error) {
    console.error('Error getting trending videos:', error);
    try {
      const mediaRef = collection(db, MEDIA_COLLECTION);
      const fallbackQ = query(
        mediaRef,
        where('mediaType', '==', 'video'),
        where('status', '==', 'published'),
        where('isTrending', '==', true),
        orderBy('publishDate', 'desc'),
        limit(limitCount)
      );
      const fallbackSnapshot = await getDocs(fallbackQ);
      const videos = fallbackSnapshot.docs
        .map(mapVideoDocument)
        .filter((video) => !normalizeVideoType(videoType) || video.videoType === normalizeVideoType(videoType));
      return { success: true, videos };
    } catch (fallbackError) {
      console.error('Error getting trending videos with fallback query:', fallbackError);
      return { success: false, videos: [] };
    }
  }
};

// Get latest videos
export const getLatestVideos = async (limitCount = 12, videoType = null) => {
  try {
    const mediaRef = collection(db, MEDIA_COLLECTION);
    const normalizedVideoType = normalizeVideoType(videoType);
    let constraints = [
      where('mediaType', '==', 'video'),
      where('status', '==', 'published'),
      orderBy('publishDate', 'desc'),
      limit(limitCount)
    ];
    
    if (normalizedVideoType) {
      constraints.unshift(where('videoType', '==', normalizedVideoType));
    }
    
    const q = query(mediaRef, ...constraints);
    const snapshot = await getDocs(q);
    
    const videos = snapshot.docs.map(mapVideoDocument);
    return { success: true, videos };
  } catch (error) {
    console.error('Error getting latest videos:', error);
    try {
      const mediaRef = collection(db, MEDIA_COLLECTION);
      const fallbackQ = query(
        mediaRef,
        where('mediaType', '==', 'video'),
        where('status', '==', 'published'),
        orderBy('publishDate', 'desc'),
        limit(limitCount)
      );
      const fallbackSnapshot = await getDocs(fallbackQ);
      const videos = fallbackSnapshot.docs
        .map(mapVideoDocument)
        .filter((video) => !normalizeVideoType(videoType) || video.videoType === normalizeVideoType(videoType));
      return { success: true, videos };
    } catch (fallbackError) {
      console.error('Error getting latest videos with fallback query:', fallbackError);
      return { success: false, videos: [] };
    }
  }
};

// Get video by ID
export const getVideoById = async (videoId) => {
  try {
    const mediaRef = doc(db, MEDIA_COLLECTION, videoId);
    const mediaSnap = await getDoc(mediaRef);
    
    if (!mediaSnap.exists()) {
      return { success: false, error: 'Video not found' };
    }
    
    const data = mediaSnap.data();
    return {
      success: true,
      video: {
        id: mediaSnap.id,
        title: data.title || '',
        slug: data.slug || '',
        description: stripHtmlTags(data.description || ''),
        category: data.category || '',
        thumbnail: data.thumbnail || '',
        youtubeUrl: data.youtubeUrl || '',
        videoId: data.videoId || '',
        duration: data.duration || '',
        views: data.views || 0,
        likes: data.likes || 0,
        isFeatured: data.isFeatured || false,
        isTrending: data.isTrending || false,
        videoType: data.videoType || 'standard',
        speaker: data.artist || data.speaker || '',
        publishDate: data.publishDate || null,
        tags: data.tags || [],
      }
    };
  } catch (error) {
    console.error('Error getting video:', error);
    return { success: false, error: error.message };
  }
};

// Increment video view
export const incrementVideoView = async (videoId) => {
  try {
    const mediaRef = doc(db, MEDIA_COLLECTION, videoId);
    await updateDoc(mediaRef, {
      views: increment(1)
    });
    return { success: true };
  } catch (error) {
    console.error('Error incrementing view:', error);
    return { success: false, error: error.message };
  }
};

// Toggle video like
export const toggleVideoLike = async (videoId) => {
  try {
    const mediaRef = doc(db, MEDIA_COLLECTION, videoId);
    const mediaSnap = await getDoc(mediaRef);
    
    if (!mediaSnap.exists()) {
      return { success: false, error: 'Video not found' };
    }
    
    const data = mediaSnap.data();
    const currentLikes = data.likes || 0;
    
    await updateDoc(mediaRef, {
      likes: currentLikes + 1
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error toggling like:', error);
    return { success: false, error: error.message };
  }
};
// ==================== YOUTUBE IMPORT ====================

// Categories shared by the media form and the YouTube import page
export const MEDIA_CATEGORIES = [
  { id: 'bhakti', name: 'Bhakti', slug: 'bhakti' },
  { id: 'spiritual', name: 'Spiritual', slug: 'spiritual' },
  { id: 'meditation', name: 'Meditation', slug: 'meditation' },
  { id: 'devotional', name: 'Devotional', slug: 'devotional' },
  { id: 'festival', name: 'Festival', slug: 'festival' },
  { id: 'mantra', name: 'Mantra', slug: 'mantra' },
  { id: 'aarti', name: 'Aarti', slug: 'aarti' },
  { id: 'kirtan', name: 'Kirtan', slug: 'kirtan' },
  { id: 'chalisa', name: 'Chalisa', slug: 'chalisa' },
  { id: 'satsang', name: 'Satsang', slug: 'satsang' },
];

const chunk = (items, size) => {
  const out = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
};

// Which of these YouTube ids are already in the media collection
export const getExistingMediaVideoIds = async (youtubeIds) => {
  const existing = new Set();
  const mediaRef = collection(db, MEDIA_COLLECTION);
  const groups = chunk([...new Set(youtubeIds)].filter(Boolean), 30);
  for (const wave of chunk(groups, 10)) {
    const snapshots = await Promise.all(wave.map((ids) => getDocs(query(mediaRef, where('videoId', 'in', ids)))));
    snapshots.forEach((snap) => snap.forEach((d) => existing.add(d.data().videoId)));
  }
  return existing;
};

const getExistingMediaSlugs = async (slugs) => {
  const existing = new Set();
  const mediaRef = collection(db, MEDIA_COLLECTION);
  const groups = chunk([...new Set(slugs)].filter(Boolean), 30);
  for (const wave of chunk(groups, 10)) {
    const snapshots = await Promise.all(wave.map((part) => getDocs(query(mediaRef, where('slug', 'in', part)))));
    snapshots.forEach((snap) => snap.forEach((d) => existing.add(d.data().slug)));
  }
  return existing;
};

// Slug from the title, max ~80 chars, without the channel name. Odia/Hindi-only
// titles lose all their letters in generateSlug, so those become "video-<youtube id>".
const importSlug = (title, videoId) => {
  const cleaned = (title || '').replace(/aarambh\s*tv|aarambh/gi, ' ');
  let slug = generateSlug(cleaned);
  if (slug.length > 80) slug = slug.slice(0, 80).replace(/-[^-]*$/, '');
  slug = slug.replace(/^-+|-+$/g, '');
  const words = slug.split('-').filter((w) => /[a-z]/.test(w));
  return words.length >= 2 ? slug : `video-${videoId.toLowerCase()}`;
};

/**
 * Save many YouTube videos into the media collection at once.
 * videos:  items from /api/youtube-import (videoId, title, description, tags,
 *          thumbnail, duration, publishDate, publishedAt, videoType, youtubeUrl)
 * options: { category, status, mediaType ('video' | 'bhajan'), artist }
 * Videos whose YouTube id is already saved are skipped. Each document id is
 * yt_<videoId>, so running two imports at once can't create duplicates.
 */
export const importYouTubeMedia = async (videos, options, onProgress) => {
  try {
    const { category = '', status = 'published', mediaType = 'video', artist = '' } = options || {};

    const existingIds = await getExistingMediaVideoIds(videos.map((v) => v.videoId));
    const toImport = videos.filter((v) => !existingIds.has(v.videoId));

    const baseSlugs = toImport.map((v) => importSlug(v.title, v.videoId));
    const takenSlugs = await getExistingMediaSlugs(baseSlugs);
    const used = new Set();
    const slugs = baseSlugs.map((slug, i) => {
      let finalSlug = slug;
      if (takenSlugs.has(finalSlug) || used.has(finalSlug)) {
        finalSlug = `${slug}-${toImport[i].videoId.toLowerCase()}`;
      }
      used.add(finalSlug);
      return finalSlug;
    });

    let saved = 0;
    const groups = chunk(toImport.map((v, i) => ({ ...v, slug: slugs[i] })), 400);

    for (const group of groups) {
      const batch = writeBatch(db);
      group.forEach((v) => {
        const ytDate = v.publishedAt ? Timestamp.fromDate(new Date(v.publishedAt)) : serverTimestamp();
        const description = v.description || '';
        batch.set(doc(db, MEDIA_COLLECTION, `yt_${v.videoId}`), {
          mediaType,
          videoType: normalizeVideoType(v.videoType) || 'standard',
          title: v.title,
          slug: v.slug,
          description,
          category,
          tags: v.tags || [],
          status,
          isFeatured: false,
          isTrending: false,
          // Keep YouTube's original upload date so old videos sort as old
          publishDate: v.publishDate || new Date().toISOString().split('T')[0],
          views: 0,
          likes: 0,
          youtubeUrl: v.youtubeUrl || `https://www.youtube.com/watch?v=${v.videoId}`,
          videoId: v.videoId,
          thumbnail: v.thumbnail || getYouTubeThumbnail(v.videoId),
          duration: v.duration || '',
          artist,
          album: '',
          metatitle: v.title,
          metadesc: description.replace(/\s+/g, ' ').trim().substring(0, 160),
          metakeywords: (v.tags || []).join(', '),
          createdAt: ytDate,
          updatedAt: serverTimestamp(),
          publishedAt: status === 'published' ? ytDate : null,
          importedFrom: 'youtube',
          importedAt: serverTimestamp(),
        });
      });
      await batch.commit();
      saved += group.length;
      onProgress?.(saved, toImport.length);
    }

    return { success: true, imported: saved, skipped: videos.length - toImport.length };
  } catch (error) {
    console.error('Error importing YouTube videos:', error);
    return { success: false, error: error.message };
  }
};
