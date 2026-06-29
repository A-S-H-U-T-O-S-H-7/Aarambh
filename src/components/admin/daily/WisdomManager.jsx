// components/admin/daily/WisdomManager.jsx
'use client';

import { useState, useEffect } from 'react';
import { Quote, Save } from 'lucide-react';

export default function WisdomManager({ data, onSave, isDark, saving }) {
  const [wisdom, setWisdom] = useState({
    quote: 'The mind is everything. What you think you become.',
    author: 'Lord Buddha',
    category: 'Wisdom',
  });

  useEffect(() => {
    if (data) setWisdom(data);
  }, [data]);

  const handleChange = (field, value) => {
    setWisdom({ ...wisdom, [field]: value });
  };

  const isFormValid = wisdom.quote?.trim() && wisdom.author?.trim();

  return (
    <div className={`rounded-2xl border p-5 transition-all duration-300 hover:shadow-lg ${
      isDark 
        ? 'border-gray-700/50 bg-gradient-to-br from-gray-800/90 to-gray-900/90 shadow-md' 
        : 'border-gray-200/50 bg-white shadow-md'
    }`}>
      <div className="flex items-center gap-2.5 mb-4">
        <div className="rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 p-1.5">
          <Quote className="w-4 h-4 text-white" />
        </div>
        <h2 className={`text-base font-semibold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
          Wisdom of the Day
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
            Quote
          </label>
          <textarea
            value={wisdom.quote}
            onChange={(e) => handleChange('quote', e.target.value)}
            rows={2}
            className={`w-full px-3 py-2 rounded-lg text-sm transition-colors resize-none ${
              isDark 
                ? 'bg-gray-900/50 border-gray-700 text-gray-100 focus:border-yellow-500' 
                : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-yellow-400'
            } border focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
            placeholder="Enter the wisdom quote"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Author
            </label>
            <input
              type="text"
              value={wisdom.author}
              onChange={(e) => handleChange('author', e.target.value)}
              className={`w-full px-3 py-2 rounded-lg text-sm transition-colors ${
                isDark 
                  ? 'bg-gray-900/50 border-gray-700 text-gray-100 focus:border-yellow-500' 
                  : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-yellow-400'
              } border focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
              placeholder="Enter author name"
            />
          </div>
          <div>
            <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Category
            </label>
            <input
              type="text"
              value={wisdom.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className={`w-full px-3 py-2 rounded-lg text-sm transition-colors ${
                isDark 
                  ? 'bg-gray-900/50 border-gray-700 text-gray-100 focus:border-yellow-500' 
                  : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-yellow-400'
              } border focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
              placeholder="e.g., Wisdom, Love, Peace"
            />
          </div>
        </div>

        <button
          onClick={() => onSave(wisdom)}
          disabled={saving || !isFormValid}
          className={`w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
            saving || !isFormValid
              ? 'opacity-50 cursor-not-allowed bg-gray-400'
              : 'bg-gradient-to-r from-yellow-400 to-yellow-500 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
          }`}
        >
          <Save className="w-4 h-4" /> 
          {saving ? 'Saving...' : 'Save Wisdom'}
        </button>
      </div>
    </div>
  );
}