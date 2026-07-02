// components/admin/settings/SocialLinks.jsx
'use client';

import { useState } from "react";
import { Save, Share2 } from "lucide-react";
import { 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaYoutube, 
  FaWhatsapp,
  FaTelegram
} from "react-icons/fa";

export default function SocialLinks({ settings, onUpdate, isDark }) {
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

  const socialIcons = {
    facebook: FaFacebook,
    twitter: FaTwitter,
    instagram: FaInstagram,
    youtube: FaYoutube,
    whatsapp: FaWhatsapp,
    telegram: FaTelegram,
  };

  const socialNames = {
    facebook: 'Facebook',
    twitter: 'Twitter',
    instagram: 'Instagram',
    youtube: 'YouTube',
    whatsapp: 'WhatsApp',
    telegram: 'Telegram',
  };

  const socialColors = {
    facebook: 'text-[#1877f2]',
    twitter: 'text-[#1da1f2]',
    instagram: 'text-[#e4405f]',
    youtube: 'text-[#ff0000]',
    whatsapp: 'text-[#25d366]',
    telegram: 'text-[#26a5e4]',
  };

  const socialPlaceholders = {
    facebook: 'https://facebook.com/your-page',
    twitter: 'https://twitter.com/your-handle',
    instagram: 'https://instagram.com/your-username',
    youtube: 'https://youtube.com/@your-channel',
    whatsapp: 'https://wa.me/your-number',
    telegram: 'https://t.me/your-channel',
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
            <Share2 className="w-5 h-5 text-yellow-500" />
          </div>
          <h2 className={`text-xl font-bold ${isDark ? "text-gray-100" : "text-gray-800"}`}>
            Social Media Links
          </h2>
        </div>

        <div className="space-y-4">
          {Object.entries(formData).map(([key, value]) => {
            const Icon = socialIcons[key];
            const iconColor = socialColors[key];
            const placeholder = socialPlaceholders[key];
            const label = socialNames[key];
            
            return (
              <div key={key}>
                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  {label} URL
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Icon className={`w-4 h-4 ${iconColor}`} />
                  </div>
                  <input
                    type="url"
                    value={value}
                    onChange={(e) => handleChange(key, e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition-all duration-200 focus:ring-2 focus:ring-yellow-400/20 focus:outline-none ${
                      isDark
                        ? "bg-gray-900 border-gray-700 text-gray-100 focus:border-yellow-500 placeholder-gray-500"
                        : "bg-gray-50 border-gray-300 text-gray-800 focus:border-yellow-400 placeholder-gray-400"
                    } border-2`}
                    placeholder={placeholder}
                  />
                </div>
              </div>
            );
          })}
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