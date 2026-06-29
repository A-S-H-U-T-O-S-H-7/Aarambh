// components/admin/media/MediaTableRow.jsx
'use client';

import { Edit, Trash2, Eye, Calendar, Star, TrendingUp, Music, Video } from "lucide-react";
import { FaYoutube } from "react-icons/fa";
import Link from "next/link";

export default function MediaTableRow({ item, index, currentPage, itemsPerPage, isDark, onEdit, onDelete }) {
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

  const getTypeIcon = (type) => {
    if (type === 'bhajan') return <Music className="w-4 h-4 text-yellow-500" />;
    return <Video className="w-4 h-4 text-yellow-500" />;
  };

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
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${
          item.mediaType === 'bhajan'
            ? isDark ? "bg-yellow-500/20 text-yellow-400" : "bg-yellow-100 text-yellow-700"
            : isDark ? "bg-blue-500/20 text-blue-400" : "bg-blue-100 text-blue-700"
        }`}>
          {getTypeIcon(item.mediaType)}
          {item.mediaType === 'bhajan' ? 'Bhajan' : 'Video'}
        </span>
      </td>
      
      <td className="px-6 py-4">
        <div className="w-20 h-12 rounded-lg overflow-hidden bg-gray-900 shadow-md">
          {item.thumbnail ? (
            <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              {item.mediaType === 'bhajan' ? (
                <Music className="w-6 h-6 text-yellow-500" />
              ) : (
                <FaYoutube className="w-6 h-6 text-red-500" />
              )}
            </div>
          )}
        </div>
      </td>
      
      <td className="px-6 py-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <div className={`text-sm font-semibold ${isDark ? "text-gray-100" : "text-gray-800"}`}>
              {item.title}
            </div>
            
            {item.isFeatured && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 text-[10px] font-bold rounded">
                <Star className="w-2.5 h-2.5" />
                FEATURED
              </span>
            )}
            {item.isTrending && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-gradient-to-r from-orange-400 to-red-500 text-white text-[10px] font-bold rounded">
                <TrendingUp className="w-2.5 h-2.5" />
                TRENDING
              </span>
            )}
          </div>
          {item.artist && (
            <div className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              Artist: {item.artist}
            </div>
          )}
        </div>
      </td>

      <td className="px-6 py-4">
        <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
          {item.status || 'draft'}
        </span>
      </td>
      
      <td className="px-6 py-4">
        <div className={`flex items-center gap-1 text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          <Calendar className="w-3 h-3" />
          <span>{formatDate(item.publishDate)}</span>
        </div>
      </td>
      
      <td className="px-6 py-4">
        <div className="flex items-center gap-1">
          <Eye className="w-3 h-3 text-gray-400" />
          <span className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            {item.views?.toLocaleString() || '0'}
          </span>
        </div>
      </td>
      
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(item.id)}
            className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer ${
              isDark
                ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                : "bg-blue-100 text-blue-600 hover:bg-blue-200"
            }`}
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(item.id, item.title)}
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