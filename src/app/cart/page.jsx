"use client";
import React, { useContext } from "react";
import { CartContext } from "../Context/Context";
import Link from "next/link";
import { MdOutlineDelete } from "react-icons/md";

const CartPage = () => {
  const {
    cartItems = [],
    removeFromCart,
    quantities = {},
    setQuantities,
    totalPrice = 0,
  } = useContext(CartContext);

  const increaseQuantity = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: (prev?.[id] || 1) + 1,
    }));
  };

  const decreaseQuantity = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max((prev?.[id] || 1) - 1, 1),
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 md:px-16 py-10">
      <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-gray-800">
        🛒 Shopping Cart
      </h2>

      {cartItems.length === 0 ? (
        <div className="text-center mt-20">
          <p className="text-xl text-gray-500">Your cart is empty 😔</p>
          <Link
            href="/product"
            className="inline-block mt-4 px-6 py-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition"
          >
            Shop Now
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* LEFT - CART ITEMS */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => {
              const qty = quantities?.[item._id] || 1;

              return (
                <div
                  key={item._id}
                  className="flex flex-col md:flex-row items-center md:items-start gap-4 bg-white p-5 rounded-xl shadow hover:shadow-md transition"
                >
                  {/* IMAGE */}
                  <div className="w-28 h-28 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={item.images?.[0]}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* INFO */}
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {item.title}
                    </h3>
                    <p className="text-gray-500 mt-1">
                      ${Number(item.price).toFixed(2)}
                    </p>

                    {/* QUANTITY */}
                    <div className="flex items-center justify-center md:justify-start gap-3 mt-3">
                      <button
                        onClick={() => decreaseQuantity(item._id)}
                        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        -
                      </button>

                      <span className="font-semibold">{qty}</span>

                      <button
                        onClick={() => increaseQuantity(item._id)}
                        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* RIGHT SIDE */}
                  <div className="flex flex-col items-center md:items-end gap-2">
                    <p className="text-lg font-bold text-gray-800">
                      ${(item.price * qty).toFixed(2)}
                    </p>

                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <MdOutlineDelete size={22} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT - SUMMARY */}
          <div className="bg-white p-6 rounded-xl shadow h-fit sticky top-24">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">
              Order Summary
            </h3>

            <div className="space-y-3 text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>$10.00</span>
              </div>

              <div className="flex justify-between">
                <span>Tax</span>
                <span>$5.00</span>
              </div>

              <div className="border-t pt-3 flex justify-between font-bold text-lg text-gray-800">
                <span>Total</span>
                <span>${(totalPrice + 10 + 5).toFixed(2)}</span>
              </div>
            </div>

            {/* CHECKOUT BUTTON */}
            <Link
              href="/cart/checkout"
              className="block mt-6 w-full text-center bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-full font-semibold hover:shadow-lg hover:scale-[1.02] transition"
            >
              Proceed to Checkout →
            </Link>

            {/* CONTINUE SHOPPING */}
            <Link
              href="/product"
              className="block mt-3 text-center text-sm text-gray-500 hover:text-pink-500"
            >
              ← Continue Shopping
            </Link>
          </div>

        </div>
      )}
    </div>
  );
};

export default CartPage;