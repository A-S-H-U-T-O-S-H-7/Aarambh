// lib/services/adminManagementService.js
import { db, auth } from '@/lib/firebase/client';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';

const ADMIN_USERS_COLLECTION = 'admins';

// ============ AVAILABLE PERMISSIONS ============
export const AVAILABLE_PERMISSIONS = [
  // Dashboard
  { id: 'view_dashboard', name: 'View Dashboard', category: 'Dashboard' },
  
  // Daily Management
  { id: 'manage_daily', name: 'Manage Daily Content', category: 'Daily Management' },
  
  // Bhajans
  { id: 'view_bhajans', name: 'View Bhajans', category: 'Bhajans' },
  { id: 'create_bhajans', name: 'Create Bhajans', category: 'Bhajans' },
  { id: 'edit_bhajans', name: 'Edit Bhajans', category: 'Bhajans' },
  { id: 'delete_bhajans', name: 'Delete Bhajans', category: 'Bhajans' },
  
  // Videos
  { id: 'view_videos', name: 'View Videos', category: 'Videos' },
  { id: 'create_videos', name: 'Create Videos', category: 'Videos' },
  { id: 'edit_videos', name: 'Edit Videos', category: 'Videos' },
  { id: 'delete_videos', name: 'Delete Videos', category: 'Videos' },
  
  // Stories
  { id: 'view_stories', name: 'View Stories', category: 'Stories' },
  { id: 'create_stories', name: 'Create Stories', category: 'Stories' },
  { id: 'edit_stories', name: 'Edit Stories', category: 'Stories' },
  { id: 'delete_stories', name: 'Delete Stories', category: 'Stories' },
  
  // Temples
  { id: 'view_temples', name: 'View Temples', category: 'Temples' },
  { id: 'create_temples', name: 'Create Temples', category: 'Temples' },
  { id: 'edit_temples', name: 'Edit Temples', category: 'Temples' },
  { id: 'delete_temples', name: 'Delete Temples', category: 'Temples' },
  
  // Festivals
  { id: 'view_festivals', name: 'View Festivals', category: 'Festivals' },
  { id: 'create_festivals', name: 'Create Festivals', category: 'Festivals' },
  { id: 'edit_festivals', name: 'Edit Festivals', category: 'Festivals' },
  { id: 'delete_festivals', name: 'Delete Festivals', category: 'Festivals' },
  
  // Astro
  { id: 'manage_astro', name: 'Manage Astro Data', category: 'Astro' },
  
  // Users
  { id: 'view_users', name: 'View Users', category: 'Users' },
  { id: 'edit_users', name: 'Edit Users', category: 'Users' },
  { id: 'block_users', name: 'Block Users', category: 'Users' },
  
  // Subscribers
  { id: 'view_subscribers', name: 'View Subscribers', category: 'Subscribers' },
  { id: 'manage_subscribers', name: 'Manage Subscribers', category: 'Subscribers' },
  
  // Admins
  { id: 'view_admins', name: 'View Admins', category: 'Admins' },
  { id: 'create_admins', name: 'Create Admins', category: 'Admins' },
  { id: 'edit_admins', name: 'Edit Admins', category: 'Admins' },
  { id: 'delete_admins', name: 'Delete Admins', category: 'Admins' },
  
  // Messages
  { id: 'view_messages', name: 'View Messages', category: 'Messages' },
  { id: 'reply_messages', name: 'Reply Messages', category: 'Messages' },
  
  // Leads
  { id: 'view_leads', name: 'View Leads', category: 'Leads' },
  
  // Activity
  { id: 'view_activity', name: 'View Activity Logs', category: 'Activity' },
  
  // Settings
  { id: 'manage_settings', name: 'Manage Settings', category: 'Settings' },
];

// ============ ROLE PERMISSIONS ============
export const ROLE_PERMISSIONS = {
  super_admin: AVAILABLE_PERMISSIONS.map(p => p.id),
  admin: [
    'view_dashboard',
    'manage_daily',
    'view_bhajans', 'create_bhajans', 'edit_bhajans', 'delete_bhajans',
    'view_videos', 'create_videos', 'edit_videos', 'delete_videos',
    'view_stories', 'create_stories', 'edit_stories', 'delete_stories',
    'view_temples', 'create_temples', 'edit_temples', 'delete_temples',
    'view_festivals', 'create_festivals', 'edit_festivals', 'delete_festivals',
    'manage_astro',
    'view_users', 'edit_users', 'block_users',
    'view_subscribers', 'manage_subscribers',
    'view_messages', 'reply_messages',
    'view_leads',
    'view_activity',
    'manage_settings',
  ],
  editor: [
    'view_dashboard',
    'manage_daily',
    'view_bhajans', 'create_bhajans', 'edit_bhajans',
    'view_videos', 'create_videos', 'edit_videos',
    'view_stories', 'create_stories', 'edit_stories',
    'view_temples', 'create_temples', 'edit_temples',
    'view_festivals', 'create_festivals', 'edit_festivals',
  ],
  viewer: [
    'view_dashboard',
    'view_bhajans',
    'view_videos',
    'view_stories',
    'view_temples',
    'view_festivals',
    'view_users',
  ],
};

// ============ ROLES LIST ============
export const ROLES = [
  { id: 'super_admin', name: 'Super Admin', description: 'Full access to everything' },
  { id: 'admin', name: 'Admin', description: 'Most features except admin management' },
  { id: 'editor', name: 'Editor', description: 'Create and edit content' },
  { id: 'viewer', name: 'Viewer', description: 'Read-only access' },
];

// ============ GET ALL ADMINS ============
export const getAllAdmins = async () => {
  try {
    const adminsRef = collection(db, ADMIN_USERS_COLLECTION);
    const q = query(adminsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    const admins = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      admins.push({
        id: doc.id,
        uid: data.uid,
        name: data.name || '',
        email: data.email || '',
        username: data.username || '',
        role: data.role || 'admin',
        permissions: data.permissions || [],
        status: data.status || 'active',
        createdAt: data.createdAt?.toDate?.() || null,
        lastLoginAt: data.lastLoginAt?.toDate?.() || null,
        createdBy: data.createdBy || null,
      });
    });
    
    return { success: true, admins };
  } catch (error) {
    console.error('Error getting admins:', error);
    return { success: false, error: error.message, admins: [] };
  }
};

// ============ GET ADMIN BY ID ============
export const getAdminById = async (adminId) => {
  try {
    const adminRef = doc(db, ADMIN_USERS_COLLECTION, adminId);
    const adminSnap = await getDoc(adminRef);
    
    if (!adminSnap.exists()) {
      return { success: false, error: 'Admin not found' };
    }
    
    const data = adminSnap.data();
    return {
      success: true,
      admin: {
        id: adminSnap.id,
        uid: data.uid,
        name: data.name || '',
        email: data.email || '',
        username: data.username || '',
        role: data.role || 'admin',
        permissions: data.permissions || [],
        status: data.status || 'active',
        createdAt: data.createdAt?.toDate?.() || null,
        lastLoginAt: data.lastLoginAt?.toDate?.() || null,
      }
    };
  } catch (error) {
    console.error('Error getting admin:', error);
    return { success: false, error: error.message };
  }
};

// ============ CREATE ADMIN ============
export const createAdmin = async (adminData) => {
  try {
    // Step 1: Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, adminData.email, adminData.password);
    const user = userCredential.user;
    
    // Step 2: Get permissions based on role
    let permissions = adminData.permissions || [];
    if (adminData.role === 'super_admin') {
      permissions = [];
    } else if (permissions.length === 0) {
      permissions = ROLE_PERMISSIONS[adminData.role] || [];
    }
    
    // Step 3: Create Firestore document
    const adminRef = doc(db, ADMIN_USERS_COLLECTION, user.uid);
    await setDoc(adminRef, {
      uid: user.uid,
      name: adminData.name,
      email: adminData.email,
      username: adminData.username,
      role: adminData.role,
      permissions: permissions,
      status: adminData.status || 'active',
      createdBy: adminData.createdBy || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastLoginAt: null,
    });
    
    return { success: true, id: adminRef.id };
    
  } catch (error) {
    console.error('Error creating admin:', error);
    if (error.code === 'auth/email-already-in-use') {
      return { success: false, error: 'Email already exists in authentication system' };
    }
    if (error.code === 'auth/weak-password') {
      return { success: false, error: 'Password is too weak. Use at least 6 characters' };
    }
    return { success: false, error: error.message };
  }
};

// ============ UPDATE ADMIN ============
export const updateAdmin = async (adminId, adminData) => {
  try {
    const adminRef = doc(db, ADMIN_USERS_COLLECTION, adminId);
    
    // Get permissions based on role
    let permissions = adminData.permissions || [];
    if (adminData.role === 'super_admin') {
      permissions = [];
    } else if (permissions.length === 0) {
      permissions = ROLE_PERMISSIONS[adminData.role] || [];
    }
    
    const updateData = {
      name: adminData.name,
      role: adminData.role,
      permissions: permissions,
      status: adminData.status,
      updatedAt: serverTimestamp(),
    };
    
    await updateDoc(adminRef, updateData);
    
    return { success: true };
  } catch (error) {
    console.error('Error updating admin:', error);
    return { success: false, error: error.message };
  }
};

// ============ DELETE ADMIN ============
export const deleteAdmin = async (adminId) => {
  try {
    const adminToDelete = await getAdminById(adminId);
    if (!adminToDelete.success) {
      return { success: false, error: 'Admin not found' };
    }
    
    // Prevent deleting last super admin
    if (adminToDelete.admin.role === 'super_admin') {
      const allAdmins = await getAllAdmins();
      const superAdminCount = allAdmins.admins.filter(a => a.role === 'super_admin').length;
      if (superAdminCount <= 1) {
        return { success: false, error: 'Cannot delete the only super admin' };
      }
    }
    
    await deleteDoc(doc(db, ADMIN_USERS_COLLECTION, adminId));
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting admin:', error);
    return { success: false, error: error.message };
  }
};

// ============ RESET ADMIN PASSWORD ============
export const resetAdminPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    console.error('Error resetting password:', error);
    return { success: false, error: error.message };
  }
};