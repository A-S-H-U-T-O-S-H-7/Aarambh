// components/admin/temples/TempleForm.jsx
'use client';

import { useState, useEffect } from 'react';
import { 
  FileText, 
  Globe, 
  Hash, 
  Tag, 
  FolderOpen,
  MapPin,
  Users,
  Star,
  Plus,
  X,
  Calendar,
  Building,
  Info,
  Gift
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

export default function TempleForm({ formData, errors, onInputChange, isDark }) {
  const [festivalsInput, setFestivalsInput] = useState('');

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

  const handleFestivalsAdd = () => {
    if (festivalsInput.trim()) {
      const current = formData.festivals || [];
      onInputChange('festivals', [...current, festivalsInput.trim()]);
      setFestivalsInput('');
    }
  };

  const handleFestivalsRemove = (index) => {
    const current = formData.festivals || [];
    onInputChange('festivals', current.filter((_, i) => i !== index));
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
              Temple Name *
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
              placeholder="Enter temple name"
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
              placeholder="temple-url-slug"
            />
            {errors.slug && <p className="text-red-500 text-xs mt-1.5">{errors.slug}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <MapPin className="w-4 h-4 inline mr-1" />
              Location *
            </label>
            <input
              type="text"
              value={formData.location || ''}
              onChange={(e) => onInputChange('location', e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                errors.location
                  ? 'border-red-500 focus:ring-red-500/20'
                  : isDark
                    ? 'bg-gray-900 border-gray-700 text-gray-100 focus:border-yellow-500'
                    : 'bg-gray-50 border-gray-300 text-gray-800 focus:border-yellow-400'
              } border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
              placeholder="e.g., Varanasi, Uttar Pradesh"
            />
            {errors.location && <p className="text-red-500 text-xs mt-1.5">{errors.location}</p>}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <FolderOpen className="w-4 h-4 inline mr-1" />
              Region *
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
              <option value="">Select region</option>
              <option value="north">North India</option>
              <option value="south">South India</option>
              <option value="east">East India</option>
              <option value="west">West India</option>
              <option value="central">Central India</option>
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1.5">{errors.category}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <Building className="w-4 h-4 inline mr-1" />
              Deity
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
              <Calendar className="w-4 h-4 inline mr-1" />
              Established
            </label>
            <input
              type="text"
              value={formData.established || ''}
              onChange={(e) => onInputChange('established', e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                isDark
                  ? 'bg-gray-900 border-gray-700 text-gray-100 focus:border-yellow-500'
                  : 'bg-gray-50 border-gray-300 text-gray-800 focus:border-yellow-400'
              } border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
              placeholder="e.g., 3500+ years"
            />
          </div>
        </div>
      </div>

      {/* Description Cards */}
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
            Descriptions
          </h3>
        </div>

        <div className="mt-4">
          <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Short Description *
          </label>
          <textarea
            value={formData.shortDescription || ''}
            onChange={(e) => onInputChange('shortDescription', e.target.value)}
            rows={3}
            className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${
              errors.shortDescription
                ? 'border-red-500 focus:ring-red-500/20'
                : isDark
                  ? 'bg-gray-900 border-gray-700 text-gray-100 focus:border-yellow-500'
                  : 'bg-gray-50 border-gray-300 text-gray-800 focus:border-yellow-400'
            } border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
            placeholder="Brief description of the temple..."
          />
          {errors.shortDescription && <p className="text-red-500 text-xs mt-1.5">{errors.shortDescription}</p>}
        </div>

        <div className="mt-4">
          <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            <Info className="w-4 h-4 inline mr-1" />
            Full Description (Detailed)
          </label>
          <RichTextEditor
            value={formData.fullDescription || ''}
            onChange={(content) => onInputChange('fullDescription', content)}
            placeholder="Write detailed temple description here..."
            minHeight="200px"
            isDark={isDark}
          />
        </div>
      </div>

      {/* Significance & Festivals */}
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
            Significance & Festivals
          </h3>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            <Info className="w-4 h-4 inline mr-1" />
            Significance
          </label>
          <textarea
            value={formData.significance || ''}
            onChange={(e) => onInputChange('significance', e.target.value)}
            rows={2}
            className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${
              isDark
                ? 'bg-gray-900 border-gray-700 text-gray-100 focus:border-yellow-500'
                : 'bg-gray-50 border-gray-300 text-gray-800 focus:border-yellow-400'
            } border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
            placeholder="e.g., One of the 12 Jyotirlingas"
          />
        </div>

        <div className="mt-4">
          <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            <Gift className="w-4 h-4 inline mr-1" />
            Celebrated Festivals
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={festivalsInput}
              onChange={(e) => setFestivalsInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleFestivalsAdd()}
              className={`flex-1 px-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                isDark
                  ? 'bg-gray-900 border-gray-700 text-gray-100 focus:border-yellow-500'
                  : 'bg-gray-50 border-gray-300 text-gray-800 focus:border-yellow-400'
              } border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
              placeholder="Add festival..."
            />
            <button
              onClick={handleFestivalsAdd}
              className="px-4 py-2.5 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {(formData.festivals || []).map((item, index) => (
              <span key={index} className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                isDark 
                  ? 'bg-yellow-500/20 text-yellow-400' 
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                <Gift className="w-3 h-3" />
                {item}
                <button
                  onClick={() => handleFestivalsRemove(index)}
                  className="hover:text-red-500 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
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
              placeholder="temple, spirituality, india, pilgrimage"
            />
          </div>
        </div>
      </div>
    </div>
  );
}