// lib/mockTempleData.js
export const templeCategories = [
  { id: 'all', name: 'All Temples', icon: '🛕' },
  { id: 'north', name: 'North India', icon: '🏔️' },
  { id: 'south', name: 'South India', icon: '🌴' },
  { id: 'east', name: 'East India', icon: '🌊' },
  { id: 'west', name: 'West India', icon: '🏜️' },
];

export const temples = [
  {
    id: 1,
    name: "Kashi Vishwanath Temple",
    location: "Varanasi, Uttar Pradesh",
    deity: "Lord Shiva",
    description: "One of the most sacred temples dedicated to Lord Shiva, located on the banks of the Ganges.",
    significance: "One of the 12 Jyotirlingas, spiritual capital of India",
    architecture: "North Indian style with golden spire",
    image: "https://images.unsplash.com/photo-1542596594-649ed1b798cd?w=800&h=600&fit=crop",
    category: "north",
    state: "Uttar Pradesh",
    established: "Ancient - 3500+ years",
    timings: "4:00 AM - 11:00 PM",
    festivals: ["Maha Shivaratri", "Dev Deepawali"],
    featured: true,
    liveDarshan: true,
    rating: 4.9,
    visitors: "Millions annually"
  },
  {
    id: 2,
    name: "Tirupati Balaji Temple",
    location: "Tirupati, Andhra Pradesh",
    deity: "Lord Venkateswara",
    description: "The richest temple in the world, dedicated to Lord Venkateswara, an incarnation of Vishnu.",
    significance: "Most visited pilgrimage site in India",
    architecture: "Dravidian style with golden dome",
    image: "https://images.unsplash.com/photo-1584952600448-4121966c30f0?w=800&h=600&fit=crop",
    category: "south",
    state: "Andhra Pradesh",
    established: "Ancient - 2000+ years",
    timings: "5:00 AM - 10:00 PM",
    festivals: ["Brahmotsavam", "Vaikunta Ekadasi"],
    featured: true,
    liveDarshan: true,
    rating: 4.8,
    visitors: "100,000+ daily"
  },
  {
    id: 3,
    name: "Golden Temple - Harmandir Sahib",
    location: "Amritsar, Punjab",
    deity: "Guru Granth Sahib",
    description: "The most sacred Sikh shrine, known for its stunning golden architecture and sarovar.",
    significance: "Spiritual center of Sikhism",
    architecture: "Sikh architecture with gold plating",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&h=600&fit=crop",
    category: "north",
    state: "Punjab",
    established: "1577 AD",
    timings: "5:00 AM - 10:00 PM",
    festivals: ["Guru Nanak Jayanti", "Vaisakhi"],
    featured: true,
    liveDarshan: true,
    rating: 4.9,
    visitors: "100,000+ daily"
  },
  {
    id: 4,
    name: "Rameshwaram Temple",
    location: "Rameshwaram, Tamil Nadu",
    deity: "Lord Shiva",
    description: "Famous for its long corridors and connection to the Ramayana, one of the Char Dham.",
    significance: "One of the 12 Jyotirlingas",
    architecture: "Dravidian style with long corridors",
    image: "https://images.unsplash.com/photo-1519791883288-dc8bd696e667?w=800&h=600&fit=crop",
    category: "south",
    state: "Tamil Nadu",
    established: "Ancient - 3000+ years",
    timings: "5:00 AM - 9:00 PM",
    festivals: ["Shivaratri", "Ram Navami"],
    featured: false,
    liveDarshan: false,
    rating: 4.7,
    visitors: "50,000+ daily"
  },
  {
    id: 5,
    name: "Jagannath Temple",
    location: "Puri, Odisha",
    deity: "Lord Jagannath",
    description: "Famous for the Rath Yatra festival, one of the Char Dham pilgrimage sites.",
    significance: "One of the Char Dham",
    architecture: "Kalinga style",
    image: "https://images.unsplash.com/photo-1584952600448-4121966c30f0?w=800&h=600&fit=crop",
    category: "east",
    state: "Odisha",
    established: "12th Century",
    timings: "5:00 AM - 11:00 PM",
    festivals: ["Rath Yatra", "Snana Yatra"],
    featured: true,
    liveDarshan: false,
    rating: 4.8,
    visitors: "1,000,000+ during festival"
  },
  {
    id: 6,
    name: "Somnath Temple",
    location: "Gujarat",
    deity: "Lord Shiva",
    description: "First among the 12 Jyotirlingas, a symbol of resilience and devotion.",
    significance: "First Jyotirlinga",
    architecture: "Chalukya style",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop",
    category: "west",
    state: "Gujarat",
    established: "Ancient - 3500+ years",
    timings: "6:00 AM - 9:00 PM",
    festivals: ["Maha Shivaratri", "Somvati Amavasya"],
    featured: false,
    liveDarshan: true,
    rating: 4.6,
    visitors: "2,000,000+ annually"
  },
  {
    id: 7,
    name: "Vaishno Devi Temple",
    location: "Jammu, Jammu & Kashmir",
    deity: "Maa Vaishno Devi",
    description: "One of the most visited cave temples dedicated to Goddess Vaishno Devi.",
    significance: "One of the 108 Shakti Peethas",
    architecture: "Cave temple",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&h=600&fit=crop",
    category: "north",
    state: "Jammu & Kashmir",
    established: "Ancient",
    timings: "24 hours",
    festivals: ["Navratri"],
    featured: false,
    liveDarshan: false,
    rating: 4.9,
    visitors: "5,000,000+ annually"
  },
  {
    id: 8,
    name: "Kamakhya Temple",
    location: "Guwahati, Assam",
    deity: "Maa Kamakhya",
    description: "One of the most sacred Shakti Peethas, located atop Nilachal Hill.",
    significance: "One of the 51 Shakti Peethas",
    architecture: "Nagara and Saracenic",
    image: "https://images.unsplash.com/photo-1519791883288-dc8bd696e667?w=800&h=600&fit=crop",
    category: "east",
    state: "Assam",
    established: "Ancient - 3000+ years",
    timings: "8:00 AM - 8:00 PM",
    festivals: ["Ambubachi Mela", "Durga Puja"],
    featured: false,
    liveDarshan: false,
    rating: 4.7,
    visitors: "500,000+ annually"
  },
  {
    id: 9,
    name: "Meenakshi Temple",
    location: "Madurai, Tamil Nadu",
    deity: "Maa Meenakshi",
    description: "Known for its stunning architecture and 14 colorful gopurams.",
    significance: "One of the most vibrant temple complexes",
    architecture: "Dravidian style",
    image: "https://images.unsplash.com/photo-1542596594-649ed1b798cd?w=800&h=600&fit=crop",
    category: "south",
    state: "Tamil Nadu",
    established: "1st Century AD",
    timings: "5:00 AM - 10:00 PM",
    festivals: ["Meenakshi Thirukalyanam", "Chithirai Festival"],
    featured: false,
    liveDarshan: true,
    rating: 4.8,
    visitors: "3,000,000+ annually"
  },
  {
    id: 10,
    name: "Dwarkadhish Temple",
    location: "Dwarka, Gujarat",
    deity: "Lord Krishna",
    description: "Believed to be the kingdom of Lord Krishna, one of the Char Dham.",
    significance: "One of the Char Dham",
    architecture: "Maya style",
    image: "https://images.unsplash.com/photo-1584952600448-4121966c30f0?w=800&h=600&fit=crop",
    category: "west",
    state: "Gujarat",
    established: "2500+ years",
    timings: "6:00 AM - 9:00 PM",
    festivals: ["Janmashtami", "Krishna Janmashtami"],
    featured: false,
    liveDarshan: true,
    rating: 4.7,
    visitors: "1,000,000+ annually"
  },
  {
    id: 11,
    name: "Kedarnath Temple",
    location: "Kedarnath, Uttarakhand",
    deity: "Lord Shiva",
    description: "One of the most sacred Himalayan shrines, part of the Panch Kedar.",
    significance: "One of the 12 Jyotirlingas",
    architecture: "Himalayan stone architecture",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop",
    category: "north",
    state: "Uttarakhand",
    established: "Ancient - 3000+ years",
    timings: "4:00 AM - 9:00 PM",
    festivals: ["Maha Shivaratri", "Kedarnath Utsav"],
    featured: false,
    liveDarshan: false,
    rating: 4.9,
    visitors: "500,000+ annually"
  },
  {
    id: 12,
    name: "Guruvayur Temple",
    location: "Guruvayur, Kerala",
    deity: "Lord Krishna",
    description: "Known as the 'Dwarka of the South', dedicated to Lord Krishna.",
    significance: "One of the most important Krishna temples",
    architecture: "Kerala style",
    image: "https://images.unsplash.com/photo-1519791883288-dc8bd696e667?w=800&h=600&fit=crop",
    category: "south",
    state: "Kerala",
    established: "1600+ years",
    timings: "3:00 AM - 10:00 PM",
    festivals: ["Guruvayur Ekadasi", "Vishu"],
    featured: false,
    liveDarshan: true,
    rating: 4.8,
    visitors: "2,000,000+ annually"
  },
];

// Helper functions
export const getCategoryTemples = (categoryId) => {
  if (categoryId === 'all') return temples;
  return temples.filter(temple => temple.category === categoryId);
};

export const getFeaturedTemples = () => {
  return temples.filter(temple => temple.featured);
};

export const getTempleById = (id) => {
  return temples.find(temple => temple.id === id);
};

export const searchTemples = (query) => {
  const searchLower = query.toLowerCase();
  return temples.filter(temple =>
    temple.name.toLowerCase().includes(searchLower) ||
    temple.location.toLowerCase().includes(searchLower) ||
    temple.deity.toLowerCase().includes(searchLower) ||
    temple.significance.toLowerCase().includes(searchLower)
  );
};

export const getLiveDarshanTemples = () => {
  return temples.filter(temple => temple.liveDarshan);
};