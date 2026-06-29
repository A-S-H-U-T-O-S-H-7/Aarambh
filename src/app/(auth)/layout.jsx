'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/lib/store/useAuthStore';

export default function AuthLayout({ children }) {
  const { isAuthenticated, loading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className=" flex items-center justify-center bg-cream-50 dark:bg-brown-900">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-saffron" />
      </div>
    );
  }

  return (
    <div className=" flex items-center justify-center bg-gradient-to-br from-cream-50 via-amber-50/40 to-yellow-50/30 dark:from-brown-950 dark:via-brown-900 dark:to-brown-950 overflow-hidden">
      {children}
    </div>
  );
}