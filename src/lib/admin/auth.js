// lib/admin/auth.js
import { db } from '@/lib/firebase/client';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, getDoc } from 'firebase/firestore';

export const adminAuthService = {
  login: async (email, password) => {
    try {
      // Check if admin exists in Firestore
      const adminsRef = collection(db, 'admins');
      const q = query(adminsRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return { success: false, error: 'Admin account not found' };
      }

      const adminDoc = querySnapshot.docs[0];
      const adminData = adminDoc.data();

      // Check if admin is active
      if (adminData.status === 'inactive') {
        return { success: false, error: 'Account is inactive' };
      }

      // Generate simple session token
      const sessionToken = Math.random().toString(36).substring(2) + 
                          Date.now().toString(36);

      // Update last login
      await updateDoc(doc(db, 'admins', adminDoc.id), {
        lastLoginAt: new Date()
      });

      return {
        success: true,
        sessionToken: sessionToken,
        admin: {
          id: adminDoc.id,
          uid: adminData.uid || adminDoc.id,
          name: adminData.name,
          email: adminData.email,
          role: adminData.role || 'admin',
          permissions: adminData.permissions || []
        }
      };

    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  },

  verifySession: async (token) => {
    try {
      // For simplicity, we'll check if admin exists
      // You can store sessions in a separate collection if needed
      const adminsRef = collection(db, 'admins');
      const q = query(adminsRef, where('status', '==', 'active'));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return { success: false };
      }

      // Return first active admin (for now)
      // In production, you should verify against a session token
      const adminDoc = querySnapshot.docs[0];
      const adminData = adminDoc.data();

      return {
        success: true,
        admin: {
          id: adminDoc.id,
          uid: adminData.uid || adminDoc.id,
          name: adminData.name,
          email: adminData.email,
          role: adminData.role || 'admin',
          permissions: adminData.permissions || []
        }
      };

    } catch (error) {
      console.error('Verify session error:', error);
      return { success: false };
    }
  },

  logout: async () => {
    return { success: true };
  }
};