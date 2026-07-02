// components/admin/temples/TempleTableRow.jsx
'use client';

import { Edit, Trash2, Calendar, Star, Eye } from 'lucide-react';
import Link from 'next/link';

export default function TempleTableRow({ temple, index, currentPage, itemsPerPage, isDark, onEdit, onDelete }) {
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return isDark ? 'bg-green-900/40 text-green-400' : 'bg-green-100 text-green-700';
      default:
        return isDark ? 'bg-yellow-900/40 text-yellow-400' : 'bg-yellow-100 text-yellow-700';
    }
  };

  const getCategoryName = (category) => {
    const map = {
      north: 'North India',
      south: 'South India',
      east: 'East India',
      west: 'West India',
      central: 'Central India',
    };
    return map[category] || category || '—';
  };

  const featuredImage = temple.featuredImage || (temple.images && temple.images[0]) || null;

  return (
    <tr className={`transition-colors ${
      isDark
        ? `${index % 2 === 0 ? 'bg-gray-900/30' : 'bg-gray-800/30'} hover:bg-gray-700/30`
        : `${index % 2 === 0 ? 'bg-white/50' : 'bg-gray-50/50'} hover:bg-gray-100/70`
    }`}>
      <td className="px-6 py-4">
        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {(currentPage - 1) * itemsPerPage + index + 1}
        </span>
      </td>
      
      <td className="px-6 py-4">
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
          {featuredImage ? (
            <img src={featuredImage} alt={temple.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl">🛕</div>
          )}
        </div>
      </td>
      
      <td className="px-6 py-4">
        <div>
          <div className={`text-sm font-semibold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
            {temple.title}
          </div>
          {temple.location && (
            <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              📍 {temple.location}
            </div>
          )}
        </div>
      </td>

      <td className="px-6 py-4">
        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {temple.deity || '—'}
        </span>
      </td>

      <td className="px-6 py-4">
        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {getCategoryName(temple.category)}
        </span>
      </td>
      
      <td className="px-6 py-4">
        <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(temple.status)}`}>
          {temple.status || 'draft'}
        </span>
      </td>

      <td className="px-6 py-4">
        {temple.featured ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-yellow-500/20 text-yellow-600 dark:bg-yellow-500/30 dark:text-yellow-400">
            <Star className="w-3 h-3" />
            Featured
          </span>
        ) : (
          <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>—</span>
        )}
      </td>
      
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(temple.id)}
            className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer ${
              isDark
                ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
            }`}
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(temple.id, temple.title, temple.images)}
            className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer ${
              isDark
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                : 'bg-red-100 text-red-600 hover:bg-red-200'
            }`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}