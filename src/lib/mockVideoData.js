// lib/mockVideoData.js
export const videoCategories = [
  { id: 'all', name: 'All Videos', icon: '🎬' },
  { id: 'discourse', name: 'Discourses', icon: '📿' },
  { id: 'bhajan', name: 'Bhajan Videos', icon: '🎵' },
  { id: 'documentary', name: 'Documentaries', icon: '🎥' },
  { id: 'talk', name: 'Spiritual Talks', icon: '🗣️' },
];

export const videos = [
  {
    id: 1,
    title: "The Power of Meditation - A Spiritual Discourse",
    description: "Learn the ancient art of meditation and its transformative power in daily life.",
    category: "discourse",
    duration: "15:23",
    views: 24500,
    likes: 1230,
    thumbnail: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=450&fit=crop",
    videoUrl: "/videos/meditation-discourse.mp4",
    speaker: "Swami Vivekananda",
    date: "2025-01-15",
    featured: true,
    trending: true
  },
  {
    id: 2,
    title: "Krishna Bhajan - Om Namah Shivaya",
    description: "Soulful bhajan dedicated to Lord Krishna with beautiful visuals.",
    category: "bhajan",
    duration: "8:45",
    views: 18900,
    likes: 980,
    thumbnail: "https://images.unsplash.com/photo-1501139083538-0139583c060f?w=800&h=450&fit=crop",
    videoUrl: "/videos/krishna-bhajan.mp4",
    speaker: "Anup Jalota",
    date: "2025-01-14",
    featured: false,
    trending: true
  },
  {
    id: 3,
    title: "Ancient Temples of India - A Documentary",
    description: "Explore the magnificent temples of India and their architectural brilliance.",
    category: "documentary",
    duration: "25:10",
    views: 32000,
    likes: 2100,
    thumbnail: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&h=450&fit=crop",
    videoUrl: "/videos/ancient-temples.mp4",
    speaker: "Documentary Team",
    date: "2025-01-13",
    featured: true,
    trending: false
  },
  {
    id: 4,
    title: "Finding Inner Peace - A Spiritual Talk",
    description: "Discover how to find inner peace in a chaotic world through spiritual wisdom.",
    category: "talk",
    duration: "12:30",
    views: 15600,
    likes: 850,
    thumbnail: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&h=450&fit=crop",
    videoUrl: "/videos/inner-peace.mp4",
    speaker: "Dalai Lama",
    date: "2025-01-12",
    featured: false,
    trending: false
  },
  {
    id: 5,
    title: "Shiva Tandava Stotram - Divine Chanting",
    description: "Powerful chanting of Shiva Tandava Stotram with mesmerizing visuals.",
    category: "bhajan",
    duration: "9:15",
    views: 23400,
    likes: 1430,
    thumbnail: "https://images.unsplash.com/photo-1519791883288-dc8bd696e667?w=800&h=450&fit=crop",
    videoUrl: "/videos/shiva-tandava.mp4",
    speaker: "Ravindra Sathe",
    date: "2025-01-11",
    featured: true,
    trending: true
  },
  {
    id: 6,
    title: "The Bhagavad Gita - Chapter 1",
    description: "Deep dive into the teachings of Bhagavad Gita with commentary and insights.",
    category: "discourse",
    duration: "18:45",
    views: 28700,
    likes: 1670,
    thumbnail: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&h=450&fit=crop",
    videoUrl: "/videos/bhagavad-gita.mp4",
    speaker: "Swami Chinmayananda",
    date: "2025-01-10",
    featured: false,
    trending: false
  },
  {
    id: 7,
    title: "Spiritual Journey to Varanasi",
    description: "Experience the spiritual essence of Varanasi through this visual journey.",
    category: "documentary",
    duration: "20:00",
    views: 21200,
    likes: 1560,
    thumbnail: "https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=800&h=450&fit=crop",
    videoUrl: "/videos/varanasi-journey.mp4",
    speaker: "Travel Documentary",
    date: "2025-01-09",
    featured: false,
    trending: false
  },
  {
    id: 8,
    title: "Hanuman Chalisa - Divine Chanting",
    description: "Powerful chanting of Hanuman Chalisa with beautiful visualizations.",
    category: "bhajan",
    duration: "7:30",
    views: 45600,
    likes: 3200,
    thumbnail: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&h=450&fit=crop",
    videoUrl: "/videos/hanuman-chalisa.mp4",
    speaker: "Hari Om Sharan",
    date: "2025-01-08",
    featured: true,
    trending: true
  },
  {
    id: 9,
    title: "The Art of Mindfulness - Spiritual Talk",
    description: "Learn the art of mindfulness and its application in modern life.",
    category: "talk",
    duration: "14:20",
    views: 12300,
    likes: 780,
    thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=450&fit=crop",
    videoUrl: "/videos/mindfulness-talk.mp4",
    speaker: "Thich Nhat Hanh",
    date: "2025-01-07",
    featured: false,
    trending: false
  },
  {
    id: 10,
    title: "Sacred Temples of South India",
    description: "Explore the magnificent temples of South India and their spiritual significance.",
    category: "documentary",
    duration: "22:30",
    views: 18900,
    likes: 1120,
    thumbnail: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&h=450&fit=crop",
    videoUrl: "/videos/south-temples.mp4",
    speaker: "Documentary Team",
    date: "2025-01-06",
    featured: false,
    trending: false
  },
  {
    id: 11,
    title: "Durga Saptashati - Divine Chanting",
    description: "Powerful chanting of Durga Saptashati with mesmerizing visuals.",
    category: "bhajan",
    duration: "11:45",
    views: 7800,
    likes: 450,
    thumbnail: "https://images.unsplash.com/photo-1519791883288-dc8bd696e667?w=800&h=450&fit=crop",
    videoUrl: "/videos/durga-saptashati.mp4",
    speaker: "Asha Bhosle",
    date: "2025-01-05",
    featured: false,
    trending: false
  },
  {
    id: 12,
    title: "Understanding Karma - Spiritual Discourse",
    description: "Deep dive into the concept of Karma and its role in our spiritual journey.",
    category: "discourse",
    duration: "16:30",
    views: 15600,
    likes: 890,
    thumbnail: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&h=450&fit=crop",
    videoUrl: "/videos/karma-discourse.mp4",
    speaker: "Swami Sivananda",
    date: "2025-01-04",
    featured: false,
    trending: false
  },
];

// Helper functions
export const getCategoryVideos = (categoryId) => {
  if (categoryId === 'all') return videos;
  return videos.filter(video => video.category === categoryId);
};

export const getFeaturedVideos = () => {
  return videos.filter(video => video.featured);
};

export const getTrendingVideos = () => {
  return videos.filter(video => video.trending);
};

// NEW: Get latest videos sorted by date
export const getLatestVideos = () => {
  return [...videos].sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const searchVideos = (query) => {
  const searchLower = query.toLowerCase();
  return videos.filter(video =>
    video.title.toLowerCase().includes(searchLower) ||
    video.speaker.toLowerCase().includes(searchLower) ||
    video.category.includes(searchLower)
  );
};

// Format views
export const formatViews = (views) => {
  if (views >= 1000000) {
    return (views / 1000000).toFixed(1) + 'M';
  } else if (views >= 1000) {
    return (views / 1000).toFixed(1) + 'K';
  }
  return views.toString();
};