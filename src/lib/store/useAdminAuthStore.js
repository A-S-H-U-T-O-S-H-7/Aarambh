// This is already from your reference - keep it!
import { create } from 'zustand';
import { adminAuthService } from '@/lib/admin/auth';
import Cookies from 'js-cookie';

const useAdminAuthStore = create((set, get) => ({
  admin: null,
  sessionToken: null,
  loading: false,
  error: null,
  isAuthenticated: false,

  adminLogin: async (email, password) => {
    set({ loading: true, error: null });
    
    try {
      const result = await adminAuthService.login(email, password);
      
      if (result.success) {
        Cookies.set('aarambh_admin_session', result.sessionToken, { 
          expires: 7,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/'
        });
        
        set({ 
          admin: result.admin, 
          sessionToken: result.sessionToken, 
          isAuthenticated: true, 
          loading: false 
        });
        
        return { success: true };
      } else {
        set({ 
          error: result.error,
          loading: false,
          admin: null,
          sessionToken: null,
          isAuthenticated: false
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      set({ 
        error: error.message || 'Login failed',
        loading: false,
        admin: null,
        sessionToken: null,
        isAuthenticated: false
      });
      return { success: false, error: error.message };
    }
  },

  verifySession: async () => {
    const token = Cookies.get('aarambh_admin_session');
    
    if (!token) {
      set({ isAuthenticated: false, admin: null, loading: false });
      return { success: false };
    }

    try {
      const result = await adminAuthService.verifySession(token);
      
      if (result.success && result.admin) {
        set({ 
          admin: result.admin, 
          sessionToken: token, 
          isAuthenticated: true, 
          loading: false 
        });
        return { success: true };
      } else {
        Cookies.remove('aarambh_admin_session');
        set({ admin: null, sessionToken: null, isAuthenticated: false, loading: false });
        return { success: false };
      }
    } catch (error) {
      Cookies.remove('aarambh_admin_session');
      set({ admin: null, sessionToken: null, isAuthenticated: false, loading: false });
      return { success: false };
    }
  },

  adminLogout: async () => {
    Cookies.remove('aarambh_admin_session');
    set({ admin: null, sessionToken: null, isAuthenticated: false, loading: false });
    return { success: true };
  },

  clearError: () => set({ error: null }),
}));

export default useAdminAuthStore;