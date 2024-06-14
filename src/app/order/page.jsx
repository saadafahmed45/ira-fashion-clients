"use client";

import { CartContext } from "@/app/Context/Context";
import Link from "next/link";
import React, { useContext, useState, useEffect } from "react";
import OrderDetails from "../components/OrderDetails";

const Order = () => {
  const {
    cartItems,
    removeFromCart,
    user,
    orderDetails,
    subtotal,
    totalPrice,
    handleOrder,
  } = useContext(CartContext);

  const [orderDitails, setOrderDitails] = useState([]);

  useEffect(() => {
    fetch("https://ira-fashion-server.onrender.com/orders")
      .then((res) => res.json())
      .then((data) => setOrderDitails(data));
  }, []);
  console.log(orderDitails.length);
  return (
    <div>
      <h2>your order</h2>
      <div>
        <h2>name : {user.displayName}</h2>
      </div>
      {orderDitails.map((order) => (
        <OrderDetails order={order} key={order._id} />
      ))}
    </div>
  );
};

export default Order;
