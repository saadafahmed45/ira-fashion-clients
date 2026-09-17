"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import CheckoutForm from "@/components/shop/CheckoutForm";

export default function CheckoutPage() {
  const { items } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4 text-gray-400">
          <ShoppingBag className="w-8 h-8 stroke-1" />
        </div>
        <h1 className="font-serif text-2xl text-gray-900 mb-2">No Items in Bag</h1>
        <p className="text-xs text-gray-500 mb-6">
          Please add items to your shopping bag before proceeding to checkout.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white text-xs uppercase tracking-wider font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Store
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="border-b border-gray-100 pb-6 mb-8 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-gray-400 block mb-1">
            Secure Order Checkout
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-gray-900 font-bold uppercase tracking-wider">
            Express Checkout
          </h1>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1 border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Cash on Delivery (COD) Active</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <CheckoutForm />
      </div>
    </div>
  );
}
