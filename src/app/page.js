"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { ProductCard } from "@/components/shared/ProductCard";
import { ProductSkeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { useProducts } from "@/features/products/hooks/useProducts";

const sampleProducts = [
  {
    _id: "demo-1",
    title: "Oud Noir Eau De Parfum",
    slug: "oud-noir-eau-de-parfum",
    vendor: "IRA Fragrance",
    price: 120.0,
    compareAtPrice: 150.0,
    images: ["https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop&q=80"],
  },
  {
    _id: "demo-2",
    title: "Silk Oversized Blazer",
    slug: "silk-oversized-blazer",
    vendor: "IRA Couture",
    price: 240.0,
    compareAtPrice: 280.0,
    images: ["https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&auto=format&fit=crop&q=80"],
  },
  {
    _id: "demo-3",
    title: "Minimalist Leather Tote",
    slug: "minimalist-leather-tote",
    vendor: "IRA Atelier",
    price: 195.0,
    images: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80"],
  },
  {
    _id: "demo-4",
    title: "Cashmere Turtleneck Sweater",
    slug: "cashmere-turtleneck-sweater",
    vendor: "IRA Knitwear",
    price: 180.0,
    images: ["https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80"],
  },
];

export default function HomePage() {
  const { data, isLoading } = useProducts({ limit: 4 });
  const products = data?.data?.length ? data.data : sampleProducts;

  return (
    <div className="flex flex-col min-h-screen bg-white text-[#111111]">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-[#F9F9F9] overflow-hidden px-4">
        <div className="absolute inset-0 opacity-40">
          <Image
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop&q=80"
            alt="Hero Collection"
            fill
            priority
            className="object-cover object-center"
          />
        </div>

        <div className="relative max-w-4xl mx-auto text-center flex flex-col items-center gap-6 py-20 z-10">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xs uppercase font-bold tracking-[0.25em] text-[#111111] bg-white/80 backdrop-blur-md px-4 py-1.5 border border-[#E5E5E5]"
          >
            Autumn / Winter 2026 Collection
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-light tracking-tight text-[#111111] uppercase font-sans leading-tight"
          >
            Refined Luxury <br />
            <span className="font-bold">Minimalist Design</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xs sm:text-sm text-[#666666] max-w-lg leading-relaxed"
          >
            Discover our latest capsule of timeless outerwear, signature fragrances, and handcrafted accessories.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center gap-4 mt-2"
          >
            <Link href="/products">
              <Button size="lg" className="flex items-center gap-3">
                Explore Collection
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Value Pillars */}
      <section className="border-y border-[#E5E5E5] py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#F9F9F9] border border-[#E5E5E5]">
              <Truck className="w-5 h-5 text-[#111111]" />
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#111111]">Worldwide Express</h4>
              <p className="text-xs text-[#666666] mt-0.5">Complimentary shipping on orders over $150</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#F9F9F9] border border-[#E5E5E5]">
              <RotateCcw className="w-5 h-5 text-[#111111]" />
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#111111]">Seamless Returns</h4>
              <p className="text-xs text-[#666666] mt-0.5">30-day effortless return policy</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#F9F9F9] border border-[#E5E5E5]">
              <ShieldCheck className="w-5 h-5 text-[#111111]" />
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#111111]">Guaranteed Authenticity</h4>
              <p className="text-xs text-[#666666] mt-0.5">Crafted with certified premium materials</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-end justify-between mb-12 border-b border-[#E5E5E5] pb-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#666666]">Curated Selection</span>
            <h2 className="text-2xl font-light uppercase text-[#111111] tracking-wide mt-1">
              Trending <span className="font-semibold">Essentials</span>
            </h2>
          </div>
          <Link href="/products" className="text-xs uppercase font-semibold tracking-wider text-[#111111] hover:underline flex items-center gap-1">
            View All Products
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Banner CTA Section */}
      <section className="bg-[#111111] text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-6">
          <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#999999]">
            The Art of Minimalism
          </span>
          <h2 className="text-3xl sm:text-5xl font-light tracking-tight uppercase leading-tight">
            Elevate Your Everyday <br />
            <span className="font-semibold text-white">Wardrobe</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#999999] max-w-xl leading-relaxed">
            Every IRA garment is designed with strict attention to silhouette, premium fabric weight, and durable construction.
          </p>
          <Link href="/products">
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-[#111111] mt-2">
              Discover All Arrivals
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
