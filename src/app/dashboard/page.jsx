import React from "react";
import { productApiUrl } from "../api/productApi";
import ChartComponent from "./ChartComponent";
import { Package, ShoppingCart, Clock, DollarSign } from "lucide-react";

async function products() {
  const res = await fetch(productApiUrl, { cache: "no-store" });
  return res.json();
}

async function orderItem() {
  const res = await fetch("https://ira-fashion-server.onrender.com/orders", {
    cache: "no-store",
  });
  return res.json();
}

const Dashboard = async () => {
  const product = await products();
  const order = await orderItem();

  // Calculate statistics
  const pendingOrders = order.filter(
    (o) => o.status?.toLowerCase() === "pending"
  ).length;

  const totalRevenue = order.reduce((sum, o) => {
    const price = parseFloat(o.totalPrice) || 0;
    return sum + price;
  }, 0);

  const stats = [
    {
      title: "Total Products",
      value: product.length,
      icon: Package,
      color: "bg-green-500",
      bgLight: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      title: "Total Orders",
      value: order.length,
      icon: ShoppingCart,
      color: "bg-blue-500",
      bgLight: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Pending Orders",
      value: pendingOrders,
      icon: Clock,
      color: "bg-yellow-500",
      bgLight: "bg-yellow-50",
      textColor: "text-yellow-600",
    },
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "bg-purple-500",
      bgLight: "bg-purple-50",
      textColor: "text-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Dashboard Overview
          </h1>
          <p className="text-gray-600">
            Welcome back! Here's what's happening with your store today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bgLight}`}>
                    <Icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full ${stat.color} bg-opacity-10`}
                  >
                    <span className={`text-xs font-semibold ${stat.textColor}`}>
                      Live
                    </span>
                  </div>
                </div>
                <h3 className="text-gray-600 text-sm font-medium mb-1">
                  {stat.title}
                </h3>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Analytics Overview
          </h2>
          <ChartComponent
            productCount={product.length}
            orderCount={order.length}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
            <h3 className="text-xl font-bold mb-2">Quick Actions</h3>
            <p className="text-blue-100 mb-4">Manage your store efficiently</p>
            <div className="flex gap-3">
              <a
                href="/dashboard/addProducts"
                className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition"
              >
                Add Product
              </a>
              <a
                href="/dashboard/order"
                className="bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-800 transition"
              >
                View Orders
              </a>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
            <h3 className="text-xl font-bold mb-2">Recent Activity</h3>
            <p className="text-purple-100 mb-4">Stay updated with your store</p>
            <div className="space-y-2">
              <div className="bg-white/20 rounded-lg p-3">
                <p className="text-sm font-semibold">
                  {pendingOrders} orders waiting
                </p>
                <p className="text-xs text-purple-100">Needs your attention</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
