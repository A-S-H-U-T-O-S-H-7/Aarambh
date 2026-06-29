// lib/mockFestivalData.js
export const festivals = [
  {
    id: 1,
    name: "Maha Shivaratri",
    nameHindi: "महाशिवरात्रि",
    date: "2025-02-26",
    description: "The great night of Shiva - a festival of meditation, fasting, and devotion to Lord Shiva.",
    category: "Major Festival",
    significance: "Celebrates the wedding of Shiva and Parvati",
    traditions: ["Fasting", "Night-long prayer", "Om Namah Shivaya chanting"],
    colors: ["#FF6B35", "#FFD700", "#8B0000"],
    image: "https://images.unsplash.com/photo-1542596594-649ed1b798cd?w=800&h=600&fit=crop",
    imageAlt: "Maha Shivaratri celebration",
    featured: true,
    emoji: "🔱",
    deity: "Lord Shiva",
    region: "All India"
  },
  {
    id: 2,
    name: "Holi",
    nameHindi: "होली",
    date: "2025-03-14",
    description: "The festival of colors celebrating the arrival of spring and the victory of good over evil.",
    category: "Major Festival",
    significance: "Celebrates the victory of Prahlad and the arrival of spring",
    traditions: ["Playing with colors", "Bonfires", "Festive sweets"],
    colors: ["#FF1493", "#FF6B00", "#7CFC00", "#FFD700"],
    image: "https://images.unsplash.com/photo-1545243424-0ce743321e11?w=800&h=600&fit=crop",
    imageAlt: "Holi celebration with colors",
    featured: true,
    emoji: "🌈",
    deity: "Lord Krishna",
    region: "All India"
  },
  {
    id: 3,
    name: "Ram Navami",
    nameHindi: "राम नवमी",
    date: "2025-04-06",
    description: "Birth anniversary of Lord Rama, celebrating his virtues of truth, righteousness, and devotion.",
    category: "Major Festival",
    significance: "Birth of Lord Rama, the seventh avatar of Vishnu",
    traditions: ["Rama Katha recitation", "Processions", "Feasting"],
    colors: ["#4CAF50", "#FFD700", "#8B4513"],
    image: "https://images.unsplash.com/photo-1584952600448-4121966c30f0?w=800&h=600&fit=crop",
    imageAlt: "Ram Navami celebration",
    featured: false,
    emoji: "🏹",
    deity: "Lord Rama",
    region: "All India"
  },
  {
    id: 4,
    name: "Ganesh Chaturthi",
    nameHindi: "गणेश चतुर्थी",
    date: "2025-08-27",
    description: "Celebrates the birth of Lord Ganesha with grand celebrations, idol installations, and community gatherings.",
    category: "Major Festival",
    significance: "Birth of Lord Ganesha, the remover of obstacles",
    traditions: ["Idol installation", "Puja", "Modak offerings"],
    colors: ["#FF6B00", "#FFD700", "#8B0000"],
    image: "https://images.unsplash.com/photo-1570594715149-3f2fc6b68e2b?w=800&h=600&fit=crop",
    imageAlt: "Ganesh Chaturthi idol",
    featured: true,
    emoji: "🐘",
    deity: "Lord Ganesha",
    region: "Maharashtra, All India"
  },
  {
    id: 5,
    name: "Durga Puja",
    nameHindi: "दुर्गा पूजा",
    date: "2025-10-01",
    description: "The grand celebration of Goddess Durga's victory over the demon Mahishasura.",
    category: "Major Festival",
    significance: "Victory of good over evil",
    traditions: ["Pandal hopping", "Durga idol installation", "Cultural programs"],
    colors: ["#FF1493", "#FFD700", "#FF6B00"],
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&h=600&fit=crop",
    imageAlt: "Durga Puja celebration",
    featured: true,
    emoji: "⚔️",
    deity: "Goddess Durga",
    region: "West Bengal, All India"
  },
  {
    id: 6,
    name: "Diwali",
    nameHindi: "दीपावली",
    date: "2025-10-20",
    description: "The festival of lights celebrating the return of Lord Rama to Ayodhya after 14 years of exile.",
    category: "Major Festival",
    significance: "Return of Lord Rama to Ayodhya",
    traditions: ["Diya lighting", "Rangoli", "Fireworks", "Gift exchange"],
    colors: ["#FF6B00", "#FFD700", "#FF1493", "#00FF00"],
    image: "https://images.unsplash.com/photo-1532529867795-5a4c6bcc6ba2?w=800&h=600&fit=crop",
    imageAlt: "Diwali celebration with diyas",
    featured: true,
    emoji: "🪔",
    deity: "Lord Rama, Lakshmi",
    region: "All India"
  },
  {
    id: 7,
    name: "Janmashtami",
    nameHindi: "जन्माष्टमी",
    date: "2025-08-16",
    description: "Celebrates the birth of Lord Krishna with joyous festivities, dances, and midnight celebrations.",
    category: "Major Festival",
    significance: "Birth of Lord Krishna, the eighth avatar of Vishnu",
    traditions: ["Midnight prayers", "Dahi Handi", "Bhajan singing"],
    colors: ["#0000FF", "#FFD700", "#00FF00"],
    image: "https://images.unsplash.com/photo-1584952600448-4121966c30f0?w=800&h=600&fit=crop",
    imageAlt: "Janmashtami celebration",
    featured: false,
    emoji: "🪈",
    deity: "Lord Krishna",
    region: "All India"
  },
  {
    id: 8,
    name: "Makar Sankranti",
    nameHindi: "मकर संक्रांति",
    date: "2025-01-14",
    description: "Harvest festival celebrating the transition of the sun into Makara (Capricorn) zodiac sign.",
    category: "Harvest Festival",
    significance: "Transition of sun into Makara",
    traditions: ["Kite flying", "Feasting", "Bonfires"],
    colors: ["#FF6B00", "#FFD700", "#FF1493"],
    image: "https://images.unsplash.com/photo-1544818410-b0ad3b72d61b?w=800&h=600&fit=crop",
    imageAlt: "Makar Sankranti kite flying",
    featured: false,
    emoji: "🪁",
    deity: "Sun God",
    region: "All India"
  },
  {
    id: 9,
    name: "Pongal",
    nameHindi: "पोंगल",
    date: "2025-01-15",
    description: "The harvest festival of Tamil Nadu, celebrating the abundance of crops with gratitude to nature.",
    category: "Harvest Festival",
    significance: "Thanksgiving for harvest",
    traditions: ["Pongal dish preparation", "Kolam drawing", "Cattle worship"],
    colors: ["#FF6B00", "#FFD700", "#4CAF50"],
    image: "https://images.unsplash.com/photo-1584952600448-4121966c30f0?w=800&h=600&fit=crop",
    imageAlt: "Pongal celebration",
    featured: false,
    emoji: "🌾",
    deity: "Surya (Sun God)",
    region: "Tamil Nadu"
  },
  {
    id: 10,
    name: "Kumbh Mela",
    nameHindi: "कुंभ मेला",
    date: "2025-03-15",
    description: "The largest peaceful gathering in the world, where millions come to take a dip in the holy rivers.",
    category: "Pilgrimage",
    significance: "Maha Kumbh - spiritual purification",
    traditions: ["Holy dip", "Spiritual discourses", "Satsang"],
    colors: ["#FF6B00", "#FFD700", "#8B0000"],
    image: "https://images.unsplash.com/photo-1584952600448-4121966c30f0?w=800&h=600&fit=crop",
    imageAlt: "Kumbh Mela gathering",
    featured: false,
    emoji: "🕉️",
    deity: "Various",
    region: "Uttarakhand, Ujjain, Nashik, Prayag"
  },
];

// Get featured festivals
export const getFeaturedFestivals = () => {
  return festivals.filter(f => f.featured);
};

// Get upcoming festivals (sorted by date)
export const getUpcomingFestivals = () => {
  const today = new Date();
  return festivals
    .filter(f => new Date(f.date) >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
};

// Calculate days until festival
export const getDaysUntil = (date) => {
  const today = new Date();
  const festivalDate = new Date(date);
  const diffTime = festivalDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};