// components/admin/settings/ContactSettings.jsx
'use client';

import { useState } from "react";
import { Phone, Mail, MapPin, Save } from "lucide-react";

export default function ContactSettings({ settings, onUpdate, isDark }) {
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
            <Phone className="w-5 h-5 text-yellow-500" />
          </div>
          <h2 className={`text-xl font-bold ${isDark ? "text-gray-100" : "text-gray-800"}`}>
            Contact Information
          </h2>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                Phone Number 1
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  value={formData.phone1 || ''}
                  onChange={(e) => handleChange('phone1', e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition-all duration-200 focus:ring-2 focus:ring-yellow-400/20 focus:outline-none ${
                    isDark
                      ? "bg-gray-900 border-gray-700 text-gray-100 focus:border-yellow-500"
                      : "bg-gray-50 border-gray-300 text-gray-800 focus:border-yellow-400"
                  } border-2`}
                  placeholder="+91 1234567890"
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                Phone Number 2 (Optional)
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  value={formData.phone2 || ''}
                  onChange={(e) => handleChange('phone2', e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition-all duration-200 focus:ring-2 focus:ring-yellow-400/20 focus:outline-none ${
                    isDark
                      ? "bg-gray-900 border-gray-700 text-gray-100 focus:border-yellow-500"
                      : "bg-gray-50 border-gray-300 text-gray-800 focus:border-yellow-400"
                  } border-2`}
                  placeholder="+91 9876543210"
                />
              </div>
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Contact Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={formData.contactEmail || ''}
                onChange={(e) => handleChange('contactEmail', e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition-all duration-200 focus:ring-2 focus:ring-yellow-400/20 focus:outline-none ${
                  isDark
                    ? "bg-gray-900 border-gray-700 text-gray-100 focus:border-yellow-500"
                    : "bg-gray-50 border-gray-300 text-gray-800 focus:border-yellow-400"
                } border-2`}
                placeholder="contact@aarambhtv.com"
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Office Address
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <textarea
                value={formData.address || ''}
                onChange={(e) => handleChange('address', e.target.value)}
                rows={3}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition-all duration-200 focus:ring-2 focus:ring-yellow-400/20 focus:outline-none resize-none ${
                  isDark
                    ? "bg-gray-900 border-gray-700 text-gray-100 focus:border-yellow-500"
                    : "bg-gray-50 border-gray-300 text-gray-800 focus:border-yellow-400"
                } border-2`}
                placeholder="Mumbai, India"
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
            {isLoading ? "Saving..." : "Save Contact Info"}
          </button>
        </div>
      </div>
    </form>
  );
}