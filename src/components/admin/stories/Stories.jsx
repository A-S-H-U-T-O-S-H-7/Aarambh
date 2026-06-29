// app/(admin)/admin/stories/page.jsx
'use client';

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Search } from "lucide-react";
import { toast } from "react-hot-toast";
import { useThemeStore } from "@/lib/store/useThemeStore";
import { useActivityLogger } from "@/hooks/useActivityLogger";
import StoriesTable from "./StoriesTable";
import { getStories, deleteStory } from "@/lib/services/storyService";
import Swal from "sweetalert2";

export default function AdminStoriesPage() {
  const { theme } = useThemeStore();
  const { log } = useActivityLogger();
  const router = useRouter();
  const isDark = theme === "dark";
  
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [featuredFilter, setFeaturedFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchStories = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getStories(currentPage, searchTerm, statusFilter, featuredFilter);
      if (result.success) {
        setStories(result.stories);
        setTotalPages(result.totalPages);
        setTotalItems(result.totalItems);
      } else {
        toast.error(result.error || "Failed to fetch stories");
      }
    } catch (error) {
      console.error("Error fetching stories:", error);
      toast.error("Failed to fetch stories");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, statusFilter, featuredFilter]);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  const handleCreate = () => {
    router.push("/admin/stories/manage/new");
  };

  const handleEdit = (storyId) => {
    router.push(`/admin/stories/manage/${storyId}`);
  };

  const handleDelete = async (storyId, storyTitle, imageUrls) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Delete "${storyTitle}"? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EAB308",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      background: isDark ? "#1f2937" : "#ffffff",
      color: isDark ? "#ffffff" : "#000000",
    });

    if (result.isConfirmed) {
      setIsUpdating(true);
      try {
        const deleteResult = await deleteStory(storyId, storyTitle, imageUrls);
        if (deleteResult.success) {
          await log({
            action: 'DELETE',
            entityType: 'story',
            entityId: storyId,
            entityTitle: storyTitle,
            details: `Deleted story: ${storyTitle}`
          });
          toast.success("Story deleted successfully");
          fetchStories();
        } else {
          toast.error(deleteResult.error || "Failed to delete story");
        }
      } catch (error) {
        toast.error("Failed to delete story");
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
                ? "border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
                : "border-yellow-500/30 text-yellow-600 hover:bg-yellow-500/10"
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className={`text-2xl font-bold ${isDark ? "text-gray-100" : "text-gray-800"}`}>
              Spiritual Stories
            </h1>
            <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"} mt-1`}>
              Manage spiritual stories and teachings
            </p>
          </div>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-semibold transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Story
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search stories by title..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border-2 transition-all duration-200 focus:ring-2 focus:ring-yellow-400/20 focus:outline-none ${
              isDark
                ? "bg-gray-800/50 border-gray-700 text-gray-100 focus:border-yellow-500 backdrop-blur-sm"
                : "bg-white/80 border-gray-200 text-gray-800 focus:border-yellow-400 backdrop-blur-sm"
            }`}
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
          className={`px-4 py-2.5 rounded-xl border-2 transition-all duration-200 focus:ring-2 focus:ring-yellow-400/20 focus:outline-none cursor-pointer ${
            isDark
              ? "bg-gray-800/50 border-gray-700 text-gray-100 focus:border-yellow-500 backdrop-blur-sm"
              : "bg-white/80 border-gray-200 text-gray-800 focus:border-yellow-400 backdrop-blur-sm"
          }`}
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>

        <select
          value={featuredFilter}
          onChange={(e) => { setFeaturedFilter(e.target.value); setCurrentPage(1); }}
          className={`px-4 py-2.5 rounded-xl border-2 transition-all duration-200 focus:ring-2 focus:ring-yellow-400/20 focus:outline-none cursor-pointer ${
            isDark
              ? "bg-gray-800/50 border-gray-700 text-gray-100 focus:border-yellow-500 backdrop-blur-sm"
              : "bg-white/80 border-gray-200 text-gray-800 focus:border-yellow-400 backdrop-blur-sm"
          }`}
        >
          <option value="all">All Stories</option>
          <option value="featured">Featured</option>
          <option value="normal">Normal</option>
        </select>
      </div>

      {!loading && stories.length > 0 && (
        <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          Total: {totalItems} story{totalItems !== 1 ? 's' : ''}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <StoriesTable
          stories={stories}
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