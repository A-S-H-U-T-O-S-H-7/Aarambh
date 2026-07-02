// components/admin/festivals/FestivalTable.jsx
'use client';

import Pagination from '../Pagination';
import FestivalTableRow from './FestivalTableRow';

export default function FestivalTable({ festivals, currentPage, totalPages, isUpdating, isDark, onEdit, onDelete, onPageChange }) {
  const itemsPerPage = 10;

  if (festivals.length === 0) {
    return (
      <div className={`rounded-2xl border p-12 text-center transition-all duration-300 ${
        isDark 
          ? 'border-gray-700/50 bg-gradient-to-br from-gray-800/90 to-gray-900/90 shadow-lg backdrop-blur-sm' 
          : 'border-gray-200/50 bg-white/80 shadow-md backdrop-blur-sm'
      }`}>
        <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>No festivals found</p>
        <p className={`text-sm mt-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Create your first festival</p>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
      isUpdating ? 'opacity-60' : 'opacity-100'
    } ${
      isDark 
        ? 'border-gray-700/50 bg-gradient-to-br from-gray-800/90 to-gray-900/90 shadow-lg backdrop-blur-sm' 
        : 'border-gray-200/50 bg-white/80 shadow-md backdrop-blur-sm'
    }`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={`${
            isDark 
              ? 'bg-gradient-to-r from-yellow-500/10 via-yellow-400/5 to-yellow-500/10 text-gray-200' 
              : 'bg-gradient-to-r from-yellow-500/5 via-yellow-400/5 to-yellow-500/5 text-gray-700'
          } border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">#</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Featured</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDark ? 'divide-gray-700/50' : 'divide-gray-200/50'}`}>
            {festivals.map((festival, index) => (
              <FestivalTableRow
                key={festival.id}
                festival={festival}
                index={index}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                isDark={isDark}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        isDark={isDark}
      />
    </div>
  );
}