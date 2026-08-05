"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { DollarSign, ShoppingBag, Package, Users, Plus, ShieldAlert, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/features/auth/hooks/useAuth";
import api from "@/lib/api";

const sampleAnalytics = {
  summary: {
    totalRevenue: 14850.0,
    totalOrders: 42,
    totalProducts: 18,
    totalCustomers: 35,
  },
  salesChart: [
    { date: "Mon", sales: 1200, orders: 4 },
    { date: "Tue", sales: 1800, orders: 6 },
    { date: "Wed", sales: 2400, orders: 8 },
    { date: "Thu", sales: 1500, orders: 5 },
    { date: "Fri", sales: 3200, orders: 11 },
    { date: "Sat", sales: 2900, orders: 9 },
    { date: "Sun", sales: 1850, orders: 6 },
  ],
  recentOrders: [
    { _id: "ord-1", orderNumber: "IRA-948123", customer: { name: "Sophia Lauren" }, pricing: { total: 240.0 }, status: "processing" },
    { _id: "ord-2", orderNumber: "IRA-948124", customer: { name: "Alexander Wright" }, pricing: { total: 120.0 }, status: "delivered" },
    { _id: "ord-3", orderNumber: "IRA-948125", customer: { name: "Emma Watson" }, pricing: { total: 395.0 }, status: "pending" },
  ],
};

export default function AdminDashboardPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [data, setData] = useState(sampleAnalytics);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await api.get("/admin/analytics");
        if (res?.data) {
          setData(res.data);
        }
      } catch (err) {
        console.warn("[Admin] Using local analytics fallback:", err.message);
      }
    }
    if (user && isAdmin) {
      fetchAnalytics();
    }
  }, [user, isAdmin]);

  if (authLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3 bg-[#F9F9F9]">
        <Loader2 className="w-8 h-8 text-[#111111] animate-spin" />
        <span className="text-xs uppercase font-semibold tracking-wider text-[#666666]">
          Verifying Admin Credentials...
        </span>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center flex flex-col items-center gap-4">
        <ShieldAlert className="w-12 h-12 text-red-500" />
        <h1 className="text-xl font-bold uppercase text-[#111111]">Admin Access Required</h1>
        <p className="text-xs text-[#666666]">
          You must be logged in as an administrator to view this page. (Logged in as: {user?.email || "Guest"})
        </p>
        <Link href="/login">
          <Button variant="outline" size="md">Login As Admin</Button>
        </Link>
      </div>
    );
  }

  const { summary, salesChart, recentOrders } = data;

  return (
    <div className="min-h-screen bg-[#F9F9F9] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 border border-[#E5E5E5]">
          <div>
            <h1 className="text-2xl font-light uppercase tracking-wider text-[#111111]">
              Shopify <span className="font-semibold">Dashboard</span>
            </h1>
            <p className="text-xs text-[#666666] mt-0.5">Real-time performance analytics & store overview</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/products/create">
              <Button size="md" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Product
              </Button>
            </Link>
          </div>
        </div>

        {/* Overview KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 border border-[#E5E5E5] flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#666666]">Total Revenue</span>
              <h3 className="text-2xl font-bold text-[#111111] mt-1">${summary?.totalRevenue?.toFixed(2)}</h3>
            </div>
            <div className="p-3 bg-[#F9F9F9] text-[#111111] border border-[#E5E5E5]">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-6 border border-[#E5E5E5] flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#666666]">Total Orders</span>
              <h3 className="text-2xl font-bold text-[#111111] mt-1">{summary?.totalOrders}</h3>
            </div>
            <div className="p-3 bg-[#F9F9F9] text-[#111111] border border-[#E5E5E5]">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-6 border border-[#E5E5E5] flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#666666]">Total Products</span>
              <h3 className="text-2xl font-bold text-[#111111] mt-1">{summary?.totalProducts}</h3>
            </div>
            <div className="p-3 bg-[#F9F9F9] text-[#111111] border border-[#E5E5E5]">
              <Package className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-6 border border-[#E5E5E5] flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#666666]">Customers</span>
              <h3 className="text-2xl font-bold text-[#111111] mt-1">{summary?.totalCustomers}</h3>
            </div>
            <div className="p-3 bg-[#F9F9F9] text-[#111111] border border-[#E5E5E5]">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Recharts Analytics Section */}
        <div className="bg-white p-6 border border-[#E5E5E5] flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#111111]">
              Sales Trend (7 Days)
            </h3>
            <span className="text-xs text-[#666666]">Revenue & Volume breakdown</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesChart}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#111111" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#111111" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
                <XAxis dataKey="date" stroke="#666666" fontSize={11} tickLine={false} />
                <YAxis stroke="#666666" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#111111", color: "#FFFFFF", border: "none", fontSize: "11px" }}
                />
                <Area type="monotone" dataKey="sales" stroke="#111111" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="bg-white p-6 border border-[#E5E5E5] flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#111111]">
              Recent Orders
            </h3>
            <Link href="/dashboard/orders" className="text-xs uppercase font-semibold text-[#111111] hover:underline">
              View All Orders
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E5E5E5] bg-[#F9F9F9] uppercase text-[#666666]">
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E5]">
                {recentOrders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-[#F9F9F9]">
                    <td className="py-3 px-4 font-semibold text-[#111111]">{ord.orderNumber}</td>
                    <td className="py-3 px-4 text-[#666666]">{ord.customer?.name}</td>
                    <td className="py-3 px-4 font-medium text-[#111111]">${ord.pricing?.total?.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <Badge variant={ord.status === "delivered" ? "success" : "warning"}>
                        {ord.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
