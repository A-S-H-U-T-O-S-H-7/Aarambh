// components/admin/layout/Sidebar.jsx
'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useThemeStore } from "@/lib/store/useThemeStore";
import {
  LayoutDashboard,
  Calendar,
  Video,
  Music,
  BookOpen,
  Building2,
  CalendarDays,
  Sparkles,
  Users,
  Mail,
  Shield,
  Eye,
  Settings,
  Menu,
  X,
  Megaphone,
  TrendingUp
} from "lucide-react";

const navigationItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Daily Management", href: "/admin/daily-management", icon: Sparkles },
  { name: "Media (Videos/Bhajans)", href: "/admin/media", icon: Video },
  { name: "Spiritual Stories", href: "/admin/stories", icon: BookOpen },
  { name: "Temples", href: "/admin/temples", icon: Building2 },
  { name: "Festivals", href: "/admin/festivals", icon: CalendarDays },
  { name: "Astro (Panchang/Horoscope)", href: "/admin/astro", icon: Calendar },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Contact Messages", href: "/admin/messages", icon: Mail },
  { name: "Advertise Leads", href: "/admin/leads", icon: Megaphone },
  { name: "Activity Logs", href: "/admin/activity", icon: Eye },
  { name: "Admin Management", href: "/admin/admins", icon: Shield },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { theme } = useThemeStore();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  const isDarkMode = theme === 'dark';

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className={`fixed top-4 left-4 z-50 lg:hidden p-2 rounded-xl shadow-lg transition-all duration-300 ${
          isDarkMode
            ? "bg-gray-800 hover:bg-gray-700 text-gray-100 border border-gray-700"
            : "bg-white hover:bg-gray-100 text-gray-700 border border-gray-200"
        }`}
      >
        {isMobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-60 shadow-xl z-50 transition-transform duration-300 ease-in-out flex flex-col ${
          isDarkMode
            ? "bg-gray-800 border-r border-gray-700"
            : "bg-white border-r border-gray-200"
        } ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Logo Section - Compact */}
        <div className={`flex items-center gap-3 px-4 py-3 border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
          <Link href="/admin/dashboard" onClick={() => setIsMobileOpen(false)} className="flex items-center gap-3 w-full">
            <Image
              src="/aarambhlogo.png"
              alt="Aarambh TV"
              width={80}
              height={50}
              className="h-14 w-18 object-contain flex-shrink-0"
              priority
            />
            <div className="flex flex-col">
              <span className={`text-md font-bold tracking-wider ${isDarkMode ? "text-gray-50" : "text-gray-800"}`}>
                Admin Panel
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-3 px-3">
          <nav className="space-y-1.5">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 shadow-md"
                      : isDarkMode
                        ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm font-medium truncate">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}