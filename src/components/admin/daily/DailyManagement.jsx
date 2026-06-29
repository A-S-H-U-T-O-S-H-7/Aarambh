// app/(admin)/admin/daily-management/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useThemeStore } from '@/lib/store/useThemeStore';
import { useActivityLogger } from '@/hooks/useActivityLogger';
import {
  getDailyContent,
  saveHero,
  saveMantra,
  saveWisdom,
  saveSong,
} from '@/lib/services/dailyContentService';

// Import all managers
import HeroManager from './HeroManager';
import MantraManager from './MantraManager';
import WisdomManager from './WisdomManager';
import SongManager from './SongManager';

export default function DailyManagementPage() {
  const { theme } = useThemeStore();
  const { log } = useActivityLogger();
  const isDark = theme === 'dark';
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [hero, setHero] = useState(null);
  const [mantra, setMantra] = useState(null);
  const [wisdom, setWisdom] = useState(null);
  const [song, setSong] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const result = await getDailyContent();
    if (result.success) {
      setHero(result.data.hero);
      setMantra(result.data.mantra);
      setWisdom(result.data.wisdom);
      setSong(result.data.song);
    } else {
      toast.error('Failed to load data');
    }
    setLoading(false);
  };

  const handleSave = async (type, data, saveFn, successMsg, entityTitle) => {
    setSaving(true);
    
    // Get old data for logging
    let oldData = null;
    if (type === 'hero') oldData = hero;
    else if (type === 'mantra') oldData = mantra;
    else if (type === 'wisdom') oldData = wisdom;
    else if (type === 'song') oldData = song;

    const result = await saveFn(data);
    
    if (result.success) {
      toast.success(successMsg);
      
      // Update local state
      if (type === 'hero') setHero(data);
      else if (type === 'mantra') setMantra(data);
      else if (type === 'wisdom') setWisdom(data);
      else if (type === 'song') setSong(data);

      // Log the activity
      await log({
        action: 'UPDATE',
        entityType: 'daily_content',
        entityId: type,
        entityTitle: entityTitle || type,
        oldData: oldData,
        newData: data,
        details: `Updated ${type} content`
      });
    } else {
      toast.error(result.error || 'Failed to save');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header - More compact */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
            Daily Content Management
          </h1>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Manage hero, mantra, wisdom, and background song
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-3 py-1 rounded-full ${
            isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
          }`}>
            {loading ? 'Loading...' : 'Live'}
          </span>
        </div>
      </div>

      {/* Grid: Hero + Song (Top Row) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <HeroManager
          data={hero}
          onSave={(data) => handleSave('hero', data, saveHero, 'Hero section updated!', 'Hero Section')}
          isDark={isDark}
          saving={saving}
        />
        <SongManager
          data={song}
          onSave={(data) => handleSave('song', data, saveSong, 'Song updated!', 'Background Song')}
          isDark={isDark}
          saving={saving}
        />
      </div>

      {/* Grid: Mantra + Wisdom (Bottom Row) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <MantraManager
          data={mantra}
          onSave={(data) => handleSave('mantra', data, saveMantra, 'Mantra updated!', 'Mantra of the Day')}
          isDark={isDark}
          saving={saving}
        />
        <WisdomManager
          data={wisdom}
          onSave={(data) => handleSave('wisdom', data, saveWisdom, 'Wisdom updated!', 'Wisdom of the Day')}
          isDark={isDark}
          saving={saving}
        />
      </div>
    </div>
  );
}