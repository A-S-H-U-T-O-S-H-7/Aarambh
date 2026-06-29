// components/admin/users/UserDetailsModal.jsx
'use client';

import { X, Mail, Calendar, Clock, User as UserIcon, Bell, Shield } from "lucide-react";

export default function UserDetailsModal({ isOpen, onClose, user, isDark }) {
  if (!isOpen || !user) return null;

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get the profile image from various possible fields
  const getProfileImage = () => {
    return user.avatar || user.photoURL || user.photoUrl || user.profileImage || user.image || null;
  };

  const profileImage = getProfileImage();
  const displayName = user.name || user.displayName || "User";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className={`relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
        isDark 
          ? 'border-gray-700 bg-gray-800/95 shadow-2xl backdrop-blur-sm' 
          : 'border-gray-200 bg-white/95 shadow-2xl backdrop-blur-sm'
      } border`}>
        <div className="h-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400" />
        
        <div className="flex items-center justify-between p-5 pb-2">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${isDark ? "bg-yellow-500/20" : "bg-yellow-500/10"}`}>
              <UserIcon className={`w-5 h-5 text-yellow-500`} />
            </div>
            <h2 className={`text-xl font-bold ${isDark ? "text-gray-100" : "text-gray-800"}`}>User Details</h2>
          </div>
          <button 
            onClick={onClose} 
            className={`p-1.5 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer ${
              isDark ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-500"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 pt-2">
          {/* Avatar */}
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 shadow-lg">
              {profileImage ? (
                <img 
                  src={profileImage} 
                  alt={displayName} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // If image fails to load, show fallback
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `
                      <div class="w-full h-full flex items-center justify-center bg-gradient-to-r from-yellow-400 to-yellow-500">
                        <span class="text-3xl font-bold text-gray-900">
                          ${displayName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    `;
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-yellow-400 to-yellow-500">
                  <span className="text-3xl font-bold text-gray-900">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Name */}
          <div className="text-center mb-4">
            <h3 className={`text-xl font-bold ${isDark ? "text-gray-100" : "text-gray-800"}`}>{displayName}</h3>
            <div className="flex items-center justify-center gap-2 mt-1.5 flex-wrap">
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full ${
                user.status === "active" 
                  ? isDark ? "bg-green-900/40 text-green-400" : "bg-green-100 text-green-700"
                  : isDark ? "bg-red-900/40 text-red-400" : "bg-red-100 text-red-700"
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {user.status === "active" ? "Active" : "Blocked"}
              </span>
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full ${
                user.isSubscribed 
                  ? isDark ? "bg-blue-900/40 text-blue-400" : "bg-blue-100 text-blue-700"
                  : isDark ? "bg-gray-700/40 text-gray-400" : "bg-gray-100 text-gray-600"
              }`}>
                <Bell className="w-3 h-3" />
                {user.isSubscribed ? "Subscribed" : "Not Subscribed"}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-3">
            <div className={`flex items-center gap-3 p-3 rounded-xl ${
              isDark ? "bg-gray-900/50" : "bg-gray-50"
            }`}>
              <Mail className="w-4 h-4 text-gray-400" />
              <div>
                <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>Email</p>
                <p className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-800"}`}>{user.email}</p>
              </div>
            </div>

            <div className={`flex items-center gap-3 p-3 rounded-xl ${
              isDark ? "bg-gray-900/50" : "bg-gray-50"
            }`}>
              <Calendar className="w-4 h-4 text-gray-400" />
              <div>
                <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>Registered On</p>
                <p className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-800"}`}>{formatDate(user.createdAt)}</p>
              </div>
            </div>

            <div className={`flex items-center gap-3 p-3 rounded-xl ${
              isDark ? "bg-gray-900/50" : "bg-gray-50"
            }`}>
              <Clock className="w-4 h-4 text-gray-400" />
              <div>
                <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>Last Login</p>
                <p className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-800"}`}>{formatDate(user.lastLoginAt)}</p>
              </div>
            </div>

            {user.role && user.role !== 'user' && (
              <div className={`flex items-center gap-3 p-3 rounded-xl ${
                isDark ? "bg-gray-900/50" : "bg-gray-50"
              }`}>
                <Shield className="w-4 h-4 text-gray-400" />
                <div>
                  <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>Role</p>
                  <p className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 p-5 pt-2 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}">
          <button 
            onClick={onClose} 
            className={`flex-1 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${
              isDark 
                ? "bg-gray-700 hover:bg-gray-600 text-gray-200" 
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}