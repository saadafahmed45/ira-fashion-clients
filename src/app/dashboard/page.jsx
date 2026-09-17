"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { DollarSign, ShoppingBag, Package, Users, ArrowUpRight, TrendingUp } from "lucide-react";
import api from "@/lib/api";
import { formatPrice, formatDate } from "@/lib/utils";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import Badge from "@/components/ui/Badge";
import Skeleton from "@/components/ui/Skeleton";

export default function DashboardOverviewPage() {
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ["adminAnalytics"],
    queryFn: async () => {
      const res = await api.get("/users/admin/analytics");
      return res.data;
    },
  });

  const summary = analyticsData?.summary || {
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
  };

  const recentOrders = analyticsData?.recentOrders || [];
  const chartData = analyticsData?.chartData || [];

  const cards = [
    {
      title: "Total Revenue",
      value: formatPrice(summary.totalRevenue),
      subtitle: "Gross non-cancelled volume",
      icon: DollarSign,
      color: "text-emerald-600 bg-emerald-50",
      href: "/dashboard/orders",
    },
    {
      title: "Total Orders",
      value: summary.totalOrders,
      subtitle: "All customer checkouts",
      icon: ShoppingBag,
      color: "text-amber-600 bg-amber-50",
      href: "/dashboard/orders",
    },
    {
      title: "Active Products",
      value: summary.totalProducts,
      subtitle: "Catalog inventory items",
      icon: Package,
      color: "text-indigo-600 bg-indigo-50",
      href: "/dashboard/products",
    },
    {
      title: "Customers",
      value: summary.totalUsers,
      subtitle: "Registered client accounts",
      icon: Users,
      color: "text-sky-600 bg-sky-50",
      href: "/dashboard/customers",
    },
  ];

  return (
    <div className="p-6 sm:p-10 space-y-10 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-gray-400 font-semibold block mb-1">
            Store Performance Console
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-gray-900 font-bold uppercase tracking-wider">
            Dashboard Overview
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/products"
            className="px-4 py-2 bg-gray-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-gray-800 transition-colors"
          >
            + Add Product
          </Link>
          <Link
            href="/dashboard/orders"
            className="px-4 py-2 border border-gray-300 text-gray-800 text-xs font-semibold uppercase tracking-wider hover:bg-gray-50 transition-colors"
          >
            View Orders
          </Link>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <Link
              key={i}
              href={card.href}
              className="bg-white p-6 border border-gray-100 shadow-xs flex flex-col justify-between hover:border-gray-300 transition-colors group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 group-hover:text-gray-900 transition-colors">
                  {card.title}
                </span>
                <div className={`p-2 rounded-xs ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-bold text-gray-900 tracking-tight">
                  {isLoading ? <Skeleton className="h-8 w-24" /> : card.value}
                </span>
                <p className="text-[11px] text-gray-400 mt-1">{card.subtitle}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Analytics Charts */}
      <div>
        <DashboardCharts chartData={chartData} />
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white border border-gray-100 shadow-xs">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-900">
              Recent Customer Orders
            </h3>
            <p className="text-[11px] text-gray-500">Latest transactions placed in store</p>
          </div>
          <Link
            href="/dashboard/orders"
            className="text-xs font-semibold text-gray-900 hover:underline uppercase tracking-wider flex items-center gap-1"
          >
            All Orders <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/70 border-b border-gray-100 text-gray-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-6 py-3 font-semibold">Order ID</th>
                <th className="px-6 py-3 font-semibold">Customer</th>
                <th className="px-6 py-3 font-semibold">Date</th>
                <th className="px-6 py-3 font-semibold">Payment</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                    Loading recent orders...
                  </td>
                </tr>
              ) : recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No orders recorded yet.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-gray-900">
                      #{order._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{order.user?.name || "Customer"}</p>
                      <p className="text-[11px] text-gray-400">{order.user?.email}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{formatDate(order.createdAt)}</td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-700">{order.paymentMethod}</span>{" "}
                      <span className="text-[11px] text-gray-400">({order.paymentStatus})</span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          order.orderStatus === "Delivered"
                            ? "success"
                            : order.orderStatus === "Processing"
                            ? "info"
                            : order.orderStatus === "Shipped"
                            ? "purple"
                            : "warning"
                        }
                      >
                        {order.orderStatus}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-gray-900">
                      {formatPrice(order.totalPrice)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
