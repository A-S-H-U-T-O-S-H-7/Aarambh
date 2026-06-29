// components/admin/astro/AstroNakshatra.jsx
'use client';

import { RefreshCw, Star, Calendar } from "lucide-react";
import { nakshatraList } from "@/lib/astro/vedicApi";

export default function AstroNakshatra({
  selectedNakshatra,
  setSelectedNakshatra,
  nakshatraData,
  onFetch,
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
      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-3">
          <Star className="w-5 h-5 text-yellow-500" />
          <span className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            Select Nakshatra:
          </span>
        </div>
        <select
          value={selectedNakshatra}
          onChange={(e) => setSelectedNakshatra(Number(e.target.value))}
          className={`px-4 py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer ${
            isDark
              ? "bg-gray-900 border-gray-700 text-gray-200 focus:border-yellow-500"
              : "bg-gray-50 border-gray-300 text-gray-800 focus:border-yellow-400"
          } border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
        >
          {nakshatraList.map((n) => (
            <option key={n.id} value={n.id}>
              {n.id}. {n.name}
            </option>
          ))}
        </select>
        <button
          onClick={onFetch}
          disabled={updating}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-semibold transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${updating ? 'animate-spin' : ''}`} />
          Fetch Nakshatra
        </button>
        <span className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
          {formatDateDisplay(selectedDate)} • {language.toUpperCase()}
        </span>
      </div>

      {/* Nakshatra Card */}
      <div className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
        isDark 
          ? 'border-gray-700 bg-gray-800/90 shadow-lg' 
          : 'border-gray-200 bg-white/80 shadow-md backdrop-blur-sm'
      }`}>
        <div className={`px-6 py-4 border-b flex items-center gap-3 ${
          isDark ? 'border-gray-700 bg-gray-900/50' : 'border-gray-200 bg-gray-50/50'
        }`}>
          <Star className="w-5 h-5 text-yellow-500" />
          <h2 className={`text-lg font-semibold ${isDark ? "text-gray-100" : "text-gray-800"}`}>
            Daily Nakshatra
          </h2>
          {nakshatraData?.nakshatra && (
            <span className={`text-sm font-medium px-3 py-1 rounded-full ${
              isDark ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700'
            }`}>
              {nakshatraData.nakshatra}
            </span>
          )}
        </div>

        <div className="p-6">
          {nakshatraData ? (
            <div className="space-y-6">
              {/* Prediction */}
              <div>
                <p className={`text-sm leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  {nakshatraData.prediction}
                </p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}">
                <div className={`p-4 rounded-xl ${isDark ? "bg-gray-900/50" : "bg-gray-50"}`}>
                  <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>Lucky Color</p>
                  <p className={`text-sm font-semibold ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                    {nakshatraData.luckyColor || "—"}
                  </p>
                </div>
                <div className={`p-4 rounded-xl ${isDark ? "bg-gray-900/50" : "bg-gray-50"}`}>
                  <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>Lucky Number</p>
                  <p className={`text-sm font-semibold ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                    {nakshatraData.luckyNumber || "—"}
                  </p>
                </div>
                <div className={`p-4 rounded-xl ${isDark ? "bg-gray-900/50" : "bg-gray-50"}`}>
                  <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>Source</p>
                  <p className={`text-sm font-semibold ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                    {nakshatraData.source === 'vedicastro' ? '🌐 VedicAstro' : '📝 Fallback'}
                  </p>
                </div>
              </div>

              {nakshatraData.source === 'fallback' && (
                <div className={`p-4 rounded-xl ${
                  isDark ? "bg-yellow-500/10 border border-yellow-500/20" : "bg-yellow-50 border border-yellow-200"
                }`}>
                  <p className={`text-sm ${isDark ? "text-yellow-400" : "text-yellow-700"}`}>
                    ⚠️ Using fallback data. Click "Fetch Nakshatra" to get real data from API.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                Select a Nakshatra and click "Fetch Nakshatra" to load data
              </p>
              <button
                onClick={onFetch}
                disabled={updating}
                className="mt-4 px-6 py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-semibold transition-all duration-200 hover:shadow-lg hover:scale-[1.02] cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 inline mr-2 ${updating ? 'animate-spin' : ''}`} />
                Fetch Nakshatra
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}