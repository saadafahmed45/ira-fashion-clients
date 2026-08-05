"use client";

import React, { useEffect, useState } from "react";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("https://ira-fashion-server.onrender.com/orders");
      const data = await res.json();

      console.log("API DATA:", data); // 🔥 debug

      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };



  if (loading) {
    return <p className="p-6">Loading orders...</p>;
  }

  console.log("Orders:", orders); // 🔥 debug
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Orders</h1>


      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-black text-white">
              <th>Name</th>
              <th>Email</th>
              <th>Products</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border text-center">
                <td>{order.customerName || "N/A"}</td>
                <td>{order.email || "N/A"}</td>
                <td>
                  {order.products?.length
                    ? order.products.map((p) => p.title).join(", ")
                    : "No products"}
                </td>
                <td>${order.totalPrice || 0}</td>
                <td>{order.status || "pending"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Order;