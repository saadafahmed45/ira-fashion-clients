"use client";

import React, { useState } from "react";
import { Search, CheckCircle2 } from "lucide-react";
import { useAllOrders, useUpdateOrderStatus } from "@/hooks/useOrders";
import { formatPrice, formatDate } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import Skeleton from "@/components/ui/Skeleton";

export default function DashboardOrdersPage() {
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [msg, setMsg] = useState("");

  const { data: ordersData, isLoading, refetch } = useAllOrders({
    status: statusFilter,
    search,
    page,
    limit: 15,
  });

  const updateOrderStatusMutation = useUpdateOrderStatus();

  const orders = ordersData?.data || [];
  const meta = ordersData?.meta || { total: 0, page: 1, totalPages: 1 };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatusMutation.mutateAsync({
        id: orderId,
        orderStatus: newStatus,
      });
      setMsg(`Order #${orderId.slice(-8).toUpperCase()} updated to ${newStatus}`);
      refetch();
      setTimeout(() => setMsg(""), 4000);
    } catch (err) {
      alert(err.message || "Failed to update order status");
    }
  };

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
    <div className="p-6 sm:p-10 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-gray-400 font-semibold block mb-1">
            Fulfillment & Logistics
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-gray-900 font-bold uppercase tracking-wider">
            Order Processing
          </h1>
        </div>

        <span className="text-xs text-gray-500 font-medium">
          Total Orders Recorded: {meta.total}
        </span>
      </div>

      {msg && (
        <div className="p-3 bg-emerald-50 text-emerald-800 text-xs border border-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{msg}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white p-4 border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by phone, city..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 text-xs focus:outline-none focus:border-gray-900"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-auto px-3 py-2 bg-gray-50 border border-gray-200 text-xs text-gray-700 focus:outline-none"
          >
            <option value="">All Fulfillment Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 shadow-xs overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50/70 border-b border-gray-100 text-gray-400 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="px-6 py-3 font-semibold">Order ID</th>
              <th className="px-6 py-3 font-semibold">Client & Phone</th>
              <th className="px-6 py-3 font-semibold">Delivery City</th>
              <th className="px-6 py-3 font-semibold">Method / Pay</th>
              <th className="px-6 py-3 font-semibold">Amount (৳)</th>
              <th className="px-6 py-3 font-semibold">Status Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                  Loading orders...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-mono font-semibold text-gray-900">
                      #{o._id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-[11px] text-gray-400">{formatDate(o.createdAt)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900">{o.user?.name || "Customer"}</p>
                    <p className="text-[11px] text-gray-500">{o.shippingAddress?.phone}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    <p className="font-medium text-gray-900">{o.shippingAddress?.city}</p>
                    <p className="text-[11px] text-gray-400 truncate max-w-xs">{o.shippingAddress?.street}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900">{o.paymentMethod}</span>
                    <span className="text-[11px] text-gray-500 block">({o.paymentStatus})</span>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">
                    {formatPrice(o.totalPrice)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusBadgeVariant(o.orderStatus)}>
                        {o.orderStatus}
                      </Badge>

                      {/* Status changer select */}
                      <select
                        value={o.orderStatus}
                        onChange={(e) => handleStatusChange(o._id, e.target.value)}
                        className="py-1 px-2 text-[11px] bg-gray-50 border border-gray-200 text-gray-800 rounded focus:outline-none"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
          <span>Page {meta.page} of {meta.totalPages}</span>
          <div className="flex gap-2">
            <button
              disabled={meta.page <= 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1.5 border border-gray-200 hover:bg-gray-50 disabled:opacity-40"
            >
              Previous
            </button>
            <button
              disabled={meta.page >= meta.totalPages}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1.5 border border-gray-200 hover:bg-gray-50 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
