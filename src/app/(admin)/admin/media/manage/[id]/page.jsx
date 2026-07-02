// app/(admin)/admin/media/manage/[id]/page.jsx (or new/page.jsx)
'use client';

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import { useThemeStore } from "@/lib/store/useThemeStore";
import useAdminAuthStore from "@/lib/store/useAdminAuthStore";
import { useActivityLogger } from "@/hooks/useActivityLogger";
import MediaForm from "@/components/admin/media/MediaForm";
import MediaSidebar from "@/components/admin/media/MediaSidebar";
import { getMediaById, createMedia, updateMedia, getYouTubeId, generateSlug } from "@/lib/services/mediaService";

export default function ManageMediaPage() {
  const { theme } = useThemeStore();
  const { admin } = useAdminAuthStore();
  const { log } = useActivityLogger();
  const router = useRouter();
  const params = useParams();
  const mediaId = params?.id;
  const isDark = theme === "dark";
  const isEditMode = mediaId && mediaId !== "new";

  const [formData, setFormData] = useState({
    mediaType: 'video',
    title: '',
    slug: '',
    description: '',
    category: '',
    tags: [],
    status: 'draft',
    isFeatured: false,
    isTrending: false,
    videoType: 'standard',
    publishDate: new Date().toISOString().split('T')[0],
    youtubeUrl: '',
    artist: '',
    album: '',
    metatitle: '',
    metadesc: '',
    metakeywords: '',
    manualSlug: false,
  });

  const [videoPreview, setVideoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEditMode);
  const [oldMediaData, setOldMediaData] = useState(null);
  
  // Default categories with proper options
  const [categories] = useState([
    { id: 'bhakti', name: 'Bhakti', slug: 'bhakti' },
    { id: 'spiritual', name: 'Spiritual', slug: 'spiritual' },
    { id: 'meditation', name: 'Meditation', slug: 'meditation' },
    { id: 'devotional', name: 'Devotional', slug: 'devotional' },
    { id: 'festival', name: 'Festival', slug: 'festival' },
    { id: 'mantra', name: 'Mantra', slug: 'mantra' },
    { id: 'aarti', name: 'Aarti', slug: 'aarti' },
    { id: 'kirtan', name: 'Kirtan', slug: 'kirtan' },
    { id: 'chalisa', name: 'Chalisa', slug: 'chalisa' },
    { id: 'satsang', name: 'Satsang', slug: 'satsang' },
  ]);
  const [loadingCategories] = useState(false); // Always false since we have static categories

  useEffect(() => {
    const videoId = getYouTubeId(formData.youtubeUrl);
    setVideoPreview(videoId);
  }, [formData.youtubeUrl]);

  useEffect(() => {
    if (isEditMode) {
      const loadMedia = async () => {
        try {
          const result = await getMediaById(mediaId);
          if (result.success && result.media) {
            const media = result.media;
            setFormData({
              mediaType: media.mediaType || 'video',
              title: media.title || '',
              slug: media.slug || '',
              description: media.description || '',
              category: media.category || '',
              tags: media.tags || [],
              status: media.status || 'draft',
              isFeatured: media.isFeatured || false,
              isTrending: media.isTrending || false,
              videoType: media.videoType || 'standard',
              publishDate: media.publishDate || new Date().toISOString().split('T')[0],
              youtubeUrl: media.youtubeUrl || '',
              artist: media.artist || '',
              album: media.album || '',
              metatitle: media.metatitle || '',
              metadesc: media.metadesc || '',
              metakeywords: media.metakeywords || '',
              manualSlug: true,
            });
            setOldMediaData(media);
          } else {
            toast.error("Media not found");
            router.push("/admin/media");
          }
        } catch (error) {
          console.error("Error loading media:", error);
          toast.error("Failed to load media");
        } finally {
          setIsFetching(false);
        }
      };
      loadMedia();
    } else {
      setIsFetching(false);
    }
  }, [isEditMode, mediaId, router]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.slug?.trim()) newErrors.slug = "Slug is required";
    
    if (formData.mediaType === 'video') {
      if (!formData.youtubeUrl?.trim()) newErrors.youtubeUrl = "YouTube URL is required";
      if (!getYouTubeId(formData.youtubeUrl)) newErrors.youtubeUrl = "Invalid YouTube URL";
    }
    
    if (formData.mediaType === 'bhajan') {
      if (!formData.artist?.trim()) newErrors.artist = "Artist name is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fix validation errors");
      return;
    }

    setIsLoading(true);
    try {
      const mediaData = {
        mediaType: formData.mediaType,
        title: formData.title,
        slug: formData.slug || generateSlug(formData.title),
        description: formData.description,
        category: formData.category,
        tags: formData.tags,
        status: formData.status,
        isFeatured: formData.isFeatured,
        isTrending: formData.isTrending,
        videoType: formData.videoType || 'standard',
        publishDate: formData.publishDate,
        youtubeUrl: formData.youtubeUrl,
        artist: formData.artist,
        album: formData.album,
        metatitle: formData.metatitle,
        metadesc: formData.metadesc,
        metakeywords: formData.metakeywords,
      };

      let result;
      if (isEditMode) {
        result = await updateMedia(mediaId, mediaData);
        if (result.success) {
          await log({
            action: 'UPDATE',
            entityType: 'media',
            entityId: mediaId,
            entityTitle: formData.title,
            oldData: oldMediaData,
            newData: mediaData,
            details: `Updated ${formData.mediaType}: ${formData.title}`
          });
        }
      } else {
        result = await createMedia(mediaData);
        if (result.success) {
          await log({
            action: 'CREATE',
            entityType: 'media',
            entityId: result.id,
            entityTitle: formData.title,
            newData: mediaData,
            details: `Created ${formData.mediaType}: ${formData.title}`
          });
        }
      }

      if (result.success) {
        toast.success(`Media ${isEditMode ? "updated" : "created"} successfully!`);
        router.push("/admin/media");
      } else {
        toast.error(result.error || "Failed to save media");
      }
    } catch (error) {
      console.error("Error saving media:", error);
      toast.error("Failed to save media");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className={`p-2 rounded-xl border-2 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer ${
            isDark
              ? "border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
              : "border-yellow-500/30 text-yellow-600 hover:bg-yellow-500/10"
          }`}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? "text-gray-100" : "text-gray-800"}`}>
            {isEditMode ? "Edit Media" : "Add New Media"}
          </h1>
          <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"} mt-1`}>
            {isEditMode ? "Update your media details" : "Create a new video or bhajan"}
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MediaForm
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
            isDark={isDark}
            categories={categories}
            loadingCategories={loadingCategories}
          />
        </div>
        <div>
          <MediaSidebar
            formData={formData}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            isDark={isDark}
            videoPreview={videoPreview}
          />
        </div>
      </div>
    </div>
  );
}