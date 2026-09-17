import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      appliedCoupon: null,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (product, quantity = 1) => {
        const currentItems = get().items;
        const existingIndex = currentItems.findIndex((item) => item.id === product._id);
        const activePrice =
          product.discountPrice > 0 ? product.discountPrice : product.price;

        if (existingIndex > -1) {
          const updatedItems = [...currentItems];
          const newQty = updatedItems[existingIndex].quantity + quantity;
          // Check stock
          if (product.stock && newQty > product.stock) {
            updatedItems[existingIndex].quantity = product.stock;
          } else {
            updatedItems[existingIndex].quantity = newQty;
          }
          set({ items: updatedItems, isOpen: true });
        } else {
          const newItem = {
            id: product._id,
            name: product.name,
            price: activePrice,
            originalPrice: product.price,
            image: product.images?.[0] || "",
            slug: product.slug,
            stock: product.stock || 99,
            quantity: Math.min(quantity, product.stock || quantity),
          };
          set({ items: [...currentItems, newItem], isOpen: true });
        }
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity < 1) return;
        set((state) => ({
          items: state.items.map((item) => {
            if (item.id === productId) {
              const maxQty = item.stock || 99;
              return { ...item, quantity: Math.min(quantity, maxQty) };
            }
            return item;
          }),
        }));
      },

      clearCart: () => set({ items: [], appliedCoupon: null }),

      applyCoupon: (coupon) => set({ appliedCoupon: coupon }),
      removeCoupon: () => set({ appliedCoupon: null }),

      getSubtotal: () => {
        return get().items.reduce((acc, item) => acc + item.price * item.quantity, 0);
      },

      getDiscountAmount: () => {
        const coupon = get().appliedCoupon;
        const subtotal = get().getSubtotal();
        if (!coupon || subtotal <= 0) return 0;

        if (coupon.calculatedDiscount) return coupon.calculatedDiscount;

        if (coupon.discountType === "percentage") {
          const discount = (subtotal * coupon.amount) / 100;
          return coupon.maxDiscount ? Math.min(discount, coupon.maxDiscount) : discount;
        }
        return Math.min(coupon.amount, subtotal);
      },

      getShippingPrice: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        return subtotal >= 2000 ? 0 : 70;
      },

      getTotalPrice: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        const discount = get().getDiscountAmount();
        const shipping = get().getShippingPrice();
        return Math.max(0, subtotal + shipping - discount);
      },

      getTotalCount: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },
    }),
    {
      name: "ira_fashion_cart",
      partialize: (state) => ({ items: state.items, appliedCoupon: state.appliedCoupon }),
    }
  )
);

export default useCartStore;
