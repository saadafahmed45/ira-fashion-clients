"use client";

import Link from "next/link";
import React, { useContext, useState } from "react";
import { CartContext } from "../Context/Context";
import { Heart, ShoppingBag, Check } from "lucide-react";

const ProductCard = ({ pd }) => {
  const { _id, name, photoUrl, price, productType, images } = pd;
  const { cartItems, handleCartAdded } = useContext(CartContext);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedAnim, setAddedAnim] = useState(false);

  const isInCart = cartItems.some((item) => item._id === _id);
  const displayImage = images?.[0] || photoUrl;

  const handleAdd = () => {
    handleCartAdded(pd);
    if (!isInCart) {
      setAddedAnim(true);
      setTimeout(() => setAddedAnim(false), 500);
    }
  };

  return (
    <div className="group relative bg-stone-50 overflow-hidden shadow-sm hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 ease-out cursor-pointer rounded-sm">

      {/* ── IMAGE SECTION ── */}
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-stone-200">
        <Link href={`/product/${_id}`}>
          <img
            src={displayImage}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        </Link>

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Product type badge */}
        {productType && (
          <span className="absolute top-3 left-3 text-[9px] font-medium tracking-[0.18em] uppercase text-stone-600 bg-stone-50/90 backdrop-blur-sm px-2.5 py-1 rounded-sm">
            {productType}
          </span>
        )}

        {/* Wishlist button */}
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-stone-50/90 backdrop-blur-sm rounded-full hover:scale-110 hover:bg-stone-50 transition-all duration-200 z-10"
          aria-label="Wishlist"
        >
          <Heart
            size={14}
            className={`transition-all duration-300 ${
              isWishlisted ? "fill-red-500 stroke-red-500" : "stroke-stone-400 fill-transparent"
            }`}
          />
        </button>

        {/* Quick add — slides up on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out z-10">
          <button
            onClick={handleAdd}
            className={`w-full py-2.5 text-[10px] font-medium tracking-[0.14em] uppercase transition-all duration-200 backdrop-blur-md rounded-sm ${
              addedAnim ? "scale-95" : "scale-100"
            } ${
              isInCart
                ? "bg-emerald-900/90 text-emerald-100 hover:bg-emerald-900"
                : "bg-stone-50/95 text-stone-900 hover:bg-stone-900 hover:text-stone-50"
            }`}
          >
            {isInCart ? "✓  In Bag" : "Add to Bag"}
          </button>
        </div>
      </div>

      {/* ── CARD BODY ── */}
      <div className="px-4 pt-3.5 pb-5 bg-stone-50">

        {/* Star rating */}
        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex gap-0.5">
            {[0, 1, 2, 3].map((i) => (
              <svg key={i} className="w-2.5 h-2.5 fill-amber-500" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
            <svg className="w-2.5 h-2.5 fill-stone-300" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
          <span className="text-[10px] font-medium text-stone-400 tracking-wider">4.9</span>
        </div>

        {/* Amber accent line */}
        <div className="w-7 h-px bg-gradient-to-r from-amber-600 to-transparent mb-2.5" />

        {/* Product name */}
        <Link href={`/product/${_id}`}>
          <h5 className="font-serif text-[18px] font-light text-stone-900 leading-snug tracking-wide group-hover:text-amber-800 transition-colors duration-200">
            {name}
          </h5>
        </Link>

        {/* Price + pill button */}
        <div className="flex items-center justify-between mt-3">
          <span className="font-serif text-xl font-normal text-stone-900 tracking-wider">
            ${price}
          </span>

          <button
            onClick={handleAdd}
            className={`flex items-center gap-1.5 text-[9px] font-medium tracking-[0.12em] uppercase px-3 py-1.5 border rounded-sm transition-all duration-200 ${
              isInCart
                ? "bg-emerald-900 text-emerald-50 border-emerald-900"
                : "text-stone-500 border-stone-300 hover:bg-stone-900 hover:text-stone-50 hover:border-stone-900"
            }`}
          >
            {isInCart ? (
              <><Check size={10} strokeWidth={2.5} /> Added</>
            ) : (
              <><ShoppingBag size={10} strokeWidth={1.8} /> Add</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;