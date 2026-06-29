// app/(admin)/admin/layout.jsx
'use client';

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Toaster } from "react-hot-toast";
import useAdminAuthStore from "@/lib/store/useAdminAuthStore";
import { useThemeStore } from "@/lib/store/useThemeStore";
import AdminSidebar from "@/components/admin/layout/Sidebar";
import AdminHeader from "@/components/admin/layout/Header";

export default function AdminLayout({ children }) {
  const { isAuthenticated, loading, verifySession } = useAdminAuthStore();
  const { theme } = useThemeStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);
  const isLoginRoute = pathname === "/admin/login";
  const isDarkMode = theme === 'dark';

  useEffect(() => {
    const init = async () => {
      await verifySession();
      setIsReady(true);
    };
    init();
  }, [verifySession]);

  useEffect(() => {
    if (!isReady) return;
    
    if (!isLoginRoute && !isAuthenticated && !loading) {
      router.replace("/admin/login");
    }
    if (isLoginRoute && isAuthenticated && !loading) {
      router.replace("/admin/dashboard");
    }
  }, [isReady, isAuthenticated, loading, isLoginRoute, router]);

  if (!isReady || (loading && !isAuthenticated && !isLoginRoute)) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-yellow-500 border-t-transparent rounded-full animate-spin" />
          <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (isLoginRoute) {
    return (
      <>
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: isDarkMode ? '#1F2937' : '#FFFFFF',
              color: isDarkMode ? '#F3F4F6' : '#111827',
              border: '1px solid #EAB308',
              borderRadius: '8px',
            },
          }}
        />
        {children}
      </>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-200"}`}>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: isDarkMode ? '#1F2937' : '#FFFFFF',
            color: isDarkMode ? '#F3F4F6' : '#111827',
            border: '1px solid #EAB308',
            borderRadius: '8px',
          },
        }}
      />
      <AdminSidebar />
      <div className="lg:ml-60">
        <AdminHeader />
        <main className="px-4 pb-8 pt-10 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}