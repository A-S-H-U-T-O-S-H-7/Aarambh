// lib/store/useThemeStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useThemeStore = create(
  persist(
    (set) => ({
      theme: "light",
      isMounted: false,
      
      // Actions
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "light" ? "dark" : "light",
        })),
      
      setTheme: (theme) => set({ theme }),
      
      setMounted: () => set({ isMounted: true }),
    }),
    {
      name: "aarambh-theme-storage",
      // Optional: Only persist theme, not isMounted
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);