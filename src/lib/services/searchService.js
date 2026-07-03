import { db } from '@/lib/firebase/client';
import { collection, getDocs } from 'firebase/firestore';

/**
 * Search across all content types in Firebase
 */
export const searchAllContent = async (searchTerm, maxResults = 20) => {
  if (!searchTerm || searchTerm.trim().length < 2) {
    return {
      success: true,
      results: { bhajans: [], videos: [], temples: [], stories: [], festivals: [] },
      total: 0,
    };
  }

  const term = searchTerm.toLowerCase().trim();

  try {
    const [bhajans, videos, temples, stories, festivals] = await Promise.all([
      searchBhajans(term, maxResults),
      searchVideos(term, maxResults),
      searchTemples(term, maxResults),
      searchStories(term, maxResults),
      searchFestivals(term, maxResults),
    ]);

    const results = { bhajans, videos, temples, stories, festivals };
    const total = bhajans.length + videos.length + temples.length + stories.length + festivals.length;

    return { success: true, results, total };
  } catch (error) {
    console.error('Error searching content:', error);
    return {
      success: false,
      error: error.message,
      results: { bhajans: [], videos: [], temples: [], stories: [], festivals: [] },
      total: 0,
    };
  }
};

/**
 * Search Bhajans - From MEDIA collection with mediaType === 'bhajan'
 */
export const searchBhajans = async (searchTerm, maxResults = 20) => {
  try {
    const mediaRef = collection(db, 'media');
    const snapshot = await getDocs(mediaRef);

    const results = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      const isBhajan = data.mediaType === 'bhajan';
      const isPublished = data.status === 'published';
      
      if (isBhajan && isPublished) {
        const title = (data.title || '').toLowerCase();
        const artist = (data.artist || '').toLowerCase();
        const category = (data.category || '').toLowerCase();
        const description = (data.description || '').toLowerCase();

        if (
          title.includes(searchTerm) ||
          artist.includes(searchTerm) ||
          category.includes(searchTerm) ||
          description.includes(searchTerm)
        ) {
          results.push({
            id: doc.id,
            type: 'bhajan',
            title: data.title,
            artist: data.artist,
            category: data.category,
            thumbnail: data.thumbnail,
            duration: data.duration,
            description: data.description,
            youtubeUrl: data.youtubeUrl,
            views: data.views || 0,
            likes: data.likes || 0,
          });
        }
      }
    });

    return results.slice(0, maxResults);
  } catch (error) {
    console.error('Error searching bhajans:', error);
    return [];
  }
};

/**
 * Search Videos - From MEDIA collection with mediaType === 'video'
 */
export const searchVideos = async (searchTerm, maxResults = 20) => {
  try {
    const mediaRef = collection(db, 'media');
    const snapshot = await getDocs(mediaRef);

    const results = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      const isVideo = data.mediaType === 'video';
      const isPublished = data.status === 'published';
      
      if (isVideo && isPublished) {
        const title = (data.title || '').toLowerCase();
        const artist = (data.artist || data.speaker || '').toLowerCase();
        const category = (data.category || '').toLowerCase();
        const description = (data.description || '').toLowerCase();

        if (
          title.includes(searchTerm) ||
          artist.includes(searchTerm) ||
          category.includes(searchTerm) ||
          description.includes(searchTerm)
        ) {
          results.push({
            id: doc.id,
            type: 'video',
            title: data.title,
            speaker: data.artist || data.speaker,
            category: data.category,
            thumbnail: data.thumbnail,
            duration: data.duration,
            description: data.description,
            youtubeUrl: data.youtubeUrl,
            views: data.views || 0,
            likes: data.likes || 0,
          });
        }
      }
    });

    return results.slice(0, maxResults);
  } catch (error) {
    console.error('Error searching videos:', error);
    return [];
  }
};

/**
 * Search Temples - From TEMPLES collection
 */
export const searchTemples = async (searchTerm, maxResults = 20) => {
  try {
    const templesRef = collection(db, 'temples');
    const snapshot = await getDocs(templesRef);

    const results = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      const isPublished = data.status === 'published';
      
      if (isPublished) {
        const name = (data.name || data.title || '').toLowerCase();
        const location = (data.location || '').toLowerCase();
        const deity = (data.deity || '').toLowerCase();
        const description = (data.shortDescription || data.description || '').toLowerCase();

        if (
          name.includes(searchTerm) ||
          location.includes(searchTerm) ||
          deity.includes(searchTerm) ||
          description.includes(searchTerm)
        ) {
          results.push({
            id: doc.id,
            type: 'temple',
            name: data.name || data.title,
            location: data.location,
            deity: data.deity,
            description: data.shortDescription || data.description,
            image: data.featuredImage || data.image,
            slug: data.slug,
            views: data.views || 0,
            likes: data.likes || 0,
          });
        }
      }
    });

    return results.slice(0, maxResults);
  } catch (error) {
    console.error('Error searching temples:', error);
    return [];
  }
};

/**
 * Search Stories - From STORIES collection
 */
export const searchStories = async (searchTerm, maxResults = 20) => {
  try {
    const storiesRef = collection(db, 'stories');
    const snapshot = await getDocs(storiesRef);

    const results = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      const isPublished = data.status === 'published';
      
      if (isPublished) {
        const title = (data.title || '').toLowerCase();
        const description = (data.description || data.excerpt || '').toLowerCase();
        const author = (data.author || '').toLowerCase();
        const tags = (data.tags || []).map((tag) => tag.toLowerCase());

        if (
          title.includes(searchTerm) ||
          description.includes(searchTerm) ||
          author.includes(searchTerm) ||
          tags.some((tag) => tag.includes(searchTerm))
        ) {
          results.push({
            id: doc.id,
            type: 'story',
            title: data.title,
            description: data.description || data.excerpt,
            author: data.author,
            tags: data.tags || [],
            coverImage: data.featuredImage || data.coverImage,
            category: data.category,
            slug: data.slug,
            views: data.views || 0,
            likes: data.likes || 0,
          });
        }
      }
    });

    return results.slice(0, maxResults);
  } catch (error) {
    console.error('Error searching stories:', error);
    return [];
  }
};

/**
 * Search Festivals - From FESTIVALS collection
 */
export const searchFestivals = async (searchTerm, maxResults = 20) => {
  try {
    const festivalsRef = collection(db, 'festivals');
    const snapshot = await getDocs(festivalsRef);

    const results = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      const isPublished = data.status === 'published';
      
      if (isPublished) {
        const name = (data.name || data.title || '').toLowerCase();
        const description = (data.description || data.shortDescription || '').toLowerCase();
        const category = (data.category || '').toLowerCase();

        if (
          name.includes(searchTerm) ||
          description.includes(searchTerm) ||
          category.includes(searchTerm)
        ) {
          results.push({
            id: doc.id,
            type: 'festival',
            name: data.name || data.title,
            description: data.description || data.shortDescription,
            category: data.category,
            image: data.featuredImage || data.image,
            date: data.date,
            slug: data.slug,
          });
        }
      }
    });

    return results.slice(0, maxResults);
  } catch (error) {
    console.error('Error searching festivals:', error);
    return [];
  }
};

/**
 * Quick search for navbar (returns limited results)
 */
export const quickSearch = async (searchTerm, maxResults = 5) => {
  if (!searchTerm || searchTerm.trim().length < 2) {
    return { success: true, results: [] };
  }

  const result = await searchAllContent(searchTerm, maxResults);
  if (result.success) {
    const allResults = [
      ...result.results.bhajans.slice(0, 2),
      ...result.results.videos.slice(0, 2),
      ...result.results.temples.slice(0, 2),
      ...result.results.stories.slice(0, 2),
      ...result.results.festivals.slice(0, 2),
    ].slice(0, maxResults);
    
    return { success: true, results: allResults };
  }
  return { success: false, results: [] };
};