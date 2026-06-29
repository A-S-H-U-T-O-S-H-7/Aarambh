// components/admin/users/UsersTableRow.jsx
'use client';

import { useState } from "react";
import { Eye, Ban, CheckCircle, Bell, BellOff, Trash2 } from "lucide-react";

export default function UsersTableRow({ 
  user, 
  index, 
  currentPage, 
  itemsPerPage, 
  isDark, 
  onView, 
  onBlock, 
  onDelete, 
  onToggleSubscription 
}) {
  const [isUpdating, setIsUpdating] = useState(false);

  const formatDate = (date) => {
    if (!date) return "Never";
    return new Date(date).toLocaleDateString("en-US", { 
      year: "numeric", 
      month: "short", 
      day: "2-digit" 
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active": 
        return isDark ? "bg-green-900/40 text-green-400" : "bg-green-100 text-green-700";
      case "blocked": 
        return isDark ? "bg-red-900/40 text-red-400" : "bg-red-100 text-red-700";
      default: 
        return isDark ? "bg-gray-700/40 text-gray-400" : "bg-gray-100 text-gray-600";
    }
  };

  // Get the profile image from various possible fields
  const getProfileImage = () => {
    return user.avatar || user.photoURL || user.photoUrl || user.profileImage || user.image || null;
  };

  const profileImage = getProfileImage();

  const handleToggleSubscription = async () => {
    setIsUpdating(true);
    await onToggleSubscription(user.id, !user.isSubscribed);
    setIsUpdating(false);
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
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0 shadow-md">
            {profileImage ? (
              <img 
                src={profileImage} 
                alt={user.name || user.email} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  // If image fails to load, show fallback
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = `
                    <div class="w-full h-full flex items-center justify-center bg-gradient-to-r from-yellow-400 to-yellow-500">
                      <span class="text-sm font-bold text-gray-900">
                        ${(user.name || user.email || 'U').charAt(0).toUpperCase()}
                      </span>
                    </div>
                  `;
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-yellow-400 to-yellow-500">
                <span className="text-sm font-bold text-gray-900">
                  {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div>
            <div className={`text-sm font-semibold ${isDark ? "text-gray-100" : "text-gray-800"}`}>
              {user.name || user.displayName || "User"}
            </div>
            <div className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              {user.email}
            </div>
          </div>
        </div>
      </td>
      
      <td className="px-6 py-4">
        <div className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
          {formatDate(user.createdAt)}
        </div>
      </td>
      
      <td className="px-6 py-4">
        <div className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
          {formatDate(user.lastLoginAt)}
        </div>
      </td>
      
      <td className="px-6 py-4">
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          {user.status === "active" ? "Active" : "Blocked"}
        </span>
      </td>
      
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          {user.isSubscribed ? (
            <>
              <Bell className="w-4 h-4 text-green-500" />
              <span className={`text-sm font-medium ${isDark ? "text-green-400" : "text-green-600"}`}>Yes</span>
            </>
          ) : (
            <>
              <BellOff className="w-4 h-4 text-gray-400" />
              <span className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>No</span>
            </>
          )}
        </div>
      </td>
      
      <td className="px-6 py-4">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onView(user)}
            className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer ${
              isDark
                ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                : "bg-blue-100 text-blue-600 hover:bg-blue-200"
            }`}
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleToggleSubscription}
            disabled={isUpdating}
            className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer ${
              user.isSubscribed
                ? isDark ? "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30" : "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                : isDark ? "bg-green-500/20 text-green-400 hover:bg-green-500/30" : "bg-green-100 text-green-600 hover:bg-green-200"
            }`}
            title={user.isSubscribed ? "Unsubscribe" : "Subscribe"}
          >
            {user.isSubscribed ? <BellOff className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
          </button>
          
          <button
            onClick={() => onBlock(user)}
            className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer ${
              user.status === "blocked"
                ? isDark ? "bg-green-500/20 text-green-400 hover:bg-green-500/30" : "bg-green-100 text-green-600 hover:bg-green-200"
                : isDark ? "bg-orange-500/20 text-orange-400 hover:bg-orange-500/30" : "bg-orange-100 text-orange-600 hover:bg-orange-200"
            }`}
            title={user.status === "blocked" ? "Unblock User" : "Block User"}
          >
            {user.status === "blocked" ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
          </button>
          
          <button
            onClick={() => onDelete(user)}
            className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer ${
              isDark
                ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                : "bg-red-100 text-red-600 hover:bg-red-200"
            }`}
            title="Delete User"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}