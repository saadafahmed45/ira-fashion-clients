"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { formatPrice } from "@/lib/utils";

export function ProductCard({ product }) {
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  if (!product) return null;

  const isLiked = isInWishlist(product._id);
  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const primaryImage = product.images?.[0] || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80";
  const secondaryImage = product.images?.[1] || primaryImage;

  return (
    <div className="group relative flex flex-col bg-white">
      {/* Product Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-50 border border-gray-100">
        <Link href={`/products/${product.slug || product._id}`}>
          {/* Primary image */}
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-center transition-all duration-500 group-hover:scale-105 group-hover:opacity-0"
          />
          {/* Hover secondary image */}
          <Image
            src={secondaryImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-center transition-all duration-500 opacity-0 group-hover:opacity-100 group-hover:scale-105"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
          {hasDiscount && (
            <span className="bg-rose-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
              {discountPercent}% OFF
            </span>
          )}
          {product.isFeatured && (
            <span className="bg-gray-900 text-white text-[10px] font-medium uppercase tracking-wider px-2 py-0.5">
              Featured
            </span>
          )}
          {product.stock <= 0 && (
            <span className="bg-gray-400 text-white text-[10px] font-medium uppercase tracking-wider px-2 py-0.5">
              Sold Out
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={() => toggleWishlist(product)}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-colors z-10 ${
            isLiked
              ? "bg-rose-50 text-rose-600"
              : "bg-white/80 backdrop-blur-xs text-gray-700 hover:bg-white hover:text-gray-900"
          }`}
          aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
        </button>

        {/* Quick Add Overlay on Hover */}
        {product.stock > 0 && (
          <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={() => addItem(product, 1)}
              className="w-full bg-white text-gray-900 py-2.5 text-xs font-semibold uppercase tracking-wider hover:bg-gray-900 hover:text-white transition-colors flex items-center justify-center gap-1.5 shadow-lg"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Quick Add
            </button>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="pt-3.5 pb-2 flex flex-col flex-1">
        {product.category?.name && (
          <span className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
            {product.category.name}
          </span>
        )}

        <Link
          href={`/products/${product.slug || product._id}`}
          className="text-xs font-medium text-gray-900 hover:text-gray-600 transition-colors line-clamp-1"
        >
          {product.name}
        </Link>

        {/* Ratings */}
        {product.ratings > 0 && (
          <div className="flex items-center gap-1 mt-1">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="text-[11px] font-medium text-gray-700">
              {product.ratings.toFixed(1)}
            </span>
            <span className="text-[10px] text-gray-400">
              ({product.numReviews})
            </span>
          </div>
        )}

        {/* Pricing */}
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-xs font-semibold text-gray-900">
            {formatPrice(hasDiscount ? product.discountPrice : product.price)}
          </span>
          {hasDiscount && (
            <span className="text-[11px] text-gray-400 line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
