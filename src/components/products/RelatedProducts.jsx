"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Sparkles } from "lucide-react";
import { useProducts } from "@/features/products/hooks/useProducts";
import { useCartStore } from "@/features/cart/store/cartStore";
import { useWishlistStore } from "@/features/wishlist/store/wishlistStore";

// Fallback demo items if backend products array is empty
const DEMO_RELATED_PRODUCTS = [
  {
    _id: "demo-related-1",
    title: "Silk Velvet Smoking Jacket",
    vendor: "IRA Atelier",
    price: 340.0,
    compareAtPrice: 420.0,
    images: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80"],
    slug: "silk-velvet-smoking-jacket",
  },
  {
    _id: "demo-related-2",
    title: "Minimalist Leather Tote",
    vendor: "IRA Leathercraft",
    price: 210.0,
    compareAtPrice: null,
    images: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80"],
    slug: "minimalist-leather-tote",
  },
  {
    _id: "demo-related-3",
    title: "Cashmere Knit Sweater",
    vendor: "IRA Essentials",
    price: 180.0,
    compareAtPrice: 220.0,
    images: ["https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&auto=format&fit=crop&q=80"],
    slug: "cashmere-knit-sweater",
  },
  {
    _id: "demo-related-4",
    title: "Amber & Cedar Parfum Oil",
    vendor: "IRA Fragrance",
    price: 95.0,
    compareAtPrice: null,
    images: ["https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80"],
    slug: "amber-cedar-parfum-oil",
  },
];

export function RelatedProducts({ currentProductId, vendor, initialProducts = [] }) {
  const { data: response, isLoading } = useProducts(
    { limit: 8, ...(vendor && { vendor }) },
    { enabled: !initialProducts || initialProducts.length === 0 }
  );
  const addItem = useCartStore((state) => state.addItem);
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const fetchedProducts = initialProducts?.length ? initialProducts : (response?.data || response);
  const productsList = Array.isArray(fetchedProducts) ? fetchedProducts : [];

  // Filter out the current active product
  let relatedProducts = productsList.filter((p) => p._id !== currentProductId);

  // Fallback to demo items if fewer than 4 products exist in DB
  if (relatedProducts.length === 0) {
    relatedProducts = DEMO_RELATED_PRODUCTS;
  }

  // Display top 4 related products
  const displayProducts = relatedProducts.slice(0, 4);

  return (
    <section className="mt-20 border-t border-[#E5E5E5] pt-16 pb-8">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-12">
        <div className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-[0.25em] text-[#666666] mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          Curated Recommendations
        </div>
        <h2 className="text-2xl sm:text-3xl font-light uppercase tracking-widest text-[#111111] font-serif">
          YOU MAY ALSO LIKE
        </h2>
        <div className="w-12 h-0.5 bg-[#111111] mt-3"></div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse flex flex-col gap-3">
              <div className="w-full aspect-[3/4] bg-[#F1F1F1]" />
              <div className="h-4 w-3/4 bg-[#F1F1F1]" />
              <div className="h-4 w-1/2 bg-[#F1F1F1]" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayProducts.map((product) => {
            const isWishlisted = isInWishlist(product._id);
            const mainImg =
              (Array.isArray(product.images) && product.images[0]) ||
              product.photoUrl ||
              "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop&q=80";

            const productLink = `/product/${product.slug || product._id}`;

            return (
              <div
                key={product._id}
                className="group relative bg-white border border-[#E5E5E5] flex flex-col justify-between overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div>
                  {/* Image Container */}
                  <div className="relative aspect-[3/4] w-full bg-[#F9F9F9] overflow-hidden">
                    <Link href={productLink}>
                      <Image
                        src={mainImg}
                        alt={product.title || product.name || "Product Image"}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>

                    {/* Wishlist Button */}
                    <button
                      onClick={() => toggleWishlist(product)}
                      className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all shadow-sm ${
                        isWishlisted
                          ? "bg-red-50 text-red-500"
                          : "bg-white/80 text-gray-700 hover:bg-white hover:text-red-500"
                      }`}
                      aria-label="Add to Wishlist"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>

                    {/* Sale Badge */}
                    {product.compareAtPrice > product.price && (
                      <div className="absolute top-3 left-3 bg-[#111111] text-white text-[9px] font-bold uppercase tracking-widest px-2 py-0.5">
                        SALE
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-4 flex flex-col gap-1">
                    {product.vendor && (
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#666666]">
                        {product.vendor}
                      </span>
                    )}
                    <Link href={productLink}>
                      <h3 className="text-xs uppercase font-medium text-[#111111] group-hover:text-[#D4AF37] transition-colors truncate">
                        {product.title || product.name}
                      </h3>
                    </Link>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-bold text-[#111111]">
                        ${product.price?.toFixed(2)}
                      </span>
                      {product.compareAtPrice > product.price && (
                        <span className="text-xs text-[#999999] line-through">
                          ${product.compareAtPrice?.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <div className="p-4 pt-0">
                  <button
                    onClick={() =>
                      addItem({
                        id: product._id,
                        name: product.title || product.name,
                        price: product.price,
                        image: mainImg,
                      })
                    }
                    className="w-full py-2.5 bg-[#111111] text-white text-[10px] uppercase tracking-widest font-semibold hover:bg-[#D4AF37] hover:text-[#111111] transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    Add To Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default RelatedProducts;
