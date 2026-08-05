"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import api from "@/lib/api";
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Mail,
  AlertCircle,
  ShoppingBag,
  HelpCircle,
  ChevronRight,
  ListFilter,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

const STEPS = [
  { key: "pending", label: "Order Placed", desc: "We received your order", icon: Clock },
  { key: "confirmed", label: "Confirmed", desc: "Order details verified", icon: CheckCircle2 },
  { key: "processing", label: "Processing", desc: "Packing & quality check", icon: Package },
  { key: "shipped", label: "Out for Delivery", desc: "On the way to your doorstep", icon: Truck },
  { key: "delivered", label: "Delivered", desc: "Package handed over", icon: CheckCircle2 },
];

function getStepIndex(status) {
  switch (status?.toLowerCase()) {
    case "pending": return 0;
    case "confirmed": return 1;
    case "processing": return 2;
    case "shipped": return 3;
    case "delivered": return 4;
    case "cancelled": return -1;
    default: return 0;
  }
}

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialQuery = searchParams.get("query") || searchParams.get("orderNumber") || "";
  const [searchInput, setSearchInput] = useState(initialQuery);
  const [activeQuery, setActiveQuery] = useState(initialQuery);
  const [selectedOrderIndex, setSelectedOrderIndex] = useState(0);

  const { data: responseData, isLoading, isError, error } = useQuery({
    queryKey: ["track-order", activeQuery],
    queryFn: async () => {
      if (!activeQuery.trim()) return null;
      const res = await api.get(`/orders/track/${encodeURIComponent(activeQuery.trim())}`);
      return res.data || res;
    },
    enabled: !!activeQuery.trim(),
    retry: false,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setActiveQuery(searchInput.trim());
    setSelectedOrderIndex(0);
    router.push(`/track-order?query=${encodeURIComponent(searchInput.trim())}`);
  };

  // Determine if single order or array of orders returned
  const isMultiple = Array.isArray(responseData);
  const orderList = isMultiple ? responseData : (responseData ? [responseData] : []);
  const activeOrder = orderList[selectedOrderIndex] || null;
  const currentStep = getStepIndex(activeOrder?.status);

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Page Header */}
        <div className="text-center space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#666666]">
            Live Order Tracking
          </span>
          <h1 className="text-3xl font-light uppercase tracking-wider text-[#111111]">
            Track Your Shipment
          </h1>
          <p className="text-xs text-[#666666] max-w-md mx-auto leading-relaxed">
            Search by your <span className="font-bold text-[#111111]">Order Number</span> (e.g. IRA-948123), <span className="font-bold text-[#111111]">Email Address</span>, <span className="font-bold text-[#111111]">Phone Number</span>, or <span className="font-bold text-[#111111]">Order ID</span>.
          </p>
        </div>

        {/* Search Input Form */}
        <form onSubmit={handleSearch} className="bg-white border border-[#E5E5E5] p-4 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#999999]" />
              <input
                type="text"
                placeholder="Enter Order #, Email, Phone, or Order ID…"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-xs text-[#111111] placeholder:text-[#AAAAAA] bg-[#FAF9F6] border border-[#E5E5E5] focus:outline-none focus:border-[#111111]"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full sm:w-auto px-8 py-3 text-xs uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <Search className="w-3.5 h-3.5" /> Track Order
            </Button>
          </div>
        </form>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white border border-[#E5E5E5] p-12 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-[#111111] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-[#666666]">Locating shipment details...</p>
          </div>
        )}

        {/* Error / Not Found State */}
        {isError && (
          <div className="bg-white border border-red-200 p-8 text-center space-y-4 shadow-sm">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
            <div>
              <h3 className="text-sm font-bold text-[#111111]">No Order Found</h3>
              <p className="text-xs text-[#666666] mt-1 max-w-md mx-auto">
                No orders match <span className="font-mono font-bold text-[#111111]">"{activeQuery}"</span>. Please double check your order number, email address, or phone number and try again.
              </p>
            </div>
          </div>
        )}

        {/* Multiple Orders Selector (if searching by Email or Phone) */}
        {isMultiple && orderList.length > 1 && (
          <div className="bg-white border border-[#E5E5E5] p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111] flex items-center gap-2">
                <ListFilter className="w-4 h-4" /> Multiple Orders Found ({orderList.length})
              </h3>
              <span className="text-[11px] text-[#888888]">Select an order to view live timeline</span>
            </div>

            <div className="grid gap-2">
              {orderList.map((ord, idx) => (
                <button
                  key={ord._id}
                  onClick={() => setSelectedOrderIndex(idx)}
                  className={`p-4 border text-left flex flex-wrap items-center justify-between gap-3 transition-colors ${
                    selectedOrderIndex === idx
                      ? "border-[#111111] bg-[#FAF9F6]"
                      : "border-[#E5E5E5] bg-white hover:border-[#CCCCCC]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-xs text-[#111111]">{ord.orderNumber}</span>
                    <span className="text-[10px] uppercase font-semibold px-2 py-0.5 border border-[#E5E5E5] bg-white">
                      {ord.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-[#666666]">
                    <span>{ord.products?.length || 0} items</span>
                    <span className="font-bold text-[#111111]">${(ord.pricing?.total || 0).toFixed(2)}</span>
                    <span className="text-[10px] text-[#888888]">{new Date(ord.createdAt).toLocaleDateString()}</span>
                    <ChevronRight className="w-4 h-4 text-[#999999]" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Cancelled Order Notice */}
        {activeOrder?.status === "cancelled" && (
          <div className="bg-red-50 border border-red-200 p-6 flex items-center gap-4">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-red-700">Order Cancelled</h3>
              <p className="text-xs text-red-600 mt-0.5">
                This order was cancelled. If you believe this is an error or need assistance, please contact support.
              </p>
            </div>
          </div>
        )}

        {/* Active Order Details & Visual Timeline */}
        {activeOrder && activeOrder.status !== "cancelled" && (
          <div className="bg-white border border-[#E5E5E5] shadow-sm overflow-hidden divide-y divide-[#E5E5E5]">
            
            {/* Header summary */}
            <div className="p-6 bg-[#FAF9F6] flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-[#888888] font-bold uppercase tracking-wider block">Order Number</span>
                <span className="font-mono font-bold text-lg text-[#111111]">{activeOrder.orderNumber}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#888888] font-bold uppercase tracking-wider block">Date Placed</span>
                <span className="text-xs font-semibold text-[#111111]">
                  {new Date(activeOrder.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit", month: "short", year: "numeric"
                  })}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#888888] font-bold uppercase tracking-wider block">Est. Delivery</span>
                <span className="text-xs font-semibold text-emerald-600">3 - 5 Business Days</span>
              </div>
            </div>

            {/* Stepper Timeline */}
            <div className="p-8 space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111]">Fulfillment Progress</h3>
              
              <div className="relative">
                {/* Connecting Bar */}
                <div className="hidden md:block absolute top-5 left-[10%] right-[10%] h-[2px] bg-[#E5E5E5] -z-0">
                  <div
                    className="h-full bg-[#111111] transition-all duration-500"
                    style={{ width: `${(Math.max(0, currentStep) / (STEPS.length - 1)) * 100}%` }}
                  />
                </div>

                {/* Steps */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-2 relative z-10">
                  {STEPS.map((step, idx) => {
                    const isCompleted = currentStep >= idx;
                    const isCurrent = currentStep === idx;
                    const StepIcon = step.icon;

                    return (
                      <div key={step.key} className="flex md:flex-col items-center gap-3 md:text-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                            isCurrent
                              ? "bg-[#111111] text-white ring-4 ring-[#111111]/20 scale-110"
                              : isCompleted
                              ? "bg-[#111111] text-white"
                              : "bg-[#F0F0F0] text-[#AAAAAA]"
                          }`}
                        >
                          <StepIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className={`text-xs font-bold uppercase tracking-wider ${isCompleted ? "text-[#111111]" : "text-[#999999]"}`}>
                            {step.label}
                          </p>
                          <p className="text-[10px] text-[#888888] mt-0.5">{step.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Items & Destination details */}
            <div className="p-6 md:p-8 grid md:grid-cols-2 gap-8 text-xs">
              
              {/* Products List */}
              <div className="space-y-4">
                <h4 className="font-bold uppercase tracking-wider text-[#111111] flex items-center gap-2">
                  <Package className="w-4 h-4" /> Package Contents
                </h4>
                <div className="divide-y divide-[#F5F5F5]">
                  {activeOrder.products?.map((item, idx) => (
                    <div key={idx} className="py-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <div className="relative w-10 h-14 bg-[#F5F5F5] flex-shrink-0">
                            <Image src={item.image} alt={item.title} fill className="object-cover" />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-[#111111]">{item.title}</p>
                          {item.variant?.name && <p className="text-[10px] text-[#888888]">{item.variant.name}</p>}
                          <p className="text-[10px] text-[#666666]">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-bold text-[#111111]">
                        ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Destination & Payment Summary */}
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold uppercase tracking-wider text-[#111111] mb-2 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" /> Destination
                  </h4>
                  <div className="space-y-1 text-[#666666]">
                    <p className="font-semibold text-[#111111]">{activeOrder.customer?.name}</p>
                    <p>{activeOrder.shippingAddress?.street}</p>
                    <p>{activeOrder.shippingAddress?.city}{activeOrder.shippingAddress?.zip ? `, ${activeOrder.shippingAddress.zip}` : ""}</p>
                    <p>{activeOrder.shippingAddress?.country || "Bangladesh"}</p>
                    <p className="text-[#888888] mt-1">
                      <Phone className="w-3 h-3 inline mr-1" />
                      {activeOrder.customer?.phone}
                    </p>
                    <p className="text-[#888888]">
                      <Mail className="w-3 h-3 inline mr-1" />
                      {activeOrder.customer?.email}
                    </p>
                  </div>
                </div>

                <div className="bg-[#FAF9F6] border border-[#E5E5E5] p-4 space-y-2">
                  <h4 className="font-bold uppercase tracking-wider text-[#111111]">Payment Details</h4>
                  <div className="flex justify-between text-[#666666]">
                    <span>Payment Method</span>
                    <span className="uppercase font-semibold text-[#111111]">{activeOrder.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between text-[#666666]">
                    <span>Payment Status</span>
                    <span className="capitalize font-semibold text-emerald-600">{activeOrder.paymentStatus}</span>
                  </div>
                  <div className="flex justify-between font-bold text-[#111111] pt-2 border-t border-[#E5E5E5] text-sm">
                    <span>Total Amount</span>
                    <span>${(activeOrder.pricing?.total || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* Customer Support Banner */}
        <div className="bg-white border border-[#E5E5E5] p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#666666]">
          <div className="flex items-center gap-3">
            <HelpCircle className="w-5 h-5 text-[#111111]" />
            <div>
              <p className="font-semibold text-[#111111]">Have questions about your order?</p>
              <p className="text-[11px] text-[#888888]">Our customer care team is available 24/7 to assist with tracking and delivery updates.</p>
            </div>
          </div>
          <Link
            href="/contact"
            className="px-5 py-2.5 border border-[#111111] text-[#111111] font-bold uppercase tracking-wider text-[10px] hover:bg-[#111111] hover:text-white transition"
          >
            Contact Support
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-8 text-xs text-[#999999]">
        Loading order tracking...
      </div>
    }>
      <TrackOrderContent />
    </Suspense>
  );
}
