'use client';

import { useState } from 'react';
import { 
  FileText, 
  Globe, 
  Hash, 
  FolderOpen,
  Calendar,
} from 'lucide-react';
import RichTextEditor from '../RichTextEditor';
import AIGenerateButton from '@/components/admin/AIGenerateButton';

// ─── SLUG GENERATION WITH TRANSLITERATION ───
const transliterateHindi = (text) => {
  const map = {
    'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ee', 'उ': 'u', 'ऊ': 'oo',
    'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au',
    'क': 'k', 'ख': 'kh', 'ग': 'g', 'घ': 'gh', 'ङ': 'ng',
    'च': 'ch', 'छ': 'chh', 'ज': 'j', 'झ': 'jh', 'ञ': 'ny',
    'ट': 't', 'ठ': 'th', 'ड': 'd', 'ढ': 'dh', 'ण': 'n',
    'त': 't', 'थ': 'th', 'द': 'd', 'ध': 'dh', 'न': 'n',
    'प': 'p', 'फ': 'ph', 'ब': 'b', 'भ': 'bh', 'म': 'm',
    'य': 'y', 'र': 'r', 'ल': 'l', 'व': 'v',
    'श': 'sh', 'ष': 'sh', 'स': 's', 'ह': 'h',
    'क्ष': 'ksh', 'त्र': 'tr', 'ज्ञ': 'gya',
    'ा': 'a', 'ि': 'i', 'ी': 'ee', 'ु': 'u', 'ू': 'oo',
    'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au',
    'ं': 'n', 'ः': 'h', '्': ''
  };
  
  let result = '';
  let i = 0;
  while (i < text.length) {
    if (i + 1 < text.length) {
      const twoChar = text.substring(i, i + 2);
      if (map[twoChar]) {
        result += map[twoChar];
        i += 2;
        continue;
      }
    }
    const char = text[i];
    if (map[char]) {
      result += map[char];
    } else {
      result += char;
    }
    i++;
  }
  return result;
};

const generateSlug = (title) => {
  if (!title) return '';
  
  let slug = transliterateHindi(title);
  slug = slug
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  return slug || 'untitled';
};

// ─── EMOJI OPTIONS ───
const EMOJI_OPTIONS = [
  { value: '🎊', label: '🎊 Celebration' },
  { value: '🎉', label: '🎉 Party' },
  { value: '🪔', label: '🪔 Diya' },
  { value: '🎆', label: '🎆 Fireworks' },
  { value: '🎇', label: '🎇 Sparkler' },
  { value: '🏮', label: '🏮 Lantern' },
  { value: '🌸', label: '🌸 Flower' },
  { value: '🌺', label: '🌺 Hibiscus' },
  { value: '🌼', label: '🌼 Bloom' },
  { value: '🌻', label: '🌻 Sunflower' },
  { value: '🌿', label: '🌿 Leaf' },
  { value: '🍂', label: '🍂 Autumn' },
  { value: '✨', label: '✨ Sparkles' },
  { value: '🌟', label: '🌟 Star' },
  { value: '⭐', label: '⭐ Glow' },
  { value: '🕊️', label: '🕊️ Peace' },
  { value: '🙏', label: '🙏 Prayer' },
  { value: '🕉️', label: '🕉️ Om' },
  { value: '🔱', label: '🔱 Trishul' },
  { value: '🛕', label: '🛕 Temple' },
];

// ─── COMPONENT ───
export default function FestivalForm({ formData, errors, onInputChange, isDark }) {
  const handleTitleChange = (value) => {
    onInputChange('title', value);
    if (!formData.manualSlug) {
      onInputChange('slug', generateSlug(value));
    }
  };

  const handleSlugChange = (value) => {
    onInputChange('slug', value);
    onInputChange('manualSlug', true);
  };

  // ─── AI CONTENT ───
  const getAIContent = () => {
    const title = formData.title || '';
    const description = formData.fullDescription || '';
    return `Festival: ${title}\nDescription: ${description}`;
  };

  // Check if all required fields are filled for AI
  const isAIEnabled = () => {
    return !!(
      formData.title?.trim() &&
      formData.fullDescription?.trim()
    );
  };

  // Handle AI generated data
  const handleAIGenerated = (field, value) => {
    if (field === 'metatitle') {
      onInputChange('metatitle', value);
    } else if (field === 'metadesc') {
      onInputChange('metadesc', value);
    } else if (field === 'metakeywords') {
      onInputChange('metakeywords', value);
    } else if (field === 'description') {
      onInputChange('description', value);
    }
  };

  return (
    <div className="space-y-5">
      {/* ─── Card 1: Basic Information ─── */}
      <div className={`rounded-2xl border p-6 transition-all duration-300 hover:shadow-xl ${
        isDark 
          ? 'border-gray-700 bg-gray-800/90 shadow-lg' 
          : 'border-gray-200 bg-white shadow-md'
      }`}>
        <div className="flex items-center gap-3 mb-5 pb-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}">
          <div className="rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 p-2">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <h3 className={`text-base font-semibold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
            Basic Information
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                errors.title
                  ? 'border-red-500 focus:ring-red-500/20'
                  : isDark
                    ? 'bg-gray-900 border-gray-700 text-gray-100 focus:border-yellow-500'
                    : 'bg-gray-50 border-gray-300 text-gray-800 focus:border-yellow-400'
              } border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
              placeholder="Enter festival title"
            />
            {errors.title && <p className="text-red-500 text-xs mt-1.5">{errors.title}</p>}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Slug *
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                errors.slug
                  ? 'border-red-500 focus:ring-red-500/20'
                  : isDark
                    ? 'bg-gray-900 border-gray-700 text-gray-100 focus:border-yellow-500'
                    : 'bg-gray-50 border-gray-300 text-gray-800 focus:border-yellow-400'
              } border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
              placeholder="festival-url-slug"
            />
            {errors.slug && <p className="text-red-500 text-xs mt-1.5">{errors.slug}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <span className="mr-1">🇮🇳</span> Hindi Name
            </label>
            <input
              type="text"
              value={formData.nameHindi || ''}
              onChange={(e) => onInputChange('nameHindi', e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                isDark
                  ? 'bg-gray-900 border-gray-700 text-gray-100 focus:border-yellow-500'
                  : 'bg-gray-50 border-gray-300 text-gray-800 focus:border-yellow-400'
              } border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
              placeholder="Hindi name (optional)"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <span className="mr-1">📅</span> Festival Date *
            </label>
            <input
              type="date"
              value={formData.date || ''}
              onChange={(e) => onInputChange('date', e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                errors.date
                  ? 'border-red-500 focus:ring-red-500/20'
                  : isDark
                    ? 'bg-gray-900 border-gray-700 text-gray-100 focus:border-yellow-500'
                    : 'bg-gray-50 border-gray-300 text-gray-800 focus:border-yellow-400'
              } border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
            />
            {errors.date && <p className="text-red-500 text-xs mt-1.5">{errors.date}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <span className="mr-1">🎭</span> Emoji
            </label>
            <select
              value={formData.emoji || ''}
              onChange={(e) => onInputChange('emoji', e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer ${
                isDark
                  ? 'bg-gray-900 border-gray-700 text-gray-100 focus:border-yellow-500'
                  : 'bg-gray-50 border-gray-300 text-gray-800 focus:border-yellow-400'
              } border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
            >
              <option value="">Select emoji</option>
              {EMOJI_OPTIONS.map((emoji) => (
                <option key={emoji.value} value={emoji.value}>
                  {emoji.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <span className="mr-1">📂</span> Category *
            </label>
            <select
              value={formData.category || ''}
              onChange={(e) => onInputChange('category', e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer ${
                errors.category
                  ? 'border-red-500 focus:ring-red-500/20'
                  : isDark
                    ? 'bg-gray-900 border-gray-700 text-gray-100 focus:border-yellow-500'
                    : 'bg-gray-50 border-gray-300 text-gray-800 focus:border-yellow-400'
              } border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
            >
              <option value="">Select category</option>
              <option value="Major Festival">Major Festival</option>
              <option value="Harvest Festival">Harvest Festival</option>
              <option value="Pilgrimage">Pilgrimage</option>
              <option value="Regional">Regional</option>
              <option value="Other">Other</option>
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1.5">{errors.category}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <span className="mr-1">🛕</span> Deity
            </label>
            <input
              type="text"
              value={formData.deity || ''}
              onChange={(e) => onInputChange('deity', e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                isDark
                  ? 'bg-gray-900 border-gray-700 text-gray-100 focus:border-yellow-500'
                  : 'bg-gray-50 border-gray-300 text-gray-800 focus:border-yellow-400'
              } border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
              placeholder="e.g., Lord Shiva"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <span className="mr-1">📍</span> Region
            </label>
            <input
              type="text"
              value={formData.region || ''}
              onChange={(e) => onInputChange('region', e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                isDark
                  ? 'bg-gray-900 border-gray-700 text-gray-100 focus:border-yellow-500'
                  : 'bg-gray-50 border-gray-300 text-gray-800 focus:border-yellow-400'
              } border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
              placeholder="e.g., All India"
            />
          </div>
        </div>
      </div>

      {/* ─── Card 2: Description with AI Button ─── */}
      <div className={`rounded-2xl border p-6 transition-all duration-300 hover:shadow-xl ${
        isDark 
          ? 'border-gray-700 bg-gray-800/90 shadow-lg' 
          : 'border-gray-200 bg-white shadow-md'
      }`}>
        <div className="flex items-center justify-between gap-4 mb-5 pb-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-gradient-to-r from-purple-400 to-purple-500 p-2">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <h3 className={`text-base font-semibold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
              Description
            </h3>
          </div>
          
          {/* AI Generate Button */}
          <AIGenerateButton
            content={getAIContent()}
            onGenerated={handleAIGenerated}
            label="✨ Generate SEO & Description"
            size="sm"
            disabled={!isAIEnabled()}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Short Description *
          </label>
          <textarea
            value={formData.description || ''}
            onChange={(e) => onInputChange('description', e.target.value)}
            rows={3}
            className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${
              errors.description
                ? 'border-red-500 focus:ring-red-500/20'
                : isDark
                  ? 'bg-gray-900 border-gray-700 text-gray-100 focus:border-yellow-500'
                  : 'bg-gray-50 border-gray-300 text-gray-800 focus:border-yellow-400'
            } border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
            placeholder="Brief description of the festival..."
          />
          {errors.description && <p className="text-red-500 text-xs mt-1.5">{errors.description}</p>}
        </div>

        <div className="mt-4">
          <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Full Description (Detailed) *
          </label>
          <RichTextEditor
            value={formData.fullDescription || ''}
            onChange={(content) => onInputChange('fullDescription', content)}
            placeholder="Write detailed festival description here..."
            minHeight="200px"
            isDark={isDark}
          />
          {errors.fullDescription && <p className="text-red-500 text-xs mt-1.5">{errors.fullDescription}</p>}
        </div>
      </div>

      {/* ─── Card 3: SEO Settings ─── */}
      <div className={`rounded-2xl border p-6 transition-all duration-300 hover:shadow-xl ${
        isDark 
          ? 'border-gray-700 bg-gray-800/90 shadow-lg' 
          : 'border-gray-200 bg-white shadow-md'
      }`}>
        <div className="flex items-center gap-3 mb-5 pb-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}">
          <div className="rounded-lg bg-gradient-to-r from-indigo-400 to-indigo-500 p-2">
            <Globe className="w-4 h-4 text-white" />
          </div>
          <h3 className={`text-base font-semibold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
            SEO Settings
          </h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Meta Title
            </label>
            <input
              type="text"
              value={formData.metatitle || ''}
              onChange={(e) => onInputChange('metatitle', e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                isDark
                  ? 'bg-gray-900 border-gray-700 text-gray-100 focus:border-yellow-500'
                  : 'bg-gray-50 border-gray-300 text-gray-800 focus:border-yellow-400'
              } border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
              placeholder="Meta title (optional)"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Meta Description
            </label>
            <textarea
              value={formData.metadesc || ''}
              onChange={(e) => onInputChange('metadesc', e.target.value)}
              rows={2}
              className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                isDark
                  ? 'bg-gray-900 border-gray-700 text-gray-100 focus:border-yellow-500'
                  : 'bg-gray-50 border-gray-300 text-gray-800 focus:border-yellow-400'
              } border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
              placeholder="Meta description (optional)"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <Hash className="w-4 h-4 inline mr-1" />
              Meta Keywords
            </label>
            <input
              type="text"
              value={formData.metakeywords || ''}
              onChange={(e) => onInputChange('metakeywords', e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                isDark
                  ? 'bg-gray-900 border-gray-700 text-gray-100 focus:border-yellow-500'
                  : 'bg-gray-50 border-gray-300 text-gray-800 focus:border-yellow-400'
              } border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
              placeholder="festival, celebration, spirituality, india"
            />
          </div>
        </div>
      </div>
    </div>
  );
}