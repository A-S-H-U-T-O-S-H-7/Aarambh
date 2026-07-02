// components/admin/media/MediaSidebar.jsx
'use client';

import { useState, useEffect } from "react";
import { Calendar, Save, Star, TrendingUp, Clock, Video } from "lucide-react";
import { FaYoutube } from "react-icons/fa";

// Toggle Switch Component
const ToggleSwitch = ({ enabled = false, onChange, label, icon: Icon, isDark }) => {
  return (
    <label className="flex items-center justify-between cursor-pointer group">
      <div className="flex items-center gap-2.5">
        {Icon && <Icon className={`w-4 h-4 ${enabled ? "text-yellow-500" : isDark ? "text-gray-500" : "text-gray-400"}`} />}
        <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{label}</span>
      </div>
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={enabled === true}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div
          className={`block w-11 h-6 rounded-full transition-all duration-200 ${
            enabled ? "bg-gradient-to-r from-yellow-400 to-yellow-500" : isDark ? "bg-gray-700" : "bg-gray-300"
          }`}
        />
        <div
          className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all duration-200 ${
            enabled ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </div>
    </label>
  );
};

export default function MediaSidebar({ 
  formData, 
  onInputChange, 
  onSubmit, 
  isLoading, 
  isDark,
  videoPreview,
}) {
  const getButtonText = () => {
    if (isLoading) return formData.status === 'published' ? "Publishing..." : "Saving...";
    return formData.status === 'published' ? "Publish Media" : "Save as Draft";
  };

  return (
    <div className="space-y-5">
      {/* Preview Card */}
      {videoPreview && (
        <div className={`rounded-2xl border p-5 transition-all duration-300 hover:shadow-xl ${
          isDark 
            ? 'border-gray-700 bg-gray-800/90 shadow-lg' 
            : 'border-gray-200 bg-white shadow-md'
        }`}>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="rounded-lg bg-gradient-to-r from-red-500 to-red-600 p-1.5">
              <FaYoutube className="w-4 h-4 text-white" />
            </div>
            <h3 className={`text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
              Preview
            </h3>
          </div>
          <div className="aspect-video rounded-lg overflow-hidden bg-gray-900 shadow-inner">
            <iframe
              src={`https://www.youtube.com/embed/${videoPreview}`}
              title="Preview"
              className="w-full h-full"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Status Card */}
      <div className={`rounded-2xl border p-5 transition-all duration-300 hover:shadow-xl ${
        isDark 
          ? 'border-gray-700 bg-gray-800/90 shadow-lg' 
          : 'border-gray-200 bg-white shadow-md'
      }`}>
        <div className="flex items-center gap-2.5 mb-4">
          <div className="rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 p-1.5">
            <Calendar className="w-4 h-4 text-white" />
          </div>
          <h3 className={`text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
            Status & Publishing
          </h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => onInputChange('status', e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer ${
                isDark
                  ? "bg-gray-900 border-gray-700 text-gray-100 focus:border-yellow-500"
                  : "bg-gray-50 border-gray-300 text-gray-800 focus:border-yellow-400"
              } border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
            >
              <option value="draft">📝 Draft</option>
              <option value="published">🚀 Published</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <Calendar className="w-4 h-4 inline mr-1.5" />
              Publish Date
            </label>
            <input
              type="date"
              value={formData.publishDate || new Date().toISOString().split('T')[0]}
              onChange={(e) => onInputChange('publishDate', e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer ${
                isDark
                  ? "bg-gray-900 border-gray-700 text-gray-100 focus:border-yellow-500"
                  : "bg-gray-50 border-gray-300 text-gray-800 focus:border-yellow-400"
              } border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
            />
          </div>
        </div>
      </div>


{/* Video Type - Only for videos */}
{formData.mediaType === 'video' && (
  <div className={`rounded-2xl border p-5 transition-all duration-300 hover:shadow-xl ${
    isDark 
      ? 'border-gray-700 bg-gray-800/90 shadow-lg' 
      : 'border-gray-200 bg-white shadow-md'
  }`}>
    <div className="flex items-center gap-2.5 mb-4">
      <div className="rounded-lg bg-gradient-to-r from-purple-400 to-purple-500 p-1.5">
        <Video className="w-4 h-4 text-white" />
      </div>
      <h3 className={`text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
        Video Type
      </h3>
    </div>

    <div>
      <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
        Select Video Format
      </label>
      <select
        value={formData.videoType || 'standard'}
        onChange={(e) => onInputChange('videoType', e.target.value)}
        className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer ${
          isDark
            ? 'bg-gray-900 border-gray-700 text-gray-100 focus:border-yellow-500'
            : 'bg-gray-50 border-gray-300 text-gray-800 focus:border-yellow-400'
        } border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
      >
        <option value="standard">🎬 Full Video (16:9)</option>
        <option value="short">📱 Short (4:5)</option>
        <option value="reel">📱 Reel (4:5)</option>
      </select>
      <div className={`mt-2 p-2 rounded-lg ${formData.videoType === 'standard' ? 'bg-blue-500/10 border border-blue-500/30' : formData.videoType === 'short' || formData.videoType === 'reel' ? 'bg-purple-500/10 border border-purple-500/30' : ''}`}>
        <p className="text-xs text-blue-600 dark:text-blue-400">
          {formData.videoType === 'standard' && '🎬 Full video format for regular content'}
          {formData.videoType === 'short' && '📱 Short format for mobile-first content (Instagram Style)'}
          {formData.videoType === 'reel' && '📱 Reel format for social media style content (Instagram Style)'}
        </p>
      </div>
    </div>
  </div>
)}

      {/* Featured Options Card */}
      <div className={`rounded-2xl border p-5 transition-all duration-300 hover:shadow-xl ${
        isDark 
          ? 'border-gray-700 bg-gray-800/90 shadow-lg' 
          : 'border-gray-200 bg-white shadow-md'
      }`}>
        <div className="flex items-center gap-2.5 mb-4">
          <div className="rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 p-1.5">
            <Star className="w-4 h-4 text-white" />
          </div>
          <h3 className={`text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
            Featured Options
          </h3>
        </div>

        <div className="space-y-3.5">
          <ToggleSwitch
            enabled={formData.isFeatured}
            onChange={(val) => onInputChange('isFeatured', val)}
            label="Featured"
            icon={Star}
            isDark={isDark}
          />
          
          <ToggleSwitch
            enabled={formData.isTrending}
            onChange={(val) => onInputChange('isTrending', val)}
            label="Trending"
            icon={TrendingUp}
            isDark={isDark}
          />
        </div>
      </div>

      {/* Save Buttons */}
      <div className="space-y-3">
        {/* Primary Save Button */}
        <button
          onClick={onSubmit}
          disabled={isLoading}
          className={`w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
            formData.status === 'published'
              ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 shadow-lg hover:shadow-xl"
              : "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl"
          }`}
        >
          <Save className="w-4 h-4" />
          <span>{getButtonText()}</span>
        </button>

        {/* Save as Draft Button (Secondary) */}
        {formData.status === 'published' && (
          <button
            onClick={() => {
              onInputChange('status', 'draft');
              setTimeout(onSubmit, 100);
            }}
            disabled={isLoading}
            className={`w-full flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
              isDark
                ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <Save className="w-4 h-4" />
            Save as Draft
          </button>
        )}
      </div>
    </div>
  );
}