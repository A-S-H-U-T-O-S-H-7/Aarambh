// components/admin/astro/HoroscopeCard.jsx
'use client';

import { Edit2, Check, X, Sparkles } from "lucide-react";

export default function HoroscopeCard({
  sign,
  horoscope,
  isEditing,
  editData,
  setEditData,
  onEdit,
  onSave,
  onCancel,
  isDark,
  updating,
}) {
  const handleInputChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className={`rounded-2xl border overflow-hidden transition-all duration-300 hover:shadow-xl ${
      isDark 
        ? 'border-gray-700 bg-gray-800/90 shadow-lg' 
        : 'border-gray-200 bg-white/80 shadow-md backdrop-blur-sm'
    }`}>
      {/* Header */}
      <div className={`px-5 py-3 border-b flex items-center justify-between ${
        isDark ? 'border-gray-700 bg-gray-900/50' : 'border-gray-200 bg-gray-50/50'
      }`}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{sign.symbol}</span>
          <div>
            <h3 className={`text-base font-bold ${isDark ? "text-gray-100" : "text-gray-800"}`}>
              {sign.name}
            </h3>
            <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              {sign.date} • {sign.element}
            </p>
          </div>
        </div>
        {!isEditing && horoscope && (
          <button
            onClick={onEdit}
            className={`p-1.5 rounded-lg transition-all duration-200 hover:scale-110 cursor-pointer ${
              isDark
                ? "hover:bg-gray-700 text-blue-400"
                : "hover:bg-gray-100 text-blue-600"
            }`}
            title="Edit manually"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Body */}
      <div className="p-5">
        {isEditing ? (
          // Edit Mode
          <div className="space-y-3">
            <div>
              <label className={`block text-xs font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                Prediction
              </label>
              <textarea
                value={editData.prediction || ''}
                onChange={(e) => handleInputChange('prediction', e.target.value)}
                rows={3}
                className={`w-full px-3 py-2 rounded-xl text-sm transition-all duration-200 resize-none ${
                  isDark
                    ? "bg-gray-900 border-gray-700 text-gray-200 focus:border-yellow-500"
                    : "bg-gray-50 border-gray-300 text-gray-800 focus:border-yellow-400"
                } border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
                placeholder="Enter prediction..."
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block text-xs font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  Lucky Color
                </label>
                <input
                  type="text"
                  value={editData.luckyColor || ''}
                  onChange={(e) => handleInputChange('luckyColor', e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-sm transition-all duration-200 ${
                    isDark
                      ? "bg-gray-900 border-gray-700 text-gray-200 focus:border-yellow-500"
                      : "bg-gray-50 border-gray-300 text-gray-800 focus:border-yellow-400"
                  } border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
                  placeholder="e.g., Red"
                />
              </div>
              <div>
                <label className={`block text-xs font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  Lucky Number
                </label>
                <input
                  type="text"
                  value={editData.luckyNumber || ''}
                  onChange={(e) => handleInputChange('luckyNumber', e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-sm transition-all duration-200 ${
                    isDark
                      ? "bg-gray-900 border-gray-700 text-gray-200 focus:border-yellow-500"
                      : "bg-gray-50 border-gray-300 text-gray-800 focus:border-yellow-400"
                  } border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
                  placeholder="e.g., 7"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block text-xs font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  Lucky Time
                </label>
                <input
                  type="text"
                  value={editData.luckyTime || ''}
                  onChange={(e) => handleInputChange('luckyTime', e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-sm transition-all duration-200 ${
                    isDark
                      ? "bg-gray-900 border-gray-700 text-gray-200 focus:border-yellow-500"
                      : "bg-gray-50 border-gray-300 text-gray-800 focus:border-yellow-400"
                  } border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
                  placeholder="e.g., 10am - 12pm"
                />
              </div>
              <div>
                <label className={`block text-xs font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  Mood
                </label>
                <input
                  type="text"
                  value={editData.mood || ''}
                  onChange={(e) => handleInputChange('mood', e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-sm transition-all duration-200 ${
                    isDark
                      ? "bg-gray-900 border-gray-700 text-gray-200 focus:border-yellow-500"
                      : "bg-gray-50 border-gray-300 text-gray-800 focus:border-yellow-400"
                  } border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
                  placeholder="e.g., Energetic"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={onSave}
                disabled={updating}
                className="flex-1 px-4 py-2 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-semibold transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <Check className="w-4 h-4 inline mr-1" />
                Save
              </button>
              <button
                onClick={onCancel}
                className="flex-1 px-4 py-2 rounded-xl bg-gray-500 hover:bg-gray-600 text-white text-sm font-semibold transition-all duration-200 hover:scale-[1.02] cursor-pointer"
              >
                <X className="w-4 h-4 inline mr-1" />
                Cancel
              </button>
            </div>
          </div>
        ) : horoscope ? (
          // View Mode
          <div className="space-y-4">
            <p className={`text-sm leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              {horoscope.prediction}
            </p>
            <div className="grid grid-cols-2 gap-3 pt-3 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}">
              <div>
                <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>Lucky Color</p>
                <p className={`text-sm font-semibold ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                  {horoscope.luckyColor || "—"}
                </p>
              </div>
              <div>
                <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>Lucky Number</p>
                <p className={`text-sm font-semibold ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                  {horoscope.luckyNumber || "—"}
                </p>
              </div>
              <div>
                <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>Lucky Time</p>
                <p className={`text-sm font-semibold ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                  {horoscope.luckyTime || "—"}
                </p>
              </div>
              <div>
                <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>Mood</p>
                <p className={`text-sm font-semibold ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                  {horoscope.mood || "—"}
                </p>
              </div>
            </div>
            {horoscope.isManualOverride && (
              <div className="mt-2 text-xs text-yellow-500 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Manually edited
              </div>
            )}
          </div>
        ) : (
          // No Data
          <div className="text-center py-6">
            <p className={`text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}>
              No horoscope data
            </p>
            <button
              onClick={onEdit}
              className="mt-2 text-sm text-yellow-500 hover:text-yellow-400 transition-colors cursor-pointer"
            >
              Add manually →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}