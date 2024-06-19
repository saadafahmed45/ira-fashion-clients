"use client";

import { CartContext } from "@/app/Context/Context";
import OrderDetails from "@/app/components/OrderDetails";
import React, { useContext, useState, useEffect } from "react";

const Order = () => {
  const { user } = useContext(CartContext);
  const [orderDetails, setOrderDetails] = useState([]);

  useEffect(() => {
    fetch("https://ira-fashion-server.onrender.com/orders")
      .then((res) => res.json())
      .then((data) => setOrderDetails(data));
  }, []);

  return (
    <div className="px-8 py-8 w-screen">
      <h2 className="text-2xl font-bold mb-4">Your Order</h2>

      {orderDetails.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {orderDetails.map((order) => (
                <OrderDetails order={order} key={order._id} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Order;
