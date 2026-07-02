// components/admin/temples/TempleSidebar.jsx
'use client';

import { useState, useRef } from 'react';
import { Calendar, Save, Star, Upload, X, Image as ImageIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';

// Toggle Switch Component
const ToggleSwitch = ({ enabled = false, onChange, label, icon: Icon, isDark }) => {
  return (
    <label className="flex items-center justify-between cursor-pointer group">
      <div className="flex items-center gap-2.5">
        {Icon && <Icon className={`w-4 h-4 ${enabled ? 'text-yellow-500' : isDark ? 'text-gray-500' : 'text-gray-400'}`} />}
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
            enabled ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' : isDark ? 'bg-gray-700' : 'bg-gray-300'
          }`}
        />
        <div
          className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all duration-200 ${
            enabled ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </div>
    </label>
  );
};

export default function TempleSidebar({ 
  formData, 
  onInputChange, 
  onSubmit, 
  isLoading, 
  isDark,
  existingImages = []
}) {
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState(existingImages || []);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 5MB)`);
        return false;
      }
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setImageFiles(prev => [...prev, ...validFiles]);
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
    onInputChange('imageFiles', [...imageFiles, ...validFiles]);
  };

  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    const updatedFiles = imageFiles.filter((_, i) => i !== index);
    onInputChange('imageFiles', updatedFiles);
  };

  const removeExistingImage = (imageUrl) => {
    const updatedImages = existingImages.filter(url => url !== imageUrl);
    onInputChange('existingImages', updatedImages);
    setImagePreviews(prev => prev.filter(url => url !== imageUrl));
  };

  const getButtonText = () => {
    if (isLoading) return formData.status === 'published' ? 'Publishing...' : 'Saving...';
    return formData.status === 'published' ? 'Publish Temple' : 'Save as Draft';
  };

  return (
    <div className="space-y-5">
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
                  ? 'bg-gray-900 border-gray-700 text-gray-100 focus:border-yellow-500'
                  : 'bg-gray-50 border-gray-300 text-gray-800 focus:border-yellow-400'
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
                  ? 'bg-gray-900 border-gray-700 text-gray-100 focus:border-yellow-500'
                  : 'bg-gray-50 border-gray-300 text-gray-800 focus:border-yellow-400'
              } border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
            />
          </div>
        </div>
      </div>

      {/* Featured Options */}
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

        <ToggleSwitch
          enabled={formData.featured}
          onChange={(val) => onInputChange('featured', val)}
          label="Featured Temple"
          icon={Star}
          isDark={isDark}
        />
      </div>

      {/* Images Upload */}
      <div className={`rounded-2xl border p-5 transition-all duration-300 hover:shadow-xl ${
        isDark 
          ? 'border-gray-700 bg-gray-800/90 shadow-lg' 
          : 'border-gray-200 bg-white shadow-md'
      }`}>
        <div className="flex items-center gap-2.5 mb-4">
          <div className="rounded-lg bg-gradient-to-r from-blue-400 to-blue-500 p-1.5">
            <ImageIcon className="w-4 h-4 text-white" />
          </div>
          <h3 className={`text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
            Images
          </h3>
          <span className={`ml-auto text-xs px-2 py-1 rounded-full ${isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
            {imagePreviews.length + existingImages.length} images
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-3">
          {existingImages.map((url, index) => (
            <div key={`existing-${index}`} className="relative aspect-square rounded-lg overflow-hidden">
              <img src={url} alt={`Image ${index + 1}`} className="w-full h-full object-cover" />
              <button
                onClick={() => removeExistingImage(url)}
                className="absolute top-1 right-1 p-0.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          {imagePreviews.map((preview, index) => (
            <div key={`new-${index}`} className="relative aspect-square rounded-lg overflow-hidden">
              <img src={preview} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 p-0.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        <label className={`flex items-center justify-center gap-2 w-full p-3 rounded-lg border-2 border-dashed cursor-pointer transition-all ${
          isDark
            ? 'border-gray-700 hover:border-yellow-500 bg-gray-900/30'
            : 'border-gray-300 hover:border-yellow-400 bg-gray-50'
        }`}>
          <Upload className="w-4 h-4 text-yellow-500" />
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Upload Images
          </span>
          <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            (Max 5MB each)
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageUpload}
          />
        </label>
      </div>

      {/* Save Button */}
      <button
        onClick={onSubmit}
        disabled={isLoading}
        className={`w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
          formData.status === 'published'
            ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 shadow-lg hover:shadow-xl'
            : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl'
        }`}
      >
        <Save className="w-4 h-4" />
        <span>{getButtonText()}</span>
      </button>
    </div>
  );
}