"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, ShoppingBag, ArrowRight, Tag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { useCartStore } from "@/features/cart/store/cartStore";
import api from "@/lib/api";

const CartPage = () => {
  const { items, removeItem, updateQuantity, getSubtotal, clearCart } = useCartStore();
  const subtotal = getSubtotal();

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const SHIPPING = subtotal > 150 ? 0 : 15;
  const discount = appliedCoupon?.discount || 0;
  const total = subtotal + SHIPPING - discount;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      setCouponLoading(true);
      const res = await api.post("/coupons/validate", { code: couponCode.trim(), amount: subtotal });
      const data = res?.data || res;
      setAppliedCoupon(data);
    } catch (err) {
      alert(err.message || "Invalid coupon code");
    } finally {
      setCouponLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 px-4 bg-white text-center">
        <div className="w-20 h-20 bg-[#F9F9F9] border border-[#E5E5E5] flex items-center justify-center">
          <ShoppingBag className="w-8 h-8 text-[#999999]" strokeWidth={1} />
        </div>
        <div>
          <h2 className="text-2xl font-light uppercase tracking-wider text-[#111111] mb-2">Your Cart is Empty</h2>
          <p className="text-xs text-[#666666] mb-6">Add some items from our collection to get started.</p>
          <Link href="/products">
            <Button size="lg" className="flex items-center gap-2">
              Browse Collection
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 pb-4 border-b border-[#E5E5E5]">
          <h1 className="text-3xl font-light uppercase tracking-wider text-[#111111]">Shopping Cart</h1>
          <p className="text-xs text-[#666666] mt-1">{items.length} item{items.length > 1 ? "s" : ""} in your cart</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Cart Items List */}
          <div className="lg:col-span-2 flex flex-col divide-y divide-[#E5E5E5]">
            {items.map((item) => (
              <div key={item.key} className="py-6 flex gap-5">
                <div className="relative w-24 aspect-[3/4] bg-[#F9F9F9] border border-[#E5E5E5] flex-shrink-0">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h3 className="text-xs font-semibold text-[#111111]">{item.title}</h3>
                      {item.variant && (
                        <p className="text-[11px] text-[#666666] mt-0.5">{item.variant.name}</p>
                      )}
                    </div>
                    <button
                      onClick={() => removeItem(item.key)}
                      className="text-[#999999] hover:text-red-500 transition-colors p-1"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <QuantitySelector
                      quantity={item.quantity}
                      onDecrease={() => updateQuantity(item.key, item.quantity - 1)}
                      onIncrease={() => updateQuantity(item.key, item.quantity + 1)}
                    />
                    <span className="text-sm font-bold text-[#111111]">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Coupon Section */}
            <div className="py-6">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-[#666666]" />
                <span className="text-xs font-semibold uppercase tracking-wider text-[#111111]">Discount Code</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter code e.g. SAVE10"
                  className="flex-1 border border-[#E5E5E5] px-3.5 py-2 text-xs focus:outline-none focus:border-[#111111] uppercase"
                />
                <Button
                  onClick={handleApplyCoupon}
                  isLoading={couponLoading}
                  disabled={!couponCode}
                  variant="outline"
                  size="md"
                >
                  Apply
                </Button>
              </div>
              {appliedCoupon && (
                <p className="mt-2 text-xs text-emerald-600 font-semibold">
                  ✓ Code &quot;{appliedCoupon.code}&quot; applied — you saved ${appliedCoupon.discount?.toFixed(2)}
                </p>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-[#F9F9F9] border border-[#E5E5E5] p-6 sticky top-24 flex flex-col gap-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#111111] border-b border-[#E5E5E5] pb-3">
                Order Summary
              </h2>

              <div className="flex flex-col gap-2 text-xs">
                <div className="flex justify-between text-[#666666]">
                  <span>Subtotal ({items.length} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#666666]">
                  <span>Shipping</span>
                  <span>{SHIPPING === 0 ? "FREE" : `$${SHIPPING.toFixed(2)}`}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Coupon ({appliedCoupon?.code})</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between font-bold text-[#111111] pt-3 border-t border-[#E5E5E5] text-sm">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <Link href="/checkout" className="w-full">
                <Button fullWidth size="lg" className="flex items-center justify-center gap-2">
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>

              <Link href="/products" className="w-full">
                <Button fullWidth variant="outline" size="md">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;