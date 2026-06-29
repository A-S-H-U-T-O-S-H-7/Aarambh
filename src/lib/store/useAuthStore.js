import { create } from 'zustand';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase/client';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';

const useAuthStore = create((set, get) => ({
  user: null,
  loading: true,
  error: null,
  isAuthenticated: false,
  isAdmin: false,

  // Initialize auth listener
  initialize: () => {
    set({ loading: true });
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get user data from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          const userData = userDoc.exists() ? userDoc.data() : {};
          
          const user = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || userData.displayName || firebaseUser.email?.split('@')[0] || 'User',
            photoURL: firebaseUser.photoURL || userData.photoURL || null,
            role: userData.role || 'user',
            ...userData,
          };
          
          set({
            user,
            isAuthenticated: true,
            isAdmin: user.role === 'admin' || user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL,
            loading: false,
            error: null,
          });
        } catch (error) {
          console.error('Error fetching user data:', error);
          // Still set the user even if Firestore fails
          set({
            user: {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
              photoURL: firebaseUser.photoURL,
              role: 'user',
            },
            isAuthenticated: true,
            isAdmin: firebaseUser.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL,
            loading: false,
            error: null,
          });
        }
      } else {
        set({
          user: null,
          isAuthenticated: false,
          isAdmin: false,
          loading: false,
          error: null,
        });
      }
    });

    return unsubscribe;
  },

  // Sign Up
  signUp: async (name, email, password) => {
    set({ loading: true, error: null });
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Update display name
      await updateProfile(firebaseUser, { displayName: name });
      
      // Create user document in Firestore
      const userData = {
        uid: firebaseUser.uid,
        displayName: name,
        email: email,
        photoURL: null,
        role: 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        preferences: {
          theme: 'light',
          notifications: true,
        },
      };
      
      await setDoc(doc(db, 'users', firebaseUser.uid), userData);
      
      set({
        user: {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: name,
          photoURL: null,
          role: 'user',
        },
        isAuthenticated: true,
        isAdmin: false,
        loading: false,
        error: null,
      });
      
      return { success: true };
    } catch (error) {
      const errorMessage = getAuthErrorMessage(error.code);
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Sign In
  signIn: async (email, password) => {
    set({ loading: true, error: null });
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Get user data from Firestore
      try {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        const userData = userDoc.exists() ? userDoc.data() : {};
        
        set({
          user: {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || userData.displayName || firebaseUser.email?.split('@')[0] || 'User',
            photoURL: firebaseUser.photoURL || userData.photoURL || null,
            role: userData.role || 'user',
            ...userData,
          },
          isAuthenticated: true,
          isAdmin: firebaseUser.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL || userData.role === 'admin',
          loading: false,
          error: null,
        });
      } catch (error) {
        // If Firestore fails, still set user with basic info
        set({
          user: {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            photoURL: firebaseUser.photoURL,
            role: 'user',
          },
          isAuthenticated: true,
          isAdmin: firebaseUser.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL,
          loading: false,
          error: null,
        });
      }
      
      return { success: true };
    } catch (error) {
      const errorMessage = getAuthErrorMessage(error.code);
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },


// Google Sign In
googleLogin: async () => {
  set({ loading: true, error: null });
  
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const firebaseUser = userCredential.user;
    
    try {
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (!userDoc.exists()) {
        const userData = {
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
          role: 'user',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          preferences: {
            theme: 'light',
            notifications: true,
          },
        };
        await setDoc(doc(db, 'users', firebaseUser.uid), userData);
      }
      
      const userDocData = (await getDoc(doc(db, 'users', firebaseUser.uid))).data() || {};
      
      set({
        user: {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || userDocData.displayName || firebaseUser.email?.split('@')[0] || 'User',
          photoURL: firebaseUser.photoURL || userDocData.photoURL || null,
          role: userDocData.role || 'user',
          ...userDocData,
        },
        isAuthenticated: true,
        isAdmin: firebaseUser.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL || userDocData.role === 'admin',
        loading: false,
        error: null,
      });
    } catch (error) {
      // If Firestore fails, still set user with basic info
      set({
        user: {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          photoURL: firebaseUser.photoURL,
          role: 'user',
        },
        isAuthenticated: true,
        isAdmin: firebaseUser.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL,
        loading: false,
        error: null,
      });
    }
    
    return { success: true };
  } catch (error) {
    console.error('Google login error:', error);
    const errorMessage = getAuthErrorMessage(error.code);
    set({ error: errorMessage, loading: false });
    return { success: false, error: errorMessage };
  }
},

  // Sign Out
  logout: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      set({
        user: null,
        isAuthenticated: false,
        isAdmin: false,
        loading: false,
        error: null,
      });
    }
  },

  // Forgot Password
  resetPassword: async (email) => {
    set({ loading: true, error: null });
    
    try {
      await sendPasswordResetEmail(auth, email);
      set({ loading: false });
      return { success: true };
    } catch (error) {
      const errorMessage = getAuthErrorMessage(error.code);
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
}));

// Helper function for error messages
function getAuthErrorMessage(code) {
  const messages = {
    'auth/email-already-in-use': 'This email is already registered. Please login.',
    'auth/invalid-email': 'Invalid email address.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
    'auth/operation-not-allowed': 'Email/Password sign-in is not enabled.',
    'auth/unauthorized-domain': 'This domain is not authorized for Firebase Google sign-in.',
    'auth/popup-blocked': 'Google sign-in popup was blocked by the browser.',
    'auth/account-exists-with-different-credential': 'An account already exists with this email using another sign-in method.',
    'auth/invalid-credential': 'Invalid credentials. Please check your email and password.',
    'auth/missing-password': 'Please enter your password.',
    'auth/missing-email': 'Please enter your email address.',
    'auth/popup-closed-by-user': 'Google sign-in was cancelled.',
    'auth/cancelled-popup-request': 'Sign-in was cancelled.',
  };
  return messages[code] || 'An error occurred. Please try again.';
}

// Auto-initialize on client
if (typeof window !== 'undefined') {
  const unsubscribe = useAuthStore.getState().initialize();
  // Store unsubscribe function for cleanup if needed
  window.__authUnsubscribe = unsubscribe;
}

export default useAuthStore;
