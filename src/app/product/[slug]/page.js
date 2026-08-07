"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Heart, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { VariantSelector } from "@/features/products/components/VariantSelector";
import { useProduct } from "@/features/products/hooks/useProducts";
import { useCartStore } from "@/features/cart/store/cartStore";
import { useWishlistStore } from "@/features/wishlist/store/wishlistStore";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug;

  const { data: product, isLoading, isError } = useProduct(slug);
  const addItem = useCartStore((state) => state.addItem);
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 animate-pulse grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="w-full aspect-[3/4] bg-[#F1F1F1]" />
        <div className="flex flex-col gap-4">
          <div className="h-6 w-3/4 bg-[#F1F1F1]" />
          <div className="h-8 w-1/4 bg-[#F1F1F1]" />
          <div className="h-20 w-full bg-[#F1F1F1]" />
        </div>
      </div>
    );
  }

  // Fallback demo product if backend product not seeded yet
  const activeProduct = product || {
    _id: "demo-detail",
    title: "Oud Noir Eau De Parfum",
    vendor: "IRA Fragrance",
    price: 120.0,
    compareAtPrice: 150.0,
    description: "An opulent blend of dark Cambodian oud, smoked amber, and damask rose. Crafted in France with 25% perfume oil concentration for all-day sillage.",
    images: [
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80",
    ],
    options: [
      { name: "Capacity", values: ["30ml", "50ml", "100ml"] },
    ],
    variants: [
      { name: "30ml", price: 90.0, stock: 15, options: { Capacity: "30ml" } },
      { name: "50ml", price: 120.0, stock: 8, options: { Capacity: "50ml" } },
      { name: "100ml", price: 180.0, stock: 5, options: { Capacity: "100ml" } },
    ],
  };

  const images = activeProduct.images?.length > 0 ? activeProduct.images : [
    "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop&q=80"
  ];

  const currentPrice = selectedVariant?.price || activeProduct.price;
  const compareAtPrice = selectedVariant?.compareAtPrice || activeProduct.compareAtPrice;
  const isLiked = isInWishlist(activeProduct._id);

  const handleAddToCart = () => {
    addItem(activeProduct, selectedVariant, quantity);
  };

  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
    if (variant?.image) {
      const idx = images.findIndex((img) => img === variant.image);
      if (idx !== -1) {
        setSelectedImage(idx);
      } else {
        setSelectedImage(variant.image);
      }
    } else if (variant?.imageIndex !== undefined && images[variant.imageIndex]) {
      setSelectedImage(variant.imageIndex);
    }
  };

  const displayImage = typeof selectedImage === "number"
    ? (images[selectedImage] || images[0])
    : (selectedImage || images[0]);

  // JSON-LD Product Schema for SEO
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: activeProduct.title,
    image: images[0],
    description: activeProduct.description,
    brand: {
      "@type": "Brand",
      name: activeProduct.vendor || "IRA Fashion",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: currentPrice,
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Image Gallery Column */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-[3/4] w-full bg-[#F9F9F9] overflow-hidden border border-[#E5E5E5]">
              <Image
                src={displayImage}
                alt={activeProduct.title}
                fill
                priority
                className="object-cover object-center"
              />
            </div>

            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((img, idx) => {
                  const isSelected = selectedImage === idx || selectedImage === img;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`relative w-20 aspect-[3/4] border ${
                        isSelected ? "border-[#111111]" : "border-[#E5E5E5]"
                      }`}
                    >
                      <Image src={img} alt={`Thumbnail ${idx}`} fill className="object-cover" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Product Info & Variant Selector Column */}
          <div className="flex flex-col gap-6">
            <div>
              {activeProduct.vendor && (
                <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#666666]">
                  {activeProduct.vendor}
                </span>
              )}
              <h1 className="text-3xl font-light uppercase tracking-wide text-[#111111] mt-1">
                {activeProduct.title}
              </h1>
            </div>

            {/* Price Display */}
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-[#111111]">
                ${currentPrice?.toFixed(2)}
              </span>
              {compareAtPrice && compareAtPrice > currentPrice && (
                <span className="text-sm text-[#666666] line-through">
                  ${compareAtPrice?.toFixed(2)}
                </span>
              )}
              {compareAtPrice && compareAtPrice > currentPrice && (
                <Badge variant="sale">Save ${(compareAtPrice - currentPrice).toFixed(2)}</Badge>
              )}
            </div>

            <p className="text-xs text-[#666666] leading-relaxed border-t border-b border-[#E5E5E5] py-4">
              {activeProduct.description}
            </p>

            {/* Dynamic Shopify Variant Selector */}
            {activeProduct.options?.length > 0 && (
              <VariantSelector
                options={activeProduct.options}
                variants={activeProduct.variants}
                onVariantChange={handleVariantChange}
              />
            )}

            {/* Quantity Selector & Action Buttons */}
            <div className="flex flex-col gap-4 mt-2">
              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#111111]">
                  Quantity:
                </span>
                <QuantitySelector
                  quantity={quantity}
                  onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
                  onIncrease={() => setQuantity((q) => q + 1)}
                />
              </div>

              <div className="flex items-center gap-3">
                <Button
                  onClick={handleAddToCart}
                  size="lg"
                  fullWidth
                  className="py-4"
                >
                  Add To Shopping Cart
                </Button>

                <button
                  onClick={() => toggleWishlist(activeProduct)}
                  className={`p-3.5 border border-[#111111] transition-colors hover:bg-[#111111] hover:text-white ${
                    isLiked ? "bg-red-50 text-red-600 border-red-200" : "text-[#111111]"
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? "fill-red-600" : ""}`} />
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#E5E5E5]">
              <div className="flex flex-col items-center text-center gap-1">
                <Truck className="w-4 h-4 text-[#111111]" />
                <span className="text-[10px] uppercase font-semibold text-[#111111]">Express Delivery</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1">
                <RotateCcw className="w-4 h-4 text-[#111111]" />
                <span className="text-[10px] uppercase font-semibold text-[#111111]">30-Day Returns</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1">
                <ShieldCheck className="w-4 h-4 text-[#111111]" />
                <span className="text-[10px] uppercase font-semibold text-[#111111]">Authentic Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
