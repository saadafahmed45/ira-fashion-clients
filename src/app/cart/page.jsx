"use client";
import React, { useContext, useState } from "react";
import { CartContext } from "../Context/Context";
import { redirect } from "next/navigation";
import Link from "next/link";
import { MdOutlineDelete } from "react-icons/md";
// import { metadata } from "../layout";

const CartPage = () => {
  const {
    cartItems,
    removeFromCart,
    user,
    quantities,
    setQuantities,
    subtotal,
    totalPrice,
  } = useContext(CartContext);

  // // Shipping cost
  const shippingCost = 10; // You can adjust this value as needed
  const tax = 4; // You can adjust this value as needed

  // Increase and decrease quantity
  const increaseQuantity = (itemId) => {
    const abc = (prevQuantities) => ({
      ...prevQuantities, //current value
      [itemId]: (prevQuantities[itemId] || 1) + 1,
    });
    setQuantities(abc);
  };

  const decreaseQuantity = (itemId) => {
    if (quantities[itemId] > 1) {
      setQuantities((prevQuantities) => ({
        ...prevQuantities,
        [itemId]: prevQuantities[itemId] - 1,
      }));
    }
  };

  // Auth system
  const myUser = user.emailVerified;
  if (!myUser) {
    redirect("/login");
  }

  const allPd = [
    "cartItems",
    ...cartItems,
    "quantities",
    quantities,
    totalPrice,
  ];

  console.log(allPd, "all");
  // add cart fun
  function handleCartAdded(getCurrentItem) {
    let copyCartItems = [...cartItems];
    const indexOfCurrentItem = copyCartItems.findIndex(
      (item) => item.id === getCurrentItem.id
    );
    console.log(copyCartItems);
    if (indexOfCurrentItem === -1) {
      copyCartItems.push(getCurrentItem);
    }
    setCartItems(copyCartItems);
    // localStorage.setItem("cartItems", JSON.stringify(copyCartItems));
  }

  return (
    <div className="flex justify-center px-8 md:px-24 py-8">
      <div className="font-[sans-serif] bg-white">
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
            <div className="divide-y lg:col-span-2">
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

                      <p className="text-gray-400 text-xs mt-1">
                        {quantities[item.id] || 1} Item
                      </p>
                      <meta
                        name="description"
                        content="Check out iPhone 12 XR Pro and iPhone 12 Pro Max. Visit your local store and for expert advice."
                        key="desc"
                      />
                      <h4 className="text-xl font-bold text-[#333] mt-4">
                        ${(item.price * (quantities[item.id] || 1)).toFixed(2)}
                      </h4>
                      <div className="mt-6">
                        <button
                          type="button"
                          className="flex flex-wrap gap-2 text-xl text-[#333]">
                          <span
                            className="bg-gray-100 px-2 py-1 rounded"
                            onClick={() => decreaseQuantity(item.id)}>
                            -
                          </span>
                          <span className="mx-4">
                            {quantities[item.id] || 1}
                          </span>
                          <span
                            className="bg-gray-100 px-2 py-1 rounded"
                            onClick={() => increaseQuantity(item.id)}>
                            +
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item.id)}>
                    <span className="m-2">Remove</span>

                    <MdOutlineDelete className=" text-2xl fill-red-500 inline cursor-pointer" />
                  </button>
                </div>
              ))}
            </div>

            {cartItems.length === 0 ? (
              <h1>Cart is empty</h1>
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
                    Total{" "}
                    <span className="ml-auto">${totalPrice.toFixed(2)}</span>
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
