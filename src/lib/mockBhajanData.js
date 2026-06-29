// lib/mockBhajanData.js
export const bhajanCategories = [
  { id: 'all', name: 'All', icon: '🕉️' },
  { id: 'krishna', name: 'Krishna', icon: '🪈' },
  { id: 'shiva', name: 'Shiva', icon: '🔱' },
  { id: 'hanuman', name: 'Hanuman', icon: '🙏' },
  { id: 'durga', name: 'Durga', icon: '⚔️' },
  { id: 'sai', name: 'Sai Baba', icon: '🕊️' },
  { id: 'jagannath', name: 'Jagannath', icon: '🛕' },
];

export const bhajans = [
  {
    id: 1,
    title: "Om Jai Jagdish Hare",
    artist: "Anup Jalota",
    category: "krishna",
    duration: "5:23",
    album: "Devotional Collection",
    year: 2020,
    plays: 24500,
    likes: 1230,
    coverArt: "/bhajans/om-jai-jagdish-hare.jpg",
    audioUrl: "/bhajans/om-jai-jagdish-hare.mp3",
    featured: true,
    description: "A beautiful bhajan praising Lord Vishnu and Krishna."
  },
  {
    id: 2,
    title: "Shiv Tandav Stotram",
    artist: "Ravindra Sathe",
    category: "shiva",
    duration: "7:45",
    album: "Shiva Mahima",
    year: 2019,
    plays: 18900,
    likes: 980,
    coverArt: "/bhajans/shiv-tandav.jpg",
    audioUrl: "/bhajans/shiv-tandav.mp3",
    featured: true,
    description: "Powerful stotram describing Lord Shiva's cosmic dance."
  },
  {
    id: 3,
    title: "Hanuman Chalisa",
    artist: "Gulshan Kumar",
    category: "hanuman",
    duration: "8:12",
    album: "Hanuman Bhajans",
    year: 2021,
    plays: 32000,
    likes: 2100,
    coverArt: "/bhajans/hanuman-chalisa.jpg",
    audioUrl: "/bhajans/hanuman-chalisa.mp3",
    featured: true,
    description: "The most powerful hymn dedicated to Lord Hanuman."
  },
  {
    id: 4,
    title: "Jai Ambe Maa",
    artist: "Lata Mangeshkar",
    category: "durga",
    duration: "6:18",
    album: "Maa Durga Bhajans",
    year: 2018,
    plays: 15600,
    likes: 850,
    coverArt: "/bhajans/jai-ambe-maa.jpg",
    audioUrl: "/bhajans/jai-ambe-maa.mp3",
    featured: false,
    description: "A soulful bhajan dedicated to Goddess Durga."
  },
  {
    id: 5,
    title: "Sai Sai Sai",
    artist: "Suresh Wadkar",
    category: "sai",
    duration: "4:56",
    album: "Sai Bhakti",
    year: 2020,
    plays: 23400,
    likes: 1430,
    coverArt: "/bhajans/sai-sai-sai.jpg",
    audioUrl: "/bhajans/sai-sai-sai.mp3",
    featured: true,
    description: "Devotional song praising Shirdi Sai Baba."
  },
  {
    id: 6,
    title: "Jagannath Ashtakam",
    artist: "M.S. Subbulakshmi",
    category: "jagannath",
    duration: "5:34",
    album: "Jagannath Bhajans",
    year: 2017,
    plays: 9800,
    likes: 620,
    coverArt: "/bhajans/jagannath-ashtakam.jpg",
    audioUrl: "/bhajans/jagannath-ashtakam.mp3",
    featured: false,
    description: "Ashtakam praising Lord Jagannath of Puri."
  },
  {
    id: 7,
    title: "Govind Bolo",
    artist: "Kishore Kumar",
    category: "krishna",
    duration: "5:12",
    album: "Hare Krishna",
    year: 2022,
    plays: 28700,
    likes: 1670,
    coverArt: "/bhajans/govind-bolo.jpg",
    audioUrl: "/bhajans/govind-bolo.mp3",
    featured: false,
    description: "Joyful bhajan calling out to Lord Krishna."
  },
  {
    id: 8,
    title: "Mahadeva Shambho",
    artist: "S.P. Balasubrahmanyam",
    category: "shiva",
    duration: "6:45",
    album: "Shiva Bhajans",
    year: 2019,
    plays: 21200,
    likes: 1560,
    coverArt: "/bhajans/mahadeva-shambho.jpg",
    audioUrl: "/bhajans/mahadeva-shambho.mp3",
    featured: true,
    description: "Beautiful bhajan invoking Lord Shiva."
  },
  {
    id: 9,
    title: "Bajrang Baan",
    artist: "Hari Om Sharan",
    category: "hanuman",
    duration: "9:30",
    album: "Hanuman Mahima",
    year: 2020,
    plays: 45600,
    likes: 3200,
    coverArt: "/bhajans/bajrang-baan.jpg",
    audioUrl: "/bhajans/bajrang-baan.mp3",
    featured: true,
    description: "Powerful hymn dedicated to Lord Hanuman."
  },
  {
    id: 10,
    title: "Devi Stuti",
    artist: "Asha Bhosle",
    category: "durga",
    duration: "7:28",
    album: "Navratri Bhajans",
    year: 2021,
    plays: 12300,
    likes: 780,
    coverArt: "/bhajans/devi-stuti.jpg",
    audioUrl: "/bhajans/devi-stuti.mp3",
    featured: false,
    description: "A beautiful stuti praising all forms of the Goddess."
  },
  {
    id: 11,
    title: "Sai Ram Saranam",
    artist: "Anuradha Paudwal",
    category: "sai",
    duration: "5:42",
    album: "Sai Namavali",
    year: 2022,
    plays: 18900,
    likes: 1120,
    coverArt: "/bhajans/sai-ram-saranam.jpg",
    audioUrl: "/bhajans/sai-ram-saranam.mp3",
    featured: false,
    description: "Melodious bhajan surrendering to Sai Baba."
  },
  {
    id: 12,
    title: "Jai Jagannath",
    artist: "Bhakti Band",
    category: "jagannath",
    duration: "4:38",
    album: "Jagannath Namavali",
    year: 2023,
    plays: 7800,
    likes: 450,
    coverArt: "/bhajans/jai-jagannath.jpg",
    audioUrl: "/bhajans/jai-jagannath.mp3",
    featured: false,
    description: "Modern bhajan dedicated to Lord Jagannath."
  },
];

// Helper functions
export const getCategoryBhajans = (categoryId) => {
  if (categoryId === 'all') return bhajans;
  return bhajans.filter(bhajan => bhajan.category === categoryId);
};

export const getFeaturedBhajans = () => {
  return bhajans.filter(bhajan => bhajan.featured);
};

export const getPopularBhajans = () => {
  return [...bhajans].sort((a, b) => b.plays - a.plays).slice(0, 6);
};

export const searchBhajans = (query) => {
  const searchLower = query.toLowerCase();
  return bhajans.filter(bhajan =>
    bhajan.title.toLowerCase().includes(searchLower) ||
    bhajan.artist.toLowerCase().includes(searchLower) ||
    bhajan.category.includes(searchLower)
  );
};