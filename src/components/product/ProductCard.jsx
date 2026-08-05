"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import { Heart, ShoppingBag, Check } from "lucide-react";
import { useCartStore } from "@/features/cart/store/cartStore";
import { useWishlistStore } from "@/features/wishlist/store/wishlistStore";

const ProductCard = ({ pd, variant = "minimal" }) => {
  if (!pd) return null;

  const { _id, title, name, photoUrl, price, productType, images, rating, compareAtPrice, slug } = pd;

  const displayName = title || name || "Product";
  const displayImage = images?.[0] || photoUrl || null;
  const displayRating = rating?.average ?? 4.9;
  const productLink = `/product/${slug || _id}`;

  const discountPercentage =
    compareAtPrice && compareAtPrice > price
      ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
      : null;

  // New Zustand store API
  const addItem = useCartStore((s) => s.addItem);
  const items = useCartStore((s) => s.items);
  const isInCart = items.some((item) => item.productId === _id);

  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const isWishlisted = isInWishlist(_id);

  const [addedAnim, setAddedAnim] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(pd);
    if (!isInCart) {
      setAddedAnim(true);
      setTimeout(() => setAddedAnim(false), 500);
    }
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(pd);
  };

  if (variant === "minimal") {
    return (
      <div className="group relative bg-white overflow-hidden transition-all duration-500 ease-out cursor-pointer text-left">
        <div className="relative w-full aspect-[3/4] overflow-hidden bg-[#F9F9F9] border border-[#E5E5E5]/50">
          <Link href={productLink} className="block w-full h-full">
            {displayImage ? (
              <Image
                src={displayImage}
                alt={displayName}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-[#CCCCCC]" strokeWidth={1} />
              </div>
            )}
          </Link>

          {discountPercentage && (
            <span className="absolute top-3 left-3 bg-[#111111] text-white text-[9px] font-bold tracking-widest uppercase px-2 py-1 z-10">
              -{discountPercentage}%
            </span>
          )}

          <div className="absolute bottom-3 left-3 right-3 z-20 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <button
              onClick={handleAdd}
              className={`w-full py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all duration-200 ${
                isInCart
                  ? "bg-[#111111] text-white"
                  : "bg-white/90 hover:bg-[#111111] hover:text-white text-[#111111] border border-[#E5E5E5]"
              }`}
            >
              {isInCart ? "✓ In Cart" : "Quick Add"}
            </button>
          </div>

          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white text-[#111111] transition-all duration-300 z-10"
            aria-label="Wishlist"
          >
            <Heart
              className={`w-3.5 h-3.5 transition-colors duration-200 ${
                isWishlisted ? "fill-red-500 stroke-red-500" : "text-[#666666]"
              }`}
            />
          </button>
        </div>

        <div className="pt-3 pb-2 space-y-1">
          <p className="text-[10px] uppercase tracking-wider text-[#666666]">
            {productType || "Essential"}
          </p>
          <Link href={productLink} className="block">
            <h4 className="text-xs font-medium text-[#111111] hover:underline line-clamp-1">
              {displayName}
            </h4>
          </Link>
          <div className="flex items-baseline gap-2">
            <span className="text-xs font-semibold text-[#111111]">${price?.toFixed(2)}</span>
            {compareAtPrice && compareAtPrice > price && (
              <span className="text-xs text-[#999999] line-through">${compareAtPrice?.toFixed(2)}</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (variant === "classic") {
    return (
      <div className="group relative bg-white border border-[#E5E5E5] overflow-hidden hover:shadow-md transition-all duration-300 text-left">
        <div className="relative w-full aspect-[4/5] bg-[#F9F9F9]">
          <Link href={productLink} className="block w-full h-full">
            {displayImage ? (
              <Image
                src={displayImage}
                alt={displayName}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-[#CCCCCC]" />
              </div>
            )}
          </Link>

          {discountPercentage && (
            <span className="absolute top-3 left-3 bg-[#111111] text-white text-[8px] font-bold tracking-wider uppercase px-2 py-0.5">
              Sale
            </span>
          )}

          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white shadow-sm text-[#111111] transition-all duration-200"
            aria-label="Wishlist"
          >
            <Heart
              className={`w-3.5 h-3.5 ${isWishlisted ? "fill-red-500 stroke-red-500" : "text-[#666666]"}`}
            />
          </button>
        </div>

        <div className="p-4 space-y-2.5">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <svg
                key={i}
                className={`w-2.5 h-2.5 ${i <= Math.round(displayRating) ? "fill-[#111111] text-[#111111]" : "fill-[#E5E5E5] text-[#E5E5E5]"}`}
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
            <span className="text-[10px] text-[#666666] ml-1">{displayRating}</span>
          </div>

          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-wider text-[#666666] font-semibold">
              {productType || "Collections"}
            </p>
            <Link href={productLink} className="block">
              <h4 className="text-xs font-medium text-[#111111] hover:underline line-clamp-1">
                {displayName}
              </h4>
            </Link>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#E5E5E5]">
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-bold text-[#111111]">${price?.toFixed(2)}</span>
              {compareAtPrice && compareAtPrice > price && (
                <span className="text-xs text-[#999999] line-through">${compareAtPrice?.toFixed(2)}</span>
              )}
            </div>
            <button
              onClick={handleAdd}
              className={`flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wider px-3 py-1.5 border transition-all duration-300 ${
                isInCart
                  ? "bg-[#111111] text-white border-[#111111]"
                  : "text-[#111111] border-[#E5E5E5] hover:bg-[#111111] hover:text-white hover:border-[#111111]"
              }`}
            >
              {isInCart ? (
                <><Check className="w-2.5 h-2.5" /> Added</>
              ) : (
                <><ShoppingBag className="w-2.5 h-2.5" /> Add</>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ProductCard;
