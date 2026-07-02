// components/admin/settings/SeoSettings.jsx
'use client';

import { useState } from "react";
import { Search, FileText, Tag, Code, Save } from "lucide-react";

export default function SeoSettings({ settings, onUpdate, isDark }) {
  const [formData, setFormData] = useState(settings);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await onUpdate(formData);
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className={`rounded-2xl border p-6 transition-all duration-300 ${
        isDark 
          ? 'border-gray-700 bg-gray-800/90 shadow-lg' 
          : 'border-gray-200 bg-white shadow-md'
      }`}>
        <div className="flex items-center gap-3 mb-6">
          <div className={`p-2 rounded-xl ${isDark ? "bg-yellow-500/20" : "bg-yellow-500/10"}`}>
            <Search className="w-5 h-5 text-yellow-500" />
          </div>
          <h2 className={`text-xl font-bold ${isDark ? "text-gray-100" : "text-gray-800"}`}>
            SEO Settings
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Meta Title
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={formData.metaTitle || ''}
                onChange={(e) => handleChange('metaTitle', e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition-all duration-200 focus:ring-2 focus:ring-yellow-400/20 focus:outline-none ${
                  isDark
                    ? "bg-gray-900 border-gray-700 text-gray-100 focus:border-yellow-500"
                    : "bg-gray-50 border-gray-300 text-gray-800 focus:border-yellow-400"
                } border-2`}
                placeholder="Enter meta title"
              />
            </div>
            <p className={`text-xs mt-1.5 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
              Recommended: 50-60 characters. Currently: {formData.metaTitle?.length || 0}
            </p>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Meta Description
            </label>
            <textarea
              value={formData.metaDescription || ''}
              onChange={(e) => handleChange('metaDescription', e.target.value)}
              rows={3}
              className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200 focus:ring-2 focus:ring-yellow-400/20 focus:outline-none resize-none ${
                isDark
                  ? "bg-gray-900 border-gray-700 text-gray-100 focus:border-yellow-500"
                  : "bg-gray-50 border-gray-300 text-gray-800 focus:border-yellow-400"
              } border-2`}
              placeholder="Enter meta description"
            />
            <p className={`text-xs mt-1.5 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
              Recommended: 150-160 characters. Currently: {formData.metaDescription?.length || 0}
            </p>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Meta Keywords
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={formData.metaKeywords || ''}
                onChange={(e) => handleChange('metaKeywords', e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition-all duration-200 focus:ring-2 focus:ring-yellow-400/20 focus:outline-none ${
                  isDark
                    ? "bg-gray-900 border-gray-700 text-gray-100 focus:border-yellow-500"
                    : "bg-gray-50 border-gray-300 text-gray-800 focus:border-yellow-400"
                } border-2`}
                placeholder="keyword1, keyword2, keyword3"
              />
            </div>
            <p className={`text-xs mt-1.5 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
              Separate keywords with commas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                Google Analytics ID
              </label>
              <div className="relative">
                <Code className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.googleAnalyticsId || ''}
                  onChange={(e) => handleChange('googleAnalyticsId', e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition-all duration-200 focus:ring-2 focus:ring-yellow-400/20 focus:outline-none ${
                    isDark
                      ? "bg-gray-900 border-gray-700 text-gray-100 focus:border-yellow-500"
                      : "bg-gray-50 border-gray-300 text-gray-800 focus:border-yellow-400"
                  } border-2`}
                  placeholder="G-XXXXXXXXXX"
                />
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                Google Site Verification
              </label>
              <input
                type="text"
                value={formData.googleSiteVerification || ''}
                onChange={(e) => handleChange('googleSiteVerification', e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200 focus:ring-2 focus:ring-yellow-400/20 focus:outline-none ${
                  isDark
                    ? "bg-gray-900 border-gray-700 text-gray-100 focus:border-yellow-500"
                    : "bg-gray-50 border-gray-300 text-gray-800 focus:border-yellow-400"
                } border-2`}
                placeholder="Enter verification code"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-semibold transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </form>
  );
}