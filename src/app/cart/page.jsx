"use client";
import React, { useContext } from "react";
import { CartContext } from "../Context/Context";
import Link from "next/link";
import { MdOutlineDelete } from "react-icons/md";

const CartPage = () => {
  const {
    cartItems,
    removeFromCart,
    quantities,
    setQuantities,
    subtotal,
    totalPrice,
  } = useContext(CartContext);

  const shippingCost = 10;
  const tax = 4;

  const increaseQuantity = (itemId) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 1) + 1,
    }));
  };

  const decreaseQuantity = (itemId) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: Math.max((prev[itemId] || 1) - 1, 1),
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 md:px-24 py-8">
      <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
        Shopping Cart
      </h2>

      {cartItems.length === 0 ? (
        <div className="text-center text-gray-500 mt-16 text-xl">
          Your cart is empty
          <Link href="/product" className="ml-2 text-blue-600 hover:underline">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Cart Items */}
          <div className="lg:col-span-2 divide-y bg-white p-6 rounded-lg shadow space-y-4">
            {cartItems.map((item) => {
              const itemPrice = Number(item.price);
              const quantity = quantities[item._id] || 1;

              return (
                <div
                  key={item._id}
                  className="flex flex-col md:flex-row items-center md:items-start gap-4 py-4"
                >
                  {/* Product Image */}
                  <div className="w-40 h-40 bg-gray-100 p-2 rounded">
                    <img
                      src={item.images?.[0]}
                      alt={item.title}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">
                      {item.title}
                    </h3>
                    <p className="text-gray-500 mt-1">
                      ${itemPrice.toFixed(2)} each
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center mt-4 gap-2">
                      <button
                        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                        onClick={() => decreaseQuantity(item._id)}
                      >
                        -
                      </button>
                      <span className="px-3 py-1">{quantity}</span>
                      <button
                        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                        onClick={() => increaseQuantity(item._id)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Remove Button & Total */}
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xl font-bold text-gray-900">
                      ${(itemPrice * quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <MdOutlineDelete size={24} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-lg shadow space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">Order Summary</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex justify-between">
                <span>Subtotal</span>
                <span>${Number(subtotal).toFixed(2)}</span>
              </li>
              <li className="flex justify-between">
                <span>Shipping</span>
                <span>${shippingCost.toFixed(2)}</span>
              </li>
              <li className="flex justify-between">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </li>
              <li className="flex justify-between font-bold text-gray-900 text-lg">
                <span>Total</span>
                <span>
                  ${Number(totalPrice + shippingCost + tax).toFixed(2)}
                </span>
              </li>
            </ul>

            <Link
              href="/cart/checkout"
              className="block text-center w-full py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
