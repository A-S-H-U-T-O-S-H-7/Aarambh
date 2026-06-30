// components/admin/daily/HeroManager.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Sparkles, Save, Upload, X, Image as ImageIcon, Monitor, Smartphone } from 'lucide-react';
import { toast } from 'react-hot-toast';

const DEFAULT_HERO_VALUES = {
  headingLine1: 'Begin Every Day',
  headingLine2: 'with Divine Wisdom',
  tagline: 'आरम्भः सर्वकार्येषु मङ्गलाचरणम्',
  ctaText: 'Explore Now',
  ctaLink: '#explore',
  desktopImage: '',
  mobileImage: '',
};

export default function HeroManager({ data, onSave, isDark, saving }) {
  const [hero, setHero] = useState(DEFAULT_HERO_VALUES);
  
  const [desktopFile, setDesktopFile] = useState(null);
  const [mobileFile, setMobileFile] = useState(null);
  const [desktopPreview, setDesktopPreview] = useState(null);
  const [mobilePreview, setMobilePreview] = useState(null);
  
  const desktopInputRef = useRef(null);
  const mobileInputRef = useRef(null);

  useEffect(() => {
    if (data) {
      const headingLine1 =
        data.headingLine1?.trim() ||
        data.titleLine1?.trim() ||
        data.primaryHeading?.trim() ||
        data.heading?.trim() ||
        DEFAULT_HERO_VALUES.headingLine1;

      const headingLine2 =
        data.headingLine2?.trim() ||
        data.titleLine2?.trim() ||
        data.accentHeading?.trim() ||
        DEFAULT_HERO_VALUES.headingLine2;

      setHero({
        headingLine1,
        headingLine2,
        tagline: data.tagline?.trim() || DEFAULT_HERO_VALUES.tagline,
        ctaText: data.ctaText?.trim() || DEFAULT_HERO_VALUES.ctaText,
        ctaLink: data.ctaLink?.trim() || DEFAULT_HERO_VALUES.ctaLink,
        desktopImage: data.desktopImage || '',
        mobileImage: data.mobileImage || '',
      });
      setDesktopPreview(data.desktopImage || null);
      setMobilePreview(data.mobileImage || null);
    }
  }, [data]);

  const handleChange = (field, value) => {
    setHero({ ...hero, [field]: value });
  };

  const handleDesktopUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    
    setDesktopFile(file);
    setDesktopPreview(URL.createObjectURL(file));
  };

  const handleMobileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    
    setMobileFile(file);
    setMobilePreview(URL.createObjectURL(file));
  };

  const removeDesktopImage = () => {
    setDesktopFile(null);
    setDesktopPreview(null);
    setHero({ ...hero, desktopImage: '' });
    if (desktopInputRef.current) desktopInputRef.current.value = '';
  };

  const removeMobileImage = () => {
    setMobileFile(null);
    setMobilePreview(null);
    setHero({ ...hero, mobileImage: '' });
    if (mobileInputRef.current) mobileInputRef.current.value = '';
  };

  const handleSave = () => {
    if (!hero.headingLine1?.trim() || !hero.ctaText?.trim()) {
      toast.error('Please fill in required fields');
      return;
    }
    
    const saveData = {
      ...hero,
      heading: [hero.headingLine1?.trim(), hero.headingLine2?.trim()].filter(Boolean).join(' '),
      headingLine1: hero.headingLine1?.trim(),
      headingLine2: hero.headingLine2?.trim(),
      tagline: hero.tagline?.trim() || 'आरम्भः सर्वकार्येषु मङ्गलाचरणम्',
      oldDesktopImage: data?.desktopImage || null,
      oldMobileImage: data?.mobileImage || null,
    };
    
    onSave(saveData, desktopFile, mobileFile);
  };

  const isFormValid = hero.headingLine1?.trim() && hero.ctaText?.trim();

  return (
    <div className={`rounded-2xl border p-5 transition-all duration-300 hover:shadow-lg ${
      isDark 
        ? 'border-gray-700/50 bg-gradient-to-br from-gray-800/90 to-gray-900/90 shadow-md' 
        : 'border-gray-200/50 bg-white shadow-md'
    }`}>
      <div className="flex items-center gap-2.5 mb-4">
        <div className="rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 p-1.5">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <h2 className={`text-base font-semibold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
          Hero Section
        </h2>
        {data?.updatedAt && (
          <span className={`ml-auto text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            Updated {new Date(data.updatedAt).toLocaleDateString()}
          </span>
        )}
      </div>

      <div className="space-y-3.5">
        {/* Heading & Tagline */}
        <div className="grid gap-3">
          <div>
            <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Title Line 1 (White)
            </label>
            <input
              type="text"
              value={hero.headingLine1}
              onChange={(e) => handleChange('headingLine1', e.target.value)}
              className={`w-full px-3 py-2 rounded-lg text-sm transition-colors ${
                isDark 
                  ? 'bg-gray-900/50 border-gray-700 text-gray-100 focus:border-yellow-500' 
                  : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-yellow-400'
              } border focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
              placeholder="Enter first title line"
            />
          </div>

          <div>
            <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Title Line 2 (Golden)
            </label>
            <input
              type="text"
              value={hero.headingLine2}
              onChange={(e) => handleChange('headingLine2', e.target.value)}
              className={`w-full px-3 py-2 rounded-lg text-sm transition-colors ${
                isDark 
                  ? 'bg-gray-900/50 border-gray-700 text-gray-100 focus:border-yellow-500' 
                  : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-yellow-400'
              } border focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
              placeholder="Enter second title line"
            />
          </div>

          <div>
            <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Tagline
            </label>
            <input
              type="text"
              value={hero.tagline}
              onChange={(e) => handleChange('tagline', e.target.value)}
              className={`w-full px-3 py-2 rounded-lg text-sm transition-colors ${
                isDark 
                  ? 'bg-gray-900/50 border-gray-700 text-gray-100 focus:border-yellow-500' 
                  : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-yellow-400'
              } border focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
              placeholder="Enter tagline"
            />
          </div>
        </div>

        {/* CTA */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              CTA Text
            </label>
            <input
              type="text"
              value={hero.ctaText}
              onChange={(e) => handleChange('ctaText', e.target.value)}
              className={`w-full px-3 py-2 rounded-lg text-sm transition-colors ${
                isDark 
                  ? 'bg-gray-900/50 border-gray-700 text-gray-100 focus:border-yellow-500' 
                  : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-yellow-400'
              } border focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
              placeholder="Button text"
            />
          </div>
          <div>
            <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              CTA Link
            </label>
            <input
              type="text"
              value={hero.ctaLink}
              onChange={(e) => handleChange('ctaLink', e.target.value)}
              className={`w-full px-3 py-2 rounded-lg text-sm transition-colors ${
                isDark 
                  ? 'bg-gray-900/50 border-gray-700 text-gray-100 focus:border-yellow-500' 
                  : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-yellow-400'
              } border focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
              placeholder="URL"
            />
          </div>
        </div>

        {/* Desktop Image Upload */}
        <div>
          <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <div className="flex items-center gap-1.5">
              <Monitor className="w-3.5 h-3.5" />
              Desktop Background Image
            </div>
          </label>
          {desktopPreview ? (
            <div className="relative rounded-lg overflow-hidden">
              <img 
                src={desktopPreview} 
                alt="Desktop background" 
                className="w-full h-28 object-cover rounded-lg"
              />
              <button
                onClick={removeDesktopImage}
                className="absolute top-1.5 right-1.5 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <label className={`flex items-center gap-2 w-full p-3 rounded-lg border-2 border-dashed cursor-pointer transition-all ${
              isDark
                ? 'border-gray-700 hover:border-yellow-500 bg-gray-900/30'
                : 'border-gray-300 hover:border-yellow-400 bg-gray-50'
            }`}>
              <Upload className="w-4 h-4 text-yellow-500" />
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Upload Desktop Image
              </span>
              <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                (Recommended: 1920x1080)
              </span>
              <input
                ref={desktopInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleDesktopUpload}
              />
            </label>
          )}
        </div>

        {/* Mobile Image Upload */}
        <div>
          <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <div className="flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5" />
              Mobile Background Image
            </div>
          </label>
          {mobilePreview ? (
            <div className="relative rounded-lg overflow-hidden">
              <img 
                src={mobilePreview} 
                alt="Mobile background" 
                className="w-full h-28 object-cover rounded-lg"
              />
              <button
                onClick={removeMobileImage}
                className="absolute top-1.5 right-1.5 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <label className={`flex items-center gap-2 w-full p-3 rounded-lg border-2 border-dashed cursor-pointer transition-all ${
              isDark
                ? 'border-gray-700 hover:border-yellow-500 bg-gray-900/30'
                : 'border-gray-300 hover:border-yellow-400 bg-gray-50'
            }`}>
              <Upload className="w-4 h-4 text-yellow-500" />
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Upload Mobile Image
              </span>
              <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                (Recommended: 768x1024)
              </span>
              <input
                ref={mobileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleMobileUpload}
              />
            </label>
          )}
        </div>

        <button
          onClick={handleSave}
          disabled={saving || !isFormValid}
          className={`w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
            saving || !isFormValid
              ? 'opacity-50 cursor-not-allowed bg-gray-400'
              : 'bg-gradient-to-r from-yellow-400 to-yellow-500 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
          }`}
        >
          <Save className="w-4 h-4" /> 
          {saving ? 'Saving...' : 'Save Hero'}
        </button>
      </div>
    </div>
  );
}