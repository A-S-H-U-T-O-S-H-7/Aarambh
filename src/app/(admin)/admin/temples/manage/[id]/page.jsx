// app/(admin)/admin/temples/manage/[id]/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useThemeStore } from '@/lib/store/useThemeStore';
import useAdminAuthStore from '@/lib/store/useAdminAuthStore';
import { useActivityLogger } from '@/hooks/useActivityLogger';
import TempleForm from '@/components/admin/temples/TempleForm';
import TempleSidebar from '@/components/admin/temples/TempleSidebar';
import { getTempleById, createTemple, updateTemple, generateSlug } from '@/lib/services/templeService';
import { ActivityActions, ActivityEntityTypes } from '@/lib/services/activityLogService';

export default function ManageTemplePage() {
  const { theme } = useThemeStore();
  const { admin } = useAdminAuthStore();
  const { log } = useActivityLogger();
  const router = useRouter();
  const params = useParams();
  const templeId = params?.id;
  const isDark = theme === 'dark';
  const isEditMode = templeId && templeId !== 'new';

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    location: '',
    shortDescription: '',
    fullDescription: '',
    category: '',
    deity: '',
    established: '',
    significance: '',
    festivals: [],
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
  const [oldTempleData, setOldTempleData] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      const loadTemple = async () => {
        try {
          const result = await getTempleById(templeId);
          if (result.success && result.temple) {
            const temple = result.temple;
            setFormData({
              title: temple.title || '',
              slug: temple.slug || '',
              location: temple.location || '',
              shortDescription: temple.shortDescription || '',
              fullDescription: temple.fullDescription || '',
              category: temple.category || '',
              deity: temple.deity || '',
              established: temple.established || '',
              significance: temple.significance || '',
              festivals: temple.festivals || [],
              featured: temple.featured || false,
              status: temple.status || 'draft',
              manualSlug: true,
              imageFiles: [],
              existingImages: temple.images || [],
              metatitle: temple.metatitle || '',
              metadesc: temple.metadesc || '',
              metakeywords: temple.metakeywords || '',
            });
            setOldTempleData(temple);
          } else {
            toast.error('Temple not found');
            router.push('/admin/temples');
          }
        } catch (error) {
          console.error('Error loading temple:', error);
          toast.error('Failed to load temple');
        } finally {
          setIsFetching(false);
        }
      };
      loadTemple();
    } else {
      setIsFetching(false);
    }
  }, [isEditMode, templeId, router]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Temple name is required';
    if (!formData.slug?.trim()) newErrors.slug = 'Slug is required';
    if (!formData.location?.trim()) newErrors.location = 'Location is required';
    if (!formData.category) newErrors.category = 'Region is required';
    if (!formData.shortDescription?.trim()) newErrors.shortDescription = 'Short description is required';
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
      const templeData = {
        title: formData.title,
        slug: formData.slug || generateSlug(formData.title),
        location: formData.location,
        shortDescription: formData.shortDescription,
        fullDescription: formData.fullDescription,
        category: formData.category,
        deity: formData.deity,
        established: formData.established,
        significance: formData.significance,
        festivals: formData.festivals,
        featured: formData.featured,
        status: formData.status,
        metatitle: formData.metatitle,
        metadesc: formData.metadesc,
        metakeywords: formData.metakeywords,
      };

      let result;
      if (isEditMode) {
        result = await updateTemple(
          templeId, 
          templeData, 
          formData.imageFiles, 
          formData.existingImages
        );
      } else {
        result = await createTemple(templeData, formData.imageFiles);
      }

      if (result.success) {
        await log({
          action: isEditMode ? ActivityActions.UPDATE : ActivityActions.CREATE,
          entityType: ActivityEntityTypes.TEMPLE,
          entityId: result.id || templeId,
          entityTitle: formData.title,
          details: `${isEditMode ? 'Updated' : 'Created'} temple: ${formData.title}`,
          oldData: oldTempleData,
          newData: templeData,
        });
        
        toast.success(`Temple ${isEditMode ? 'updated' : 'created'} successfully!`);
        router.push('/admin/temples');
      } else {
        toast.error(result.error || 'Failed to save temple');
      }
    } catch (error) {
      console.error('Error saving temple:', error);
      toast.error('Failed to save temple');
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
            {isEditMode ? 'Edit Temple' : 'Add New Temple'}
          </h1>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
            {isEditMode ? 'Update temple details' : 'Create a new temple entry'}
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TempleForm
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
            isDark={isDark}
          />
        </div>
        <div>
          <TempleSidebar
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