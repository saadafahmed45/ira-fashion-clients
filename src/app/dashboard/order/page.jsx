"use client";

import { CartContext } from "@/app/Context/Context";
import OrderDetails from "@/app/components/OrderDetails";
import React, { useContext, useState, useEffect } from "react";
import { Search, Filter, Download, RefreshCw } from "lucide-react";

const Order = () => {
  const { user } = useContext(CartContext);
  const [orderDetails, setOrderDetails] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [searchTerm, statusFilter, orderDetails]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        "https://ira-fashion-server.onrender.com/orders",
        { cache: "no-store" }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await res.json();
      setOrderDetails(data);
      setFilteredOrders(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = [...orderDetails];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((order) => {
        const customerName =
          order.customersDetails?.[0]?.displayName?.toLowerCase() || "";
        const customerEmail =
          order.customersDetails?.[0]?.email?.toLowerCase() || "";
        const productNames =
          order.products?.map((p) => p.name?.toLowerCase()).join(" ") || "";
        const search = searchTerm.toLowerCase();

        return (
          customerName.includes(search) ||
          customerEmail.includes(search) ||
          productNames.includes(search)
        );
      });
    }

    // Filter by status
    if (statusFilter !== "All") {
      filtered = filtered.filter(
        (order) => order.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    setFilteredOrders(filtered);
  };

  const exportToCSV = () => {
    const headers = [
      "Order ID",
      "Customer",
      "Email",
      "Products",
      "Total",
      "Status",
    ];
    const rows = filteredOrders.map((order) => [
      order._id,
      order.customersDetails?.[0]?.displayName || "N/A",
      order.customersDetails?.[0]?.email || "N/A",
      order.products?.map((p) => p.name).join(", ") || "N/A",
      order.totalPrice || 0,
      order.status || "Pending",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const getStatusCount = (status) => {
    if (status === "All") return orderDetails.length;
    return orderDetails.filter(
      (order) => order.status?.toLowerCase() === status.toLowerCase()
    ).length;
  };

  const calculateTotalRevenue = (orders) => {
    return orders.reduce((sum, order) => {
      const price = Number(order.totalPrice) || 0;
      return sum + price;
    }, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Error Loading Orders
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchOrders}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Orders Management
              </h1>
              <p className="text-gray-600">
                {filteredOrders.length} of {orderDetails.length} orders
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={fetchOrders}
                className="flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition border border-gray-300 shadow-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              {filteredOrders.length > 0 && (
                <button
                  onClick={exportToCSV}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {["All", "Pending", "Processing", "Done", "Cancel"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`p-4 rounded-xl shadow-md transition-all ${
                statusFilter === status
                  ? "bg-blue-600 text-white ring-2 ring-blue-400"
                  : "bg-white text-gray-700 hover:shadow-lg"
              }`}
            >
              <div className="text-2xl font-bold">{getStatusCount(status)}</div>
              <div className="text-sm opacity-90">{status}</div>
            </button>
          ))}
        </div>

        {/* Search and Filters */}
        {orderDetails.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by customer name, email, or product..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="text-gray-400 w-5 h-5" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Done">Done</option>
                  <option value="Cancel">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Orders Table */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              {orderDetails.length === 0
                ? "No Orders Found"
                : "No Matching Orders"}
            </h3>
            <p className="text-gray-600 mb-6">
              {orderDetails.length === 0
                ? "You haven't received any orders yet."
                : "Try adjusting your search or filter criteria."}
            </p>
            {orderDetails.length === 0 && (
              <a
                href="/product"
                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                View Products
              </a>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                      Customer Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredOrders.map(
                    (order, index) =>
                      order && (
                        <OrderDetails
                          order={order}
                          key={order._id}
                          index={index}
                        />
                      )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Summary Section */}
        {filteredOrders.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Total Orders
              </h3>
              <p className="text-3xl font-bold text-blue-600">
                {filteredOrders.length}
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Total Revenue
              </h3>
              <p className="text-3xl font-bold text-green-600">
                ${calculateTotalRevenue(filteredOrders).toFixed(2)}
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Average Order
              </h3>
              <p className="text-3xl font-bold text-purple-600">
                $
                {filteredOrders.length > 0
                  ? (
                      calculateTotalRevenue(filteredOrders) /
                      filteredOrders.length
                    ).toFixed(2)
                  : "0.00"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;
