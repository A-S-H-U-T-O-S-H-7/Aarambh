// components/admin/leads/LeadsTableRow.jsx
'use client';

import { Eye, Trash2 } from "lucide-react";

export default function LeadsTableRow({ inquiry, index, isDark, onView, onUpdateStatus, onDelete }) {
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">Pending</span>;
      case 'contacted':
        return <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">Contacted</span>;
      case 'approved':
        return <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">Approved</span>;
      case 'rejected':
        return <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">Rejected</span>;
      default:
        return <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">Unknown</span>;
    }
  };

  const getAdTypeLabel = (type) => {
    const types = {
      display: "Display Banner",
      video: "Video Ad",
      native: "Native Ad",
      newsletter: "Newsletter Ad",
      sponsored: "Sponsored Article",
    };
    return types[type] || type;
  };

  return (
    <tr className={`transition-colors ${
      isDark
        ? `${index % 2 === 0 ? "bg-gray-900/30" : "bg-gray-800/30"} hover:bg-gray-700/30`
        : `${index % 2 === 0 ? "bg-white/50" : "bg-gray-50/50"} hover:bg-gray-100/70`
    }`}>
      <td className="px-6 py-4">
        <span className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          {index + 1}
        </span>
      </td>
      
      <td className="px-6 py-4">
        <div>
          <div className={`text-sm font-semibold ${isDark ? "text-gray-100" : "text-gray-800"}`}>
            {inquiry.companyName}
          </div>
          <div className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            {inquiry.contactPerson}
          </div>
        </div>
      </td>
      
      <td className="px-6 py-4">
        <div>
          <div className={`text-xs ${isDark ? "text-gray-300" : "text-gray-600"}`}>
            {inquiry.email}
          </div>
          <div className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            {inquiry.phone}
          </div>
        </div>
      </td>
      
      <td className="px-6 py-4">
        <div className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
          {getAdTypeLabel(inquiry.adType)}
        </div>
        <div className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
          {inquiry.budget && inquiry.budget.replace('_', ' - ').replace('below', 'Below').replace('above', 'Above')}
        </div>
      </td>
      
      <td className="px-6 py-4">
        {getStatusBadge(inquiry.status)}
      </td>
      
      <td className="px-6 py-4">
        <div className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
          {formatDate(inquiry.createdAt)}
        </div>
      </td>
      
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onView(inquiry)}
            className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer ${
              isDark
                ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                : "bg-blue-100 text-blue-600 hover:bg-blue-200"
            }`}
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <select
            onChange={(e) => onUpdateStatus(inquiry.id, e.target.value)}
            value={inquiry.status}
            className={`text-xs px-2 py-1.5 rounded-lg border focus:outline-none ${
              isDark
                ? "bg-gray-700 border-gray-600 text-gray-300"
                : "bg-white border-gray-300 text-gray-700"
            }`}
          >
            <option value="pending">Pending</option>
            <option value="contacted">Contacted</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <button
            onClick={() => onDelete(inquiry)}
            className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer ${
              isDark
                ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                : "bg-red-100 text-red-600 hover:bg-red-200"
            }`}
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}