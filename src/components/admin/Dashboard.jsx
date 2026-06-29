// app/(admin)/admin/dashboard/page.jsx
'use client';

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Eye,
  Music,
  Video,
  BookOpen,
  Building2,
  CalendarDays,
  Users,
  Mail,
  RefreshCw,
  Activity,
  BarChart3,
  Newspaper,
  TrendingUp,
  Clock,
  UserPlus,
} from "lucide-react";
import useAdminAuthStore from "@/lib/store/useAdminAuthStore";
import { useThemeStore } from "@/lib/store/useThemeStore";
import { getDashboardData } from "@/lib/services/dashboardService";

const initialDashboard = {
  stats: {
    totalBhajans: 0,
    publishedBhajans: 0,
    totalVideos: 0,
    publishedVideos: 0,
    totalStories: 0,
    publishedStories: 0,
    totalTemples: 0,
    totalFestivals: 0,
    totalUsers: 0,
    activeUsers: 0,
    subscribers: 0,
    unreadMessages: 0,
    totalViews: 0,
  },
  recentContent: [],
  recentUsers: [],
  recentMessages: [],
  recentActivities: [],
};

const formatNumber = (value) => {
  const number = Number(value) || 0;
  if (number >= 1000000) return `${(number / 1000000).toFixed(1)}M`;
  if (number >= 1000) return `${(number / 1000).toFixed(1)}K`;
  return number.toLocaleString("en-US");
};

const formatDate = (date) => {
  if (!date) return "Recently";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(date));
};

export default function DashboardPage() {
  const { admin } = useAdminAuthStore();
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const [dashboard, setDashboard] = useState(initialDashboard);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    setIsLoading(true);
    setError("");
    const result = await getDashboardData();
    if (result.success) {
      setDashboard({
        stats: result.stats,
        recentContent: result.recentContent,
        recentUsers: result.recentUsers,
        recentMessages: result.recentMessages,
        recentActivities: result.recentActivities || [], 
      });
    } else {
      setError(result.error || "Unable to load dashboard data");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const stats = dashboard.stats;

  const totalContent = stats.totalBhajans + stats.totalVideos + stats.totalStories;
  const publishedContent = stats.publishedBhajans + stats.publishedVideos + stats.publishedStories;
  const publishingRate = totalContent ? Math.round((publishedContent / totalContent) * 100) : 0;

  const statCards = [
    {
      title: "Bhajans",
      value: formatNumber(stats.totalBhajans),
      caption: `${formatNumber(stats.publishedBhajans)} published`,
      icon: Music,
      gradient: "from-amber-400 to-yellow-500",
      bg: "bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20",
      iconBg: "bg-gradient-to-br from-amber-400 to-yellow-500",
    },
    {
      title: "Videos",
      value: formatNumber(stats.totalVideos),
      caption: `${formatNumber(stats.publishedVideos)} published`,
      icon: Video,
      gradient: "from-blue-400 to-indigo-500",
      bg: "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20",
      iconBg: "bg-gradient-to-br from-blue-400 to-indigo-500",
    },
    {
      title: "Stories",
      value: formatNumber(stats.totalStories),
      caption: `${formatNumber(stats.publishedStories)} published`,
      icon: BookOpen,
      gradient: "from-purple-400 to-pink-500",
      bg: "bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20",
      iconBg: "bg-gradient-to-br from-purple-400 to-pink-500",
    },
    {
      title: "Temples",
      value: formatNumber(stats.totalTemples),
      caption: "Sacred places",
      icon: Building2,
      gradient: "from-orange-400 to-red-500",
      bg: "bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20",
      iconBg: "bg-gradient-to-br from-orange-400 to-red-500",
    },
    {
      title: "Festivals",
      value: formatNumber(stats.totalFestivals),
      caption: "Upcoming celebrations",
      icon: CalendarDays,
      gradient: "from-pink-400 to-rose-500",
      bg: "bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20",
      iconBg: "bg-gradient-to-br from-pink-400 to-rose-500",
    },
    {
      title: "Users",
      value: formatNumber(stats.totalUsers),
      caption: `${formatNumber(stats.activeUsers)} active`,
      icon: Users,
      gradient: "from-emerald-400 to-teal-500",
      bg: "bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20",
      iconBg: "bg-gradient-to-br from-emerald-400 to-teal-500",
    },
  ];

  const getActionText = (action) => {
    const texts = {
      CREATE: "Created",
      UPDATE: "Updated",
      DELETE: "Deleted",
      PUBLISH: "Published",
      UNPUBLISH: "Unpublished",
      FEATURED_ON: "Featured",
      FEATURED_OFF: "Removed featured",
      TRENDING_ON: "Trending",
      TRENDING_OFF: "Removed trending",
      LOGIN: "Logged in",
      LOGOUT: "Logged out",
      STATUS_CHANGE: "Status changed",
    };
    return texts[action] || action;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-yellow-500 flex items-center gap-2">
            <span className="h-1 w-8 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500"></span>
            Admin Dashboard
          </p>
          <h1 className={`mt-2 text-2xl font-bold sm:text-3xl ${isDark ? "text-gray-100" : "text-gray-800"}`}>
            Welcome back, {admin?.name || "Admin"} 👋
          </h1>
          <p className={`mt-1 text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            Here's what's happening with your content today
          </p>
        </div>
        <button
          onClick={fetchDashboard}
          disabled={isLoading}
          className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-200 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 ${
            isDark
              ? "border-gray-700 bg-gray-800 text-gray-200 hover:bg-gray-700"
              : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300"
          }`}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-600 backdrop-blur-sm dark:text-red-400"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </motion.div>
      )}

      {/* Stats Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-36 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                className={`group relative overflow-hidden rounded-2xl border p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                  isDark
                    ? "border-gray-700/50 bg-gradient-to-br from-gray-800/90 to-gray-900/90 shadow-lg"
                    : `${stat.bg} border-gray-200/50 shadow-md`
                }`}
              >
                {/* Subtle gradient overlay */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                  isDark ? "bg-gradient-to-br from-yellow-500/5 to-transparent" : "bg-gradient-to-br from-white/50 to-transparent"
                }`} />
                
                <div className="relative">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                        {stat.title}
                      </p>
                      <p className={`mt-2 text-3xl font-bold tracking-tight ${isDark ? "text-gray-100" : "text-gray-800"}`}>
                        {stat.value}
                      </p>
                      <p className={`mt-1.5 text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                        {stat.caption}
                      </p>
                    </div>
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${stat.iconBg} shadow-lg`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  
                  {/* Decorative element */}
                  <div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-10 blur-2xl transition-all duration-500 group-hover:scale-150 ${
                    isDark ? "bg-yellow-500" : stat.iconBg
                  }`} />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Publishing Health + Recent Activity */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        {/* Publishing Health */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`relative overflow-hidden rounded-2xl border p-6 transition-all duration-300 hover:shadow-xl ${
            isDark
              ? "border-gray-700/50 bg-gradient-to-br from-gray-800/90 to-gray-900/90 shadow-lg"
              : "border-gray-200/50 bg-white shadow-md"
          }`}
        >
          <div className="flex items-center gap-2 border-b pb-4 ${isDark ? 'border-gray-700' : 'border-gray-200'}">
            <div className="rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 p-1.5">
              <BarChart3 className="h-4 w-4 text-white" />
            </div>
            <h2 className={`text-sm font-bold uppercase tracking-wider ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Publishing Health
            </h2>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-[180px_1fr] md:items-center">
            <div className="relative mx-auto flex h-40 w-40 items-center justify-center rounded-full border-8 border-gray-200 dark:border-gray-700">
              <div
                className="absolute inset-[-8px] rounded-full"
                style={{
                  background: `conic-gradient(#EAB308 ${publishingRate * 3.6}deg, ${isDark ? "#374151" : "#e5e7eb"} 0deg)`,
                  WebkitMask: "radial-gradient(circle, transparent 55%, black 57%)",
                  mask: "radial-gradient(circle, transparent 55%, black 57%)",
                }}
              />
              <div className="text-center">
                <p className={`text-3xl font-bold ${isDark ? "text-gray-100" : "text-gray-800"}`}>{publishingRate}%</p>
                <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>published</p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["Bhajans", stats.publishedBhajans, stats.totalBhajans],
                ["Videos", stats.publishedVideos, stats.totalVideos],
                ["Stories", stats.publishedStories, stats.totalStories],
              ].map(([label, published, total]) => (
                <div key={label} className={`rounded-xl p-4 transition-all duration-200 hover:scale-105 ${
                  isDark ? "bg-gray-900/50" : "bg-gradient-to-br from-gray-50 to-gray-100/50"
                }`}>
                  <p className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    {label}
                  </p>
                  <p className={`mt-2 text-xl font-bold ${isDark ? "text-gray-100" : "text-gray-800"}`}>
                    {formatNumber(published)}
                    <span className="text-sm font-medium text-gray-400"> / {formatNumber(total)}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className={`relative overflow-hidden rounded-2xl border p-6 transition-all duration-300 hover:shadow-xl ${
            isDark
              ? "border-gray-700/50 bg-gradient-to-br from-gray-800/90 to-gray-900/90 shadow-lg"
              : "border-gray-200/50 bg-white shadow-md"
          }`}
        >
          <div className="flex items-center gap-2 border-b pb-4 ${isDark ? 'border-gray-700' : 'border-gray-200'}">
            <div className="rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 p-1.5">
              <Activity className="h-4 w-4 text-white" />
            </div>
            <h2 className={`text-sm font-bold uppercase tracking-wider ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Recent Activity
            </h2>
          </div>
          <div className="mt-6">
            {dashboard.recentActivities?.length > 0 ? (
              <div className="space-y-4">
                {dashboard.recentActivities.slice(0, 5).map((activity, index) => (
                  <motion.div 
                    key={activity.id || index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex gap-3 group"
                  >
                    <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 group-hover:scale-150 transition-transform" />
                    <div className="min-w-0 flex-1">
                      <p className={`truncate text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                        {getActionText(activity.action)}
                        {activity.entityTitle && ` “${activity.entityTitle}”`}
                      </p>
                      <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                        {activity.adminName || "Admin"} • {formatDate(activity.timestamp)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className={`text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}>No recent activity</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Recent Content + Users + Messages */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Recent Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`relative overflow-hidden rounded-2xl border p-6 transition-all duration-300 hover:shadow-xl ${
            isDark
              ? "border-gray-700/50 bg-gradient-to-br from-gray-800/90 to-gray-900/90 shadow-lg"
              : "border-gray-200/50 bg-white shadow-md"
          }`}
        >
          <div className="flex items-center gap-2 border-b pb-4 ${isDark ? 'border-gray-700' : 'border-gray-200'}">
            <div className="rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 p-1.5">
              <Newspaper className="h-4 w-4 text-white" />
            </div>
            <h2 className={`text-sm font-bold uppercase tracking-wider ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Latest Content
            </h2>
          </div>
          <div className="mt-6">
            {dashboard.recentContent?.length ? (
              <div className="space-y-3">
                {dashboard.recentContent.slice(0, 5).map((item, index) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`rounded-xl p-3 transition-all duration-200 hover:scale-[1.02] ${
                      isDark ? "bg-gray-900/50" : "bg-gradient-to-br from-gray-50 to-gray-100/50"
                    }`}
                  >
                    <p className={`truncate text-sm font-semibold ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                      {item.title}
                    </p>
                    <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                      <span className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>{item.type}</span>
                      <span className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>•</span>
                      <span className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>{formatDate(item.date)}</span>
                      <span className={`ml-auto rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                        item.status === "published"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className={`text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}>No content yet</p>
            )}
          </div>
        </motion.div>

        {/* Recent Users */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className={`relative overflow-hidden rounded-2xl border p-6 transition-all duration-300 hover:shadow-xl ${
            isDark
              ? "border-gray-700/50 bg-gradient-to-br from-gray-800/90 to-gray-900/90 shadow-lg"
              : "border-gray-200/50 bg-white shadow-md"
          }`}
        >
          <div className="flex items-center gap-2 border-b pb-4 ${isDark ? 'border-gray-700' : 'border-gray-200'}">
            <div className="rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 p-1.5">
              <UserPlus className="h-4 w-4 text-white" />
            </div>
            <h2 className={`text-sm font-bold uppercase tracking-wider ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              New Users
            </h2>
          </div>
          <div className="mt-6">
            {dashboard.recentUsers?.length ? (
              <div className="space-y-3">
                {dashboard.recentUsers.slice(0, 5).map((user, index) => (
                  <motion.div 
                    key={user.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3 group"
                  >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-500 text-sm font-bold text-white shadow-lg`}>
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`truncate text-sm font-semibold ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                        {user.name}
                      </p>
                      <p className={`truncate text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                        {user.email || formatDate(user.date)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className={`text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}>No users yet</p>
            )}
          </div>
        </motion.div>

        {/* Contact Inbox */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`relative overflow-hidden rounded-2xl border p-6 transition-all duration-300 hover:shadow-xl ${
            isDark
              ? "border-gray-700/50 bg-gradient-to-br from-gray-800/90 to-gray-900/90 shadow-lg"
              : "border-gray-200/50 bg-white shadow-md"
          }`}
        >
          <div className="flex items-center gap-2 border-b pb-4 ${isDark ? 'border-gray-700' : 'border-gray-200'}">
            <div className="rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 p-1.5">
              <Mail className="h-4 w-4 text-white" />
            </div>
            <h2 className={`text-sm font-bold uppercase tracking-wider ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Contact Inbox
            </h2>
          </div>
          <div className="mt-6">
            {dashboard.recentMessages?.length ? (
              <div className="space-y-3">
                {dashboard.recentMessages.slice(0, 5).map((msg, index) => (
                  <motion.div 
                    key={msg.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`rounded-xl p-3 transition-all duration-200 hover:scale-[1.02] ${
                      isDark ? "bg-gray-900/50" : "bg-gradient-to-br from-gray-50 to-gray-100/50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className={`truncate text-sm font-semibold ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                        {msg.subject}
                      </p>
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                        msg.status === "unread"
                          ? "bg-red-500/20 text-red-600 dark:bg-red-500/30 dark:text-red-400"
                          : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                      }`}>
                        {msg.status}
                      </span>
                    </div>
                    <p className={`mt-1 text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                      {msg.name} • {formatDate(msg.date)}
                    </p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className={`text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}>No messages</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}