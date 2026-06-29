// lib/services/activityLogService.js
import { db } from "@/lib/firebase/client";
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  orderBy, 
  limit, 
  getDocs, 
  where, 
  deleteDoc, 
  doc,
  startAfter,
  getCountFromServer
} from "firebase/firestore";

const ACTIVITY_LOGS_COLLECTION = "activity";

// Activity action types
export const ActivityActions = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  PUBLISH: 'PUBLISH',
  UNPUBLISH: 'UNPUBLISH',
  FEATURED_ON: 'FEATURED_ON',
  FEATURED_OFF: 'FEATURED_OFF',
  TRENDING_ON: 'TRENDING_ON',
  TRENDING_OFF: 'TRENDING_OFF',
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  STATUS_CHANGE: 'STATUS_CHANGE',
};

// Activity entity types
export const ActivityEntityTypes = {
  BHAJAN: 'bhajan',
  VIDEO: 'video',
  STORY: 'story',
  TEMPLE: 'temple',
  FESTIVAL: 'festival',
  PANCHANG: 'panchang',
  HOROSCOPE: 'horoscope',
  USER: 'user',
  ADMIN: 'admin',
  SETTINGS: 'settings',
};

// Log an activity
export const logActivity = async ({
  action,
  entityType,
  entityId,
  entityTitle,
  oldData = null,
  newData = null,
  details = null,
  adminId,
  adminName,
  adminRole,
}) => {
  try {
    const activityData = {
      action,
      entityType,
      entityId,
      entityTitle: entityTitle || '',
      oldData: oldData ? JSON.stringify(oldData) : null,
      newData: newData ? JSON.stringify(newData) : null,
      details: details || '',
      adminId,
      adminName,
      adminRole,
      timestamp: serverTimestamp(),
    };
    
    await addDoc(collection(db, ACTIVITY_LOGS_COLLECTION), activityData);
    return { success: true };
  } catch (error) {
    console.error('Error logging activity:', error);
    return { success: false, error: error.message };
  }
};

// Get activity logs with filters and pagination
export const getActivityLogs = async (page = 1, filters = {}, itemsPerPage = 20) => {
  try {
    const logsRef = collection(db, ACTIVITY_LOGS_COLLECTION);
    let constraints = [orderBy('timestamp', 'desc')];
    
    // Apply filters
    if (filters.action && filters.action !== 'all') {
      constraints.push(where('action', '==', filters.action));
    }
    if (filters.entityType && filters.entityType !== 'all') {
      constraints.push(where('entityType', '==', filters.entityType));
    }
    if (filters.adminId && filters.adminId !== 'all') {
      constraints.push(where('adminId', '==', filters.adminId));
    }

    // Get total count
    const countQuery = query(logsRef, ...constraints);
    const countSnapshot = await getCountFromServer(countQuery);
    const totalItems = countSnapshot.data().count;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    // Get paginated data
    const q = query(logsRef, ...constraints, limit(itemsPerPage));
    const snapshot = await getDocs(q);
    
    let logs = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      logs.push({
        id: doc.id,
        action: data.action,
        entityType: data.entityType,
        entityId: data.entityId,
        entityTitle: data.entityTitle,
        details: data.details,
        adminId: data.adminId,
        adminName: data.adminName,
        adminRole: data.adminRole,
        oldData: data.oldData ? JSON.parse(data.oldData) : null,
        newData: data.newData ? JSON.parse(data.newData) : null,
        timestamp: data.timestamp?.toDate?.() || null,
      });
    });

    // Apply search filter (client-side)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      logs = logs.filter(log => 
        log.entityTitle?.toLowerCase().includes(searchLower) ||
        log.adminName?.toLowerCase().includes(searchLower)
      );
    }
    
    return {
      success: true,
      logs,
      totalPages,
      totalItems,
      currentPage: page,
    };
  } catch (error) {
    console.error('Error getting activity logs:', error);
    return { 
      success: false, 
      error: error.message, 
      logs: [], 
      totalPages: 1, 
      totalItems: 0,
      currentPage: 1,
    };
  }
};

// Get recent activity logs (for dashboard)
export const getRecentActivities = async (maxItems = 10) => {
  try {
    const logsRef = collection(db, ACTIVITY_LOGS_COLLECTION);
    const q = query(logsRef, orderBy('timestamp', 'desc'), limit(maxItems));
    const snapshot = await getDocs(q);
    
    const logs = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      logs.push({
        id: doc.id,
        action: data.action,
        entityType: data.entityType,
        entityTitle: data.entityTitle,
        adminName: data.adminName,
        timestamp: data.timestamp?.toDate?.() || null,
      });
    });
    
    return { success: true, logs };
  } catch (error) {
    console.error('Error getting recent activities:', error);
    return { success: false, logs: [] };
  }
};

// Clear old logs (maintenance)
export const clearOldLogs = async (daysOld = 90) => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    const logsRef = collection(db, ACTIVITY_LOGS_COLLECTION);
    const q = query(logsRef, where('timestamp', '<=', cutoffDate));
    const snapshot = await getDocs(q);
    
    let deletedCount = 0;
    for (const doc of snapshot.docs) {
      await deleteDoc(doc.ref);
      deletedCount++;
    }
    
    return { success: true, deletedCount };
  } catch (error) {
    console.error('Error clearing old logs:', error);
    return { success: false, error: error.message };
  }
};