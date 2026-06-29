// components/admin/media/MediaForm.jsx
'use client';

import { useState, useEffect } from "react";
import { 
  Video, 
  Music, 
  Tag, 
  FileText, 
  Globe, 
  FolderOpen,
  User,
  Album,
  Hash
} from "lucide-react";
import { FaYoutube } from "react-icons/fa";
import RichTextEditor from "../RichTextEditor";

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export default function MediaForm({ formData, errors, onInputChange, isDark, categories = [], loadingCategories = false }) {
  const [tagsInput, setTagsInput] = useState(formData.tags?.join(', ') || '');
  const [mediaType, setMediaType] = useState(formData.mediaType || 'video');

  const handleTitleChange = (value) => {
    onInputChange("title", value);
    if (!formData.manualSlug) {
      onInputChange("slug", generateSlug(value));
    }
  };

  const handleSlugChange = (value) => {
    onInputChange("slug", value);
    onInputChange("manualSlug", true);
  };

  const handleTagsChange = (e) => {
    const value = e.target.value;
    setTagsInput(value);
    const tagsArray = value.split(',').map(tag => tag.trim()).filter(tag => tag);
    onInputChange("tags", tagsArray);
  };

  const handleMediaTypeChange = (type) => {
    setMediaType(type);
    onInputChange("mediaType", type);
  };

  useEffect(() => {
    if (formData.tags && Array.isArray(formData.tags)) {
      setTagsInput(formData.tags.join(', '));
    }
  }, [formData.tags]);

  useEffect(() => {
    if (formData.mediaType) {
      setMediaType(formData.mediaType);
    }
  }, [formData.mediaType]);

  return (
    <div className="space-y-5">
      {/* Combined Card: Basic Information + Media Details */}
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
            Basic Information & Media Details
          </h3>
        </div>

        {/* Row 1: Media Type, Title, Slug */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Media Type *
            </label>
            <select
              value={mediaType}
              onChange={(e) => handleMediaTypeChange(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer ${
                isDark
                  ? "bg-gray-900 border-gray-700 text-gray-100 focus:border-yellow-500"
                  : "bg-gray-50 border-gray-300 text-gray-800 focus:border-yellow-400"
              } border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
            >
              <option value="video">🎬 Video</option>
              <option value="bhajan">🎵 Bhajan</option>
            </select>
          </div>

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
                  ? "border-red-500 focus:ring-red-500/20"
                  : isDark
                    ? "bg-gray-900 border-gray-700 text-gray-100 focus:border-yellow-500"
                    : "bg-gray-50 border-gray-300 text-gray-800 focus:border-yellow-400"
              } border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
              placeholder="Enter title..."
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
                  ? "border-red-500 focus:ring-red-500/20"
                  : isDark
                    ? "bg-gray-900 border-gray-700 text-gray-100 focus:border-yellow-500"
                    : "bg-gray-50 border-gray-300 text-gray-800 focus:border-yellow-400"
              } border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
              placeholder="url-slug"
            />
            {errors.slug && <p className="text-red-500 text-xs mt-1.5">{errors.slug}</p>}
          </div>
        </div>

        {/* Row 2: YouTube URL (full width) + Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="md:col-span-1">
            <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <FaYoutube className="w-4 h-4 inline mr-1.5" />
              YouTube URL *
            </label>
            <input
              type="text"
              value={formData.youtubeUrl}
              onChange={(e) => onInputChange("youtubeUrl", e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                errors.youtubeUrl
                  ? "border-red-500 focus:ring-red-500/20"
                  : isDark
                    ? "bg-gray-900 border-gray-700 text-gray-100 focus:border-yellow-500"
                    : "bg-gray-50 border-gray-300 text-gray-800 focus:border-yellow-400"
              } border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
              placeholder="https://www.youtube.com/watch?v=..."
            />
            {errors.youtubeUrl && <p className="text-red-500 text-xs mt-1.5">{errors.youtubeUrl}</p>}
          </div>

          {/* Category - Dropdown with options */}
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <FolderOpen className="w-4 h-4 inline mr-1.5" />
              Category
            </label>
            {loadingCategories ? (
              <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border-2 ${
                isDark ? "border-gray-700 bg-gray-900" : "border-gray-300 bg-gray-50"
              }`}>
                <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Loading...</span>
              </div>
            ) : (
              <select
                value={formData.category}
                onChange={(e) => onInputChange('category', e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer ${
                  isDark
                    ? "bg-gray-900 border-gray-700 text-gray-100 focus:border-yellow-500"
                    : "bg-gray-50 border-gray-300 text-gray-800 focus:border-yellow-400"
                } border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug || cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Row 3: Bhajan Specific Fields */}
        {mediaType === 'bhajan' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}">
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                <User className="w-4 h-4 inline mr-1.5" />
                Artist *
              </label>
              <input
                type="text"
                value={formData.artist}
                onChange={(e) => onInputChange("artist", e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                  errors.artist
                    ? "border-red-500 focus:ring-red-500/20"
                    : isDark
                      ? "bg-gray-900 border-gray-700 text-gray-100 focus:border-yellow-500"
                      : "bg-gray-50 border-gray-300 text-gray-800 focus:border-yellow-400"
                } border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
                placeholder="Enter artist name"
              />
              {errors.artist && <p className="text-red-500 text-xs mt-1.5">{errors.artist}</p>}
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                <Album className="w-4 h-4 inline mr-1.5" />
                Album / Source
              </label>
              <input
                type="text"
                value={formData.album}
                onChange={(e) => onInputChange("album", e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                  isDark
                    ? "bg-gray-900 border-gray-700 text-gray-100 focus:border-yellow-500"
                    : "bg-gray-50 border-gray-300 text-gray-800 focus:border-yellow-400"
                } border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
                placeholder="Enter album/source"
              />
            </div>
          </div>
        )}
      </div>

      {/* Card 3: Description */}
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

        <RichTextEditor
          value={formData.description}
          onChange={(content) => onInputChange("description", content)}
          placeholder="Write your description here..."
          minHeight="150px"
          isDark={isDark}
        />
      </div>

      {/* Card 4: Tags */}
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
            Tags
          </h3>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Tags (comma separated)
          </label>
          <input
            type="text"
            value={tagsInput}
            onChange={handleTagsChange}
            placeholder="spiritual, meditation, devotion, bhajan"
            className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${
              isDark
                ? "bg-gray-900 border-gray-700 text-gray-100 focus:border-yellow-500 placeholder-gray-500"
                : "bg-gray-50 border-gray-300 text-gray-800 focus:border-yellow-400 placeholder-gray-400"
            } border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
          />
          <p className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            Enter tags separated by commas (e.g., spiritual, meditation, devotion)
          </p>
          {formData.tags && formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.tags.map((tag, index) => (
                <span key={index} className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  isDark 
                    ? 'bg-yellow-500/20 text-yellow-400' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Card 5: SEO Settings - Meta Title & Keywords in one row, Description below */}
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
          {/* Row 1: Meta Title + Meta Keywords */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Meta Title
              </label>
              <input
                type="text"
                value={formData.metatitle || ''}
                onChange={(e) => onInputChange("metatitle", e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                  isDark
                    ? "bg-gray-900 border-gray-700 text-gray-100 focus:border-yellow-500"
                    : "bg-gray-50 border-gray-300 text-gray-800 focus:border-yellow-400"
                } border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
                placeholder="Meta title (optional)"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                <Hash className="w-4 h-4 inline mr-1.5" />
                Meta Keywords
              </label>
              <input
                type="text"
                value={formData.metakeywords || ''}
                onChange={(e) => onInputChange("metakeywords", e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                  isDark
                    ? "bg-gray-900 border-gray-700 text-gray-100 focus:border-yellow-500"
                    : "bg-gray-50 border-gray-300 text-gray-800 focus:border-yellow-400"
                } border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
                placeholder="keyword1, keyword2, keyword3 (optional)"
              />
            </div>
          </div>

          {/* Row 2: Meta Description (full width) */}
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Meta Description
            </label>
            <textarea
              value={formData.metadesc || ''}
              onChange={(e) => onInputChange("metadesc", e.target.value)}
              rows={2}
              className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                isDark
                  ? "bg-gray-900 border-gray-700 text-gray-100 focus:border-yellow-500"
                  : "bg-gray-50 border-gray-300 text-gray-800 focus:border-yellow-400"
              } border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
              placeholder="Meta description (optional)"
            />
          </div>
        </div>
      </div>
    </div>
  );
}