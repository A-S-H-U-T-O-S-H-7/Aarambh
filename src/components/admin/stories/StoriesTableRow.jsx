// components/admin/stories/StoriesTableRow.jsx
'use client';

import { Edit, Trash2, Eye, Calendar, Star } from "lucide-react";

export default function StoriesTableRow({ story, index, currentPage, itemsPerPage, isDark, onEdit, onDelete }) {
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "published":
        return isDark ? "bg-green-900/40 text-green-400" : "bg-green-100 text-green-700";
      default:
        return isDark ? "bg-yellow-900/40 text-yellow-400" : "bg-yellow-100 text-yellow-700";
    }
  };

  const featuredImage = story.featuredImage || (story.images && story.images[0]) || null;

  return (
    <tr className={`transition-colors ${
      isDark
        ? `${index % 2 === 0 ? "bg-gray-900/30" : "bg-gray-800/30"} hover:bg-gray-700/30`
        : `${index % 2 === 0 ? "bg-white/50" : "bg-gray-50/50"} hover:bg-gray-100/70`
    }`}>
      <td className="px-6 py-4">
        <span className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          {(currentPage - 1) * itemsPerPage + index + 1}
        </span>
      </td>
      
      <td className="px-6 py-4">
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 shadow-md">
          {featuredImage ? (
            <img src={featuredImage} alt={story.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No img</div>
          )}
        </div>
      </td>
      
      <td className="px-6 py-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <div className={`text-sm font-semibold ${isDark ? "text-gray-100" : "text-gray-800"}`}>
              {story.title}
            </div>
            {story.isFeatured && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 text-[10px] font-bold rounded">
                <Star className="w-2.5 h-2.5" />
                FEATURED
              </span>
            )}
          </div>
          <div className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            {story.excerpt?.substring(0, 80)}...
          </div>
        </div>
      </td>
      
      <td className="px-6 py-4">
        <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(story.status)}`}>
          {story.status || 'draft'}
        </span>
      </td>
      
      <td className="px-6 py-4">
        <div className={`flex items-center gap-1 text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          <Calendar className="w-3 h-3" />
          <span>{formatDate(story.publishDate)}</span>
        </div>
      </td>
      
      <td className="px-6 py-4">
        <div className="flex items-center gap-1">
          <Eye className="w-3 h-3 text-gray-400" />
          <span className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            {story.views?.toLocaleString() || '0'}
          </span>
        </div>
      </td>
      
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(story.id)}
            className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer ${
              isDark
                ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                : "bg-blue-100 text-blue-600 hover:bg-blue-200"
            }`}
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(story.id, story.title, story.images)}
            className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer ${
              isDark
                ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                : "bg-red-100 text-red-600 hover:bg-red-200"
            }`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}