// app/(admin)/admin/users/page.jsx
'use client';

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search, Download, Users as UsersIcon, UserCheck, UserX, Bell, RefreshCw } from "lucide-react";
import { toast } from "react-hot-toast";
import { useThemeStore } from "@/lib/store/useThemeStore";
import useAdminAuthStore from "@/lib/store/useAdminAuthStore";
import { useActivityLogger } from "@/hooks/useActivityLogger";
import UsersTable from "./UsersTable";
import UserDetailsModal from "./UserDetailsModal";
import { 
  getUsers, 
  updateUserStatus, 
  updateUserSubscription, 
  deleteUser, 
  exportSubscribedUsersToCSV, 
  getUserStats 
} from "@/lib/services/userService";
import Swal from "sweetalert2";

export default function AdminUsersPage() {
  const { theme } = useThemeStore();
  const { admin } = useAdminAuthStore();
  const { log } = useActivityLogger();
  const router = useRouter();
  const isDark = theme === "dark";
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [subscriptionFilter, setSubscriptionFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    blockedUsers: 0,
    subscribedUsers: 0,
  });

  const fetchUsers = useCallback(async (showRefresh = false) => {
    if (showRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    try {
      const result = await getUsers(currentPage, searchTerm, statusFilter, subscriptionFilter);
      if (result.success) {
        setUsers(result.users);
        setTotalPages(result.totalPages);
        setTotalItems(result.totalItems);
      } else {
        toast.error(result.error || "Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [currentPage, searchTerm, statusFilter, subscriptionFilter]);

  const fetchStats = useCallback(async () => {
    const result = await getUserStats();
    if (result.success && result.stats) {
      setStats(result.stats);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, [fetchUsers, fetchStats]);

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleToggleSubscription = async (userId, isSubscribed) => {
    setIsUpdating(true);
    try {
      // Get user data first for logging
      const user = users.find(u => u.id === userId);
      const result = await updateUserSubscription(userId, isSubscribed);
      if (result.success) {
        await log({
          action: isSubscribed ? 'SUBSCRIBE' : 'UNSUBSCRIBE',
          entityType: 'user',
          entityId: userId,
          entityTitle: user?.name || 'User',
          details: `${isSubscribed ? 'Subscribed' : 'Unsubscribed'} from newsletter`
        });
        toast.success(isSubscribed ? "User subscribed to newsletter" : "User unsubscribed from newsletter");
        fetchUsers(true);
        fetchStats();
      } else {
        toast.error(result.error || "Failed to update subscription");
      }
    } catch (error) {
      toast.error("Failed to update subscription");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleBlockUser = async (user) => {
    const newStatus = user.status === "blocked" ? "active" : "blocked";
    const action = newStatus === "blocked" ? "block" : "unblock";
    
    const result = await Swal.fire({
      title: `${action === "block" ? "Block" : "Unblock"} User?`,
      text: `Are you sure you want to ${action} "${user.name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EAB308",
      cancelButtonColor: "#6b7280",
      confirmButtonText: `Yes, ${action} user`,
      cancelButtonText: "Cancel",
      background: isDark ? "#1f2937" : "#ffffff",
      color: isDark ? "#ffffff" : "#000000",
    });

    if (result.isConfirmed) {
      setIsUpdating(true);
      try {
        const updateResult = await updateUserStatus(user.id, newStatus);
        if (updateResult.success) {
          await log({
            action: 'STATUS_CHANGE',
            entityType: 'user',
            entityId: user.id,
            entityTitle: user.name,
            details: `User ${action}ed`
          });
          toast.success(`User ${action}ed successfully`);
          fetchUsers(true);
          fetchStats();
        } else {
          toast.error(updateResult.error || `Failed to ${action} user`);
        }
      } catch (error) {
        toast.error(`Failed to ${action} user`);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleDeleteUser = async (user) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete "${user.name}". This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EAB308",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete user",
      cancelButtonText: "Cancel",
      background: isDark ? "#1f2937" : "#ffffff",
      color: isDark ? "#ffffff" : "#000000",
    });

    if (result.isConfirmed) {
      setIsUpdating(true);
      try {
        const deleteResult = await deleteUser(user.id);
        if (deleteResult.success) {
          await log({
            action: 'DELETE',
            entityType: 'user',
            entityId: user.id,
            entityTitle: user.name,
            details: `Deleted user: ${user.name}`
          });
          toast.success("User deleted successfully");
          fetchUsers(true);
          fetchStats();
        } else {
          toast.error(deleteResult.error || "Failed to delete user");
        }
      } catch (error) {
        toast.error("Failed to delete user");
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleExportSubscribers = async () => {
    const result = await exportSubscribedUsersToCSV();
    if (result.success) {
      const blob = new Blob([result.csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `subscribers_${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`Exported ${result.count} subscribers`);
    } else {
      toast.error("Failed to export subscribers");
    }
  };

  const handleRefresh = () => {
    fetchUsers(true);
    fetchStats();
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

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
              Users
            </h1>
            <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"} mt-1`}>
              Manage registered users and newsletter subscribers
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
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
          <button
            onClick={handleExportSubscribers}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-semibold transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Export Subscribers
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`rounded-2xl border p-5 transition-all duration-300 hover:shadow-xl ${
          isDark 
            ? 'border-gray-700 bg-gray-800/90 shadow-lg' 
            : 'border-gray-200 bg-white/80 shadow-md backdrop-blur-sm'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Total Users</p>
              <p className={`text-2xl font-bold ${isDark ? "text-gray-100" : "text-gray-800"}`}>{stats.totalUsers}</p>
            </div>
            <UsersIcon className="w-8 h-8 text-yellow-500 opacity-50" />
          </div>
        </div>
        
        <div className={`rounded-2xl border p-5 transition-all duration-300 hover:shadow-xl ${
          isDark 
            ? 'border-gray-700 bg-gray-800/90 shadow-lg' 
            : 'border-gray-200 bg-white/80 shadow-md backdrop-blur-sm'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Active Users</p>
              <p className={`text-2xl font-bold ${isDark ? "text-gray-100" : "text-gray-800"}`}>{stats.activeUsers}</p>
            </div>
            <UserCheck className="w-8 h-8 text-green-500 opacity-50" />
          </div>
        </div>
        
        <div className={`rounded-2xl border p-5 transition-all duration-300 hover:shadow-xl ${
          isDark 
            ? 'border-gray-700 bg-gray-800/90 shadow-lg' 
            : 'border-gray-200 bg-white/80 shadow-md backdrop-blur-sm'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Blocked Users</p>
              <p className={`text-2xl font-bold ${isDark ? "text-gray-100" : "text-gray-800"}`}>{stats.blockedUsers}</p>
            </div>
            <UserX className="w-8 h-8 text-red-500 opacity-50" />
          </div>
        </div>
        
        <div className={`rounded-2xl border p-5 transition-all duration-300 hover:shadow-xl ${
          isDark 
            ? 'border-gray-700 bg-gray-800/90 shadow-lg' 
            : 'border-gray-200 bg-white/80 shadow-md backdrop-blur-sm'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Subscribers</p>
              <p className={`text-2xl font-bold ${isDark ? "text-gray-100" : "text-gray-800"}`}>{stats.subscribedUsers}</p>
            </div>
            <Bell className="w-8 h-8 text-yellow-500 opacity-50" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className={`rounded-2xl border p-5 transition-all duration-300 ${
        isDark 
          ? 'border-gray-700 bg-gray-800/90 shadow-lg' 
          : 'border-gray-200 bg-white/80 shadow-md backdrop-blur-sm'
      }`}>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={handleSearch}
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition-all duration-200 focus:ring-2 focus:ring-yellow-400/20 focus:outline-none ${
                isDark
                  ? "bg-gray-900 border-gray-700 text-gray-100 focus:border-yellow-500"
                  : "bg-gray-50 border-gray-300 text-gray-800 focus:border-yellow-400"
              } border-2`}
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className={`px-4 py-2.5 rounded-xl text-sm transition-all duration-200 focus:ring-2 focus:ring-yellow-400/20 focus:outline-none cursor-pointer ${
              isDark
                ? "bg-gray-900 border-gray-700 text-gray-100 focus:border-yellow-500"
                : "bg-gray-50 border-gray-300 text-gray-800 focus:border-yellow-400"
            } border-2`}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>

          <select
            value={subscriptionFilter}
            onChange={(e) => { setSubscriptionFilter(e.target.value); setCurrentPage(1); }}
            className={`px-4 py-2.5 rounded-xl text-sm transition-all duration-200 focus:ring-2 focus:ring-yellow-400/20 focus:outline-none cursor-pointer ${
              isDark
                ? "bg-gray-900 border-gray-700 text-gray-100 focus:border-yellow-500"
                : "bg-gray-50 border-gray-300 text-gray-800 focus:border-yellow-400"
            } border-2`}
          >
            <option value="all">All Users</option>
            <option value="subscribed">Subscribed Only</option>
            <option value="not_subscribed">Not Subscribed</option>
          </select>
        </div>
      </div>

      {/* Total Records */}
      {!loading && users.length > 0 && (
        <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          Total: {totalItems} user{totalItems !== 1 ? 's' : ''}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <UsersTable
          users={users}
          currentPage={currentPage}
          totalPages={totalPages}
          isUpdating={isUpdating}
          isDark={isDark}
          onView={handleViewUser}
          onBlock={handleBlockUser}
          onDelete={handleDeleteUser}
          onToggleSubscription={handleToggleSubscription}
          onPageChange={setCurrentPage}
        />
      )}

      {/* User Details Modal */}
      <UserDetailsModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedUser(null); }}
        user={selectedUser}
        isDark={isDark}
      />
    </div>
  );
}