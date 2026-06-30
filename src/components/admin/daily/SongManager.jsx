// components/admin/daily/SongManager.jsx
'use client';

import { useState, useEffect } from 'react';
import { Music, Save, Upload } from 'lucide-react';

export default function SongManager({ data, onSave, isDark, saving }) {
  const [song, setSong] = useState({
    title: 'Om Namah Shivaya',
    artist: 'Anup Jalota',
    url: '',
    isPlaying: true,
    festival: 'Maha Shivaratri',
  });

  useEffect(() => {
    if (data) {
      setSong({
        title: data.title || 'Om Namah Shivaya',
        artist: data.artist || 'Anup Jalota',
        url: data.url || data.songUrl || '',
        isPlaying: data.isPlaying !== undefined ? data.isPlaying : true,
        festival: data.festival || 'Maha Shivaratri',
      });
    }
  }, [data]);

  const handleChange = (field, value) => {
    setSong({ ...song, [field]: value });
  };

  const isFormValid = song.title?.trim() && song.url?.trim();

  return (
    <div className={`rounded-2xl border p-5 transition-all duration-300 hover:shadow-lg ${
      isDark 
        ? 'border-gray-700/50 bg-gradient-to-br from-gray-800/90 to-gray-900/90 shadow-md' 
        : 'border-gray-200/50 bg-white shadow-md'
    }`}>
      <div className="flex items-center gap-2.5 mb-4">
        <div className="rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 p-1.5">
          <Music className="w-4 h-4 text-white" />
        </div>
        <h2 className={`text-base font-semibold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
          Background Song
        </h2>
        <span className={`ml-auto text-[10px] px-2.5 py-1 rounded-full ${
          song.isPlaying 
            ? 'bg-green-500/20 text-green-600 dark:bg-green-500/30 dark:text-green-400' 
            : 'bg-gray-500/20 text-gray-600 dark:bg-gray-500/30 dark:text-gray-400'
        }`}>
          {song.isPlaying ? '● Playing' : '● Paused'}
        </span>
      </div>

      <div className="space-y-3.5">
        <div>
          <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Song Title *
          </label>
          <input
            type="text"
            value={song.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className={`w-full px-3 py-2 rounded-lg text-sm transition-colors ${
              isDark 
                ? 'bg-gray-900/50 border-gray-700 text-gray-100 focus:border-yellow-500' 
                : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-yellow-400'
            } border focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
            placeholder="Enter song title"
          />
        </div>

        <div>
          <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Artist
          </label>
          <input
            type="text"
            value={song.artist}
            onChange={(e) => handleChange('artist', e.target.value)}
            className={`w-full px-3 py-2 rounded-lg text-sm transition-colors ${
              isDark 
                ? 'bg-gray-900/50 border-gray-700 text-gray-100 focus:border-yellow-500' 
                : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-yellow-400'
            } border focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
            placeholder="Enter artist name"
          />
        </div>

        <div>
          <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Audio URL (Direct MP3 / audio file) *
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={song.url}
              onChange={(e) => handleChange('url', e.target.value)}
              className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                isDark 
                  ? 'bg-gray-900/50 border-gray-700 text-gray-100 focus:border-yellow-500' 
                  : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-yellow-400'
              } border focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
              placeholder="https://youtube.com/..."
            />
            <button className={`px-3 py-2 rounded-lg border transition-colors cursor-pointer ${
              isDark 
                ? 'border-gray-700 hover:bg-gray-700 text-gray-400' 
                : 'border-gray-200 hover:bg-gray-50 text-gray-500'
            }`}>
              <Upload className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Festival (Optional)
            </label>
            <input
              type="text"
              value={song.festival || ''}
              onChange={(e) => handleChange('festival', e.target.value)}
              className={`w-full px-3 py-2 rounded-lg text-sm transition-colors ${
                isDark 
                  ? 'bg-gray-900/50 border-gray-700 text-gray-100 focus:border-yellow-500' 
                  : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-yellow-400'
              } border focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
              placeholder="e.g., Maha Shivaratri"
            />
          </div>

          <div>
            <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Status
            </label>
            <select
              value={song.isPlaying ? 'playing' : 'paused'}
              onChange={(e) => handleChange('isPlaying', e.target.value === 'playing')}
              className={`w-full px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                isDark 
                  ? 'bg-gray-900/50 border-gray-700 text-gray-100 focus:border-yellow-500' 
                  : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-yellow-400'
              } border focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
            >
              <option value="playing">▶ Playing</option>
              <option value="paused">⏸ Paused</option>
            </select>
          </div>
        </div>

        {/* Song Preview */}
        {song.url && (
          <div className={`p-3 rounded-lg text-xs ${
            isDark ? 'bg-gray-900/50 text-gray-400' : 'bg-gray-50 text-gray-500'
          }`}>
            🎵 {song.title} {song.artist && `- ${song.artist}`}
            {song.festival && ` • ${song.festival}`}
          </div>
        )}

        <button
          onClick={() => onSave(song)}
          disabled={saving || !isFormValid}
          className={`w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
            saving || !isFormValid
              ? 'opacity-50 cursor-not-allowed bg-gray-400'
              : 'bg-gradient-to-r from-yellow-400 to-yellow-500 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
          }`}
        >
          <Save className="w-4 h-4" /> 
          {saving ? 'Saving...' : 'Save Song'}
        </button>
      </div>
    </div>
  );
}