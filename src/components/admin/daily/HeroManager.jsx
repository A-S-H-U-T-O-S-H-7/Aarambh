// components/admin/daily/HeroManager.jsx
'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Save } from 'lucide-react';

export default function HeroManager({ data, onSave, isDark, saving }) {
  const [hero, setHero] = useState({
    heading: 'Begin Every Day with Divine Wisdom',
    tagline: 'Your Daily Spiritual Destination',
    ctaText: 'Explore Now',
    ctaLink: '#explore',
  });

  useEffect(() => {
    if (data) setHero(data);
  }, [data]);

  const handleChange = (field, value) => {
    setHero({ ...hero, [field]: value });
  };

  const isFormValid = hero.heading?.trim() && hero.ctaText?.trim();

  return (
    <div className={`rounded-2xl border p-5 transition-all duration-300 hover:shadow-lg ${
      isDark 
        ? 'border-gray-700/50 bg-gradient-to-br from-gray-800/90 to-gray-900/90 shadow-md' 
        : 'border-gray-200/50 bg-white shadow-md'
    }`}>
      <div className="flex items-center gap-2.5 mb-4">
        <div className="rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 p-1.5">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <h2 className={`text-base font-semibold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
          Hero Section
        </h2>
        {data?.updatedAt && (
          <span className={`ml-auto text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            Updated {new Date(data.updatedAt).toLocaleDateString()}
          </span>
        )}
      </div>

      <div className="space-y-3.5">
        <div>
          <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Heading
          </label>
          <input
            type="text"
            value={hero.heading}
            onChange={(e) => handleChange('heading', e.target.value)}
            className={`w-full px-3 py-2 rounded-lg text-sm transition-colors ${
              isDark 
                ? 'bg-gray-900/50 border-gray-700 text-gray-100 focus:border-yellow-500' 
                : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-yellow-400'
            } border focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
            placeholder="Enter heading"
          />
        </div>

        <div>
          <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Tagline
          </label>
          <input
            type="text"
            value={hero.tagline}
            onChange={(e) => handleChange('tagline', e.target.value)}
            className={`w-full px-3 py-2 rounded-lg text-sm transition-colors ${
              isDark 
                ? 'bg-gray-900/50 border-gray-700 text-gray-100 focus:border-yellow-500' 
                : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-yellow-400'
            } border focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
            placeholder="Enter tagline"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              CTA Text
            </label>
            <input
              type="text"
              value={hero.ctaText}
              onChange={(e) => handleChange('ctaText', e.target.value)}
              className={`w-full px-3 py-2 rounded-lg text-sm transition-colors ${
                isDark 
                  ? 'bg-gray-900/50 border-gray-700 text-gray-100 focus:border-yellow-500' 
                  : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-yellow-400'
              } border focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
              placeholder="Button text"
            />
          </div>
          <div>
            <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              CTA Link
            </label>
            <input
              type="text"
              value={hero.ctaLink}
              onChange={(e) => handleChange('ctaLink', e.target.value)}
              className={`w-full px-3 py-2 rounded-lg text-sm transition-colors ${
                isDark 
                  ? 'bg-gray-900/50 border-gray-700 text-gray-100 focus:border-yellow-500' 
                  : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-yellow-400'
              } border focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
              placeholder="URL"
            />
          </div>
        </div>

        <button
          onClick={() => onSave(hero)}
          disabled={saving || !isFormValid}
          className={`w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
            saving || !isFormValid
              ? 'opacity-50 cursor-not-allowed bg-gray-400'
              : 'bg-gradient-to-r from-yellow-400 to-yellow-500 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
          }`}
        >
          <Save className="w-4 h-4" /> 
          {saving ? 'Saving...' : 'Save Hero'}
        </button>
      </div>
    </div>
  );
}