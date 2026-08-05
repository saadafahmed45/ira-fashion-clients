"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import {
  ChevronDown,
  ChevronUp,
  Search,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  Trash2,
  MapPin,
  Phone,
} from "lucide-react";

const STATUS_OPTIONS = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
const PAYMENT_STATUS = ["pending", "paid", "failed", "refunded"];

const statusStyles = {
  pending:    { bg: "bg-amber-50 text-amber-700 border-amber-200",    dot: "bg-amber-400",   Icon: Clock },
  confirmed:  { bg: "bg-blue-50 text-blue-700 border-blue-200",       dot: "bg-blue-400",    Icon: Package },
  processing: { bg: "bg-indigo-50 text-indigo-700 border-indigo-200", dot: "bg-indigo-400",  Icon: Package },
  shipped:    { bg: "bg-purple-50 text-purple-700 border-purple-200", dot: "bg-purple-400",  Icon: Truck },
  delivered:  { bg: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-400", Icon: CheckCircle },
  cancelled:  { bg: "bg-red-50 text-red-600 border-red-200",          dot: "bg-red-400",     Icon: XCircle },
};

function StatusBadge({ status }) {
  const { bg, dot } = statusStyles[status] || statusStyles.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border ${bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {status}
    </span>
  );
}

export default function AdminOrdersPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const { data: response, isLoading } = useQuery({
    queryKey: ["admin-orders", { page, status: statusFilter, search }],
    queryFn: async () => {
      const params = { page, limit: 15 };
      if (statusFilter) params.status = statusFilter;
      if (search) params.search = search;
      const res = await api.get("/orders", { params });
      return res;
    },
    keepPreviousData: true,
  });

  const statusMutation = useMutation({
    mutationFn: ({ orderId, status, paymentStatus }) =>
      api.patch(`/orders/${orderId}/status`, { status, paymentStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    },
    onError: (err) => alert(err.message || "Failed to update status"),
  });

  const deleteMutation = useMutation({
    mutationFn: (orderId) => api.delete(`/orders/${orderId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      setDeletingId(null);
    },
    onError: (err) => {
      alert(err.message || "Failed to delete order");
      setDeletingId(null);
    },
  });

  const orders = response?.data || [];
  const meta = response?.meta || {};

  return (
    <div className="p-6 lg:p-8 bg-[#F9F9F9] min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 border border-[#E5E5E5]">
          <div>
            <h1 className="text-xl font-light uppercase tracking-wider text-[#111111]">
              Order <span className="font-semibold">Management</span>
            </h1>
            <p className="text-xs text-[#666666] mt-0.5">
              {meta.total ?? 0} total orders — manage fulfilment, status, and payments
            </p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white border border-[#E5E5E5] p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="flex items-center gap-2 border border-[#E5E5E5] px-3 py-2 flex-1 min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-[#999999]" />
            <input
              type="text"
              placeholder="Search order #, customer name, email…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="flex-1 text-xs text-[#111111] placeholder:text-[#BBBBBB] focus:outline-none bg-transparent"
            />
          </div>

          {/* Status Filter Pills */}
          <div className="flex gap-2 flex-wrap">
            {["", ...STATUS_OPTIONS].map((s) => (
              <button
                key={s}
                onClick={() => { setStatusFilter(s); setPage(1); }}
                className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider border transition ${
                  statusFilter === s
                    ? "bg-[#111111] text-white border-[#111111]"
                    : "border-[#E5E5E5] text-[#666666] hover:border-[#111111] hover:text-[#111111]"
                }`}
              >
                {s || "All"}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white border border-[#E5E5E5] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-[#F9F9F9] border-b border-[#E5E5E5] text-[#666666] uppercase tracking-wider">
                  <th className="text-left px-5 py-3 font-semibold w-4"></th>
                  <th className="text-left px-5 py-3 font-semibold">Order #</th>
                  <th className="text-left px-5 py-3 font-semibold">Customer</th>
                  <th className="text-left px-5 py-3 font-semibold">Items</th>
                  <th className="text-left px-5 py-3 font-semibold">Total</th>
                  <th className="text-left px-5 py-3 font-semibold">Status</th>
                  <th className="text-left px-5 py-3 font-semibold">Payment</th>
                  <th className="text-left px-5 py-3 font-semibold">Date</th>
                  <th className="text-left px-5 py-3 font-semibold">Update</th>
                  <th className="px-5 py-3 font-semibold"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F9F9F9]">
                {isLoading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 9 }).map((__, j) => (
                        <td key={j} className="px-5 py-4">
                          <div className="h-3 bg-[#F9F9F9] animate-pulse rounded" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="text-center py-16 text-[#999999]">
                      <Package className="w-8 h-8 mx-auto mb-2 text-[#E5E5E5]" />
                      No orders found
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <React.Fragment key={order._id}>
                      <tr className="hover:bg-[#FAFAFA] transition-colors group">
                        {/* Expand Toggle */}
                        <td className="px-5 py-4">
                          <button
                            onClick={() => setExpandedId(expandedId === order._id ? null : order._id)}
                            className="text-[#999999] hover:text-[#111111] transition-colors"
                          >
                            {expandedId === order._id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        </td>

                        {/* Order # */}
                        <td className="px-5 py-4">
                          <span className="font-mono font-bold text-[#111111]">{order.orderNumber}</span>
                        </td>

                        {/* Customer */}
                        <td className="px-5 py-4">
                          <p className="font-semibold text-[#111111]">{order.customer?.name}</p>
                          <p className="text-[#999999] text-[10px]">{order.customer?.email}</p>
                        </td>

                        {/* Items */}
                        <td className="px-5 py-4 text-[#666666]">
                          {order.products?.length ?? 0} item{(order.products?.length ?? 0) !== 1 ? "s" : ""}
                        </td>

                        {/* Total */}
                        <td className="px-5 py-4 font-bold text-[#111111]">
                          ${(order.pricing?.total ?? 0).toFixed(2)}
                        </td>

                        {/* Status Badge */}
                        <td className="px-5 py-4">
                          <StatusBadge status={order.status} />
                        </td>

                        {/* Payment Method */}
                        <td className="px-5 py-4 text-[#666666] capitalize">
                          {order.paymentMethod}
                          <span className={`ml-1.5 text-[10px] font-semibold ${
                            order.paymentStatus === "paid" ? "text-emerald-600" :
                            order.paymentStatus === "failed" ? "text-red-500" : "text-amber-500"
                          }`}>
                            ({order.paymentStatus})
                          </span>
                        </td>

                        {/* Date */}
                        <td className="px-5 py-4 text-[#999999]">
                          {new Date(order.createdAt).toLocaleDateString("en-GB", {
                            day: "2-digit", month: "short", year: "numeric"
                          })}
                        </td>

                        {/* Status Update Dropdown */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <select
                              value={order.status}
                              onChange={(e) =>
                                statusMutation.mutate({ orderId: order._id, status: e.target.value })
                              }
                              className="text-[10px] border border-[#E5E5E5] px-2 py-1.5 bg-white focus:outline-none focus:border-[#111111] cursor-pointer uppercase font-semibold"
                            >
                              {STATUS_OPTIONS.map((s) => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                            <select
                              value={order.paymentStatus}
                              onChange={(e) =>
                                statusMutation.mutate({ orderId: order._id, paymentStatus: e.target.value })
                              }
                              className="text-[10px] border border-[#E5E5E5] px-2 py-1.5 bg-white focus:outline-none focus:border-[#111111] cursor-pointer"
                            >
                              {PAYMENT_STATUS.map((s) => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </div>
                        </td>

                        {/* Delete */}
                        <td className="px-5 py-4">
                          {deletingId === order._id ? (
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-red-500 font-semibold">Confirm?</span>
                              <button
                                onClick={() => deleteMutation.mutate(order._id)}
                                disabled={deleteMutation.isPending}
                                className="text-[10px] font-bold text-red-600 hover:underline"
                              >
                                {deleteMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : "Yes"}
                              </button>
                              <button
                                onClick={() => setDeletingId(null)}
                                className="text-[10px] text-[#666666] hover:underline"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeletingId(order._id)}
                              className="opacity-0 group-hover:opacity-100 text-[#CCCCCC] hover:text-red-500 transition-all p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>

                      {/* Expandable Detail Row */}
                      {expandedId === order._id && (
                        <tr>
                          <td colSpan={10} className="bg-[#FAFAFA] border-t border-b border-[#E5E5E5] px-8 py-5">
                            <div className="grid md:grid-cols-3 gap-6 text-xs">
                              {/* Products */}
                              <div>
                                <p className="font-bold uppercase tracking-wider text-[#111111] mb-3">
                                  Order Items
                                </p>
                                <div className="space-y-2">
                                  {order.products?.map((p, i) => (
                                    <div key={i} className="flex items-center justify-between gap-2 bg-white border border-[#E5E5E5] px-3 py-2">
                                      <div>
                                        <p className="font-semibold text-[#111111] line-clamp-1">{p.title}</p>
                                        {p.variant?.name && (
                                          <p className="text-[10px] text-[#999999]">{p.variant.name}</p>
                                        )}
                                      </div>
                                      <div className="text-right flex-shrink-0">
                                        <p className="font-bold text-[#111111]">${(p.price * (p.quantity || 1)).toFixed(2)}</p>
                                        <p className="text-[10px] text-[#999999]">× {p.quantity || 1}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Shipping Address */}
                              <div>
                                <p className="font-bold uppercase tracking-wider text-[#111111] mb-3">
                                  Shipping Details
                                </p>
                                <div className="space-y-1.5 text-[#666666]">
                                  <div className="flex items-start gap-1.5">
                                    <MapPin className="w-3.5 h-3.5 mt-0.5 text-[#999999] flex-shrink-0" />
                                    <div>
                                      <p>{order.shippingAddress?.street}</p>
                                      <p>{order.shippingAddress?.city}
                                        {order.shippingAddress?.state && `, ${order.shippingAddress.state}`}
                                        {order.shippingAddress?.zip && ` ${order.shippingAddress.zip}`}
                                      </p>
                                      <p>{order.shippingAddress?.country}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <Phone className="w-3.5 h-3.5 text-[#999999]" />
                                    <span>{order.customer?.phone}</span>
                                  </div>
                                </div>
                                {order.notes && (
                                  <div className="mt-3">
                                    <p className="font-semibold text-[#111111] mb-1">Order Notes</p>
                                    <p className="text-[#666666] italic">{order.notes}</p>
                                  </div>
                                )}
                              </div>

                              {/* Pricing Summary */}
                              <div>
                                <p className="font-bold uppercase tracking-wider text-[#111111] mb-3">
                                  Pricing Summary
                                </p>
                                <div className="space-y-2 bg-white border border-[#E5E5E5] p-3">
                                  <div className="flex justify-between text-[#666666]">
                                    <span>Subtotal</span>
                                    <span>${(order.pricing?.subtotal ?? 0).toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between text-[#666666]">
                                    <span>Shipping</span>
                                    <span>{order.pricing?.shipping > 0 ? `$${order.pricing.shipping.toFixed(2)}` : "FREE"}</span>
                                  </div>
                                  {(order.pricing?.discount ?? 0) > 0 && (
                                    <div className="flex justify-between text-emerald-600">
                                      <span>Discount</span>
                                      <span>-${order.pricing.discount.toFixed(2)}</span>
                                    </div>
                                  )}
                                  <div className="flex justify-between font-bold text-[#111111] pt-2 border-t border-[#E5E5E5]">
                                    <span>Total</span>
                                    <span>${(order.pricing?.total ?? 0).toFixed(2)}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {meta.totalPages > 1 && (
            <div className="border-t border-[#E5E5E5] px-5 py-3 flex items-center justify-between">
              <span className="text-xs text-[#666666]">
                Page {meta.page} of {meta.totalPages} ({meta.total} orders)
              </span>
              <div className="flex gap-2">
                <button
                  disabled={!meta.hasPrevPage}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-1.5 text-[10px] font-bold uppercase border border-[#E5E5E5] disabled:opacity-30 hover:border-[#111111] transition"
                >
                  Previous
                </button>
                <button
                  disabled={!meta.hasNextPage}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1.5 text-[10px] font-bold uppercase border border-[#E5E5E5] disabled:opacity-30 hover:border-[#111111] transition"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
