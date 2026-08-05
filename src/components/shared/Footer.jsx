"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";

export function Footer() {
  const pathname = usePathname();

  // Hide Main Store Footer on Admin Dashboard routes
  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  return (
    <footer className="bg-[#111111] text-white border-t border-[#333333] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#222222]">
          {/* Brand Info */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold tracking-widest uppercase">
              IRA <span className="font-light text-[#999999]">FASHION</span>
            </h3>
            <p className="text-xs text-[#999999] leading-relaxed">
              Curated luxury fashion and apparel crafted for the modern minimalist aesthetic.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#FFFFFF]">Shop</h4>
            <Link href="/products" className="text-xs text-[#999999] hover:text-white transition-colors">
              All Products
            </Link>
            <Link href="/new-arrivals" className="text-xs text-[#999999] hover:text-white transition-colors">
              New Arrivals
            </Link>
            <Link href="/collections" className="text-xs text-[#999999] hover:text-white transition-colors">
              Collections
            </Link>
          </div>

          {/* Customer Care */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#FFFFFF]">Customer Care</h4>
            <Link href="/contact" className="text-xs text-[#999999] hover:text-white transition-colors">
              Contact Us
            </Link>
            <Link href="/cart" className="text-xs text-[#999999] hover:text-white transition-colors">
              Shopping Cart
            </Link>
            <Link href="/wishlist" className="text-xs text-[#999999] hover:text-white transition-colors">
              Wishlist
            </Link>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#FFFFFF]">Newsletter</h4>
            <p className="text-xs text-[#999999]">
              Subscribe to receive updates on new collections and exclusive previews.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex items-center border border-[#333333] bg-[#1A1A1A]">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 bg-transparent text-xs text-white placeholder:text-[#666666] focus:outline-none"
              />
              <button type="submit" className="p-2 text-white hover:text-[#999999] transition-colors">
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#666666]">
          <p>© {new Date().getFullYear()} IRA FASHION HOUSE. All Rights Reserved.</p>
          <div className="flex gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Shipping Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
