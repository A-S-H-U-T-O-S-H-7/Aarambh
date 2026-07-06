/**
 * Generate a natural, immersive storytelling script for temple voiceover
 * Supports both Hindi and English content with emotional and engaging language
 */

export function generateTempleScript(templeData) {
  const {
    title,
    location,
    deity,
    established,
    shortDescription,
    fullDescription,
    significance,
    festivals,
  } = templeData;

  // ─── Safe clean text function ───
  const cleanText = (text) => {
    if (!text) return '';
    // If it's an array, join it
    if (Array.isArray(text)) {
      return text.filter(Boolean).join(', ').replace(/<[^>]*>/g, '').trim();
    }
    // If it's a string, clean it
    if (typeof text === 'string') {
      return text.replace(/<[^>]*>/g, '').trim();
    }
    // If it's anything else, return empty string
    return '';
  };

  // ─── Detect language ───
  const isHindi = (text) => {
    if (!text) return false;
    const textStr = typeof text === 'string' ? text : String(text);
    const devanagariRegex = /[\u0900-\u097F]/;
    return devanagariRegex.test(textStr);
  };

  // ─── Get clean values ───
  const cleanTitle = cleanText(title) || 'this sacred temple';
  const cleanLocation = cleanText(location) || 'an ancient land';
  const cleanDeity = cleanText(deity) || 'the divine';
  const cleanEstablished = cleanText(established) || 'time immemorial';
  const cleanShortDesc = cleanText(shortDescription) || '';
  const cleanFullDesc = cleanText(fullDescription) || '';
  const cleanSignificance = cleanText(significance) || '';
  const cleanFestivals = cleanText(festivals) || '';

  // Determine language from title
  const language = isHindi(title) ? 'hi' : 'en';

  // ─── Format festivals list ───
  const formatFestivals = (festivals) => {
    if (!festivals) return '';
    
    let items = [];
    if (typeof festivals === 'string') {
      items = festivals.split(',').map(f => f.trim()).filter(Boolean);
    } else if (Array.isArray(festivals)) {
      items = festivals.map(f => f.trim()).filter(Boolean);
    } else {
      return '';
    }
    
    if (items.length === 0) return '';
    if (items.length === 1) return items[0];
    if (items.length === 2) return `${items[0]} and ${items[1]}`;
    return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
  };

  const formattedFestivals = formatFestivals(festivals);

  let script = '';

  if (language === 'hi') {
    // ─── HINDI SCRIPT ───
    script = `नमस्कार, आज हम आपको ले चलेंगे ${cleanTitle} की पवित्र यात्रा पर, जो कि ${cleanLocation} में स्थित है। `;
    script += `इस दिव्य मंदिर में ${cleanDeity} का वास है और यह ${cleanEstablished} से स्थापित है। `;
    
    if (cleanShortDesc) {
      script += `${cleanShortDesc}। `;
    }
    
    if (cleanFullDesc) {
      script += `${cleanFullDesc}। `;
    }
    
    if (cleanSignificance) {
      script += `इस मंदिर का महत्व है कि ${cleanSignificance}। `;
    }
    
    if (formattedFestivals) {
      script += `यहाँ भक्त ${formattedFestivals} के पावन अवसरों पर उत्सव मनाते हैं और अपनी आस्था को प्रगट करते हैं।`;
    }
    
    script += ` यह है ${cleanTitle} की अद्भुत कहानी। हम आशा करते हैं कि इस यात्रा ने आपके मन को शांति और आत्मिक संतोष दिया होगा।`;

  } else {
    // ─── ENGLISH SCRIPT ───
    script = `Namaste! Today, we invite you on a sacred journey to ${cleanTitle}, located in the heart of ${cleanLocation}. `;
    script += `This divine temple is home to ${cleanDeity} and has stood since ${cleanEstablished}. `;
    
    if (cleanShortDesc) {
      script += `${cleanShortDesc}. `;
    }
    
    if (cleanFullDesc) {
      script += `${cleanFullDesc}. `;
    }
    
    if (cleanSignificance) {
      script += `The profound significance of this temple lies in the belief that ${cleanSignificance}. `;
    }
    
    if (formattedFestivals) {
      script += `Devotees gather here to celebrate ${formattedFestivals}, offering their heartfelt prayers and devotion. `;
    }
    
    script += `This is the timeless story of ${cleanTitle}. May this journey bring peace and spiritual fulfillment to your heart.`;
  }

  return {
    script,
    language,
    hasContent: script.length > 20,
  };
}