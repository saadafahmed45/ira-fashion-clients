"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, ArrowRight } from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { useCartStore } from "../store/cartStore";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getSubtotal } = useCartStore();
  const subtotal = getSubtotal();

  return (
    <Drawer isOpen={isOpen} onClose={closeCart} title={`Your Cart (${items.length})`}>
      {items.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-12">
          <div className="w-16 h-16 rounded-full bg-[#F9F9F9] flex items-center justify-center text-[#666666]">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <p className="text-sm text-[#666666]">Your shopping cart is empty.</p>
          <Button onClick={closeCart} variant="outline" size="md">
            Start Shopping
          </Button>
        </div>
      ) : (
        <div className="flex flex-col h-full justify-between gap-6">
          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto flex flex-col divide-y divide-[#E5E5E5]">
            {items.map((item) => (
              <div key={item.key} className="py-4 flex gap-4">
                <div className="relative w-20 aspect-[3/4] bg-[#F9F9F9] flex-shrink-0">
                  <Image
                    src={item.image || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&auto=format&fit=crop&q=80"}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="text-xs font-medium text-[#111111] line-clamp-1">
                        {item.title}
                      </h4>
                      {item.variant && (
                        <span className="text-[11px] text-[#666666] block mt-0.5">
                          {item.variant.name}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => removeItem(item.key)}
                      className="text-[#999999] hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <QuantitySelector
                      quantity={item.quantity}
                      onDecrease={() => updateQuantity(item.key, item.quantity - 1)}
                      onIncrease={() => updateQuantity(item.key, item.quantity + 1)}
                    />
                    <span className="text-xs font-semibold text-[#111111]">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Subtotal & Checkout */}
          <div className="border-t border-[#E5E5E5] pt-4 flex flex-col gap-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#666666]">Subtotal</span>
              <span className="font-semibold text-[#111111]">${subtotal.toFixed(2)}</span>
            </div>
            <p className="text-[11px] text-[#666666]">Taxes and shipping calculated at checkout.</p>

            <div className="flex flex-col gap-2">
              <Link href="/checkout" onClick={closeCart} className="w-full">
                <Button fullWidth variant="primary" size="lg" className="flex items-center justify-center gap-2">
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/cart" onClick={closeCart} className="w-full">
                <Button fullWidth variant="outline" size="md">
                  View Shopping Cart
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </Drawer>
  );
}
