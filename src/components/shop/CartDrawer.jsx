"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    getSubtotal,
    getTotalCount,
  } = useCartStore();

  const subtotal = getSubtotal();
  const totalCount = getTotalCount();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
          />

          {/* Drawer Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 250 }}
            className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-gray-900" />
                <h2 className="text-sm font-semibold tracking-wider uppercase text-gray-900">
                  Shopping Bag ({totalCount})
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="p-1.5 text-gray-400 hover:text-gray-900 rounded-full transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-gray-100">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4 text-gray-400">
                    <ShoppingBag className="w-8 h-8 stroke-1" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 mb-1">
                    Your bag is empty
                  </h3>
                  <p className="text-xs text-gray-500 max-w-xs mb-6">
                    Discover our new arrivals and curate your seasonal modest wardrobe.
                  </p>
                  <Button
                    onClick={closeCart}
                    variant="primary"
                    size="sm"
                  >
                    Start Shopping
                  </Button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="py-4 flex gap-4">
                    {/* Item Image */}
                    <div className="relative w-20 h-24 bg-gray-50 flex-shrink-0 overflow-hidden border border-gray-100">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <ShoppingBag className="w-6 h-6" />
                        </div>
                      )}
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-xs font-medium text-gray-900 truncate">
                            {item.name}
                          </h4>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-xs font-semibold text-gray-900 mt-1">
                          {formatPrice(item.price)}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center border border-gray-200">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2.5 py-0.5 text-xs text-gray-600 hover:bg-gray-100 transition-colors"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-medium text-gray-900 min-w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2.5 py-0.5 text-xs text-gray-600 hover:bg-gray-100 transition-colors"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-[11px] text-gray-500">
                          Total: {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer / Checkout */}
            {items.length > 0 && (
              <div className="border-t border-gray-100 p-6 bg-gray-50/50 space-y-4">
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Subtotal</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400">
                  Shipping and coupon discounts calculated at checkout.
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Link
                    href="/cart"
                    onClick={closeCart}
                    className="w-full text-center py-2.5 px-4 text-xs font-medium uppercase tracking-wider border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors"
                  >
                    View Bag
                  </Link>
                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="w-full text-center py-2.5 px-4 text-xs font-medium uppercase tracking-wider bg-gray-900 text-white hover:bg-gray-800 transition-colors flex items-center justify-center gap-1.5"
                  >
                    Checkout <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default CartDrawer;
