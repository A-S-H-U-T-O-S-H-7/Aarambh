// components/admin/layout/Header.jsx
'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Sun, Moon, ChevronDown, LogOut } from "lucide-react";
import { useThemeStore } from "@/lib/store/useThemeStore";
import useAdminAuthStore from "@/lib/store/useAdminAuthStore";

export default function AdminHeader() {
  const { theme, toggleTheme } = useThemeStore();
  const { admin, adminLogout } = useAdminAuthStore();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const isDark = theme === 'dark';

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    await adminLogout();
    setDropdownOpen(false);
    router.replace("/admin/login");
  };

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-40 lg:left-60 transition-all duration-300 ${
        isDark
          ? "bg-gray-900/95 border-b border-gray-700 backdrop-blur-md"
          : "bg-gray-50/95 border-b border-gray-200 backdrop-blur-md"
      }`}
    >
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-end gap-3">
          {/* Date & Time */}
          <div
            className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg ${
              isDark
                ? "bg-gray-800/80 text-gray-300 border border-gray-700"
                : "bg-white/80 text-gray-600 border border-gray-200"
            }`}
          >
            <span className="text-sm font-medium">
              {format(currentTime, "EEEE, MMMM d, yyyy • h:mm a")}
            </span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg cursor-pointer transition-all duration-200 ${
              isDark
                ? "bg-gray-800 hover:bg-gray-700 text-yellow-400 border border-gray-700"
                : "bg-white hover:bg-gray-100 text-yellow-600 border border-gray-200"
            }`}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={`flex items-center gap-2 px-3 py-1.5 cursor-pointer rounded-lg transition-all duration-200 ${
                isDark
                  ? "bg-gray-800/80 hover:bg-gray-700 border border-gray-700"
                  : "bg-white/80 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center">
                <span className="text-gray-900 text-xs font-bold">
                  {admin?.name?.charAt(0) || admin?.email?.charAt(0) || "A"}
                </span>
              </div>
              <div className="hidden sm:block text-left">
                <p className={`text-sm font-semibold ${isDark ? "text-gray-100" : "text-gray-800"}`}>
                  {admin?.name || "Admin"}
                </p>
                <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  {admin?.role === "super_admin" ? "Super Admin" : "Admin"}
                </p>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? "rotate-180" : ""} ${isDark ? "text-gray-400" : "text-gray-400"}`} />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div
                className={`absolute right-0 mt-2 w-56 rounded-xl shadow-xl border z-50 ${
                  isDark
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className={`px-4 py-3 border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                  <p className={`text-sm font-medium ${isDark ? "text-gray-100" : "text-gray-800"}`}>
                    {admin?.name || "Admin User"}
                  </p>
                  <p className={`text-xs mt-0.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    {admin?.email}
                  </p>
                </div>
                <div className="py-2">
                  <button
                    onClick={handleLogout}
                    className={`w-full cursor-pointer px-4 py-2 text-left text-sm flex items-center gap-2 transition-colors ${
                      isDark
                        ? "text-gray-300 hover:bg-gray-700 hover:text-yellow-400"
                        : "text-gray-600 hover:bg-gray-100 hover:text-yellow-600"
                    }`}
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}