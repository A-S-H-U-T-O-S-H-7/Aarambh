// components/admin/astro/AstroPanchang.jsx
'use client';

import { useState } from "react";
import { 
  RefreshCw, Edit2, Check, X, Calendar, 
  Sun, Moon, Star, Clock, Sparkles 
} from "lucide-react";
import PanchangCard from "./PanchangCard";
import ChoghadiyaTable from "./ChoghadiyaTable";
import HoraTable from "./HoraTable";

const normalizePanchangValue = (value) => {
  if (value === undefined || value === null || value === '') return '';
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) return value.filter((item) => item !== undefined && item !== null && item !== '').join(', ');
  if (typeof value === 'object') {
    return (
      value.name ||
      value.title ||
      value.tithi_name ||
      value.tithiName ||
      value.nakshatra_name ||
      value.nakshatraName ||
      value.tithi_detail ||
      value.tithiDetail ||
      value.nakshatra_detail ||
      value.nakshatraDetail ||
      value.meaning ||
      value.special ||
      value.type ||
      value.start ||
      value.end ||
      ''
    );
  }
  return String(value);
};

const panchangFields = [
  { key: 'tithi', label: 'Tithi', icon: Moon },
  { key: 'tithiDetails', label: 'Tithi Details', icon: Moon },
  { key: 'nakshatra', label: 'Nakshatra', icon: Star },
  { key: 'nakshatraDetails', label: 'Nakshatra Details', icon: Star },
  { key: 'yoga', label: 'Yoga', icon: Sun },
  { key: 'karana', label: 'Karana', icon: Sun },
  { key: 'sunrise', label: 'Sunrise', icon: Sun },
  { key: 'sunset', label: 'Sunset', icon: Moon },
  { key: 'rahuKaal', label: 'Rahu Kaal', icon: Clock },
  { key: 'abhijitMuhurat', label: 'Abhijit Muhurat', icon: Clock },
  { key: 'amritKaal', label: 'Amrit Kaal', icon: Clock },
  { key: 'specialEvent', label: 'Special Event', icon: Calendar },
];

export default function AstroPanchang({
  panchang,
  isEditing,
  setIsEditing,
  editData,
  setEditData,
  onSave,
  onFetch,
  updating,
  isDark,
  selectedDate,
  location,
  language,
}) {
  const formatDateDisplay = (date) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      weekday: 'short'
    });
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({});
  };

  return (
    <div className="space-y-5">
      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={onFetch}
          disabled={updating}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-semibold transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${updating ? 'animate-spin' : ''}`} />
          Fetch from API
        </button>
        {panchang && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500 text-white font-semibold transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Edit2 className="w-4 h-4" />
            Edit Manually
          </button>
        )}
      </div>

      {/* Main Card */}
      <div className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
        isDark 
          ? 'border-gray-700 bg-gray-800/90 shadow-lg' 
          : 'border-gray-200 bg-white/80 shadow-md backdrop-blur-sm'
      }`}>
        <div className={`px-6 py-4 border-b flex items-center justify-between flex-wrap gap-2 ${
          isDark ? 'border-gray-700 bg-gray-900/50' : 'border-gray-200 bg-gray-50/50'
        }`}>
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-yellow-500" />
            <h2 className={`text-lg font-semibold ${isDark ? "text-gray-100" : "text-gray-800"}`}>
              Daily Panchang
            </h2>
            <span className={`text-xs px-2.5 py-1 rounded-full ${
              isDark ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700'
            }`}>
              {formatDateDisplay(selectedDate)}
            </span>
            <span className={`text-xs px-2.5 py-1 rounded-full ${
              isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'
            }`}>
              {location.toUpperCase()} • {language.toUpperCase()}
            </span>
          </div>
          {panchang?.isManualOverride && (
            <span className={`text-xs px-2.5 py-1 rounded-full ${
              isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-700'
            }`}>
              Manually edited
            </span>
          )}
        </div>

        <div className="p-6">
          {!panchang && !isEditing ? (
            <div className="text-center py-12">
              <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                No panchang data found for this date
              </p>
              <button
                onClick={onFetch}
                disabled={updating}
                className="mt-4 px-6 py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-semibold transition-all duration-200 hover:shadow-lg hover:scale-[1.02] cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 inline mr-2 ${updating ? 'animate-spin' : ''}`} />
                Fetch from API
              </button>
            </div>
          ) : isEditing ? (
            // Edit Mode
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {panchangFields.map((field) => {
                  const Icon = field.icon;
                  return (
                    <div key={field.key}>
                      <label className={`block text-sm font-medium mb-1.5 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                        {field.label}
                      </label>
                      <div className="relative">
                        <Icon className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
                        <input
                          type="text"
                          value={editData[field.key] || ''}
                          onChange={(e) => handleInputChange(field.key, e.target.value)}
                          className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                            isDark
                              ? "bg-gray-900 border-gray-700 text-gray-200 focus:border-yellow-500"
                              : "bg-gray-50 border-gray-300 text-gray-800 focus:border-yellow-400"
                          } border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
                          placeholder={`Enter ${field.label.toLowerCase()}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => onSave(editData)}
                  disabled={updating}
                  className="flex-1 px-6 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Check className="w-4 h-4 inline mr-2" />
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 px-6 py-2.5 rounded-xl bg-gray-500 hover:bg-gray-600 text-white font-semibold transition-all duration-200 hover:scale-[1.02] cursor-pointer"
                >
                  <X className="w-4 h-4 inline mr-2" />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            // View Mode
            <div className="space-y-6">
              {/* Main Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {panchangFields.map((field) => {
                  const Icon = field.icon;
                  const value = normalizePanchangValue(panchang[field.key]);
                  return (
                    <PanchangCard
                      key={field.key}
                      icon={Icon}
                      label={field.label}
                      value={value}
                      isDark={isDark}
                    />
                  );
                })}
              </div>

              {/* Festivals Section */}
              {panchang.festivals && panchang.festivals.length > 0 && (
                <div className={`mt-6 p-4 rounded-xl ${
                  isDark ? "bg-yellow-500/10 border border-yellow-500/20" : "bg-yellow-50 border border-yellow-200"
                }`}>
                  <h3 className={`text-sm font-semibold flex items-center gap-2 mb-3 ${isDark ? "text-yellow-400" : "text-yellow-700"}`}>
                    <Sparkles className="w-4 h-4" />
                    Festivals & Special Events
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {panchang.festivals.map((festival, index) => (
                      <div key={index} className={`p-3 rounded-lg ${
                        isDark ? "bg-gray-900/50" : "bg-white/50"
                      }`}>
                        <p className={`text-sm font-semibold ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                          {festival.festival_name}
                        </p>
                        <p className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                          {festival.significance}
                        </p>
                        <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${
                          isDark ? "bg-blue-500/20 text-blue-400" : "bg-blue-100 text-blue-700"
                        }`}>
                          {festival.type}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Choghadiya Table */}
              {panchang.choghadiya && (
                <ChoghadiyaTable
                  choghadiya={panchang.choghadiya}
                  isDark={isDark}
                />
              )}

              {/* Hora Table */}
              {panchang.hora && (
                <HoraTable
                  hora={panchang.hora}
                  isDark={isDark}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}