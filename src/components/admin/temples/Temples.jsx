// app/(admin)/admin/temples/page.jsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useThemeStore } from '@/lib/store/useThemeStore';
import useAdminAuthStore from '@/lib/store/useAdminAuthStore';
import { useActivityLogger } from '@/hooks/useActivityLogger';
import TempleTable from './TempleTable';
import { getTemples, deleteTemple } from '@/lib/services/templeService';
import Swal from 'sweetalert2';

// Temple categories
export const templeCategories = [
  { id: 'all', name: 'All Regions', icon: '🛕' },
  { id: 'north', name: 'North India', icon: '🏔️' },
  { id: 'south', name: 'South India', icon: '🌴' },
  { id: 'east', name: 'East India', icon: '🌊' },
  { id: 'west', name: 'West India', icon: '🏜️' },
  { id: 'central', name: 'Central India', icon: '🏛️' },
];

export default function AdminTemplesPage() {
  const { theme } = useThemeStore();
  const { admin } = useAdminAuthStore();
  const { log } = useActivityLogger();
  const router = useRouter();
  const isDark = theme === 'dark';
  
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [featuredFilter, setFeaturedFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchTemples = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getTemples(currentPage, searchTerm, statusFilter, categoryFilter, featuredFilter);
      if (result.success) {
        setTemples(result.temples);
        setTotalPages(result.totalPages);
        setTotalItems(result.totalItems);
      } else {
        toast.error(result.error || 'Failed to fetch temples');
      }
    } catch (error) {
      console.error('Error fetching temples:', error);
      toast.error('Failed to fetch temples');
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, statusFilter, categoryFilter, featuredFilter]);

  useEffect(() => {
    fetchTemples();
  }, [fetchTemples]);

  const handleCreate = () => {
    router.push('/admin/temples/manage/new');
  };

  const handleEdit = (id) => {
    router.push(`/admin/temples/manage/${id}`);
  };

  const handleDelete = async (id, title, imageUrls) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Delete "${title}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EAB308',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      background: isDark ? '#1f2937' : '#ffffff',
      color: isDark ? '#ffffff' : '#000000',
    });

    if (result.isConfirmed) {
      setIsUpdating(true);
      try {
        const deleteResult = await deleteTemple(id, imageUrls);
        if (deleteResult.success) {
          await log({
            action: 'DELETE',
            entityType: 'temple',
            entityId: id,
            entityTitle: title,
            details: `Deleted temple: ${title}`
          });
          toast.success('Temple deleted successfully');
          fetchTemples();
        } else {
          toast.error(deleteResult.error || 'Failed to delete');
        }
      } catch (error) {
        toast.error('Failed to delete');
      } finally {
        setIsUpdating(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start gap-3">
          <button
            onClick={() => router.back()}
            className={`mt-0.5 p-2 rounded-xl border-2 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer ${
              isDark
                ? 'border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10'
                : 'border-yellow-500/30 text-yellow-600 hover:bg-yellow-500/10'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className={`text-2xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
              Temples
            </h1>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
              Manage sacred temples and their details
            </p>
          </div>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-semibold transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Temple
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search temples by name, location, or deity..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border-2 transition-all duration-200 focus:ring-2 focus:ring-yellow-400/20 focus:outline-none ${
              isDark
                ? 'bg-gray-800/50 border-gray-700 text-gray-100 focus:border-yellow-500 backdrop-blur-sm'
                : 'bg-white/80 border-gray-200 text-gray-800 focus:border-yellow-400 backdrop-blur-sm'
            }`}
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
          className={`px-4 py-2.5 rounded-xl border-2 transition-all duration-200 focus:ring-2 focus:ring-yellow-400/20 focus:outline-none cursor-pointer ${
            isDark
              ? 'bg-gray-800/50 border-gray-700 text-gray-100 focus:border-yellow-500 backdrop-blur-sm'
              : 'bg-white/80 border-gray-200 text-gray-800 focus:border-yellow-400 backdrop-blur-sm'
          }`}
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
          className={`px-4 py-2.5 rounded-xl border-2 transition-all duration-200 focus:ring-2 focus:ring-yellow-400/20 focus:outline-none cursor-pointer ${
            isDark
              ? 'bg-gray-800/50 border-gray-700 text-gray-100 focus:border-yellow-500 backdrop-blur-sm'
              : 'bg-white/80 border-gray-200 text-gray-800 focus:border-yellow-400 backdrop-blur-sm'
          }`}
        >
          <option value="all">All Regions</option>
          <option value="north">North India</option>
          <option value="south">South India</option>
          <option value="east">East India</option>
          <option value="west">West India</option>
          <option value="central">Central India</option>
        </select>

        <select
          value={featuredFilter}
          onChange={(e) => { setFeaturedFilter(e.target.value); setCurrentPage(1); }}
          className={`px-4 py-2.5 rounded-xl border-2 transition-all duration-200 focus:ring-2 focus:ring-yellow-400/20 focus:outline-none cursor-pointer ${
            isDark
              ? 'bg-gray-800/50 border-gray-700 text-gray-100 focus:border-yellow-500 backdrop-blur-sm'
              : 'bg-white/80 border-gray-200 text-gray-800 focus:border-yellow-400 backdrop-blur-sm'
          }`}
        >
          <option value="all">All Temples</option>
          <option value="featured">Featured</option>
          <option value="normal">Normal</option>
        </select>
      </div>

      {!loading && temples.length > 0 && (
        <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Total: {totalItems} temple{totalItems !== 1 ? 's' : ''}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <TempleTable
          temples={temples}
          currentPage={currentPage}
          totalPages={totalPages}
          isUpdating={isUpdating}
          isDark={isDark}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}