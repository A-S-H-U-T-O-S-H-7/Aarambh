// app/(admin)/admin/stories/manage/[id]/page.jsx (or new/page.jsx)
'use client';

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import { useThemeStore } from "@/lib/store/useThemeStore";
import { useActivityLogger } from "@/hooks/useActivityLogger";
import StoriesForm from "@/components/admin/stories/StoriesForm";
import StoriesSidebar from "@/components/admin/stories/StoriesSidebar";
import { getStoryById, createStory, updateStory, generateSlug } from "@/lib/services/storyService";

// Categories with options
const CATEGORIES = [
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

export default function ManageStoryPage() {
  const { theme } = useThemeStore();
  const { log } = useActivityLogger();
  const router = useRouter();
  const params = useParams();
  const storyId = params?.id;
  const isDark = theme === "dark";
  const isEditMode = storyId && storyId !== "new";

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    description: '',
    author: '',
    source: '',
    moral: '',
    category: '',
    tags: [],
    status: 'draft',
    isFeatured: false,
    publishDate: new Date().toISOString().split('T')[0],
    metatitle: '',
    metadesc: '',
    metakeywords: '',
    manualSlug: false,
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEditMode);
  const [oldStoryData, setOldStoryData] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      const loadStory = async () => {
        try {
          const result = await getStoryById(storyId);
          if (result.success && result.story) {
            const story = result.story;
            setFormData({
              title: story.title || '',
              slug: story.slug || '',
              content: story.content || '',
              excerpt: story.excerpt || '',
              description: story.description || story.excerpt || '',
              author: story.author || '',
              source: story.source || '',
              moral: story.moral || '',
              category: story.category || '',
              tags: story.tags || [],
              status: story.status || 'draft',
              isFeatured: story.isFeatured || false,
              publishDate: story.publishDate || new Date().toISOString().split('T')[0],
              metatitle: story.metatitle || '',
              metadesc: story.metadesc || '',
              metakeywords: story.metakeywords || '',
              manualSlug: true,
            });
            setExistingImages(story.images || []);
            setOldStoryData(story);
          } else {
            toast.error("Story not found");
            router.push("/admin/stories");
          }
        } catch (error) {
          console.error("Error loading story:", error);
          toast.error("Failed to load story");
        } finally {
          setIsFetching(false);
        }
      };
      loadStory();
    } else {
      setIsFetching(false);
    }
  }, [isEditMode, storyId, router]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.slug?.trim()) newErrors.slug = "Slug is required";
    if (!formData.content?.trim()) newErrors.content = "Content is required";
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
      const storyData = {
        title: formData.title,
        slug: formData.slug || generateSlug(formData.title),
        content: formData.content,
        excerpt: formData.excerpt || formData.description,
        description: formData.description || formData.excerpt,
        author: formData.author,
        source: formData.source,
        moral: formData.moral,
        category: formData.category,
        tags: formData.tags,
        status: formData.status,
        isFeatured: formData.isFeatured,
        publishDate: formData.publishDate,
        metatitle: formData.metatitle,
        metadesc: formData.metadesc,
        metakeywords: formData.metakeywords,
      };

      let result;
      if (isEditMode) {
        result = await updateStory(storyId, storyData, imageFiles, existingImages);
        if (result.success) {
          await log({
            action: 'UPDATE',
            entityType: 'story',
            entityId: storyId,
            entityTitle: formData.title,
            oldData: oldStoryData,
            newData: storyData,
            details: `Updated story: ${formData.title}`
          });
        }
      } else {
        result = await createStory(storyData, imageFiles);
        if (result.success) {
          await log({
            action: 'CREATE',
            entityType: 'story',
            entityId: result.id,
            entityTitle: formData.title,
            newData: storyData,
            details: `Created story: ${formData.title}`
          });
        }
      }

      if (result.success) {
        toast.success(`Story ${isEditMode ? "updated" : "created"} successfully!`);
        router.push("/admin/stories");
      } else {
        toast.error(result.error || "Failed to save story");
      }
    } catch (error) {
      console.error("Error saving story:", error);
      toast.error("Failed to save story");
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
            {isEditMode ? "Edit Story" : "Add New Story"}
          </h1>
          <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"} mt-1`}>
            {isEditMode ? "Update your spiritual story" : "Create a new spiritual story"}
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <StoriesForm
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
            isDark={isDark}
            categories={CATEGORIES}
          />
        </div>
        <div>
          <StoriesSidebar
            formData={formData}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            isDark={isDark}
            existingImages={existingImages}
          />
        </div>
      </div>
    </div>
  );
}