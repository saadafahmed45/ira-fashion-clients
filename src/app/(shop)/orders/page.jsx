"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Package, Clock, CheckCircle2, Truck, XCircle, ArrowRight } from "lucide-react";
import { useMyOrders } from "@/hooks/useOrders";
import { useAuthStore } from "@/store/authStore";
import { formatPrice, formatDate } from "@/lib/utils";
import Skeleton from "@/components/ui/Skeleton";
import Badge from "@/components/ui/Badge";

export default function OrdersPage() {
  const { isAuthenticated } = useAuthStore();
  const { data: ordersData, isLoading } = useMyOrders();

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4 text-gray-400">
          <Package className="w-8 h-8 stroke-1" />
        </div>
        <h1 className="font-serif text-2xl text-gray-900 mb-2">Track Your Orders</h1>
        <p className="text-xs text-gray-500 mb-6">
          Please sign in to view your order history and live delivery statuses.
        </p>
        <Link
          href="/login?redirect=/orders"
          className="inline-block px-6 py-2.5 bg-gray-900 text-white text-xs uppercase tracking-wider font-semibold hover:bg-gray-800 transition-colors"
        >
          Sign In to Account
        </Link>
      </div>
    );
  }

  const orders = ordersData?.data || [];

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "Delivered":
        return "success";
      case "Shipped":
        return "purple";
      case "Processing":
        return "info";
      case "Cancelled":
        return "danger";
      default:
        return "warning";
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="border-b border-gray-100 pb-6 mb-8">
        <span className="text-[10px] uppercase tracking-[0.25em] text-gray-400 block mb-1">
          Account Dashboard
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl text-gray-900 font-bold uppercase tracking-wider">
          My Order History
        </h1>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 border border-gray-100 p-8">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3 stroke-1" />
          <h3 className="font-serif text-lg text-gray-900 mb-1">No Orders Yet</h3>
          <p className="text-xs text-gray-500 mb-6">
            You haven&apos;t placed any orders with Ira Fashion yet.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-gray-900 text-white text-xs uppercase tracking-wider font-semibold hover:bg-gray-800 transition-colors"
          >
            Start Shopping <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white border border-gray-100 shadow-xs overflow-hidden"
            >
              {/* Order Header */}
              <div className="bg-gray-50/70 px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-6">
                  <div>
                    <span className="text-gray-400 text-[10px] uppercase tracking-wider block">
                      Order ID
                    </span>
                    <span className="font-semibold text-gray-900">
                      #{order._id.slice(-8).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px] uppercase tracking-wider block">
                      Date Placed
                    </span>
                    <span className="font-medium text-gray-700">
                      {formatDate(order.createdAt)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px] uppercase tracking-wider block">
                      Payment
                    </span>
                    <span className="font-medium text-gray-700">
                      {order.paymentMethod} ({order.paymentStatus})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant={getStatusBadgeVariant(order.orderStatus)}>
                    {order.orderStatus}
                  </Badge>
                  <span className="text-sm font-bold text-gray-900">
                    {formatPrice(order.totalPrice)}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6 divide-y divide-gray-100">
                {order.orderItems?.map((item, idx) => (
                  <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="relative w-14 h-18 bg-gray-50 border border-gray-100 flex-shrink-0 overflow-hidden">
                        {item.image && (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-gray-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-gray-500">
                          Qty: {item.quantity} × {formatPrice(item.price)}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-gray-900">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Delivery Address & Status Progress */}
              <div className="px-6 py-4 bg-gray-50/40 border-t border-gray-100 text-[11px] text-gray-500 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="font-semibold text-gray-700">Shipping to:</span>{" "}
                  {order.shippingAddress?.street}, {order.shippingAddress?.city}{" "}
                  (Phone: {order.shippingAddress?.phone})
                </div>
                {order.deliveredAt && (
                  <span className="text-emerald-700 font-medium">
                    Delivered on {formatDate(order.deliveredAt)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
