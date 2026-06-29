// lib/astro/vedicApi.js
const API_KEY = process.env.NEXT_PUBLIC_VEDIC_ASTRO_API_KEY;
const BASE_URL = 'https://api.vedicastroapi.com/v3-json/prediction';
const PANCHANG_BASE_URL = 'https://api.vedicastroapi.com/v3-json/panchang';

// Zodiac mappings
export const zodiacNumbers = {
  aries: 1,
  taurus: 2,
  gemini: 3,
  cancer: 4,
  leo: 5,
  virgo: 6,
  libra: 7,
  scorpio: 8,
  sagittarius: 9,
  capricorn: 10,
  aquarius: 11,
  pisces: 12,
};

// Nakshatra mappings
export const nakshatraList = [
  { id: 1, name: 'Ashwini' },
  { id: 2, name: 'Bharani' },
  { id: 3, name: 'Krittika' },
  { id: 4, name: 'Rohini' },
  { id: 5, name: 'Mrigashira' },
  { id: 6, name: 'Ardra' },
  { id: 7, name: 'Punarvasu' },
  { id: 8, name: 'Pushya' },
  { id: 9, name: 'Ashlesha' },
  { id: 10, name: 'Magha' },
  { id: 11, name: 'Purvaphalguni' },
  { id: 12, name: 'Uttaraphalguni' },
  { id: 13, name: 'Hasta' },
  { id: 14, name: 'Chitra' },
  { id: 15, name: 'Swati' },
  { id: 16, name: 'Vishakha' },
  { id: 17, name: 'Anuradha' },
  { id: 18, name: 'Jyeshtha' },
  { id: 19, name: 'Mula' },
  { id: 20, name: 'Purvashadha' },
  { id: 21, name: 'Uttarashadha' },
  { id: 22, name: 'Sravana' },
  { id: 23, name: 'Dhanista' },
  { id: 24, name: 'Shatabhisha' },
  { id: 25, name: 'Purvabhadra' },
  { id: 26, name: 'Uttarabhadra' },
  { id: 27, name: 'Revati' },
];

// Supported languages
export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
  { code: 'te', label: 'తెలుగు', flag: '🇮🇳' },
];

// Default locations
export const LOCATIONS = {
  delhi: { lat: '28.6139', lon: '77.2090', tz: 5.5 },
  varanasi: { lat: '25.3176', lon: '82.9739', tz: 5.5 },
  ayodhya: { lat: '26.7900', lon: '82.2020', tz: 5.5 },
  mathura: { lat: '27.4924', lon: '77.6737', tz: 5.5 },
  haridwar: { lat: '29.9457', lon: '78.1642', tz: 5.5 },
};

// Helper: Format date to DD/MM/YYYY
const formatApiDate = (dateValue) => {
  const date = dateValue ? new Date(`${dateValue}T00:00:00`) : new Date();
  if (isNaN(date.getTime())) return formatApiDate();
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Helper: Clean API key
const cleanEnv = (value) => {
  if (!value) return value;
  return String(value)
    .trim()
    .replace(/,+$/g, '')
    .trim()
    .replace(/^['"`]+|['"`]+$/g, '')
    .trim();
};

const cleanApiKey = cleanEnv(API_KEY);

// ==================== FALLBACK DATA ====================

const fallbackPredictions = {
  aries: 'Today brings new opportunities for growth and leadership. Your energy is high, making it perfect for tackling challenging tasks.',
  taurus: 'Focus on stability and practical matters today. Financial decisions made now can benefit you in the long run.',
  gemini: 'Communication flows easily today. Express your ideas freely and connect with others for creative collaboration.',
  cancer: 'Emotional connections deepen today. Family matters take priority and bring you joy and satisfaction.',
  leo: 'Your natural charisma shines bright today. Step into the spotlight and share your gifts with the world.',
  virgo: 'Details matter today. Your analytical skills are sharp, making this a good day for problem solving.',
  libra: 'Balance is key today. Focus on harmony in relationships and beauty in your surroundings.',
  scorpio: 'Deep insights come to you today. Trust your intuition and embrace meaningful transformation.',
  sagittarius: 'Adventure calls today. Explore new ideas, places, or perspectives that expand your horizons.',
  capricorn: 'Hard work pays off today. Your discipline and determination can lead to recognition.',
  aquarius: 'Innovative ideas flow freely today. Think practically while keeping your original perspective.',
  pisces: 'Your creativity and compassion are heightened today. Helping others brings fulfillment.',
};

const defaultColors = {
  aries: 'Red',
  taurus: 'Green',
  gemini: 'Yellow',
  cancer: 'White',
  leo: 'Orange',
  virgo: 'Brown',
  libra: 'Blue',
  scorpio: 'Dark Red',
  sagittarius: 'Purple',
  capricorn: 'Black',
  aquarius: 'Silver',
  pisces: 'Pink',
};

// ==================== HOROSCOPE APIs ====================

// Fetch daily horoscope (Sun or Moon)
export const fetchDailyHoroscope = async (sign, lang = 'en', date = null, type = 'moon') => {
  try {
    const zodiac = zodiacNumbers[sign];
    if (!zodiac) {
      console.error(`Invalid sign: ${sign}`);
      return getMockHoroscope(sign);
    }

    if (!cleanApiKey) {
      console.warn('VEDIC_ASTRO_API_KEY is not configured; using fallback horoscope.');
      return getMockHoroscope(sign);
    }

    const params = new URLSearchParams({
      api_key: cleanApiKey,
      date: formatApiDate(date),
      zodiac: String(zodiac),
      split: 'true',
      type: 'big',
      lang: lang || 'en',
    });

    const endpoint = `${BASE_URL}/daily-${type}?${params.toString()}`;

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error(`Horoscope API error for ${sign}:`, response.status);
      return getMockHoroscope(sign);
    }

    const data = await response.json();
    if (!data || (data.status && Number(data.status) >= 400)) {
      console.error(`Horoscope API invalid response for ${sign}:`, data);
      return getMockHoroscope(sign);
    }

    return parseHoroscopeResponse(data, sign, type);
  } catch (error) {
    console.error(`fetchHoroscope error for ${sign}:`, error.message);
    return getMockHoroscope(sign);
  }
};

// Fetch all horoscopes for all zodiac signs
export const fetchAllHoroscopes = async (lang = 'en', date = null, type = 'moon') => {
  const signs = Object.keys(zodiacNumbers);
  const results = {};
  let successCount = 0;

  for (const sign of signs) {
    try {
      const data = await fetchDailyHoroscope(sign, lang, date, type);
      results[sign] = data;
      if (data && data.prediction) successCount++;
    } catch (error) {
      console.error(`Failed to fetch ${sign}:`, error);
      results[sign] = getMockHoroscope(sign);
    }
  }

  console.log(`✅ Fetched ${successCount}/${signs.length} horoscopes`);
  return results;
};

// Parse horoscope response
const parseHoroscopeResponse = (data, sign, type) => {
  const response = data?.response || data?.data || data?.result || data;
  const botResponse = response?.bot_response || {};

  // Extract prediction from bot_response
  let prediction = '';
  const preferredSections = ['total_score', 'status', 'finances', 'relationship', 'career', 'health'];
  for (const key of preferredSections) {
    if (botResponse[key]?.split_response) {
      prediction += botResponse[key].split_response + ' ';
    }
  }
  prediction = prediction.trim() || response?.prediction || fallbackPredictions[sign];

  return {
    prediction: prediction,
    luckyColor: response?.lucky_color || response?.luckyColor || defaultColors[sign],
    luckyColorCode: response?.lucky_color_code || '',
    luckyNumber: Array.isArray(response?.lucky_number) 
      ? response.lucky_number.join(', ') 
      : response?.lucky_number || String(Math.floor(Math.random() * 9) + 1),
    luckyTime: response?.lucky_time || '',
    mood: response?.mood || `${type === 'moon' ? 'Reflective' : 'Focused'} & Positive`,
    compatibility: response?.compatibility || '',
    zodiac: response?.zodiac || sign,
    source: 'vedicastro',
    sourceType: type,
  };
};

// Mock horoscope data
const getMockHoroscope = (sign) => ({
  prediction: fallbackPredictions[sign] || 'Today brings positive energy your way. Stay focused on your goals.',
  luckyColor: defaultColors[sign] || 'Red',
  luckyNumber: String(Math.floor(Math.random() * 9) + 1),
  luckyTime: 'Morning hours',
  mood: 'Optimistic',
  compatibility: '',
  source: 'fallback',
});

// ==================== PANCHANG APIs ====================

// Fetch festivals
export const fetchFestivals = async (date = null, lat = '28.6139', lon = '77.2090', tz = 5.5, lang = 'en') => {
  try {
    if (!cleanApiKey) {
      console.warn('API key not configured; using fallback festivals.');
      return { festivals: [], yogas: [] };
    }

    const params = new URLSearchParams({
      api_key: cleanApiKey,
      date: formatApiDate(date),
      tz: String(tz),
      lat: String(lat),
      lon: String(lon),
      lang: lang || 'en',
    });

    const endpoint = `${PANCHANG_BASE_URL}/festivals?${params.toString()}`;

    const response = await fetch(endpoint, { cache: 'no-store' });
    if (!response.ok) {
      console.error('Festivals API error:', response.status);
      return { festivals: [], yogas: [] };
    }

    const data = await response.json();
    if (data.status === 200 && data.response) {
      return {
        festivals: data.response.festival_list || [],
        yogas: data.response.yogas || [],
      };
    }
    return { festivals: [], yogas: [] };
  } catch (error) {
    console.error('fetchFestivals error:', error.message);
    return { festivals: [], yogas: [] };
  }
};

// Fetch sunrise
export const fetchSunrise = async (date = null, lat = '28.6139', lon = '77.2090', tz = 5.5, time = '06:00', lang = 'en') => {
  try {
    if (!cleanApiKey) {
      console.warn('API key not configured; using fallback sunrise.');
      return { sunrise: '6:30 AM', bot_response: 'Sun rises at 6:30 AM' };
    }

    const params = new URLSearchParams({
      api_key: cleanApiKey,
      date: formatApiDate(date),
      tz: String(tz),
      lat: String(lat),
      lon: String(lon),
      time: time,
      lang: lang || 'en',
    });

    const endpoint = `${PANCHANG_BASE_URL}/sunrise?${params.toString()}`;
    const response = await fetch(endpoint, { cache: 'no-store' });
    if (!response.ok) return { sunrise: '6:30 AM', bot_response: 'Sun rises at 6:30 AM' };

    const data = await response.json();
    if (data.status === 200 && data.response) {
      return {
        sunrise: data.response.sun_rise || '6:30 AM',
        bot_response: data.response.bot_response || '',
      };
    }
    return { sunrise: '6:30 AM', bot_response: 'Sun rises at 6:30 AM' };
  } catch (error) {
    console.error('fetchSunrise error:', error.message);
    return { sunrise: '6:30 AM', bot_response: 'Sun rises at 6:30 AM' };
  }
};

// Fetch sunset
export const fetchSunset = async (date = null, lat = '28.6139', lon = '77.2090', tz = 5.5, time = '18:00', lang = 'en') => {
  try {
    if (!cleanApiKey) {
      return { sunset: '6:45 PM', bot_response: 'Sun sets at 6:45 PM' };
    }

    const params = new URLSearchParams({
      api_key: cleanApiKey,
      date: formatApiDate(date),
      tz: String(tz),
      lat: String(lat),
      lon: String(lon),
      time: time,
      lang: lang || 'en',
    });

    const endpoint = `${PANCHANG_BASE_URL}/sunset?${params.toString()}`;
    const response = await fetch(endpoint, { cache: 'no-store' });
    if (!response.ok) return { sunset: '6:45 PM', bot_response: 'Sun sets at 6:45 PM' };

    const data = await response.json();
    if (data.status === 200 && data.response) {
      return {
        sunset: data.response.sun_set || '6:45 PM',
        bot_response: data.response.bot_response || '',
      };
    }
    return { sunset: '6:45 PM', bot_response: 'Sun sets at 6:45 PM' };
  } catch (error) {
    console.error('fetchSunset error:', error.message);
    return { sunset: '6:45 PM', bot_response: 'Sun sets at 6:45 PM' };
  }
};

// Fetch Choghadiya Muhurta
export const fetchChoghadiya = async (date = null, lat = '28.6139', lon = '77.2090', tz = 5.5, time = '06:00', lang = 'en') => {
  try {
    if (!cleanApiKey) {
      return getMockChoghadiya();
    }

    const params = new URLSearchParams({
      api_key: cleanApiKey,
      date: formatApiDate(date),
      tz: String(tz),
      lat: String(lat),
      lon: String(lon),
      time: time,
      lang: lang || 'en',
    });

    const endpoint = `${PANCHANG_BASE_URL}/choghadiya-muhurta?${params.toString()}`;
    const response = await fetch(endpoint, { cache: 'no-store' });
    if (!response.ok) return getMockChoghadiya();

    const data = await response.json();
    if (data.status === 200 && data.response) {
      return {
        day: data.response.day || [],
        night: data.response.night || [],
        dayOfWeek: data.response.day_of_week || '',
      };
    }
    return getMockChoghadiya();
  } catch (error) {
    console.error('fetchChoghadiya error:', error.message);
    return getMockChoghadiya();
  }
};

const getMockChoghadiya = () => ({
  day: [
    { start: '6:30 AM', end: '8:00 AM', muhurat: 'Chal', type: 'Good' },
    { start: '8:00 AM', end: '9:30 AM', muhurat: 'Labh', type: 'Auspicious' },
    { start: '9:30 AM', end: '11:00 AM', muhurat: 'Amrit', type: 'Auspicious' },
    { start: '11:00 AM', end: '12:30 PM', muhurat: 'Kaal', type: 'Inauspicious' },
    { start: '12:30 PM', end: '2:00 PM', muhurat: 'Shubh', type: 'Auspicious' },
    { start: '2:00 PM', end: '3:30 PM', muhurat: 'Rog', type: 'Inauspicious' },
    { start: '3:30 PM', end: '5:00 PM', muhurat: 'Udveg', type: 'Inauspicious' },
    { start: '5:00 PM', end: '6:30 PM', muhurat: 'Chal', type: 'Good' },
  ],
  night: [],
  dayOfWeek: 'Monday',
});

// Fetch Hora Muhurta
export const fetchHoraMuhurta = async (date = null, lat = '28.6139', lon = '77.2090', tz = 5.5, time = '06:00', lang = 'en') => {
  try {
    if (!cleanApiKey) {
      return { horas: [], dayOfWeek: '' };
    }

    const params = new URLSearchParams({
      api_key: cleanApiKey,
      date: formatApiDate(date),
      tz: String(tz),
      lat: String(lat),
      lon: String(lon),
      time: time,
      lang: lang || 'en',
    });

    const endpoint = `${PANCHANG_BASE_URL}/hora-muhurta?${params.toString()}`;
    const response = await fetch(endpoint, { cache: 'no-store' });
    if (!response.ok) return { horas: [], dayOfWeek: '' };

    const data = await response.json();
    if (data.status === 200 && data.response) {
      return {
        horas: data.response.horas || [],
        dayOfWeek: data.response.day_of_week || '',
      };
    }
    return { horas: [], dayOfWeek: '' };
  } catch (error) {
    console.error('fetchHoraMuhurta error:', error.message);
    return { horas: [], dayOfWeek: '' };
  }
};

// ==================== NAKSHATRA API ====================

// Fetch daily nakshatra
export const fetchNakshatra = async (nakshatraId, lang = 'en', date = null) => {
  try {
    if (!cleanApiKey) {
      return getMockNakshatra(nakshatraId);
    }

    const params = new URLSearchParams({
      api_key: cleanApiKey,
      date: formatApiDate(date),
      nakshatra: String(nakshatraId),
      lang: lang || 'en',
    });

    const endpoint = `${BASE_URL}/daily-nakshatra?${params.toString()}`;
    const response = await fetch(endpoint, { cache: 'no-store' });
    if (!response.ok) return getMockNakshatra(nakshatraId);

    const data = await response.json();
    if (data.status === 200 && data.response) {
      return parseNakshatraResponse(data);
    }
    return getMockNakshatra(nakshatraId);
  } catch (error) {
    console.error('fetchNakshatra error:', error.message);
    return getMockNakshatra(nakshatraId);
  }
};

const parseNakshatraResponse = (data) => {
  const response = data.response || {};
  const botResponse = response.bot_response || {};

  let prediction = '';
  const sections = ['total_score', 'status', 'finances', 'relationship', 'career', 'health'];
  for (const key of sections) {
    if (botResponse[key]?.split_response) {
      prediction += botResponse[key].split_response + ' ';
    }
  }

  return {
    prediction: prediction.trim() || response.prediction || '',
    luckyColor: response.lucky_color || '',
    luckyColorCode: response.lucky_color_code || '',
    luckyNumber: Array.isArray(response.lucky_number) 
      ? response.lucky_number.join(', ') 
      : response.lucky_number || '',
    nakshatra: response.nakshatra || '',
    source: 'vedicastro',
  };
};

const getMockNakshatra = (id) => {
  const nakshatra = nakshatraList.find(n => n.id === id);
  return {
    prediction: `Today brings positive energy for ${nakshatra?.name || 'this nakshatra'}. Stay focused on your goals and trust your intuition.`,
    luckyColor: 'Red',
    luckyNumber: '7',
    nakshatra: nakshatra?.name || '',
    source: 'fallback',
  };
};

// ==================== UTILITY FUNCTIONS ====================

// Get all panchang data in one call
export const fetchAllPanchangData = async (date = null, location = 'delhi', lang = 'en') => {
  const loc = LOCATIONS[location] || LOCATIONS.delhi;
  
  try {
    const [festivals, sunrise, sunset, choghadiya, hora] = await Promise.all([
      fetchFestivals(date, loc.lat, loc.lon, loc.tz, lang),
      fetchSunrise(date, loc.lat, loc.lon, loc.tz, '06:00', lang),
      fetchSunset(date, loc.lat, loc.lon, loc.tz, '18:00', lang),
      fetchChoghadiya(date, loc.lat, loc.lon, loc.tz, '06:00', lang),
      fetchHoraMuhurta(date, loc.lat, loc.lon, loc.tz, '06:00', lang),
    ]);

    return {
      success: true,
      festivals: festivals.festivals || [],
      yogas: festivals.yogas || [],
      sunrise: sunrise.sunrise || '6:30 AM',
      sunset: sunset.sunset || '6:45 PM',
      choghadiya: choghadiya,
      hora: hora,
    };
  } catch (error) {
    console.error('fetchAllPanchangData error:', error);
    return {
      success: false,
      festivals: [],
      yogas: [],
      sunrise: '6:30 AM',
      sunset: '6:45 PM',
      choghadiya: { day: [], night: [] },
      hora: { horas: [] },
    };
  }
};