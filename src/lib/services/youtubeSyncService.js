import { db } from '@/lib/firebase/client';
import { doc, getDoc, setDoc, arrayUnion, collection, query, where, getCountFromServer } from 'firebase/firestore';
import { importYouTubeMedia } from './mediaService';
import { logActivity } from './activityLogService';

// Auto-sync: new uploads on the Aarambh TV YouTube channel become DRAFT videos
// in the Media Library. It runs from the admin panel (when an admin opens it,
// and via "Check YouTube now"), so an admin only has to pick a category and publish.

const SYNC_DOC = () => doc(db, 'settings', 'youtube_sync');
const THROTTLE_KEY = 'aarambh_youtube_sync_at';
const THROTTLE_MS = 10 * 60 * 1000; // automatic checks at most every 10 minutes
const OVERLAP_MS = 24 * 60 * 60 * 1000; // re-check the last day (late-processed uploads)
export const YOUTUBE_SYNC_EVENT = 'aarambh:youtube-sync';

let running = null;

/**
 * Check YouTube for new uploads and create drafts for them.
 * force: ignore the 10-minute throttle (manual "Check YouTube now")
 * Returns { success, created, skipped } or { success: false, error }.
 */
export const syncYouTubeDrafts = async (adminData, { force = false } = {}) => {
  if (running) return running;

  if (!force) {
    try {
      const last = Number(sessionStorage.getItem(THROTTLE_KEY) || 0);
      if (Date.now() - last < THROTTLE_MS) return { success: true, created: 0, skipped: 0, throttled: true };
    } catch {}
  }

  running = (async () => {
    try {
      try { sessionStorage.setItem(THROTTLE_KEY, String(Date.now())); } catch {}

      const startedAt = new Date().toISOString();
      const snap = await getDoc(SYNC_DOC());
      const state = snap.exists() ? snap.data() : {};
      const dismissed = new Set(state.dismissedIds || []);

      // First run: start from "now - 1 day" (older videos go through the Import page)
      const lastSynced = state.lastSyncedAt ? new Date(state.lastSyncedAt).getTime() : Date.now();
      const since = new Date(lastSynced - OVERLAP_MS).toISOString();

      const found = [];
      let pageToken = '';
      let playlistId = null;
      do {
        const res = await fetch('/api/youtube-import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ since, pageToken, playlistId }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error || 'YouTube check failed');
        playlistId = data.playlistId;
        pageToken = data.done ? '' : data.nextPageToken;
        found.push(...data.videos);
      } while (pageToken);

      const fresh = found.filter((v) => !dismissed.has(v.videoId));
      let created = 0;
      let skipped = found.length - fresh.length;

      if (fresh.length > 0) {
        // Already-saved videos are skipped inside importYouTubeMedia
        const result = await importYouTubeMedia(fresh, { category: '', status: 'draft', mediaType: 'video' });
        if (!result.success) throw new Error(result.error);
        created = result.imported;
        skipped += result.skipped;
      }

      await setDoc(SYNC_DOC(), { lastSyncedAt: startedAt }, { merge: true });

      if (created > 0) {
        await logActivity({
          action: 'CREATE',
          entityType: 'media',
          entityId: 'youtube-sync',
          entityTitle: `${created} new YouTube ${created === 1 ? 'video' : 'videos'} added as drafts`,
          details: `Auto-sync created ${created} draft ${created === 1 ? 'video' : 'videos'} from new YouTube uploads`,
          adminId: adminData?.id || adminData?.uid,
          adminName: adminData?.name || adminData?.username,
          adminRole: adminData?.role,
        });
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent(YOUTUBE_SYNC_EVENT, { detail: { created } }));
        }
      }
      return { success: true, created, skipped };
    } catch (error) {
      console.error('YouTube sync failed:', error);
      return { success: false, error: error.message };
    } finally {
      running = null;
    }
  })();

  return running;
};

// Remember a YouTube video the admin deleted, so auto-sync never re-creates it
export const dismissYouTubeVideo = async (youtubeId) => {
  if (!youtubeId) return;
  try {
    await setDoc(SYNC_DOC(), { dismissedIds: arrayUnion(youtubeId) }, { merge: true });
  } catch (error) {
    console.error('Could not record dismissed YouTube video:', error);
  }
};

// How many auto-created drafts are still waiting to be reviewed
export const countYouTubeDrafts = async () => {
  try {
    const q = query(
      collection(db, 'media'),
      where('status', '==', 'draft'),
      where('importedFrom', '==', 'youtube')
    );
    const snap = await getCountFromServer(q);
    return snap.data().count;
  } catch (error) {
    console.error('Could not count YouTube drafts:', error);
    return 0;
  }
};
