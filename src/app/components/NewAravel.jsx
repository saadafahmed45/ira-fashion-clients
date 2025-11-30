"use client";
import React, { useContext } from "react";
import productApi from "../api/productApi";
import Image from "next/image";
import Link from "next/link";

const NewArrival = async () => {
  const productsData = await productApi();
  const newProducts = productsData.slice(-4).reverse();

  return (
    <section className="py-12">
      {/* Section Title */}
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
        New Arrivals
      </h2>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-6 md:px-16">
        {newProducts.map((item) => (
          <div
            key={item._id}
            className="w-full max-w-sm bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-xl transition duration-300"
          >
            {/* Product Image */}
            <Link href={`/product/${item._id}`}>
              <div className="overflow-hidden rounded-t-xl">
                <img
                  src={item.photoUrl}
                  alt={item.name}
                  className="w-full h-64 object-cover rounded-t-xl hover:scale-110 transition duration-500"
                />
              </div>
            </Link>

            {/* Product Info */}
            <div className="px-5 pb-5 pt-3">
              <Link href={`/product/${item._id}`}>
                <h5 className="text-lg font-semibold text-gray-900 hover:underline">
                  {item.name}
                </h5>
              </Link>

              {/* Rating */}
              <div className="flex items-center mt-2 mb-4">
                <div className="flex space-x-1">
                  {[...Array(4)].map((_, index) => (
                    <svg
                      key={index}
                      className="w-4 h-4 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 22 20"
                    >
                      <path d="M20.924 7.625a1.5 1.5 0..." />
                    </svg>
                  ))}
                  <svg
                    className="w-4 h-4 text-gray-300"
                    fill="currentColor"
                    viewBox="0 0 22 20"
                  >
                    <path d="M20.924 7.625a1.5 1.5 0..." />
                  </svg>
                </div>
                <span className="ml-3 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded">
                  5.0
                </span>
              </div>

              {/* Price + Cart */}
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">
                  ${item.price}
                </span>
                <button
                  onClick={() => handleCartAdded(item)}
                  className="bg-pink-500 hover:bg-pink-600 transition text-white font-medium rounded-lg text-sm px-4 py-2"
                >
                  Add to cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Button */}
      <div className="text-center mt-10">
        <Link
          href={"/product"}
          className="bg-black text-white px-6 py-2 rounded-md text-lg hover:bg-gray-800 transition"
        >
          See More Products
        </Link>
      </div>
    </section>
  );
};

export default NewArrival;
