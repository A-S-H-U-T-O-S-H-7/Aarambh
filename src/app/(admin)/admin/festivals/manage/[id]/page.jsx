// app/(admin)/admin/festivals/manage/[id]/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useThemeStore } from '@/lib/store/useThemeStore';
import useAdminAuthStore from '@/lib/store/useAdminAuthStore';
import { useActivityLogger } from '@/hooks/useActivityLogger';
import FestivalForm from '@/components/admin/festivals/FestivalForm';
import FestivalSidebar from '@/components/admin/festivals/FestivalSidebar';
import { getFestivalById, createFestival, updateFestival, generateSlug } from '@/lib/services/festivalService';
import { ActivityActions, ActivityEntityTypes } from '@/lib/services/activityLogService';

export default function ManageFestivalPage() {
  const { theme } = useThemeStore();
  const { admin } = useAdminAuthStore();
  const { log } = useActivityLogger();
  const router = useRouter();
  const params = useParams();
  const festivalId = params?.id;
  const isDark = theme === 'dark';
  const isEditMode = festivalId && festivalId !== 'new';

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    nameHindi: '',
    description: '',
    fullDescription: '',
    date: '',
    category: '',
    significance: '',
    traditions: [],
    colors: [],
    emoji: '🎊',
    deity: '',
    region: '',
    featured: false,
    status: 'draft',
    manualSlug: false,
    imageFiles: [],
    existingImages: [],
    metatitle: '',
    metadesc: '',
    metakeywords: '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEditMode);
  const [oldFestivalData, setOldFestivalData] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      const loadFestival = async () => {
        try {
          const result = await getFestivalById(festivalId);
          if (result.success && result.festival) {
            const festival = result.festival;
            setFormData({
              title: festival.title || '',
              slug: festival.slug || '',
              nameHindi: festival.nameHindi || '',
              description: festival.description || '',
              fullDescription: festival.fullDescription || '',
              date: festival.date || '',
              category: festival.category || '',
              significance: festival.significance || '',
              traditions: festival.traditions || [],
              colors: festival.colors || [],
              emoji: festival.emoji || '🎊',
              deity: festival.deity || '',
              region: festival.region || '',
              featured: festival.featured || false,
              status: festival.status || 'draft',
              manualSlug: true,
              imageFiles: [],
              existingImages: festival.images || [],
              metatitle: festival.metatitle || '',
              metadesc: festival.metadesc || '',
              metakeywords: festival.metakeywords || '',
            });
            setOldFestivalData(festival);
          } else {
            toast.error('Festival not found');
            router.push('/admin/festivals');
          }
        } catch (error) {
          console.error('Error loading festival:', error);
          toast.error('Failed to load festival');
        } finally {
          setIsFetching(false);
        }
      };
      loadFestival();
    } else {
      setIsFetching(false);
    }
  }, [isEditMode, festivalId, router]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.slug?.trim()) newErrors.slug = 'Slug is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.description?.trim()) newErrors.description = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Please fix validation errors');
      return;
    }

    setIsLoading(true);
    try {
      const festivalData = {
        title: formData.title,
        slug: formData.slug || generateSlug(formData.title),
        nameHindi: formData.nameHindi,
        description: formData.description,
        fullDescription: formData.fullDescription,
        date: formData.date,
        category: formData.category,
        significance: formData.significance,
        traditions: formData.traditions,
        colors: formData.colors,
        emoji: formData.emoji || '🎊',
        deity: formData.deity,
        region: formData.region,
        featured: formData.featured,
        status: formData.status,
        metatitle: formData.metatitle,
        metadesc: formData.metadesc,
        metakeywords: formData.metakeywords,
      };

      let result;
      if (isEditMode) {
        result = await updateFestival(
          festivalId, 
          festivalData, 
          formData.imageFiles, 
          formData.existingImages
        );
      } else {
        result = await createFestival(festivalData, formData.imageFiles);
      }

      if (result.success) {
        await log({
          action: isEditMode ? ActivityActions.UPDATE : ActivityActions.CREATE,
          entityType: ActivityEntityTypes.FESTIVAL,
          entityId: result.id || festivalId,
          entityTitle: formData.title,
          details: `${isEditMode ? 'Updated' : 'Created'} festival: ${formData.title}`,
          oldData: oldFestivalData,
          newData: festivalData,
        });
        
        toast.success(`Festival ${isEditMode ? 'updated' : 'created'} successfully!`);
        router.push('/admin/festivals');
      } else {
        toast.error(result.error || 'Failed to save festival');
      }
    } catch (error) {
      console.error('Error saving festival:', error);
      toast.error('Failed to save festival');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className={`p-2 rounded-xl border-2 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer ${
            isDark
              ? 'border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10'
              : 'border-yellow-500/30 text-yellow-600 hover:bg-yellow-500/10'
          }`}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
            {isEditMode ? 'Edit Festival' : 'Add New Festival'}
          </h1>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
            {isEditMode ? 'Update festival details' : 'Create a new festival'}
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <FestivalForm
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
            isDark={isDark}
          />
        </div>
        <div>
          <FestivalSidebar
            formData={formData}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            isDark={isDark}
            existingImages={formData.existingImages}
          />
        </div>
      </div>
    </div>
  );
}