"use client";

import { CartContext } from "@/app/Context/Context";
import Link from "next/link";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";

const CheckOutPage = () => {
  const {
    cartItems = [],
    user,
    subtotal = 0,
    totalPrice = 0,
    quantities = {}, // ✅ FIX: quantities add
  } = useContext(CartContext);

  const [paymentMethod, setPaymentMethod] = useState("cod");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleOrder = async () => {
    if (!user) {
      toast.error("Please login first!");
      return;
    }

    if (!formData.name || !formData.phone || !formData.address) {
      toast.error("Please fill all required fields!");
      return;
    }

    const order = {
      customer: {
        ...formData,
        email: user?.email,
      },
      paymentMethod,
      products: cartItems.map((item) => {
        const qty = quantities?.[item._id] || 1;

        return {
          ...item,
          quantity: qty,
          total: item.price * qty,
        };
      }),
      subtotal,
      totalPrice,
      orderDate: new Date().toISOString(),
      status: "pending",
    };

    try {
      const res = await fetch(
        "https://ira-fashion-server.onrender.com/orders",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(order),
        }
      );

      if (res.ok) {
        toast.success("Order placed successfully 🎉");
      } else {
        toast.error("Order failed!");
      }
    } catch (err) {
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 md:px-20 py-10">
      <div className="grid lg:grid-cols-3 gap-8">

        {/* LEFT SIDE */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">

          <h2 className="text-2xl font-bold mb-4">Checkout</h2>

          {/* CUSTOMER INFO */}
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              className="p-3 border rounded w-full"
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              onChange={handleChange}
              className="p-3 border rounded w-full"
            />
          </div>

          <input
            type="text"
            name="address"
            placeholder="Full Address"
            onChange={handleChange}
            className="p-3 border rounded w-full mt-4"
          />

          <input
            type="text"
            name="city"
            placeholder="City"
            onChange={handleChange}
            className="p-3 border rounded w-full mt-4"
          />

          {/* PAYMENT METHOD */}
          <div className="mt-6">
            <h3 className="font-semibold mb-3">Payment Method</h3>

            <div className="flex gap-4">
              <button
                onClick={() => setPaymentMethod("cod")}
                className={`flex-1 p-3 border rounded ${
                  paymentMethod === "cod"
                    ? "bg-pink-500 text-white"
                    : "bg-white"
                }`}
              >
                Cash on Delivery
              </button>

              <button
                onClick={() => setPaymentMethod("card")}
                className={`flex-1 p-3 border rounded ${
                  paymentMethod === "card"
                    ? "bg-pink-500 text-white"
                    : "bg-white"
                }`}
              >
                Card Payment
              </button>
            </div>
          </div>

          {/* CARD FORM */}
          {paymentMethod === "card" && (
            <div className="mt-4 space-y-3">
              <input
                type="text"
                placeholder="Card Number"
                className="p-3 border rounded w-full"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="p-3 border rounded"
                />
                <input
                  type="text"
                  placeholder="CVV"
                  className="p-3 border rounded"
                />
              </div>
            </div>
          )}

          {/* PLACE ORDER */}
          <button
            onClick={handleOrder}
            className="mt-6 w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded font-semibold"
          >
            Place Order
          </button>
        </div>

        {/* RIGHT SIDE */}
        <div className="bg-white p-6 rounded-lg shadow h-fit">
          <h3 className="text-xl font-bold mb-4">Order Summary</h3>

          {cartItems.length === 0 ? (
            <p>No items</p>
          ) : (
            <div className="space-y-3">
              {cartItems.map((item) => {
                const qty = quantities?.[item._id] || 1;

                return (
                 <div key={item._id} className="flex gap-3 items-center">
                   <img src={item.images?.[0]} className="w-14 h-14 object-cover rounded" /> 
                   <div className="flex-1">
                     <p className="text-sm font-semibold"> {item.title} </p> 
                     <span className="flex justify-between  items-center">
                      <p className="text-xs text-gray-600">Quantities: {qty}</p>
                   <p className="text-xs text-gray-500"> ${item.price * qty}  × {qty}</p> 
                     </span>
                   </div> 
                   </div>
                );
              })}
            </div>
          )}

          <div className="border-t mt-4 pt-4 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>$10</span>
            </div>

            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${totalPrice + 10}</span>
            </div>
          </div>

          <Link
            href="/cart"
            className="block mt-4 text-center text-pink-500 underline"
          >
            Back to Cart
          </Link>
        </div>

      </div>
    </div>
  );
};

export default CheckOutPage;