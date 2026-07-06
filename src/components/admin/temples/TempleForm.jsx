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
  Gift,
  Sparkles
} from 'lucide-react';
import RichTextEditor from '../RichTextEditor';
import AIGenerateButton from '@/components/admin/AIGenerateButton';
import TempleVoiceoverGenerator from '../voiceover/TempleVoiceoverGenerator';
import { FaHeadphones } from 'react-icons/fa';

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

// ─── COMPONENT ───

export default function TempleForm({ formData, errors, onInputChange, isDark, templeId = null }) {
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

  // ─── AI CONTENT ───
  const getAIContent = () => {
    const name = formData.title || '';
    const location = formData.location || '';
    const deity = formData.deity || '';
    const description = formData.fullDescription || '';
    return `Temple: ${name}\nLocation: ${location}\nDeity: ${deity}\nDescription: ${description}`;
  };

  // Check if all required fields are filled for AI
  const isAIEnabled = () => {
    return !!(
      formData.title?.trim() &&
      formData.location?.trim() &&
      formData.deity?.trim() &&
      formData.fullDescription?.trim()
    );
  };

  // Handle AI generated data
  const handleAIGenerated = (field, value) => {
    if (field === 'shortDescription') {
      onInputChange('shortDescription', value);
    } else if (field === 'significance') {
      onInputChange('significance', value);
    } else if (field === 'festivals') {
      // Festivals come as comma-separated string, convert to array
      const festivalsArray = value.split(',').map(f => f.trim()).filter(f => f);
      onInputChange('festivals', festivalsArray);
    } else if (field === 'metatitle') {
      onInputChange('metatitle', value);
    } else if (field === 'metadesc') {
      onInputChange('metadesc', value);
    } else if (field === 'metakeywords') {
      onInputChange('metakeywords', value);
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
              Deity *
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
              Descriptions
            </h3>
          </div>
          
          {/* AI Generate Button - Enabled only when required fields are filled */}
          <AIGenerateButton
            content={getAIContent()}
            onGenerated={handleAIGenerated}
            label="✨ Generate SEO & Details"
            size="sm"
            disabled={!isAIEnabled()}
          />
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
            Full Description (Detailed) *
          </label>
          <RichTextEditor
            value={formData.fullDescription || ''}
            onChange={(content) => onInputChange('fullDescription', content)}
            placeholder="Write detailed temple description here..."
            minHeight="200px"
            isDark={isDark}
          />
          {errors.fullDescription && <p className="text-red-500 text-xs mt-1.5">{errors.fullDescription}</p>}
        </div>
      </div>

      {/* ─── Card 3: Significance & Festivals ─── */}
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

      {/* ─── Card 4: SEO Settings ─── */}
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

      {/* ─── Card 5: AI Voiceover ─── */}
{(templeId || formData.id) && formData.fullDescription && (
  <div className={`rounded-2xl border p-6 transition-all duration-300 hover:shadow-xl ${
    isDark 
      ? 'border-gray-700 bg-gray-800/90 shadow-lg' 
      : 'border-gray-200 bg-white shadow-md'
  }`}>
    <div className="flex items-center gap-3 mb-4 pb-4 border-b">
      <div className="rounded-lg bg-gradient-to-r from-purple-400 to-pink-400 p-2">
        <FaHeadphones className="w-4 h-4 text-white" />
      </div>
      <h3 className={`text-base font-semibold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
        AI Voiceover
      </h3>
      {formData.voiceoverUrl && (
        <span className="ml-auto text-xs px-2.5 py-1 rounded-full bg-green-500/20 text-green-600 dark:bg-green-500/30 dark:text-green-400">
          ✅ Voiceover Ready
        </span>
      )}
    </div>

    <TempleVoiceoverGenerator
      contentId={templeId || formData.id}
      templeData={{
        title: formData.title,
        location: formData.location,
        deity: formData.deity,
        established: formData.established,
        shortDescription: formData.shortDescription,
        fullDescription: formData.fullDescription,
        significance: formData.significance,
        festivals: formData.festivals,
      }}
      existingVoiceoverUrl={formData.voiceoverUrl}
      isDark={isDark}
      onVoiceoverGenerated={(url) => {
        onInputChange('voiceoverUrl', url);
        onInputChange('voiceoverStatus', url ? 'completed' : null);
      }}
    />
  </div>
)}
    </div>
  );
}