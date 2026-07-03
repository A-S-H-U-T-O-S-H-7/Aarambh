// app/api/astro/fetch/route.js
import { NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { db } from '@/lib/firebase/firebase-admin';
import { fetchAllPanchangData, fetchAllHoroscopes, LOCATIONS } from '@/lib/astro/vedicApi';
import { zodiacSigns } from '@/lib/services/horoscopeService';

const CRON_SECRET = process.env.CRON_SECRET || process.env.CRON_SECRET_KEY;

const DEFAULT_LOCATION = 'delhi';
const DEFAULT_LANG = 'en';

function getTodayIST() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
}

function isAuthorized(request) {
  if (!CRON_SECRET) return true;
  const authHeader = request.headers.get('authorization');
  return authHeader === `Bearer ${CRON_SECRET}`;
}

async function updateDailyAstroData(date, location = DEFAULT_LOCATION, lang = DEFAULT_LANG) {
  const locData = LOCATIONS[location] || LOCATIONS.delhi;

  const panchangResult = await fetchAllPanchangData(date, location, lang);
  if (!panchangResult.success) {
    throw new Error('Failed to fetch panchang data from API');
  }

  await db.collection('panchang').doc(date).set({
    date,
    location,
    locationLat: locData.lat,
    locationLon: locData.lon,
    locationTz: locData.tz,
    month: panchangResult.month || '',
    samvat: panchangResult.samvat || '',
    tithi: panchangResult.tithi || '',
    tithiDetails: panchangResult.tithiDetails || '',
    nakshatra: panchangResult.nakshatra || '',
    nakshatraDetails: panchangResult.nakshatraDetails || '',
    yoga: panchangResult.yoga || '',
    karana: panchangResult.karana || '',
    festivals: panchangResult.festivals,
    yogas: panchangResult.yogas,
    sunrise: panchangResult.sunrise,
    sunset: panchangResult.sunset,
    rahuKaal: panchangResult.rahuKaal || '',
    abhijitMuhurat: panchangResult.abhijitMuhurat || '',
    amritKaal: panchangResult.amritKaal || '',
    specialEvent: panchangResult.specialEvent || '',
    choghadiya: panchangResult.choghadiya,
    hora: panchangResult.hora,
    source: 'vedicastro',
    isManualOverride: false,
    updatedAt: FieldValue.serverTimestamp(),
    updatedBy: null,
  }, { merge: true });

  const apiResults = await fetchAllHoroscopes(lang, date);
  let successCount = 0;
  let failCount = 0;

  for (const sign of zodiacSigns) {
    const apiData = apiResults[sign.id];
    if (apiData?.prediction) {
      await db.collection('horoscopes').doc(`${sign.id}_${date}`).set({
        sign: sign.id,
        date,
        prediction: apiData.prediction,
        luckyColor: apiData.luckyColor,
        luckyNumber: apiData.luckyNumber,
        luckyTime: apiData.luckyTime || '',
        mood: apiData.mood || '',
        compatibility: apiData.compatibility || '',
        source: 'vedicastro',
        isManualOverride: false,
        updatedAt: FieldValue.serverTimestamp(),
        updatedBy: null,
      }, { merge: true });
      successCount++;
    } else {
      failCount++;
    }
  }

  return { successCount, failCount };
}

async function handleCronRequest(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    let date = getTodayIST();
    let location = DEFAULT_LOCATION;
    let lang = DEFAULT_LANG;

    if (request.method === 'POST') {
      const body = await request.json().catch(() => ({}));
      date = body.date || date;
      location = body.location || location;
      lang = body.lang || lang;
    }

    console.log(`Fetching astro data for ${date} (${location}, ${lang})...`);

    const { successCount, failCount } = await updateDailyAstroData(date, location, lang);

    console.log(`Astro data saved for ${date} (${successCount} horoscopes, ${failCount} failed)`);

    return NextResponse.json({
      success: true,
      message: `Panchang and horoscopes updated for ${date}`,
      date,
      location,
      lang,
      horoscopesUpdated: successCount,
      horoscopesFailed: failCount,
    });
  } catch (error) {
    console.error('Error in astro cron:', error);
    return NextResponse.json(
      { error: 'Failed to update astro data', details: error.message },
      { status: 500 }
    );
  }
}

// Vercel Cron invokes this path via GET
export async function GET(request) {
  return handleCronRequest(request);
}

export async function POST(request) {
  return handleCronRequest(request);
}
