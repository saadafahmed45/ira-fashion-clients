"use client";

import React from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatPrice } from "@/lib/utils";

export function DashboardCharts({ chartData = [] }) {
  // If no historical chart data available, provide clean placeholder trend
  const data =
    chartData.length > 0
      ? chartData
      : [
          { name: "May", revenue: 14500, orders: 4 },
          { name: "Jun", revenue: 22000, orders: 7 },
          { name: "Jul", revenue: 18500, orders: 5 },
          { name: "Aug", revenue: 31000, orders: 9 },
          { name: "Sep", revenue: 42000, orders: 12 },
        ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Revenue Area Chart */}
      <div className="bg-white p-6 border border-gray-100 shadow-xs">
        <div className="mb-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-900">
            Revenue Performance
          </h3>
          <p className="text-[11px] text-gray-500">Gross monthly revenue in BDT (৳)</p>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#111111" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#111111" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "#888888" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#888888" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `৳${v / 1000}k`}
              />
              <Tooltip
                formatter={(val) => [formatPrice(val), "Revenue"]}
                contentStyle={{
                  backgroundColor: "#111",
                  color: "#fff",
                  borderRadius: 0,
                  fontSize: 12,
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#111111"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#revenueGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Order Volume Bar Chart */}
      <div className="bg-white p-6 border border-gray-100 shadow-xs">
        <div className="mb-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-900">
            Order Volume Trend
          </h3>
          <p className="text-[11px] text-gray-500">Number of monthly customer orders</p>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "#888888" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#888888" }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                formatter={(val) => [val, "Orders"]}
                contentStyle={{
                  backgroundColor: "#111",
                  color: "#fff",
                  borderRadius: 0,
                  fontSize: 12,
                }}
              />
              <Bar dataKey="orders" fill="#D97706" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default DashboardCharts;
