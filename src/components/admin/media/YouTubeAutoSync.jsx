'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import useAdminAuthStore from '@/lib/store/useAdminAuthStore';
import { syncYouTubeDrafts } from '@/lib/services/youtubeSyncService';

// Rendered once in the admin layout: when an admin opens the panel, new
// YouTube uploads are turned into drafts in the background.
export default function YouTubeAutoSync() {
  const { admin } = useAdminAuthStore();
  const router = useRouter();
  const adminId = admin?.id || admin?.uid;

  useEffect(() => {
    if (!adminId) return;
    let cancelled = false;

    syncYouTubeDrafts(admin).then((result) => {
      if (cancelled || !result.success || !result.created) return;
      toast(
        (t) => (
          <span className="text-sm">
            {result.created} new YouTube {result.created === 1 ? 'video' : 'videos'} added as drafts.{' '}
            <button
              className="underline font-medium cursor-pointer"
              onClick={() => {
                toast.dismiss(t.id);
                router.push('/admin/media?status=draft');
              }}
            >
              Review
            </button>
          </span>
        ),
        { duration: 8000, icon: '🎬' }
      );
    });

    return () => {
      cancelled = true;
    };
  }, [adminId]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
