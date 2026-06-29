// app/(admin)/admin/admins/page.jsx
'use client';

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, RefreshCw } from "lucide-react";
import { toast } from "react-hot-toast";
import { useThemeStore } from "@/lib/store/useThemeStore";
import useAdminAuthStore from "@/lib/store/useAdminAuthStore";
import { useActivityLogger } from "@/hooks/useActivityLogger";
import AdminTable from "@/components/admin/admins/AdminTable";
import AdminModal from "@/components/admin/admins/AdminModal";
import { getAllAdmins, createAdmin, updateAdmin, deleteAdmin } from "@/lib/services/adminManagementService";
import Swal from "sweetalert2";

export default function AdminManagementPage() {
  const { theme } = useThemeStore();
  const { admin: currentAdmin } = useAdminAuthStore();
  const { log } = useActivityLogger();
  const router = useRouter();
  const isDark = theme === "dark";
  
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchAdmins = useCallback(async (showRefresh = false) => {
    if (showRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    try {
      const result = await getAllAdmins();
      if (result.success) {
        setAdmins(result.admins);
      } else {
        toast.error(result.error || "Failed to fetch admins");
      }
    } catch (error) {
      console.error("Error fetching admins:", error);
      toast.error("Failed to fetch admins");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    // Only super admin can access this page
    if (currentAdmin?.role !== "super_admin") {
      toast.error("Access denied. Super Admin only.");
      router.push("/admin/dashboard");
      return;
    }
    fetchAdmins();
  }, [currentAdmin, router, fetchAdmins]);

  const handleAddAdmin = () => {
    setEditingAdmin(null);
    setIsModalOpen(true);
  };

  const handleEditAdmin = (admin) => {
    setEditingAdmin(admin);
    setIsModalOpen(true);
  };

  const handleSaveAdmin = async (formData) => {
    setIsSaving(true);
    try {
      let result;
      let oldData = null;
      
      if (editingAdmin) {
        // Get old data for logging
        oldData = editingAdmin;
        result = await updateAdmin(editingAdmin.id, formData);
        if (result.success) {
          await log({
            action: 'UPDATE',
            entityType: 'admin',
            entityId: editingAdmin.id,
            entityTitle: formData.name,
            oldData: oldData,
            newData: formData,
            details: `Updated admin: ${formData.name}`
          });
        }
      } else {
        result = await createAdmin(formData);
        if (result.success) {
          await log({
            action: 'CREATE',
            entityType: 'admin',
            entityId: result.id,
            entityTitle: formData.name,
            newData: formData,
            details: `Created admin: ${formData.name}`
          });
        }
      }
      
      if (result.success) {
        toast.success(editingAdmin ? "Admin updated successfully" : "Admin created successfully");
        setIsModalOpen(false);
        fetchAdmins(true);
      } else {
        toast.error(result.error || "Operation failed");
      }
    } catch (error) {
      console.error("Error saving admin:", error);
      toast.error("Failed to save admin");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAdmin = async (admin) => {
    // Prevent self-deletion
    if (admin.id === currentAdmin?.id) {
      toast.error("You cannot delete your own account");
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Delete admin "${admin.name}"? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EAB308",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      background: isDark ? "#1f2937" : "#ffffff",
      color: isDark ? "#ffffff" : "#000000",
    });

    if (result.isConfirmed) {
      try {
        const deleteResult = await deleteAdmin(admin.id);
        if (deleteResult.success) {
          await log({
            action: 'DELETE',
            entityType: 'admin',
            entityId: admin.id,
            entityTitle: admin.name,
            details: `Deleted admin: ${admin.name}`
          });
          toast.success("Admin deleted successfully");
          fetchAdmins(true);
        } else {
          toast.error(deleteResult.error || "Failed to delete admin");
        }
      } catch (error) {
        console.error("Error deleting admin:", error);
        toast.error("Failed to delete admin");
      }
    }
  };

  const handleRefresh = () => {
    fetchAdmins(true);
  };

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
            type="button"
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
              Admin Management
            </h1>
            <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"} mt-1`}>
              Manage system administrators and their permissions
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
            onClick={handleAddAdmin}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-semibold transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Admin
          </button>
        </div>
      </div>

      {/* Total Records */}
      <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
        Total: {admins.length} admin{admins.length !== 1 ? 's' : ''}
      </div>

      {/* Admins Table */}
      <AdminTable
        admins={admins}
        currentAdminId={currentAdmin?.id}
        isDark={isDark}
        onEdit={handleEditAdmin}
        onDelete={handleDeleteAdmin}
      />

      {/* Admin Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAdmin(null);
        }}
        onSave={handleSaveAdmin}
        editingAdmin={editingAdmin}
        isSaving={isSaving}
        isDark={isDark}
      />
    </div>
  );
}