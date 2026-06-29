// app/(admin)/admin/activity/page.jsx
'use client';

import { useState, useEffect, useCallback } from "react";
import { 
  Search, 
  Calendar, 
  User, 
  FileText, 
  Eye, 
  Trash2, 
  Edit, 
  Star, 
  TrendingUp, 
  PlusCircle,
  CheckCircle,
  XCircle,
  LogIn,
  LogOut,
  RefreshCw
} from "lucide-react";
import { useThemeStore } from "@/lib/store/useThemeStore";
import useAdminAuthStore from "@/lib/store/useAdminAuthStore";
import { 
  getActivityLogs, 
  ActivityActions, 
  ActivityEntityTypes 
} from "@/lib/services/activityLogService";
import Pagination from "@/components/admin/Pagination";

const actionIcons = {
  [ActivityActions.CREATE]: { icon: PlusCircle, color: "text-emerald-500", bg: "bg-emerald-100 dark:bg-emerald-900/30" },
  [ActivityActions.UPDATE]: { icon: Edit, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30" },
  [ActivityActions.DELETE]: { icon: Trash2, color: "text-red-500", bg: "bg-red-100 dark:bg-red-900/30" },
  [ActivityActions.PUBLISH]: { icon: CheckCircle, color: "text-green-500", bg: "bg-green-100 dark:bg-green-900/30" },
  [ActivityActions.UNPUBLISH]: { icon: XCircle, color: "text-gray-500", bg: "bg-gray-100 dark:bg-gray-700/30" },
  [ActivityActions.FEATURED_ON]: { icon: Star, color: "text-yellow-500", bg: "bg-yellow-100 dark:bg-yellow-900/30" },
  [ActivityActions.FEATURED_OFF]: { icon: Star, color: "text-gray-500", bg: "bg-gray-100 dark:bg-gray-700/30" },
  [ActivityActions.TRENDING_ON]: { icon: TrendingUp, color: "text-orange-500", bg: "bg-orange-100 dark:bg-orange-900/30" },
  [ActivityActions.TRENDING_OFF]: { icon: TrendingUp, color: "text-gray-500", bg: "bg-gray-100 dark:bg-gray-700/30" },
  [ActivityActions.LOGIN]: { icon: LogIn, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30" },
  [ActivityActions.LOGOUT]: { icon: LogOut, color: "text-gray-500", bg: "bg-gray-100 dark:bg-gray-700/30" },
  [ActivityActions.STATUS_CHANGE]: { icon: Eye, color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-900/30" },
};

const getActionText = (action) => {
  const texts = {
    [ActivityActions.CREATE]: "Created",
    [ActivityActions.UPDATE]: "Updated",
    [ActivityActions.DELETE]: "Deleted",
    [ActivityActions.PUBLISH]: "Published",
    [ActivityActions.UNPUBLISH]: "Unpublished",
    [ActivityActions.FEATURED_ON]: "Marked as Featured",
    [ActivityActions.FEATURED_OFF]: "Removed from Featured",
    [ActivityActions.TRENDING_ON]: "Marked as Trending",
    [ActivityActions.TRENDING_OFF]: "Removed from Trending",
    [ActivityActions.LOGIN]: "Logged In",
    [ActivityActions.LOGOUT]: "Logged Out",
    [ActivityActions.STATUS_CHANGE]: "Status Changed",
  };
  return texts[action] || action;
};

const actionOptions = [
  { value: 'all', label: 'All Actions' },
  { value: ActivityActions.CREATE, label: 'Create' },
  { value: ActivityActions.UPDATE, label: 'Update' },
  { value: ActivityActions.DELETE, label: 'Delete' },
  { value: ActivityActions.PUBLISH, label: 'Publish' },
  { value: ActivityActions.UNPUBLISH, label: 'Unpublish' },
  { value: ActivityActions.FEATURED_ON, label: 'Featured On' },
  { value: ActivityActions.FEATURED_OFF, label: 'Featured Off' },
  { value: ActivityActions.TRENDING_ON, label: 'Trending On' },
  { value: ActivityActions.TRENDING_OFF, label: 'Trending Off' },
  { value: ActivityActions.LOGIN, label: 'Login' },
  { value: ActivityActions.LOGOUT, label: 'Logout' },
  { value: ActivityActions.STATUS_CHANGE, label: 'Status Change' },
];

const entityOptions = [
  { value: 'all', label: 'All Types' },
  { value: ActivityEntityTypes.BHAJAN, label: 'Bhajan' },
  { value: ActivityEntityTypes.VIDEO, label: 'Video' },
  { value: ActivityEntityTypes.STORY, label: 'Story' },
  { value: ActivityEntityTypes.TEMPLE, label: 'Temple' },
  { value: ActivityEntityTypes.FESTIVAL, label: 'Festival' },
  { value: ActivityEntityTypes.ADMIN, label: 'Admin' },
  { value: ActivityEntityTypes.USER, label: 'User' },
  { value: ActivityEntityTypes.SETTINGS, label: 'Settings' },
];

export default function ActivityLogsPage() {
  const { theme } = useThemeStore();
  const { admin } = useAdminAuthStore();
  const isDark = theme === 'dark';
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [filters, setFilters] = useState({
    action: "all",
    entityType: "all",
    search: "",
  });

  const fetchLogs = useCallback(async (showRefresh = false) => {
    if (showRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    try {
      const result = await getActivityLogs(currentPage, filters);
      if (result.success) {
        setLogs(result.logs);
        setTotalPages(result.totalPages);
        setTotalItems(result.totalItems);
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [currentPage, filters]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({ action: "all", entityType: "all", search: "" });
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    fetchLogs(true);
  };

  const getEntityTypeColor = (entityType) => {
    const colors = {
      [ActivityEntityTypes.BHAJAN]: "text-yellow-500",
      [ActivityEntityTypes.VIDEO]: "text-blue-500",
      [ActivityEntityTypes.STORY]: "text-purple-500",
      [ActivityEntityTypes.TEMPLE]: "text-orange-500",
      [ActivityEntityTypes.FESTIVAL]: "text-pink-500",
      [ActivityEntityTypes.ADMIN]: "text-red-500",
      [ActivityEntityTypes.USER]: "text-green-500",
      [ActivityEntityTypes.SETTINGS]: "text-gray-500",
    };
    return colors[entityType] || "text-gray-500";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? "text-gray-100" : "text-gray-800"}`}>
            Activity Logs
          </h1>
          <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"} mt-1`}>
            Track all admin activities and changes across the platform
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
            isDark
              ? "bg-gray-800 border border-gray-700 text-gray-200 hover:bg-gray-700"
              : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
          }`}
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className={`rounded-2xl border p-5 transition-all duration-300 ${
        isDark 
          ? 'border-gray-700 bg-gray-800/90 shadow-lg' 
          : 'border-gray-200 bg-white/80 shadow-md backdrop-blur-sm'
      }`}>
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title or admin name..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition-all duration-200 focus:ring-2 focus:ring-yellow-400/20 focus:outline-none ${
                isDark
                  ? "bg-gray-900 border-gray-700 text-gray-100 focus:border-yellow-500 placeholder-gray-500"
                  : "bg-gray-50 border-gray-300 text-gray-800 focus:border-yellow-400 placeholder-gray-400"
              } border-2`}
            />
          </div>

          <select
            value={filters.action}
            onChange={(e) => handleFilterChange("action", e.target.value)}
            className={`px-4 py-2.5 rounded-xl text-sm transition-all duration-200 focus:ring-2 focus:ring-yellow-400/20 focus:outline-none cursor-pointer ${
              isDark
                ? "bg-gray-900 border-gray-700 text-gray-100 focus:border-yellow-500"
                : "bg-gray-50 border-gray-300 text-gray-800 focus:border-yellow-400"
            } border-2`}
          >
            {actionOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          <select
            value={filters.entityType}
            onChange={(e) => handleFilterChange("entityType", e.target.value)}
            className={`px-4 py-2.5 rounded-xl text-sm transition-all duration-200 focus:ring-2 focus:ring-yellow-400/20 focus:outline-none cursor-pointer ${
              isDark
                ? "bg-gray-900 border-gray-700 text-gray-100 focus:border-yellow-500"
                : "bg-gray-50 border-gray-300 text-gray-800 focus:border-yellow-400"
            } border-2`}
          >
            {entityOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          {(filters.search || filters.action !== 'all' || filters.entityType !== 'all') && (
            <button
              onClick={clearFilters}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${
                isDark
                  ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Total Records */}
      {!loading && logs.length > 0 && (
        <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          Total: {totalItems} log{totalItems !== 1 ? 's' : ''}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : logs.length === 0 ? (
        <div className={`rounded-2xl border p-12 text-center transition-all duration-300 ${
          isDark 
            ? 'border-gray-700 bg-gray-800/90 shadow-lg' 
            : 'border-gray-200 bg-white/80 shadow-md backdrop-blur-sm'
        }`}>
          <p className={`text-lg ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            No activity logs found
          </p>
          <p className={`text-sm mt-2 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
            Activities will appear here as admins perform actions
          </p>
        </div>
      ) : (
        <>
          {/* Logs Timeline */}
          <div className="space-y-4">
            {logs.map((log, index) => {
              const ActionIcon = actionIcons[log.action]?.icon || FileText;
              const iconColor = actionIcons[log.action]?.color || "text-gray-500";
              const iconBg = actionIcons[log.action]?.bg || (isDark ? "bg-gray-700/50" : "bg-gray-100");
              const entityColor = getEntityTypeColor(log.entityType);
              
              return (
                <div
                  key={log.id || index}
                  className={`rounded-2xl border p-5 transition-all duration-300 hover:shadow-xl ${
                    isDark
                      ? "border-gray-700 bg-gray-800/90 shadow-lg hover:bg-gray-800"
                      : "border-gray-200 bg-white/80 shadow-md backdrop-blur-sm hover:bg-white"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`p-2.5 rounded-xl ${iconBg}`}>
                      <ActionIcon className={`w-5 h-5 ${iconColor}`} />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-sm font-semibold ${isDark ? "text-gray-100" : "text-gray-800"}`}>
                            {getActionText(log.action)}
                          </span>
                          {log.entityTitle && (
                            <span className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                              <span className={`font-medium ${entityColor}`}>“{log.entityTitle}”</span>
                            </span>
                          )}
                          {log.entityType && log.entityType !== 'all' && (
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                              isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
                            }`}>
                              {log.entityType}
                            </span>
                          )}
                        </div>
                        <div className={`flex items-center gap-2 text-xs shrink-0 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                          <User className="w-3 h-3" />
                          <span className="font-medium">{log.adminName || "Unknown"}</span>
                          <span className={isDark ? "text-gray-600" : "text-gray-300"}>•</span>
                          <span className="capitalize">{log.adminRole === "super_admin" ? "Super Admin" : log.adminRole || "Admin"}</span>
                        </div>
                      </div>
                      
                      {/* Details */}
                      {log.details && (
                        <p className={`text-sm mt-1.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                          {log.details}
                        </p>
                      )}
                      
                      {/* Timestamp */}
                      <div className={`flex items-center gap-2 mt-2 text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(log.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                isDark={isDark}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}