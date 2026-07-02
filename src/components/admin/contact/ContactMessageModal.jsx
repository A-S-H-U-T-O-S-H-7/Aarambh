// components/admin/messages/ContactMessageModal.jsx
'use client';

import { X, Mail, Phone, User, Calendar, MessageSquare } from "lucide-react";

export default function ContactMessageModal({ isOpen, onClose, message, isDark }) {
  if (!isOpen || !message) return null;

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'unread':
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
      case 'read':
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
      case 'replied':
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className={`relative w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden ${
        isDark ? "bg-gray-800" : "bg-white"
      }`}>
        <div className="h-1.5 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400" />
        
        <div className="flex items-center justify-between p-5 pb-2">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${isDark ? "bg-yellow-500/20" : "bg-yellow-500/10"}`}>
              <MessageSquare className={`w-5 h-5 text-yellow-500`} />
            </div>
            <h2 className={`text-xl font-bold ${isDark ? "text-gray-100" : "text-gray-800"}`}>
              Message Details
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-all ${
              isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 pt-2 space-y-4">
          {/* Sender Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`flex items-center gap-3 p-3 rounded-lg ${isDark ? "bg-gray-700/50" : "bg-gray-50"}`}>
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>Name</p>
                <p className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-800"}`}>{message.name}</p>
              </div>
            </div>
            
            <div className={`flex items-center gap-3 p-3 rounded-lg ${isDark ? "bg-gray-700/50" : "bg-gray-50"}`}>
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>Email</p>
                <p className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-800"}`}>{message.email}</p>
              </div>
            </div>
            
            <div className={`flex items-center gap-3 p-3 rounded-lg ${isDark ? "bg-gray-700/50" : "bg-gray-50"}`}>
              <Phone className="w-5 h-5 text-gray-400" />
              <div>
                <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>Phone</p>
                <p className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-800"}`}>{message.phone}</p>
              </div>
            </div>
            
            <div className={`flex items-center gap-3 p-3 rounded-lg ${isDark ? "bg-gray-700/50" : "bg-gray-50"}`}>
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>Received</p>
                <p className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-800"}`}>{formatDate(message.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className={`flex items-center justify-between p-3 rounded-lg ${isDark ? "bg-gray-700/50" : "bg-gray-50"}`}>
            <span className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>Status</span>
            <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(message.status)}`}>
              {message.status === 'unread' ? 'Unread' : message.status === 'read' ? 'Read' : 'Replied'}
            </span>
          </div>

          {/* Subject */}
          {message.subject && (
            <div className={`p-3 rounded-lg ${isDark ? "bg-gray-700/50" : "bg-gray-50"}`}>
              <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"} mb-1`}>Subject</p>
              <p className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-800"}`}>{message.subject}</p>
            </div>
          )}

          {/* Message Content */}
          <div className={`p-3 rounded-lg ${isDark ? "bg-gray-700/50" : "bg-gray-50"}`}>
            <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"} mb-2`}>Message</p>
            <div className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"} whitespace-pre-wrap leading-relaxed`}>
              {message.message}
            </div>
          </div>

          {/* Reply Button */}
          <div className="pt-2">
            <a
              href={`mailto:${message.email}?subject=Re: ${message.subject || 'Your inquiry'}`}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
            >
              <Mail className="w-4 h-4" />
              Reply via Email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}