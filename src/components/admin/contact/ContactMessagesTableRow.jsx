// components/admin/messages/ContactMessagesTableRow.jsx
'use client';

import { Eye, Reply, Trash2 } from "lucide-react";

export default function ContactMessagesTableRow({ message, index, isDark, onView, onMarkReplied, onDelete }) {
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'unread':
        return <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">Unread</span>;
      case 'read':
        return <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">Read</span>;
      case 'replied':
        return <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">Replied</span>;
      default:
        return <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">Unknown</span>;
    }
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
            {message.name}
          </div>
          <div className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            {message.email}
          </div>
          <div className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"} mt-1`}>
            {message.phone}
          </div>
        </div>
      </td>
      
      <td className="px-6 py-4">
        <div className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"} max-w-xs truncate`}>
          {message.message}
        </div>
        {message.subject && (
          <div className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"} mt-1`}>
            Subject: {message.subject}
          </div>
        )}
      </td>
      
      <td className="px-6 py-4">
        {getStatusBadge(message.status)}
      </td>
      
      <td className="px-6 py-4">
        <div className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
          {formatDate(message.createdAt)}
        </div>
      </td>
      
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onView(message)}
            className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer ${
              isDark
                ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                : "bg-blue-100 text-blue-600 hover:bg-blue-200"
            }`}
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          {message.status !== 'replied' && (
            <button
              onClick={() => onMarkReplied(message.id)}
              className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer ${
                isDark
                  ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                  : "bg-green-100 text-green-600 hover:bg-green-200"
              }`}
              title="Mark as Replied"
            >
              <Reply className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => onDelete(message)}
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