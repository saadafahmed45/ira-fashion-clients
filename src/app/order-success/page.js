"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import api from "@/lib/api";
import { CheckCircle2, Package, Truck, ArrowRight, ShoppingBag, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderNumber = searchParams.get("orderNumber");

  const { data: response, isLoading, isError } = useQuery({
    queryKey: ["order-success", orderNumber],
    queryFn: async () => {
      if (!orderNumber) return null;
      const res = await api.get(`/orders/track/${orderNumber}`);
      return res.data || res;
    },
    enabled: !!orderNumber,
  });

  const order = response;

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* Confirmation Header Banner */}
        <div className="bg-white border border-[#E5E5E5] p-8 md:p-12 text-center flex flex-col items-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            Order Confirmed
          </span>

          <h1 className="text-2xl md:text-3xl font-light uppercase tracking-wider text-[#111111]">
            Thank You For Your Order!
          </h1>

          <p className="text-xs text-[#666666] leading-relaxed max-w-md">
            Your order has been placed successfully. We are preparing your items for delivery.
          </p>

          {orderNumber && (
            <div className="bg-[#FAF9F6] border border-[#E5E5E5] px-6 py-3 rounded-sm flex items-center gap-3 mt-2">
              <span className="text-xs text-[#666666]">Order Number:</span>
              <span className="font-mono font-bold text-sm text-[#111111]">{orderNumber}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            {orderNumber && (
              <Button
                onClick={() => router.push(`/track-order?orderNumber=${orderNumber}`)}
                variant="primary"
                size="lg"
                className="flex items-center gap-2 text-xs uppercase tracking-wider"
              >
                <Truck className="w-4 h-4" /> Track Order Status
              </Button>
            )}

            <Button
              onClick={() => router.push("/products")}
              variant="outline"
              size="lg"
              className="flex items-center gap-2 text-xs uppercase tracking-wider"
            >
              <ShoppingBag className="w-4 h-4" /> Continue Shopping
            </Button>
          </div>
        </div>

        {/* Order Breakdown Details */}
        {isLoading ? (
          <div className="bg-white border border-[#E5E5E5] p-8 text-center text-xs text-[#999999] animate-pulse">
            Loading receipt details...
          </div>
        ) : order ? (
          <div className="bg-white border border-[#E5E5E5] divide-y divide-[#E5E5E5] shadow-sm">
            {/* Items Purchased */}
            <div className="p-6 md:p-8 space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#111111] flex items-center gap-2">
                <Package className="w-4 h-4 text-[#111111]" /> Items Ordered ({order.products?.length || 0})
              </h2>

              <div className="divide-y divide-[#F5F5F5]">
                {order.products?.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {item.image && (
                        <div className="relative w-12 h-16 bg-[#F5F5F5] flex-shrink-0">
                          <Image src={item.image} alt={item.title} fill className="object-cover" />
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-semibold text-[#111111]">{item.title}</p>
                        {item.variant?.name && (
                          <p className="text-[10px] text-[#888888]">{item.variant.name}</p>
                        )}
                        <p className="text-[11px] text-[#666666]">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#111111]">
                      ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery & Address */}
            <div className="p-6 md:p-8 grid md:grid-cols-2 gap-6 text-xs">
              <div>
                <h3 className="font-bold uppercase tracking-wider text-[#111111] mb-2 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> Shipping Address
                </h3>
                <p className="font-semibold text-[#111111]">{order.customer?.name}</p>
                <p className="text-[#666666]">{order.shippingAddress?.street}</p>
                <p className="text-[#666666]">
                  {order.shippingAddress?.city}{order.shippingAddress?.zip ? `, ${order.shippingAddress.zip}` : ""}
                </p>
                <p className="text-[#666666]">{order.shippingAddress?.country || "Bangladesh"}</p>
                <p className="text-[#888888] mt-2">Phone: {order.customer?.phone}</p>
              </div>

              <div>
                <h3 className="font-bold uppercase tracking-wider text-[#111111] mb-2 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Summary & Payment
                </h3>
                <div className="space-y-1.5 text-[#666666]">
                  <div className="flex justify-between">
                    <span>Payment Method:</span>
                    <span className="uppercase font-semibold text-[#111111]">{order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Status:</span>
                    <span className="capitalize font-semibold text-amber-600">{order.paymentStatus}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${(order.pricing?.subtotal || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>{order.pricing?.shipping > 0 ? `$${order.pricing.shipping.toFixed(2)}` : "FREE"}</span>
                  </div>
                  <div className="flex justify-between font-bold text-[#111111] pt-2 border-t border-[#E5E5E5] text-sm">
                    <span>Total Paid:</span>
                    <span>${(order.pricing?.total || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}

      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-8 text-xs text-[#999999]">
        Loading order confirmation...
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
