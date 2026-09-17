import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/lib/api";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      hasHydrated: false,
      isAuthenticated: false,
      isAdmin: false,

      setHasHydrated: (val) => set({ hasHydrated: val }),

      setAuth: (user, accessToken, refreshToken = null) => {
        set((state) => ({
          user,
          accessToken,
          refreshToken: refreshToken || state.refreshToken,
          isAuthenticated: !!user,
          isAdmin: user?.role === "admin",
          isLoading: false,
        }));
      },

      logout: async () => {
        try {
          await api.post("/auth/logout");
        } catch {
          // Continue client cleanup even if network fails
        }
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isAdmin: false,
          isLoading: false,
        });
      },

      checkAuth: async () => {
        const state = get();
        const storedRefreshToken = state.refreshToken;
        const currentUser = state.user;

        // If we already have user and token from localStorage, maintain authenticated state
        if (currentUser && state.accessToken) {
          set({
            isAuthenticated: true,
            isAdmin: currentUser?.role === "admin",
          });
        }

        // Only attempt refresh if there is a refreshToken or active user
        if (!storedRefreshToken && !currentUser) {
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isAdmin: false,
            isLoading: false,
          });
          return;
        }

        try {
          const refreshRes = await api.post("/auth/refresh", {
            refreshToken: storedRefreshToken,
          });
          if (refreshRes.success && refreshRes.data) {
            const { user, accessToken, refreshToken } = refreshRes.data;
            set({
              user,
              accessToken,
              refreshToken: refreshToken || storedRefreshToken,
              isAuthenticated: true,
              isAdmin: user?.role === "admin",
              isLoading: false,
            });
            return;
          }
        } catch (err) {
          // Only invalidate session if explicitly 401 or 403
          if (err?.statusCode === 401 || err?.statusCode === 403) {
            set({
              user: null,
              accessToken: null,
              refreshToken: null,
              isAuthenticated: false,
              isAdmin: false,
              isLoading: false,
            });
          }
        }
      },
    }),
    {
      name: "ira_fashion_auth",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hasHydrated = true;
          state.isLoading = false;
          state.isAuthenticated = !!state.user;
          state.isAdmin = state.user?.role === "admin";
        }
      },
    }
  )
);

export default useAuthStore;
