"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, ArrowRight, ShoppingBag, Tag, CheckCircle2, ArrowLeft } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useValidateCoupon } from "@/hooks/useCoupons";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";

export default function CartPage() {
  const {
    items,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    updateQuantity,
    removeItem,
    clearCart,
    getSubtotal,
    getDiscountAmount,
    getShippingPrice,
    getTotalPrice,
  } = useCartStore();

  const validateCouponMutation = useValidateCoupon();
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const shipping = getShippingPrice();
  const total = getTotalPrice();

  const handleApplyCoupon = async () => {
    setCouponError("");
    if (!couponCode.trim()) return;

    try {
      const res = await validateCouponMutation.mutateAsync({
        code: couponCode.trim(),
        subtotal,
      });
      if (res.success && res.data) {
        applyCoupon(res.data);
        setCouponCode("");
      }
    } catch (err) {
      setCouponError(err.message || "Invalid coupon code");
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4 text-gray-400">
          <ShoppingBag className="w-8 h-8 stroke-1" />
        </div>
        <h1 className="font-serif text-2xl text-gray-900 mb-2">Your Bag is Empty</h1>
        <p className="text-xs text-gray-500 mb-6">
          You have no items in your shopping bag. Explore our artisanal collections.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white text-xs uppercase tracking-wider font-semibold hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="border-b border-gray-100 pb-6 mb-8 flex justify-between items-end">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-gray-400 block mb-1">
            Order Review
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-gray-900 font-bold uppercase tracking-wider">
            Shopping Bag ({items.reduce((acc, i) => acc + i.quantity, 0)})
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-gray-400 hover:text-red-600 transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Items Table / List */}
        <div className="lg:col-span-2 divide-y divide-gray-100">
          {items.map((item) => (
            <div key={item.id} className="py-6 flex gap-6 items-center">
              <div className="relative w-24 h-32 bg-gray-50 flex-shrink-0 border border-gray-100 overflow-hidden">
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                )}
              </div>

              <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <Link
                    href={`/products/${item.slug || item.id}`}
                    className="text-xs font-semibold text-gray-900 hover:text-gray-600 truncate block"
                  >
                    {item.name}
                  </Link>
                  <p className="text-xs font-bold text-gray-900">
                    {formatPrice(item.price)}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-200">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-3 py-1 text-xs text-gray-600 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="px-3 text-xs font-medium text-gray-900 min-w-8 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1 text-xs text-gray-600 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>

                  <span className="text-xs font-semibold text-gray-900 min-w-20 text-right">
                    {formatPrice(item.price * item.quantity)}
                  </span>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="pt-6">
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50/70 border border-gray-100 p-6 space-y-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-900 border-b border-gray-200/60 pb-3">
              Summary
            </h3>

            {/* Promo Code Box */}
            <div className="space-y-2">
              <label className="text-[11px] font-medium uppercase tracking-wider text-gray-600 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-gray-500" /> Promo Code
              </label>

              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{appliedCoupon.code}</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-[11px] font-semibold text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code..."
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="flex-1 px-3 py-1.5 bg-white border border-gray-200 text-xs uppercase focus:outline-none focus:border-gray-900"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={validateCouponMutation.isPending}
                    className="px-4 py-1.5 bg-gray-900 text-white text-xs font-medium uppercase tracking-wider hover:bg-gray-800 disabled:opacity-50"
                  >
                    Apply
                  </button>
                </div>
              )}
              {couponError && (
                <p className="text-[11px] text-red-500">{couponError}</p>
              )}
            </div>

            {/* Calculations */}
            <div className="space-y-2.5 text-xs border-t border-gray-200/60 pt-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900">{formatPrice(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Coupon Discount</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600">
                <span>Estimated Shipping</span>
                <span>{shipping === 0 ? "FREE" : formatPrice(shipping)}</span>
              </div>

              <div className="border-t border-gray-200/60 pt-3 flex justify-between items-baseline text-sm font-bold text-gray-900">
                <span>Total Payable</span>
                <span className="text-base">{formatPrice(total)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="w-full py-3 px-6 bg-gray-900 text-white text-xs font-semibold uppercase tracking-widest hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
