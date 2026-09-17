"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";

export default function WishlistPage() {
  const { items, toggleWishlist, clearWishlist } = useWishlistStore();
  const { addItem } = useCartStore();

  const handleMoveToCart = (product) => {
    addItem(product, 1);
    toggleWishlist(product);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-4 text-rose-500">
          <Heart className="w-8 h-8 stroke-1" />
        </div>
        <h1 className="font-serif text-2xl text-gray-900 mb-2">Your Wishlist is Empty</h1>
        <p className="text-xs text-gray-500 mb-6">
          Save garments you love to your wishlist and revisit them anytime.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-gray-900 text-white text-xs uppercase tracking-wider font-semibold hover:bg-gray-800 transition-colors"
        >
          Explore Collections <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="border-b border-gray-100 pb-6 mb-8 flex justify-between items-end">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-gray-400 block mb-1">
            Curated Favorites
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-gray-900 font-bold uppercase tracking-wider">
            My Wishlist ({items.length})
          </h1>
        </div>
        <button
          onClick={clearWishlist}
          className="text-xs text-gray-400 hover:text-red-600 transition-colors"
        >
          Clear Wishlist
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((product) => {
          const activePrice =
            product.discountPrice > 0 ? product.discountPrice : product.price;

          return (
            <div
              key={product._id}
              className="group bg-white border border-gray-100 flex flex-col justify-between"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-50">
                {product.images?.[0] && (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                )}
                <button
                  onClick={() => toggleWishlist(product)}
                  className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 text-gray-600 hover:text-red-500 flex items-center justify-center transition-colors shadow-xs"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-4 flex flex-col gap-3">
                <div>
                  <Link
                    href={`/products/${product.slug || product._id}`}
                    className="text-xs font-medium text-gray-900 hover:text-gray-600 truncate block"
                  >
                    {product.name}
                  </Link>
                  <p className="text-xs font-bold text-gray-900 mt-1">
                    {formatPrice(activePrice)}
                  </p>
                </div>

                <button
                  onClick={() => handleMoveToCart(product)}
                  className="w-full py-2 bg-gray-900 text-white text-[11px] font-semibold uppercase tracking-wider hover:bg-gray-800 transition-colors flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  Move to Bag
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
