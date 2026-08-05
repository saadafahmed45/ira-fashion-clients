import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      openWishlist: () => set({ isOpen: true }),
      closeWishlist: () => set({ isOpen: false }),

      toggleWishlist: (product) => {
        const currentItems = get().items;
        const exists = currentItems.some((item) => item._id === product._id);

        if (exists) {
          set({ items: currentItems.filter((item) => item._id !== product._id) });
        } else {
          set({ items: [...currentItems, product] });
        }
      },

      isInWishlist: (productId) => {
        return get().items.some((item) => item._id === productId);
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item._id !== productId),
        }));
      },
    }),
    {
      name: "ira_fashion_wishlist",
      partialize: (state) => ({ items: state.items }),
    }
  )
);

export default useWishlistStore;
