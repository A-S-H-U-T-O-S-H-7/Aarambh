// components/admin/Pagination.jsx
'use client';

import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ currentPage, totalPages, onPageChange, isDark }) {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Calculate start and end of visible pages
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust to show 3 pages in middle
      if (currentPage <= 3) {
        end = Math.min(totalPages - 1, 4);
      } else if (currentPage >= totalPages - 2) {
        start = Math.max(2, totalPages - 3);
      }
      
      // Add ellipsis if needed
      if (start > 2) {
        pages.push('...');
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (end < totalPages - 1) {
        pages.push('...');
      }
      
      pages.push(totalPages);
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}">
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
            isDark
              ? "text-gray-400 hover:bg-gray-700"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        
        {getPageNumbers().map((page, index) => (
          page === '...' ? (
            <span key={`ellipsis-${index}`} className={`px-2 text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}>
              …
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer ${
                currentPage === page
                  ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 shadow-md"
                  : isDark
                    ? "text-gray-400 hover:bg-gray-700"
                    : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          )
        ))}
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
            isDark
              ? "text-gray-400 hover:bg-gray-700"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      
      <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
}