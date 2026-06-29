// hooks/useDailyData.js
'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase/firebase';

export function useDailyData(date = new Date().toISOString().split('T')[0]) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const doc = await db.collection('dailyAstroData').doc(date).get();
        
        if (doc.exists) {
          setData(doc.data());
        } else {
          setError('No data available for this date');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [date]);

  return { data, loading, error };
}