"use client";

import { CartContext } from "@/app/Context/Context";
import Link from "next/link";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
const CheckOutPage = () => {
  const {
    cartItems,
    removeFromCart,
    user,
    quantities,
    setQuantities,
    subtotal,
    totalPrice,
    handleOrder,
  } = useContext(CartContext);

  const [orderDetails, setOrderDetails] = useState(null);

  const handleProductAdded = async () => {
    const newOrder = {
      customersDetails: user.providerData,
      products: cartItems,
      totalPrice,
      orderDate: new Date().toISOString(),
    };

    setOrderDetails(newOrder);
    console.log(newOrder);
    try {
      const response = await fetch(
        "https://ira-fashion-server.onrender.com/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newOrder),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Order sent successfully:", data);
        toast.success("Order placed successfully!");
      } else {
        console.error("Failed to place order:", response.statusText);
        toast.error("Failed to place order.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("An error occurred while placing the order.");
    }
  };

  return (
    <div className="h-full px-24 my-8 ">
      <div className="relative mx-auto w-full bg-white">
        <div className="grid min-h-screen grid-cols-10">
          <div className="col-span-full py-6 px-4 sm:py-12 lg:col-span-6 lg:py-24">
            <div className="mx-auto w-full max-w-lg">
              <div className="">
                <h1 className="relative text-2xl font-medium text-gray-700 sm:text-3xl">
                  Secure Checkout
                  <span className="mt-2 block h-1 w-10 bg-pink-500 sm:w-20"></span>
                </h1>
                <div className="text-sm breadcrumbs m-2">
                  <ul>
                    <li>
                      <Link href={"/cart"}>Cart Details</Link>
                    </li>
                    <li>
                      <a className="font-semibold">Order Products</a>
                    </li>
                  </ul>
                </div>
              </div>

              <form action="" className="mt-10 flex flex-col space-y-4">
                <div>
                  <label
                    for="email"
                    className="text-xs font-semibold text-gray-500"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={user.email}
                    placeholder="john.capler@fang.com"
                    className="mt-1 block w-full rounded border-gray-300 bg-gray-50 py-3 px-4 text-sm placeholder-gray-300 shadow-sm outline-none transition focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div className="relative">
                  <label className="text-xs font-semibold text-gray-500">
                    Card number
                  </label>
                  <input
                    type="text"
                    id="card-number"
                    name="card-number"
                    placeholder="1234-5678-XXXX-XXXX"
                    className="block w-full rounded border-gray-300 bg-gray-50 py-3 px-4 pr-10 text-sm placeholder-gray-300 shadow-sm outline-none transition focus:ring-2 focus:ring-pink-500"
                  />
                  {/* <img
                    src="/images/uQUFIfCYVYcLK0qVJF5Yw.png"
                    alt=""
                    className="absolute bottom-3 right-3 max-h-4"
                  /> */}
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500">
                    Expiration date
                  </p>
                  <div className="mr-6 flex flex-wrap">
                    <div className="my-1">
                      <label className="sr-only">Select expiration month</label>
                      <select
                        name="month"
                        id="month"
                        className="cursor-pointer rounded border-gray-300 bg-gray-50 py-3 px-2 text-sm shadow-sm outline-none transition focus:ring-2 focus:ring-pink-500"
                      >
                        <option value="">Month</option>
                      </select>
                    </div>
                    <div className="my-1 ml-3 mr-6">
                      <label className="sr-only">Select expiration year</label>
                      <select
                        name="year"
                        id="year"
                        className="cursor-pointer rounded border-gray-300 bg-gray-50 py-3 px-2 text-sm shadow-sm outline-none transition focus:ring-2 focus:ring-pink-500"
                      >
                        <option value="">Year</option>
                      </select>
                    </div>
                    <div className="relative my-1">
                      <label className="sr-only">Security code</label>
                      <input
                        type="text"
                        id="security-code"
                        name="security-code"
                        placeholder="Security code"
                        className="block w-36 rounded border-gray-300 bg-gray-50 py-3 px-4 text-sm placeholder-gray-300 shadow-sm outline-none transition focus:ring-2 focus:ring-pink-500"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label for="card-name" className="sr-only">
                    Card name
                  </label>
                  <input
                    type="text"
                    id="card-name"
                    name="card-name"
                    placeholder="Name on the card"
                    className="mt-1 block w-full rounded border-gray-300 bg-gray-50 py-3 px-4 text-sm placeholder-gray-300 shadow-sm outline-none transition focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </form>
              <p className="mt-10 text-center text-sm font-semibold text-gray-500">
                By placing this order you agree to the{" "}
                <a
                  href="#"
                  className="whitespace-nowrap text-pink-400 underline hover:text-pink-500 "
                >
                  Terms and Conditions
                </a>
              </p>
              <button
                onClick={handleProductAdded}
                className="mt-4 inline-flex w-full items-center justify-center rounded bg-pink-500 py-2.5 px-4 text-base font-semibold tracking-wide text-white text-opacity-80 outline-none ring-offset-2 transition hover:text-opacity-100 focus:ring-2 focus:ring-pink-500 sm:text-lg"
              >
                Place Order
              </button>
            </div>
          </div>
          <div className="relative col-span-full flex flex-col py-6 pl-8 pr-4 sm:py-12 lg:col-span-4 lg:py-24">
            <h2 className="sr-only">Order summary</h2>
            <div>
              <img
                src="https://images.unsplash.com/photo-1581318694548-0fb6e47fe59b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80"
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 h-full w-full bg-gradient-to-t from-pink-800 to-pink-400 opacity-95"></div>
            </div>
            <div className="relative">
              <ul className="space-y-5">
                {/* map start */}
                {cartItems.map((item) => (
                  <li key={item._id} className="flex justify-between">
                    <div className="inline-flex">
                      <img src={item.photoUrl} alt="" className="max-h-16" />
                      <div className="ml-3">
                        <p className="text-base font-semibold text-white">
                          {item.name}
                        </p>
                        {/* <p className='text-sm font-medium text-white text-opacity-80'>
                        Pdf, doc Kindle
                      </p> */}
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-white">
                      ${item.price}
                    </p>
                  </li>
                ))}
                {/* map here  */}
              </ul>
              <div className="my-5 h-0.5 w-full bg-white bg-opacity-30"></div>
              <div className="space-y-2">
                <p className="flex justify-between text-lg font-bold text-white">
                  <span>Total price:</span>
                  <span>${subtotal}</span>
                </p>
                <p className="flex justify-between text-sm font-medium text-white">
                  <span>Vat: 10%</span>
                  <span>$55.00</span>
                </p>
              </div>
            </div>
            <div className="relative mt-10 text-white">
              <h3 className="mb-5 text-lg font-bold">Support</h3>
              <p className="text-sm font-semibold">
                +01 653 235 211{" "}
                <span className="font-light">(International)</span>
              </p>
              <p className="mt-1 text-sm font-semibold">
                support@irafashion.com{" "}
                <span className="font-light">(Email)</span>
              </p>
              <p className="mt-2 text-xs font-medium">
                Call us now for payment related issues
              </p>
            </div>
            <div className="relative mt-10 flex">
              <p className="flex flex-col">
                <span className="text-sm font-bold text-white">
                  Money Back Guarantee
                </span>
                <span className="text-xs font-medium text-white">
                  within 30 days of purchase
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOutPage;
