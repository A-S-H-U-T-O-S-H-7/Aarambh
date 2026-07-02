// components/admin/festivals/FestivalForm.jsx
'use client';

import { useState, useEffect } from 'react';
import { 
  FileText, 
  Globe, 
  Hash, 
  Tag, 
  FolderOpen,
  Calendar,
  MapPin,
  Users,
  Star,
  Plus,
  X
} from 'lucide-react';
import RichTextEditor from '../RichTextEditor';

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export default function FestivalForm({ formData, errors, onInputChange, isDark, categories = [] }) {
  const [tagsInput, setTagsInput] = useState(formData.tags?.join(', ') || '');
  const [traditionsInput, setTraditionsInput] = useState('');
  const [colorsInput, setColorsInput] = useState('');

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

  const handleTagsChange = (e) => {
    const value = e.target.value;
    setTagsInput(value);
    const tagsArray = value.split(',').map(tag => tag.trim()).filter(tag => tag);
    onInputChange('tags', tagsArray);
  };

  const handleTraditionsAdd = () => {
    if (traditionsInput.trim()) {
      const current = formData.traditions || [];
      onInputChange('traditions', [...current, traditionsInput.trim()]);
      setTraditionsInput('');
    }
  };

  const handleTraditionsRemove = (index) => {
    const current = formData.traditions || [];
    onInputChange('traditions', current.filter((_, i) => i !== index));
  };

  const handleColorsAdd = () => {
    if (colorsInput.trim()) {
      const current = formData.colors || [];
      onInputChange('colors', [...current, colorsInput.trim()]);
      setColorsInput('');
    }
  };

  const handleColorsRemove = (index) => {
    const current = formData.colors || [];
    onInputChange('colors', current.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-5">
      {/* Basic Information Card */}
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
            <input
              type="text"
              value={formData.emoji || ''}
              onChange={(e) => onInputChange('emoji', e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                isDark
                  ? 'bg-gray-900 border-gray-700 text-gray-100 focus:border-yellow-500'
                  : 'bg-gray-50 border-gray-300 text-gray-800 focus:border-yellow-400'
              } border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
              placeholder="e.g., 🎊"
            />
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

      {/* Description Card */}
      <div className={`rounded-2xl border p-6 transition-all duration-300 hover:shadow-xl ${
        isDark 
          ? 'border-gray-700 bg-gray-800/90 shadow-lg' 
          : 'border-gray-200 bg-white shadow-md'
      }`}>
        <div className="flex items-center gap-3 mb-5 pb-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}">
          <div className="rounded-lg bg-gradient-to-r from-purple-400 to-purple-500 p-2">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <h3 className={`text-base font-semibold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
            Description
          </h3>
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
            Full Description (Detailed)
          </label>
          <RichTextEditor
            value={formData.fullDescription || ''}
            onChange={(content) => onInputChange('fullDescription', content)}
            placeholder="Write detailed festival description here..."
            minHeight="200px"
            isDark={isDark}
          />
        </div>
      </div>

      {/* Traditions & Colors Card */}
      <div className={`rounded-2xl border p-6 transition-all duration-300 hover:shadow-xl ${
        isDark 
          ? 'border-gray-700 bg-gray-800/90 shadow-lg' 
          : 'border-gray-200 bg-white shadow-md'
      }`}>
        <div className="flex items-center gap-3 mb-5 pb-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}">
          <div className="rounded-lg bg-gradient-to-r from-green-400 to-green-500 p-2">
            <Tag className="w-4 h-4 text-white" />
          </div>
          <h3 className={`text-base font-semibold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
            Traditions & Colors
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Traditions */}
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <Users className="w-4 h-4 inline mr-1" />
              Traditions
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={traditionsInput}
                onChange={(e) => setTraditionsInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTraditionsAdd()}
                className={`flex-1 px-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                  isDark
                    ? 'bg-gray-900 border-gray-700 text-gray-100 focus:border-yellow-500'
                    : 'bg-gray-50 border-gray-300 text-gray-800 focus:border-yellow-400'
                } border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
                placeholder="Add tradition..."
              />
              <button
                onClick={handleTraditionsAdd}
                className="px-4 py-2.5 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {(formData.traditions || []).map((item, index) => (
                <span key={index} className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                  isDark 
                    ? 'bg-yellow-500/20 text-yellow-400' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {item}
                  <button
                    onClick={() => handleTraditionsRemove(index)}
                    className="hover:text-red-500 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              🎨 Festival Colors
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={colorsInput}
                onChange={(e) => setColorsInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleColorsAdd()}
                className={`flex-1 px-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                  isDark
                    ? 'bg-gray-900 border-gray-700 text-gray-100 focus:border-yellow-500'
                    : 'bg-gray-50 border-gray-300 text-gray-800 focus:border-yellow-400'
                } border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
                placeholder="Add color..."
              />
              <button
                onClick={handleColorsAdd}
                className="px-4 py-2.5 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {(formData.colors || []).map((item, index) => (
                <span key={index} className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                  isDark 
                    ? 'bg-yellow-500/20 text-yellow-400' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item }} />
                  {item}
                  <button
                    onClick={() => handleColorsRemove(index)}
                    className="hover:text-red-500 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SEO Settings */}
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
              placeholder="keyword1, keyword2, keyword3 (optional)"
            />
          </div>
        </div>
      </div>
    </div>
  );
}