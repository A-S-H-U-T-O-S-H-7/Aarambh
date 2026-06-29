// components/admin/astro/AstroHoroscope.jsx
'use client';

import { RefreshCw } from "lucide-react";
import HoroscopeCard from "./HoroscopeCard";
import { zodiacSigns } from "@/lib/services/horoscopeService";

export default function AstroHoroscope({
  horoscopes,
  editingSign,
  setEditingSign,
  editData,
  setEditData,
  onSave,
  onFetch,
  getHoroscopeForSign,
  updating,
  isDark,
  selectedDate,
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

  return (
    <div className="space-y-5">
      {/* Actions */}
      <div className="flex flex-wrap gap-3 items-center">
        <button
          onClick={onFetch}
          disabled={updating}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-semibold transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${updating ? 'animate-spin' : ''}`} />
          Fetch All Horoscopes
        </button>
        <span className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
          {Object.keys(horoscopes).length}/12 signs available • {formatDateDisplay(selectedDate)} • {language.toUpperCase()}
        </span>
      </div>

      {/* Horoscopes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        {zodiacSigns.map((sign) => {
          const horoscope = getHoroscopeForSign(sign.id);
          const isEditing = editingSign === sign.id;
          
          return (
            <HoroscopeCard
              key={sign.id}
              sign={sign}
              horoscope={horoscope}
              isEditing={isEditing}
              editData={editData}
              setEditData={setEditData}
              onEdit={() => setEditingSign(sign.id)}
              onSave={() => onSave(sign.id, editData)}
              onCancel={() => {
                setEditingSign(null);
                setEditData({});
              }}
              isDark={isDark}
              updating={updating}
            />
          );
        })}
      </div>
    </div>
  );
}