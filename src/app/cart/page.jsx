"use client";
import React, { useContext, useState } from "react";
import { CartContext } from "../Context/Context";
import { redirect } from "next/navigation";
import Link from "next/link";

const CartPage = () => {
  const { cartItems, removeFromCart, user } = useContext(CartContext);
  // Calculate subtotal
  const subtotal = cartItems.reduce((total, item) => total + item.price, 0);

  // Shipping cost
  const shippingCost = 10; // You can adjust this value as needed
  const tax = 4; // You can adjust this value as needed

  // Calculate total price including shipping
  const totalPrice = subtotal + shippingCost + tax;

  //  increase and decrease

  const [quantity, setQuantity] = useState(1);
  const { price } = cartItems;

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
    console.log("increase");
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
    console.log("decrease");
  };
  const totalIncreasePrice = (price * quantity).toFixed(2);

  // auth system
  const myUser = user.emailVerified;
  // set privet route
  // const emailVerified = myUser;
  if (!myUser) {
    redirect("/login");
  }

  return (
    <div className="h-full flex  justify-center px-8 md:px-24 py-8 overflow-hidden">
      <div className="font-[sans-serif] bg-white ">
        <div className="lg:max-w-7xl max-w-xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#333]">
            Shopping Cart
          </h2>
          <div className="text-sm breadcrumbs m-2">
            <ul>
              <li>
                <Link href={"/"}>Home</Link>
              </li>
              <li>
                <a className="font-semibold">Cart Details</a>
              </li>
            </ul>
          </div>
          <div className="grid lg:grid-cols-3 gap-8 items-start mt-8">
            <div className="divide-y lg:col-span-2 ">
              {/* hareeeee  */}
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col md:flex-row items-start justify-between gap-4 py-8">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className=" h-40 md:h-64 bg-gray-100 p-2  md:p-6 rounded">
                      <img
                        src={item.img}
                        className="w-full h-full object-contain shrink-0"
                      />
                    </div>
                    <div>
                      <p className="text-md font-bold text-[#333]">
                        {item.name}
                      </p>
                      <p className="text-gray-400 text-xs mt-1">1 Item</p>
                      <h4 className="text-xl font-bold text-[#333] mt-4">
                        ${item.price}
                      </h4>
                      <div className="mt-6">
                        <button
                          type="button"
                          className="flex flex-wrap gap-2 text-xl text-[#333]">
                          <span
                            className="bg-gray-100 px-2 py-1 rounded"
                            onClick={decreaseQuantity}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-3.5 fill-current"
                              viewBox="0 0 124 124">
                              <path
                                d="M112 50H12C5.4 50 0 55.4 0 62s5.4 12 12 12h100c6.6 0 12-5.4 12-12s-5.4-12-12-12z"
                                data-original="#000000"></path>
                            </svg>
                          </span>
                          <span className="mx-4">1</span>
                          <span
                            className="bg-gray-100 px-2 py-1 rounded"
                            onClick={increaseQuantity}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-3.5 fill-current"
                              viewBox="0 0 42 42">
                              <path
                                d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z"
                                data-original="#000000"></path>
                            </svg>
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item.id)}>
                    <span className="m-2">Remove</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 fill-red-500 inline cursor-pointer"
                      viewBox="0 0 24 24">
                      <path
                        d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z"
                        data-original="#000000"></path>
                      <path
                        d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z"
                        data-original="#000000"></path>
                    </svg>
                  </button>
                </div>
              ))}
              {/* hareee */}
            </div>

            {cartItems.length == 0 ? (
              <h1>cart is empty</h1>
            ) : (
              <div className="bg-gray-100 p-8">
                <h3 className="text-2xl font-bold text-[#333]">
                  Order summary
                </h3>
                <ul className="text-[#333] mt-6 divide-y">
                  <li className="flex flex-wrap gap-4 text-md py-3">
                    Subtotal{" "}
                    <span className="ml-auto font-bold">
                      ${subtotal.toFixed(2)}
                    </span>
                  </li>
                  <li className="flex flex-wrap gap-4 text-md py-3">
                    Shipping{" "}
                    <span className="ml-auto font-bold">
                      ${shippingCost.toFixed(2)}
                    </span>
                  </li>
                  <li className="flex flex-wrap gap-4 text-md py-3">
                    Tax{" "}
                    <span className="ml-auto font-bold">${tax.toFixed(2)}</span>
                  </li>
                  <li className="flex flex-wrap gap-4 text-md py-3 font-bold">
                    Total <span className="ml-auto">${totalPrice}</span>
                  </li>
                </ul>
                <Link
                  href={"/cart/checkout"}
                  type="button"
                  className="mt-6 text-md px-6 py-2.5 w-full bg-[#FF3EA5] hover:bg-[#912760] text-white rounded text-center">
                  Check out
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
