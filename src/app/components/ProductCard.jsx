"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useContext } from "react";
import { CartContext } from "../Context/Context";
import { Heart, ShoppingCart } from "lucide-react";

const ProductCard = ({ pd }) => {
  const { _id, name, photoUrl, price } = pd;
  const { cartItems, handleCartAdded } = useContext(CartContext);

  // FIXED: Correct cart checking
  const isInCart = cartItems.some((item) => item._id === _id);

  return (
    <div className="w-full">
      <div
        key={_id}
        className="group w-full bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-xl hover:border-blue-400 transition-all duration-300"
      >
        {/* Image Section */}
        <div className="relative w-full h-64 overflow-hidden">
          <Link href={`/product/${_id}`}>
            <img
              src={photoUrl}
              alt={name}
              className="rounded-t-2xl w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </Link>

          {/* Wishlist Icon */}
          <button className="absolute top-3 right-3 p-2 bg-white/80 rounded-full shadow-sm hover:bg-white transition">
            <Heart size={18} className="text-gray-600 hover:text-red-500" />
          </button>
        </div>

        {/* Content */}
        <div className="px-5 py-4 space-y-2">
          {/* Title */}
          <Link href={`/product/${_id}`}>
            <h5 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition">
              {name}
            </h5>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center text-yellow-400">
              {[...Array(4)].map((_, index) => (
                <svg
                  key={index}
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 22 20"
                >
                  <path d="M20.924 7.625a1.523...Z" />
                </svg>
              ))}
              <svg
                className="w-4 h-4 text-gray-300"
                fill="currentColor"
                viewBox="0 0 22 20"
              >
                <path d="M20.924 7.625a1.523...Z" />
              </svg>
            </div>

            <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-[2px] rounded">
              4.9
            </span>
          </div>

          {/* Price + Add to Cart */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-2xl font-bold text-gray-900">${price}</span>

            {/* ADD TO CART BUTTON */}
            <button
              onClick={() => handleCartAdded(pd)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium 
                transition-all duration-300 shadow-sm
                ${
                  isInCart
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }
              `}
            >
              <ShoppingCart size={18} />
              {isInCart ? "Added" : "Add"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
