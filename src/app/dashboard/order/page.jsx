"use client";

import React, { useEffect, useState } from "react";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await fetch("https://ira-fashion-server.onrender.com/orders");
    const data = await res.json();
    setOrders(data);
  };

  const filtered = orders.filter((o) => {
    return (
      o.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      o.email?.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Orders</h1>

      <input
        className="border p-2 mb-4 w-full"
        placeholder="Search..."
        onChange={(e) => setSearch(e.target.value)}
      />

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
          {filtered.map((order) => (
            <tr key={order._id} className="border">
              <td>{order.customerName}</td>
              <td>{order.email}</td>
              <td>
                {order.products?.map((p) => p.title).join(", ")}
              </td>
              <td>${order.totalPrice}</td>
              <td>{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Order;