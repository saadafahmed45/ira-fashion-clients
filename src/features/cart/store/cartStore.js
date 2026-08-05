import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (product, variant = null, quantity = 1) => {
        const currentItems = get().items;
        const variantId = variant ? (variant._id || variant.name) : "default";
        const itemKey = `${product._id}_${variantId}`;

        const existingIndex = currentItems.findIndex((item) => item.key === itemKey);

        if (existingIndex > -1) {
          const updatedItems = [...currentItems];
          updatedItems[existingIndex].quantity += quantity;
          set({ items: updatedItems, isOpen: true });
        } else {
          const newItem = {
            key: itemKey,
            productId: product._id,
            title: product.title,
            slug: product.slug,
            image: variant?.image || product.images?.[0] || "",
            price: variant?.price || product.price,
            variant: variant ? { name: variant.name, sku: variant.sku, options: variant.options } : null,
            quantity,
          };
          set({ items: [...currentItems, newItem], isOpen: true });
        }
      },

      removeItem: (itemKey) => {
        set((state) => ({
          items: state.items.filter((item) => item.key !== itemKey),
        }));
      },

      updateQuantity: (itemKey, quantity) => {
        if (quantity < 1) return;
        set((state) => ({
          items: state.items.map((item) =>
            item.key === itemKey ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getSubtotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: "ira_fashion_cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);

export default useCartStore;
