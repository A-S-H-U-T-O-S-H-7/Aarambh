// app/(admin)/admin/messages/page.jsx
'use client';

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search } from "lucide-react";
import { toast } from "react-hot-toast";
import { useThemeStore } from "@/lib/store/useThemeStore";
import useAdminAuthStore from "@/lib/store/useAdminAuthStore";
import { useActivityLogger } from "@/hooks/useActivityLogger";
import ContactStatsCards from "./ContactStatsCards";
import ContactMessagesTable from "./ContactMessagesTable";
import ContactMessageModal from "./ContactMessageModal";
import { getContactMessages, updateMessageStatus, deleteContactMessage, getMessageStats } from "@/lib/services/contactService";
import Swal from "sweetalert2";

export default function ContactMessagesPage() {
  const { theme } = useThemeStore();
  const { admin } = useAdminAuthStore();
  const { log } = useActivityLogger();
  const router = useRouter();
  const isDark = theme === "dark";
  
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [stats, setStats] = useState({ total: 0, unread: 0, read: 0, replied: 0 });
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getContactMessages(currentPage, searchTerm, statusFilter);
      if (result.success) {
        setMessages(result.messages);
        setTotalPages(result.totalPages);
        setTotalItems(result.totalItems);
      } else {
        toast.error(result.error || "Failed to fetch messages");
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, statusFilter]);

  const fetchStats = useCallback(async () => {
    const result = await getMessageStats();
    if (result.success) {
      setStats(result.stats);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
    fetchStats();
  }, [fetchMessages, fetchStats]);

  const handleViewMessage = (message) => {
    setSelectedMessage(message);
    setIsModalOpen(true);
    if (message.status === 'unread') {
      handleMarkAsRead(message.id);
    }
  };

  const handleMarkAsRead = async (messageId) => {
    const result = await updateMessageStatus(messageId, 'read', admin);
    if (result.success) {
      fetchMessages();
      fetchStats();
    }
  };

  const handleMarkAsReplied = async (messageId) => {
    const result = await updateMessageStatus(messageId, 'replied', admin);
    if (result.success) {
      await log({
        action: 'UPDATE',
        entityType: 'contact',
        entityId: messageId,
        entityTitle: 'Contact Message',
        details: 'Marked as replied'
      });
      toast.success("Marked as replied");
      fetchMessages();
      fetchStats();
    }
  };

  const handleDeleteMessage = async (message) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Delete message from "${message.name}"?`,
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
      const deleteResult = await deleteContactMessage(message.id, admin);
      if (deleteResult.success) {
        await log({
          action: 'DELETE',
          entityType: 'contact',
          entityId: message.id,
          entityTitle: message.name,
          details: `Deleted contact message from ${message.name}`
        });
        toast.success("Message deleted");
        fetchMessages();
        fetchStats();
      } else {
        toast.error(deleteResult.error || "Failed to delete message");
      }
    }
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
              Contact Messages
            </h1>
            <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"} mt-1`}>
              Manage customer inquiries and support messages
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <ContactStatsCards stats={stats} isDark={isDark} />

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
              placeholder="Search by name, email or message..."
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
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className={`px-4 py-2.5 rounded-xl text-sm transition-all duration-200 focus:ring-2 focus:ring-yellow-400/20 focus:outline-none cursor-pointer ${
              isDark
                ? "bg-gray-900 border-gray-700 text-gray-100 focus:border-yellow-500"
                : "bg-gray-50 border-gray-300 text-gray-800 focus:border-yellow-400"
            } border-2`}
          >
            <option value="all">All Status</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
          </select>
        </div>
      </div>

      {/* Total Records */}
      {!loading && messages.length > 0 && (
        <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          Total: {totalItems} message{totalItems !== 1 ? 's' : ''}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <ContactMessagesTable
          messages={messages}
          currentPage={currentPage}
          totalPages={totalPages}
          isDark={isDark}
          onView={handleViewMessage}
          onMarkReplied={handleMarkAsReplied}
          onDelete={handleDeleteMessage}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Message Modal */}
      <ContactMessageModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedMessage(null);
        }}
        message={selectedMessage}
        isDark={isDark}
      />
    </div>
  );
}