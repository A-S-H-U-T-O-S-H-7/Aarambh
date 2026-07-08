'use client';

import { useState, useEffect, useRef } from 'react';
import { Sparkles, Save, Upload, X, Monitor, Smartphone, Video, Image as ImageIcon, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';

const DEFAULT_HERO_VALUES = {
  headingLine1: 'Begin Every Day',
  headingLine2: 'with Divine Wisdom',
  tagline: 'आरम्भः सर्वकार्येषु मङ्गलाचरणम्',
  ctaText: 'Explore Now',
  ctaLink: '#explore',
  desktopImage: '',
  desktopVideo: '',
  mobileImage: '',
  mobileVideo: '',
};

export default function HeroManager({ data, onSave, isDark, saving }) {
  const [hero, setHero] = useState(DEFAULT_HERO_VALUES);
  
  const [desktopImageFile, setDesktopImageFile] = useState(null);
  const [desktopVideoFile, setDesktopVideoFile] = useState(null);
  const [mobileImageFile, setMobileImageFile] = useState(null);
  const [mobileVideoFile, setMobileVideoFile] = useState(null);
  
  const [desktopImagePreview, setDesktopImagePreview] = useState(null);
  const [desktopVideoPreview, setDesktopVideoPreview] = useState(null);
  const [mobileImagePreview, setMobileImagePreview] = useState(null);
  const [mobileVideoPreview, setMobileVideoPreview] = useState(null);
  
  const desktopImageInputRef = useRef(null);
  const desktopVideoInputRef = useRef(null);
  const mobileImageInputRef = useRef(null);
  const mobileVideoInputRef = useRef(null);
  
  const videoRefs = {
    desktop: useRef(null),
    mobile: useRef(null),
  };

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
        desktopVideo: data.desktopVideo || '',
        mobileImage: data.mobileImage || '',
        mobileVideo: data.mobileVideo || '',
      });
      
      setDesktopImagePreview(data.desktopImage || null);
      setDesktopVideoPreview(data.desktopVideo || null);
      setMobileImagePreview(data.mobileImage || null);
      setMobileVideoPreview(data.mobileVideo || null);
    }
  }, [data]);

  const handleChange = (field, value) => {
    setHero({ ...hero, [field]: value });
  };

  const handleFileUpload = (type, file, setFile, setPreview) => {
    if (!file) return;
    
    // For videos
    if (file.type.startsWith('video/')) {
      if (file.size > 30 * 1024 * 1024) {
        toast.error('Video size must be less than 30MB');
        return;
      }
      
      // Check duration for videos
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = function() {
        if (this.duration > 30) {
          toast.error('Video must be 30 seconds or less');
          return;
        }
        setFile(file);
        setPreview(URL.createObjectURL(file));
        toast.success(`${type} uploaded successfully!`);
      };
      video.src = URL.createObjectURL(file);
      video.onerror = function() {
        setFile(file);
        setPreview(URL.createObjectURL(file));
        toast.warning('Could not verify video duration. Please ensure it is 30 seconds or less.');
      };
      return;
    }
    
    // For images
    if (file.type.startsWith('image/')) {
      const maxSize = type.includes('Desktop') ? 8 : 5;
      if (file.size > maxSize * 1024 * 1024) {
        toast.error(`Image size must be less than ${maxSize}MB`);
        return;
      }
      setFile(file);
      setPreview(URL.createObjectURL(file));
      toast.success(`${type} uploaded successfully!`);
    } else {
      toast.error('Please select an image or video file');
    }
  };

  const handleDesktopImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    handleFileUpload('Desktop Image', file, setDesktopImageFile, setDesktopImagePreview);
    e.target.value = '';
  };

  const handleDesktopVideoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    handleFileUpload('Desktop Video', file, setDesktopVideoFile, setDesktopVideoPreview);
    e.target.value = '';
  };

  const handleMobileImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    handleFileUpload('Mobile Image', file, setMobileImageFile, setMobileImagePreview);
    e.target.value = '';
  };

  const handleMobileVideoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    handleFileUpload('Mobile Video', file, setMobileVideoFile, setMobileVideoPreview);
    e.target.value = '';
  };

  const removeMedia = (type) => {
    switch(type) {
      case 'desktopImage':
        setDesktopImageFile(null);
        setDesktopImagePreview(null);
        setHero({ ...hero, desktopImage: '' });
        if (desktopImageInputRef.current) desktopImageInputRef.current.value = '';
        break;
      case 'desktopVideo':
        setDesktopVideoFile(null);
        setDesktopVideoPreview(null);
        setHero({ ...hero, desktopVideo: '' });
        if (desktopVideoInputRef.current) desktopVideoInputRef.current.value = '';
        if (videoRefs.desktop.current) {
          videoRefs.desktop.current.pause();
          videoRefs.desktop.current.src = '';
        }
        break;
      case 'mobileImage':
        setMobileImageFile(null);
        setMobileImagePreview(null);
        setHero({ ...hero, mobileImage: '' });
        if (mobileImageInputRef.current) mobileImageInputRef.current.value = '';
        break;
      case 'mobileVideo':
        setMobileVideoFile(null);
        setMobileVideoPreview(null);
        setHero({ ...hero, mobileVideo: '' });
        if (mobileVideoInputRef.current) mobileVideoInputRef.current.value = '';
        if (videoRefs.mobile.current) {
          videoRefs.mobile.current.pause();
          videoRefs.mobile.current.src = '';
        }
        break;
    }
  };

  // Get active media type for display
  const getActiveMediaType = (device) => {
    const video = device === 'desktop' ? hero.desktopVideo : hero.mobileVideo;
    const image = device === 'desktop' ? hero.desktopImage : hero.mobileImage;
    
    if (video) return 'video';
    if (image) return 'image';
    return 'none';
  };

  const handleSave = () => {
    if (!hero.headingLine1?.trim() || !hero.ctaText?.trim()) {
      toast.error('Please fill in required fields');
      return;
    }
    
    // Check if at least one media is set for EITHER desktop OR mobile
    const hasDesktopMedia = hero.desktopImage || hero.desktopVideo;
    const hasMobileMedia = hero.mobileImage || hero.mobileVideo;
    
    // Only require at least one device to have media
    if (!hasDesktopMedia && !hasMobileMedia) {
      toast.error('Please add at least one media (image or video) for desktop OR mobile');
      return;
    }
    
    const saveData = {
      ...hero,
      heading: [hero.headingLine1?.trim(), hero.headingLine2?.trim()].filter(Boolean).join(' '),
      headingLine1: hero.headingLine1?.trim(),
      headingLine2: hero.headingLine2?.trim(),
      tagline: hero.tagline?.trim() || 'आरम्भः सर्वकार्येषु मङ्गलाचरणम्',
      oldDesktopImage: data?.desktopImage || null,
      oldDesktopVideo: data?.desktopVideo || null,
      oldMobileImage: data?.mobileImage || null,
      oldMobileVideo: data?.mobileVideo || null,
    };
    
    onSave(
      saveData, 
      desktopImageFile, 
      desktopVideoFile, 
      mobileImageFile, 
      mobileVideoFile
    );
  };

  const isFormValid = hero.headingLine1?.trim() && hero.ctaText?.trim();

  // Render media preview with status indicator
  const renderMediaPreview = (type, preview, fileType, device) => {
    const isVideo = fileType === 'video';
    const isActive = preview || (type === 'desktopImage' ? hero.desktopImage : 
                    type === 'desktopVideo' ? hero.desktopVideo :
                    type === 'mobileImage' ? hero.mobileImage : hero.mobileVideo);
    
    if (!isActive) return null;
    
    const isDesktop = type.includes('desktop');
    const label = isDesktop ? 'Desktop' : 'Mobile';
    const deviceKey = isDesktop ? 'desktop' : 'mobile';
    const activeType = getActiveMediaType(deviceKey);
    const isCurrentlyActive = (isVideo && activeType === 'video') || (!isVideo && activeType === 'image');
    
    return (
      <div className="relative rounded-lg overflow-hidden border-2 transition-all duration-300" 
           style={{
             borderColor: isCurrentlyActive ? '#F59E0B' : 'rgba(255,255,255,0.1)',
             boxShadow: isCurrentlyActive ? '0 0 20px rgba(245, 158, 11, 0.2)' : 'none'
           }}>
        {isVideo ? (
          <video
            ref={el => {
              if (isDesktop) videoRefs.desktop.current = el;
              else videoRefs.mobile.current = el;
            }}
            src={preview || hero[type]}
            className="w-full h-28 object-cover"
            loop
            muted
            autoPlay
            playsInline
          />
        ) : (
          <img 
            src={preview || hero[type]} 
            alt={`${label} ${fileType}`} 
            className="w-full h-28 object-cover"
          />
        )}
        
        {/* Status badge */}
        <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-black/60 backdrop-blur-sm text-white">
          {isVideo ? <Video className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
          {isVideo ? 'Video' : 'Image'}
          {isCurrentlyActive && (
            <span className="flex items-center gap-1 ml-1 text-yellow-400">
              <Check className="w-3 h-3" /> Active
            </span>
          )}
        </div>
        
        <button
          onClick={() => removeMedia(type)}
          className="absolute top-2 right-2 p-1 bg-red-500/90 text-white rounded-full hover:bg-red-600 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  };

  // Render upload button
  const renderUploadButton = (type, onUpload, ref, fileType, device) => {
    const isDesktop = type.includes('desktop');
    const label = isDesktop ? 'Desktop' : 'Mobile';
    const isVideo = fileType === 'video';
    const deviceKey = isDesktop ? 'desktop' : 'mobile';
    const hasMedia = isVideo ? (isDesktop ? hero.desktopVideo : hero.mobileVideo) : (isDesktop ? hero.desktopImage : hero.mobileImage);
    const activeType = getActiveMediaType(deviceKey);
    const isActive = (isVideo && activeType === 'video') || (!isVideo && activeType === 'image');
    const Icon = isVideo ? Video : ImageIcon;
    const color = isVideo ? 'text-purple-500' : 'text-yellow-500';
    
    if (hasMedia) return null;
    
    return (
      <label className={`flex items-center gap-2 w-full p-3 rounded-lg border-2 border-dashed cursor-pointer transition-all ${
        isDark
          ? 'border-gray-700 hover:border-yellow-500 bg-gray-900/30'
          : 'border-gray-300 hover:border-yellow-400 bg-gray-50'
      } ${isActive ? 'ring-2 ring-yellow-400/50' : ''}`}>
        <Upload className={`w-4 h-4 ${color}`} />
        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Upload {label} {isVideo ? 'Video' : 'Image'}
        </span>
        <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          {isVideo ? '(Max 30 sec, 30MB)' : '(Max 5MB)'}
        </span>
        <input
          ref={ref}
          type="file"
          accept={isVideo ? "video/*" : "image/*"}
          className="hidden"
          onChange={onUpload}
        />
      </label>
    );
  };

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
              Title Line 1 (White) *
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
              CTA Text *
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

        {/* ─── DESKTOP MEDIA ─── */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Monitor className="w-4 h-4 text-blue-500" />
            <h3 className={`text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
              Desktop Background
            </h3>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${
              getActiveMediaType('desktop') === 'video' 
                ? 'bg-purple-500/20 text-purple-400' 
                : getActiveMediaType('desktop') === 'image'
                ? 'bg-yellow-500/20 text-yellow-400'
                : 'bg-gray-500/20 text-gray-400'
            }`}>
              {getActiveMediaType('desktop') === 'video' ? '🎬 Video' : 
               getActiveMediaType('desktop') === 'image' ? '🖼️ Image' : 'None'}
            </span>
          </div>
          
          <div className="space-y-2">
            {/* Desktop Video */}
            <div>
              {renderMediaPreview('desktopVideo', desktopVideoPreview, 'video', 'desktop')}
              {renderUploadButton('desktopVideo', handleDesktopVideoUpload, desktopVideoInputRef, 'video', 'desktop')}
            </div>
            
            {/* Desktop Image */}
            <div>
              {renderMediaPreview('desktopImage', desktopImagePreview, 'image', 'desktop')}
              {renderUploadButton('desktopImage', handleDesktopImageUpload, desktopImageInputRef, 'image', 'desktop')}
            </div>
          </div>
        </div>

        {/* ─── MOBILE MEDIA ─── */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Smartphone className="w-4 h-4 text-green-500" />
            <h3 className={`text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
              Mobile Background
            </h3>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${
              getActiveMediaType('mobile') === 'video' 
                ? 'bg-purple-500/20 text-purple-400' 
                : getActiveMediaType('mobile') === 'image'
                ? 'bg-yellow-500/20 text-yellow-400'
                : 'bg-gray-500/20 text-gray-400'
            }`}>
              {getActiveMediaType('mobile') === 'video' ? '🎬 Video' : 
               getActiveMediaType('mobile') === 'image' ? '🖼️ Image' : 'None'}
            </span>
          </div>
          
          <div className="space-y-2">
            {/* Mobile Video */}
            <div>
              {renderMediaPreview('mobileVideo', mobileVideoPreview, 'video', 'mobile')}
              {renderUploadButton('mobileVideo', handleMobileVideoUpload, mobileVideoInputRef, 'video', 'mobile')}
            </div>
            
            {/* Mobile Image */}
            <div>
              {renderMediaPreview('mobileImage', mobileImagePreview, 'image', 'mobile')}
              {renderUploadButton('mobileImage', handleMobileImageUpload, mobileImageInputRef, 'image', 'mobile')}
            </div>
          </div>
        </div>

        {/* Info message */}
        <div className={`p-3 rounded-lg text-xs ${
          isDark ? 'bg-gray-900/50 text-gray-400' : 'bg-gray-50 text-gray-500'
        }`}>
          <p>💡 <span className="font-medium">Priority:</span> Video takes priority over image for each device. You can set media for desktop only, mobile only, or both independently.</p>
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