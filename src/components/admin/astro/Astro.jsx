// app/(admin)/admin/astro/page.jsx
'use client';

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, RefreshCw, Languages, Calendar } from "lucide-react";
import { toast } from "react-hot-toast";
import { useThemeStore } from "@/lib/store/useThemeStore";
import useAdminAuthStore from "@/lib/store/useAdminAuthStore";
import { useActivityLogger } from "@/hooks/useActivityLogger";
import AstroLayout from "@/components/admin/astro/AstroLayout";
import { 
  getPanchang, 
  fetchAndSavePanchang, 
  updatePanchangManually 
} from "@/lib/services/panchangService";
import { 
  zodiacSigns, 
  getAllHoroscopes, 
  updateAllHoroscopesFromAPI, 
  updateHoroscopeManually 
} from "@/lib/services/horoscopeService";
import { 
  fetchNakshatra,
  nakshatraList,
  SUPPORTED_LANGUAGES,
  LOCATIONS
} from "@/lib/astro/vedicApi";

export default function AstroManagementPage() {
  const { theme } = useThemeStore();
  const { admin } = useAdminAuthStore();
  const { log } = useActivityLogger();
  const router = useRouter();
  const isDark = theme === "dark";

  // State
  const [activeTab, setActiveTab] = useState('panchang');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [language, setLanguage] = useState('en');
  const [location, setLocation] = useState('delhi');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  // Panchang state
  const [panchang, setPanchang] = useState(null);
  const [isEditingPanchang, setIsEditingPanchang] = useState(false);
  const [editPanchangData, setEditPanchangData] = useState({});
  
  // Horoscope state
  const [horoscopes, setHoroscopes] = useState({});
  const [editingSign, setEditingSign] = useState(null);
  const [editHoroscopeData, setEditHoroscopeData] = useState({});
  
  // Nakshatra state
  const [selectedNakshatra, setSelectedNakshatra] = useState(1);
  const [nakshatraData, setNakshatraData] = useState(null);
  
  // Stats
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch all data
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch Panchang
      const panchangResult = await getPanchang(selectedDate);
      if (panchangResult.success && panchangResult.panchang) {
        setPanchang(panchangResult.panchang);
        setEditPanchangData(panchangResult.panchang);
      } else {
        setPanchang(null);
      }

      // Fetch Horoscopes
      const horoscopeResult = await getAllHoroscopes(selectedDate);
      if (horoscopeResult.success) {
        setHoroscopes(horoscopeResult.horoscopes);
        if (Object.keys(horoscopeResult.horoscopes).length > 0) {
          const firstHoroscope = Object.values(horoscopeResult.horoscopes)[0];
          setLastUpdated(firstHoroscope?.updatedAt?.toDate?.() || null);
        }
      }

      // Fetch Nakshatra
      const nakshatraResult = await fetchNakshatra(selectedNakshatra, language, selectedDate);
      if (nakshatraResult) {
        setNakshatraData(nakshatraResult);
      }
    } catch (error) {
      console.error("Error fetching astro data:", error);
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, [selectedDate, selectedNakshatra, language]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // ============ PANCHANG FUNCTIONS ============
  const handleFetchPanchang = async () => {
    setUpdating(true);
    try {
      const apiResult = await fetchAndSavePanchang(location, language, admin, selectedDate);
      if (apiResult.success) {
        toast.success("Panchang updated from API successfully!");
        await fetchAllData();
      } else {
        toast.error(apiResult.error || "Failed to fetch from API");
      }
    } catch (error) {
      console.error("Error fetching panchang:", error);
      toast.error("Failed to fetch from API");
    } finally {
      setUpdating(false);
    }
  };

  const handleSavePanchang = async (data) => {
    setUpdating(true);
    try {
      const result = await updatePanchangManually(data, admin, selectedDate);
      if (result.success) {
        await log({
          action: 'UPDATE',
          entityType: 'panchang',
          entityId: selectedDate,
          entityTitle: 'Daily Panchang',
          details: `Manually updated panchang for ${selectedDate}`
        });
        toast.success("Panchang updated successfully!");
        setIsEditingPanchang(false);
        await fetchAllData();
      } else {
        toast.error(result.error || "Failed to update panchang");
      }
    } catch (error) {
      console.error("Error updating panchang:", error);
      toast.error("Failed to update panchang");
    } finally {
      setUpdating(false);
    }
  };

  // ============ HOROSCOPE FUNCTIONS ============
  const handleFetchHoroscopes = async () => {
    setUpdating(true);
    try {
      const apiResult = await updateAllHoroscopesFromAPI(admin, language, selectedDate);
      if (apiResult.success) {
        toast.success(`Horoscopes updated from API! (${apiResult.successCount} signs)`);
        await fetchAllData();
      } else {
        toast.error(apiResult.error || "Failed to fetch from API");
      }
    } catch (error) {
      console.error("Error fetching horoscopes:", error);
      toast.error("Failed to fetch from API");
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveHoroscope = async (sign, data) => {
    setUpdating(true);
    try {
      const result = await updateHoroscopeManually(sign, data, admin, selectedDate);
      if (result.success) {
        await log({
          action: 'UPDATE',
          entityType: 'horoscope',
          entityId: sign,
          entityTitle: `${sign} Horoscope`,
          details: `Manually updated ${sign} horoscope for ${selectedDate}`
        });
        toast.success(`${sign} horoscope updated successfully!`);
        setEditingSign(null);
        await fetchAllData();
      } else {
        toast.error(result.error || "Failed to update horoscope");
      }
    } catch (error) {
      console.error("Error updating horoscope:", error);
      toast.error("Failed to update horoscope");
    } finally {
      setUpdating(false);
    }
  };

  // ============ NAKSHATRA FUNCTIONS ============
  const handleFetchNakshatra = async () => {
    setUpdating(true);
    try {
      const result = await fetchNakshatra(selectedNakshatra, language, selectedDate);
      if (result) {
        setNakshatraData(result);
        toast.success("Nakshatra data updated!");
      } else {
        toast.error("Failed to fetch nakshatra data");
      }
    } catch (error) {
      console.error("Error fetching nakshatra:", error);
      toast.error("Failed to fetch nakshatra");
    } finally {
      setUpdating(false);
    }
  };

  // ============ UI HELPERS ============
  const formatDateDisplay = (date) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      weekday: 'short'
    });
  };

  const getHoroscopeForSign = (sign) => {
    return horoscopes[sign] || null;
  };

  const locationOptions = Object.keys(LOCATIONS).map(key => ({
    value: key,
    label: key.charAt(0).toUpperCase() + key.slice(1)
  }));

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start gap-3">
          <button
            onClick={() => router.back()}
            className={`mt-0.5 p-2 rounded-xl border-2 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer ${
              isDark
                ? "border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
                : "border-yellow-500/30 text-yellow-600 hover:bg-yellow-500/10"
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className={`text-2xl font-bold ${isDark ? "text-gray-100" : "text-gray-800"}`}>
              🪐 Astro Management
            </h1>
            <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"} mt-1`}>
              Manage Panchang, Horoscope and Nakshatra
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Language Selector */}
          <div className="flex items-center gap-2">
            <Languages className="w-4 h-4 text-yellow-500" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className={`px-3 py-2 rounded-xl text-sm transition-all duration-200 cursor-pointer ${
                isDark
                  ? "bg-gray-800 border-gray-700 text-gray-200 focus:border-yellow-500"
                  : "bg-white border-gray-200 text-gray-700 focus:border-yellow-400"
              } border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
            >
              {SUPPORTED_LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.label}
                </option>
              ))}
            </select>
          </div>

          {/* Location Selector */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-yellow-500" />
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={`px-3 py-2 rounded-xl text-sm transition-all duration-200 cursor-pointer ${
                isDark
                  ? "bg-gray-800 border-gray-700 text-gray-200 focus:border-yellow-500"
                  : "bg-white border-gray-200 text-gray-700 focus:border-yellow-400"
              } border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
            >
              {locationOptions.map(loc => (
                <option key={loc.value} value={loc.value}>
                  {loc.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Date Selector */}
      <div className={`rounded-2xl border p-5 transition-all duration-300 ${
        isDark 
          ? 'border-gray-700 bg-gray-800/90 shadow-lg' 
          : 'border-gray-200 bg-white/80 shadow-md backdrop-blur-sm'
      }`}>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-yellow-500" />
            <span className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Date:
            </span>
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className={`px-4 py-2 rounded-xl text-sm transition-all duration-200 cursor-pointer ${
              isDark
                ? "bg-gray-900 border-gray-700 text-gray-200 focus:border-yellow-500"
                : "bg-gray-50 border-gray-300 text-gray-800 focus:border-yellow-400"
            } border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/20`}
          />
          <span className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
            {formatDateDisplay(selectedDate)}
          </span>
          {lastUpdated && (
            <span className={`text-xs ml-auto ${isDark ? "text-gray-500" : "text-gray-400"}`}>
              Last updated: {new Date(lastUpdated).toLocaleString()}
            </span>
          )}
        </div>
      </div>

      {/* Main Layout */}
      <AstroLayout
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDark={isDark}
        updating={updating}
        panchang={panchang}
        isEditingPanchang={isEditingPanchang}
        setIsEditingPanchang={setIsEditingPanchang}
        editPanchangData={editPanchangData}
        setEditPanchangData={setEditPanchangData}
        onSavePanchang={handleSavePanchang}
        onFetchPanchang={handleFetchPanchang}
        horoscopes={horoscopes}
        editingSign={editingSign}
        setEditingSign={setEditingSign}
        editHoroscopeData={editHoroscopeData}
        setEditHoroscopeData={setEditHoroscopeData}
        onSaveHoroscope={handleSaveHoroscope}
        onFetchHoroscopes={handleFetchHoroscopes}
        getHoroscopeForSign={getHoroscopeForSign}
        selectedNakshatra={selectedNakshatra}
        setSelectedNakshatra={setSelectedNakshatra}
        nakshatraData={nakshatraData}
        onFetchNakshatra={handleFetchNakshatra}
        selectedDate={selectedDate}
        location={location}
        language={language}
      />
    </div>
  );
}