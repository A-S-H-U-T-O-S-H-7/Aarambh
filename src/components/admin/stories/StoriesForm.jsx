// components/admin/stories/StoriesForm.jsx
'use client';

import { useState, useEffect } from "react";
import { FileText, Globe, Hash, Tag, FolderOpen, User, Library } from "lucide-react";
import RichTextEditor from "../RichTextEditor";

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Default categories with options
const DEFAULT_CATEGORIES = [
  { id: 'bhakti', name: 'Bhakti', slug: 'bhakti' },
  { id: 'spiritual', name: 'Spiritual', slug: 'spiritual' },
  { id: 'meditation', name: 'Meditation', slug: 'meditation' },
  { id: 'devotional', name: 'Devotional', slug: 'devotional' },
  { id: 'festival', name: 'Festival', slug: 'festival' },
  { id: 'saints', name: 'Saints', slug: 'saints' },
  { id: 'ramayana', name: 'Ramayana', slug: 'ramayana' },
  { id: 'mahabharata', name: 'Mahabharata', slug: 'mahabharata' },
  { id: 'bhagavad_gita', name: 'Bhagavad Gita', slug: 'bhagavad-gita' },
  { id: 'vedas', name: 'Vedas', slug: 'vedas' },
  { id: 'upanishads', name: 'Upanishads', slug: 'upanishads' },
  { id: 'purana', name: 'Purana', slug: 'purana' },
];

export default function StoriesForm({ formData, errors, onInputChange, isDark, categories = DEFAULT_CATEGORIES }) {
  const [tagsInput, setTagsInput] = useState('');

  // Initialize tags input from formData
  useEffect(() => {
    if (formData.tags && Array.isArray(formData.tags) && formData.tags.length > 0) {
      setTagsInput(formData.tags.join(', '));
    } else {
      setTagsInput('');
    }
  }, [formData.tags]);

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
    
    // Split by comma, trim each tag, remove empty tags
    const tagsArray = value
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag !== '');
    
    onInputChange("tags", tagsArray);
  };

  // Handle keydown for better user experience
  const handleTagsKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Force update tags on Enter key
      const value = e.target.value;
      if (value.trim()) {
        const tagsArray = value
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag !== '');
        onInputChange("tags", tagsArray);
      }
    }
  };

  // Remove a tag
  const removeTag = (indexToRemove) => {
    const newTags = formData.tags.filter((_, index) => index !== indexToRemove);
    onInputChange("tags", newTags);
    // Update input value
    setTagsInput(newTags.join(', '));
  };

  return (
    <div className="space-y-5">
      {/* Card 1: Basic Information */}
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
              Story Title *
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
              placeholder="Enter story title..."
            />
            {errors.title && <p className="text-red-500 text-xs mt-1.5">{errors.title}</p>}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              URL Slug *
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
              placeholder="story-url-slug"
            />
            {errors.slug && <p className="text-red-500 text-xs mt-1.5">{errors.slug}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <FolderOpen className="w-4 h-4 inline mr-1.5" />
              Category
            </label>
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
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <Tag className="w-4 h-4 inline mr-1.5" />
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={handleTagsChange}
              onKeyDown={handleTagsKeyDown}
              placeholder="spiritual, devotion, wisdom, story"
              className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                isDark
                  ? "bg-gray-900 border-gray-700 text-gray-100 focus:border-yellow-500 placeholder-gray-500"
                  : "bg-gray-50 border-gray-300 text-gray-800 focus:border-yellow-400 placeholder-gray-400"
              } border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
            />
            <p className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              Enter tags separated by commas (e.g., spiritual, devotion, wisdom)
            </p>
            
            {/* Tag Badges */}
            {formData.tags && formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${
                      isDark 
                        ? 'bg-yellow-500/20 text-yellow-400' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="hover:text-red-500 transition-colors ml-0.5"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card 2: Story Details */}
      <div className={`rounded-2xl border p-6 transition-all duration-300 hover:shadow-xl ${
        isDark 
          ? 'border-gray-700 bg-gray-800/90 shadow-lg' 
          : 'border-gray-200 bg-white shadow-md'
      }`}>
        <div className="flex items-center gap-3 mb-5 pb-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}">
          <div className="rounded-lg bg-gradient-to-r from-amber-400 to-orange-500 p-2">
            <Library className="w-4 h-4 text-white" />
          </div>
          <h3 className={`text-base font-semibold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
            Story Details
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <User className="w-4 h-4 inline mr-1.5" />
              Author
            </label>
            <input
              type="text"
              value={formData.author || ''}
              onChange={(e) => onInputChange("author", e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                isDark
                  ? "bg-gray-900 border-gray-700 text-gray-100 focus:border-yellow-500"
                  : "bg-gray-50 border-gray-300 text-gray-800 focus:border-yellow-400"
              } border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
              placeholder="Author name"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Source
            </label>
            <input
              type="text"
              value={formData.source || ''}
              onChange={(e) => onInputChange("source", e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                isDark
                  ? "bg-gray-900 border-gray-700 text-gray-100 focus:border-yellow-500"
                  : "bg-gray-50 border-gray-300 text-gray-800 focus:border-yellow-400"
              } border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
              placeholder="Scripture, saint, tradition, etc."
            />
          </div>
        </div>

        <div className="mt-4">
          <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Short Description
          </label>
          <textarea
            value={formData.description || ''}
            onChange={(e) => onInputChange("description", e.target.value)}
            rows={3}
            className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${
              isDark
                ? "bg-gray-900 border-gray-700 text-gray-100 focus:border-yellow-500"
                : "bg-gray-50 border-gray-300 text-gray-800 focus:border-yellow-400"
            } border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
            placeholder="Brief summary for the story card and detail page"
          />
        </div>

        <div className="mt-4">
          <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Moral of the Story
          </label>
          <textarea
            value={formData.moral || ''}
            onChange={(e) => onInputChange("moral", e.target.value)}
            rows={3}
            className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${
              isDark
                ? "bg-gray-900 border-gray-700 text-gray-100 focus:border-yellow-500"
                : "bg-gray-50 border-gray-300 text-gray-800 focus:border-yellow-400"
            } border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
            placeholder="The lesson or takeaway from the story"
          />
        </div>
      </div>

      {/* Card 3: Story Content */}
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
            Story Content
          </h3>
        </div>

        <RichTextEditor
          value={formData.content}
          onChange={(content) => onInputChange("content", content)}
          placeholder="Write your spiritual story here..."
          minHeight="250px"
          isDark={isDark}
        />
        {errors.content && <p className="text-red-500 text-xs mt-2">{errors.content}</p>}
      </div>

      {/* Card 4: SEO Settings */}
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