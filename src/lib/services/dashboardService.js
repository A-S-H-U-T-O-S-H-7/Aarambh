// lib/services/dashboardService.js
import { db } from "@/lib/firebase/client";
import {
  collection,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { getRecentActivities } from "./activityLogService"; 

const COLLECTIONS = {
  bhajans: "bhajans",
  videos: "videos",
  stories: "stories",
  temples: "temples",
  festivals: "festivals",
  users: "users",
  subscribers: "subscribers",
  contacts: "contact_messages",
  activities: "activity",
};

const emptyStats = {
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
};

const countCollection = async (collectionName, filters = []) => {
  try {
    const collectionRef = collection(db, collectionName);
    const countQuery = filters.length ? query(collectionRef, ...filters) : collectionRef;
    const snapshot = await getCountFromServer(countQuery);
    return snapshot.data().count || 0;
  } catch {
    return 0;
  }
};

const toDate = (value) => value?.toDate?.() || value || null;

const getRecentFromCollection = async (collectionName, mapItem, maxItems = 5) => {
  try {
    const recentQuery = query(collection(db, collectionName), orderBy("createdAt", "desc"), limit(maxItems));
    const snapshot = await getDocs(recentQuery);
    return snapshot.docs.map((doc) => mapItem(doc.id, doc.data()));
  } catch {
    return [];
  }
};

export const getDashboardData = async () => {
  try {
    const [
      totalBhajans,
      publishedBhajans,
      totalVideos,
      publishedVideos,
      totalStories,
      publishedStories,
      totalTemples,
      totalFestivals,
      totalUsers,
      activeUsers,
      subscribers,
      unreadMessages,
      recentBhajans,
      recentVideos,
      recentStories,
      recentUsers,
      recentMessages,
      recentActivities,
    ] = await Promise.all([
      countCollection(COLLECTIONS.bhajans),
      countCollection(COLLECTIONS.bhajans, [where("status", "==", "published")]),
      countCollection(COLLECTIONS.videos),
      countCollection(COLLECTIONS.videos, [where("status", "==", "published")]),
      countCollection(COLLECTIONS.stories),
      countCollection(COLLECTIONS.stories, [where("status", "==", "published")]),
      countCollection(COLLECTIONS.temples),
      countCollection(COLLECTIONS.festivals),
      countCollection(COLLECTIONS.users),
      countCollection(COLLECTIONS.users, [where("status", "==", "active")]),
      countCollection(COLLECTIONS.subscribers, [where("status", "==", "active")]),
      countCollection(COLLECTIONS.contacts, [where("status", "==", "unread")]),
      getRecentFromCollection(COLLECTIONS.bhajans, (id, data) => ({
        id,
        type: "Bhajan",
        title: data.title || "Untitled bhajan",
        status: data.status || "draft",
        date: toDate(data.createdAt),
      })),
      getRecentFromCollection(COLLECTIONS.videos, (id, data) => ({
        id,
        type: "Video",
        title: data.title || "Untitled video",
        status: data.status || "draft",
        date: toDate(data.createdAt),
      })),
      getRecentFromCollection(COLLECTIONS.stories, (id, data) => ({
        id,
        type: "Story",
        title: data.title || "Untitled story",
        status: data.status || "draft",
        date: toDate(data.createdAt),
      })),
      getRecentFromCollection(COLLECTIONS.users, (id, data) => ({
        id,
        name: data.name || data.email?.split("@")[0] || "User",
        email: data.email || "",
        date: toDate(data.createdAt),
      })),
      getRecentFromCollection(COLLECTIONS.contacts, (id, data) => ({
        id,
        name: data.name || "Visitor",
        subject: data.subject || "Contact message",
        status: data.status || "unread",
        date: toDate(data.createdAt),
      })),
      getRecentActivities(6), 
    ]);

    return {
      success: true,
      stats: {
        totalBhajans,
        publishedBhajans,
        totalVideos,
        publishedVideos,
        totalStories,
        publishedStories,
        totalTemples,
        totalFestivals,
        totalUsers,
        activeUsers,
        subscribers,
        unreadMessages,
        totalViews: 0,
      },
      recentContent: [...recentBhajans, ...recentVideos, ...recentStories]
        .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
        .slice(0, 8),
      recentUsers,
      recentMessages,
      recentActivities: recentActivities.logs || [], 
    };
  } catch (error) {
    console.error("Dashboard error:", error);
    return {
      success: false,
      error: error.message,
      stats: emptyStats,
      recentContent: [],
      recentUsers: [],
      recentMessages: [],
      recentActivities: [], 
    };
  }
};