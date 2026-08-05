"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/features/cart/store/cartStore";
import { useWishlistStore } from "@/features/wishlist/store/wishlistStore";

export function ProductCard({ product }) {
  const addItem = useCartStore((state) => state.addItem);
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const isLiked = isInWishlist(product._id);
  const primaryImage = product.images?.[0] || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&auto=format&fit=crop&q=80";
  const hoverImage = product.images?.[1] || primaryImage;

  const price = product.price;
  const compareAtPrice = product.compareAtPrice;
  const isOnSale = compareAtPrice && compareAtPrice > price;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div className="group relative flex flex-col bg-white">
      {/* Product Image Container */}
      <Link href={`/product/${product.slug || product._id}`} className="relative aspect-[3/4] w-full overflow-hidden bg-[#F9F9F9]">
        <Image
          src={primaryImage}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Secondary Hover Image */}
        {product.images?.[1] && (
          <Image
            src={hoverImage}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover object-center opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}

        {/* Sale Badge */}
        {isOnSale && (
          <span className="absolute top-3 left-3 bg-[#111111] text-white text-[10px] uppercase font-bold tracking-widest px-2 py-1">
            Sale
          </span>
        )}

        {/* Action Overlay Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 transition-opacity duration-300">
          <button
            onClick={handleToggleWishlist}
            aria-label="Add to Wishlist"
            className={`p-2 bg-white/90 backdrop-blur-sm shadow-sm transition-all hover:bg-[#111111] hover:text-white ${
              isLiked ? "text-red-500" : "text-[#111111]"
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-red-500" : ""}`} />
          </button>
        </div>

        {/* Quick Add To Cart Button */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleQuickAdd}
            className="w-full bg-[#111111] text-white py-2.5 text-xs uppercase font-medium tracking-wider flex items-center justify-center gap-2 hover:bg-[#333333] transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Quick Add
          </button>
        </div>
      </Link>

      {/* Info Container */}
      <div className="pt-3 pb-1 flex flex-col gap-1">
        {product.vendor && (
          <span className="text-[10px] uppercase tracking-widest text-[#666666]">
            {product.vendor}
          </span>
        )}

        <Link
          href={`/product/${product.slug || product._id}`}
          className="text-xs font-medium text-[#111111] hover:underline line-clamp-1"
        >
          {product.title}
        </Link>

        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs font-semibold text-[#111111]">
            ${price?.toFixed(2)}
          </span>
          {isOnSale && (
            <span className="text-xs text-[#666666] line-through">
              ${compareAtPrice?.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
