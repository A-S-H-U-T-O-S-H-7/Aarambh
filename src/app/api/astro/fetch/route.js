// app/api/astro/fetch/route.js
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/firebase-admin';
import { fetchAllPanchangData, fetchAllHoroscopes } from '@/lib/astro/vedicApi';

const SECRET_KEY = process.env.CRON_SECRET_KEY || 'your-secret-key';
const LOCATIONS = {
  delhi: { lat: '28.6139', lon: '77.2090' },
  varanasi: { lat: '25.3176', lon: '82.9739' },
  // Add more as needed
};

export async function POST(request) {
  try {
    // Verify the request is authorized
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${SECRET_KEY}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { location = 'delhi', date = new Date().toISOString().split('T')[0] } = await request.json();

    console.log(`🔄 Fetching astro data for ${date} at ${location}...`);

    // Fetch Panchang
    const panchangData = await fetchAllPanchangData(date, location, 'en');

    // Fetch Horoscopes for all languages
    const languages = ['en', 'hi'];
    const horoscopeData = {};

    for (const lang of languages) {
      horoscopeData[lang] = await fetchAllHoroscopes(lang);
    }

    // Prepare data for Firestore
    const dailyData = {
      date,
      location,
      updatedAt: new Date().toISOString(),
      panchang: panchangData,
      horoscope: horoscopeData,
      languages: languages,
    };

    // Save to Firestore
    const docRef = db.collection('dailyAstroData').doc(date);
    await docRef.set(dailyData, { merge: true });

    console.log(`✅ Data saved successfully for ${date}`);

    return NextResponse.json({
      success: true,
      message: `Data fetched and saved for ${date}`,
      data: dailyData,
    });

  } catch (error) {
    console.error('❌ Error fetching astro data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch astro data', details: error.message },
      { status: 500 }
    );
  }
}

// GET endpoint to check stored data
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const date = url.searchParams.get('date') || new Date().toISOString().split('T')[0];

    const doc = await db.collection('dailyAstroData').doc(date).get();

    if (!doc.exists) {
      return NextResponse.json({ error: 'No data found for this date' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: doc.data(),
    });

  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}