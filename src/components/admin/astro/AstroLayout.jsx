// components/admin/astro/AstroLayout.jsx
'use client';

import { Calendar, Sparkles, Moon } from "lucide-react";
import AstroPanchang from "./AstroPanchang";
import AstroHoroscope from "./AstroHoroscope";
import AstroNakshatra from "./AstroNakshatra";

const TABS = [
  { id: 'panchang', label: '📅 Panchang', icon: Calendar },
  { id: 'horoscope', label: '⭐ Horoscope', icon: Sparkles },
  { id: 'nakshatra', label: '🌙 Nakshatra', icon: Moon },
];

export default function AstroLayout({
  activeTab,
  setActiveTab,
  isDark,
  updating,
  // Panchang props
  panchang,
  isEditingPanchang,
  setIsEditingPanchang,
  editPanchangData,
  setEditPanchangData,
  onSavePanchang,
  onFetchPanchang,
  // Horoscope props
  horoscopes,
  editingSign,
  setEditingSign,
  editHoroscopeData,
  setEditHoroscopeData,
  onSaveHoroscope,
  onFetchHoroscopes,
  getHoroscopeForSign,
  // Nakshatra props
  selectedNakshatra,
  setSelectedNakshatra,
  nakshatraData,
  onFetchNakshatra,
  // Other
  selectedDate,
  location,
  language,
}) {
  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className={`rounded-2xl border p-1 transition-all duration-300 ${
        isDark 
          ? 'border-gray-700 bg-gray-800/90 shadow-lg' 
          : 'border-gray-200 bg-white/80 shadow-md backdrop-blur-sm'
      }`}>
        <div className="flex gap-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 shadow-lg"
                    : isDark
                      ? "text-gray-400 hover:bg-gray-700 hover:text-gray-200"
                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'panchang' && (
          <AstroPanchang
            panchang={panchang}
            isEditing={isEditingPanchang}
            setIsEditing={setIsEditingPanchang}
            editData={editPanchangData}
            setEditData={setEditPanchangData}
            onSave={onSavePanchang}
            onFetch={onFetchPanchang}
            updating={updating}
            isDark={isDark}
            selectedDate={selectedDate}
            location={location}
            language={language}
          />
        )}

        {activeTab === 'horoscope' && (
          <AstroHoroscope
            horoscopes={horoscopes}
            editingSign={editingSign}
            setEditingSign={setEditingSign}
            editData={editHoroscopeData}
            setEditData={setEditHoroscopeData}
            onSave={onSaveHoroscope}
            onFetch={onFetchHoroscopes}
            getHoroscopeForSign={getHoroscopeForSign}
            updating={updating}
            isDark={isDark}
            selectedDate={selectedDate}
            language={language}
          />
        )}

        {activeTab === 'nakshatra' && (
          <AstroNakshatra
            selectedNakshatra={selectedNakshatra}
            setSelectedNakshatra={setSelectedNakshatra}
            nakshatraData={nakshatraData}
            onFetch={onFetchNakshatra}
            updating={updating}
            isDark={isDark}
            selectedDate={selectedDate}
            language={language}
          />
        )}
      </div>

      {/* Footer */}
      <div className="text-center">
        <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
          Data sourced from VedicAstro API • Language: {language.toUpperCase()}
        </p>
      </div>
    </div>
  );
}