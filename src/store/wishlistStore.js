import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/lib/api";
import { useAuthStore } from "./authStore";

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],

      toggleWishlist: async (product) => {
        const currentItems = get().items;
        const exists = currentItems.some((item) => item._id === product._id);

        let updatedItems;
        if (exists) {
          updatedItems = currentItems.filter((item) => item._id !== product._id);
        } else {
          updatedItems = [...currentItems, product];
        }

        set({ items: updatedItems });

        // If user is authenticated, sync with server
        if (useAuthStore.getState().isAuthenticated) {
          try {
            await api.post(`/users/wishlist/${product._id}`);
          } catch {
            // Keep local state intact
          }
        }
      },

      isInWishlist: (productId) => {
        return get().items.some((item) => item._id === productId);
      },

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: "ira_fashion_wishlist",
    }
  )
);

export default useWishlistStore;
