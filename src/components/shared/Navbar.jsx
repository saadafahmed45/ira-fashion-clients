"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingBag, Heart, User, Menu, X, ShieldAlert } from "lucide-react";
import { useCartStore } from "@/features/cart/store/cartStore";
import { useWishlistStore } from "@/features/wishlist/store/wishlistStore";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const openCart = useCartStore((state) => state.openCart);
  const totalCartItems = useCartStore((state) => state.getTotalItems());
  const wishlistItems = useWishlistStore((state) => state.items);
  const { user, logout, isAdmin } = useAuth();

  // Hide Main Store Navbar on Admin Dashboard routes
  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5E5E5]">
      {/* Top Announcement Bar */}
      <div className="bg-[#111111] text-white text-[10px] uppercase font-medium tracking-widest text-center py-2 px-4">
        Complimentary Express Shipping on Orders Over $150
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-[#111111] p-1"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Brand Logo */}
        <Link href="/" className="text-lg font-bold tracking-widest text-[#111111] uppercase font-sans">
          IRA <span className="font-light text-[#666666]">FASHION</span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/products" className="text-xs uppercase tracking-wider text-[#111111] hover:text-[#666666] transition-colors">
            All Products
          </Link>
          <Link href="/new-arrivals" className="text-xs uppercase tracking-wider text-[#111111] hover:text-[#666666] transition-colors">
            New Arrivals
          </Link>
          <Link href="/collections" className="text-xs uppercase tracking-wider text-[#111111] hover:text-[#666666] transition-colors">
            Collections
          </Link>
          <Link href="/contact" className="text-xs uppercase tracking-wider text-[#111111] hover:text-[#666666] transition-colors">
            Contact
          </Link>
        </nav>

        {/* Action Icons */}
        <div className="flex items-center gap-5">
          {/* Search Trigger */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="text-[#111111] hover:text-[#666666] transition-colors p-1"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Wishlist Link */}
          <Link href="/wishlist" className="relative text-[#111111] hover:text-[#666666] transition-colors p-1">
            <Heart className="w-4 h-4" />
            {wishlistItems.length > 0 && (
              <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-[#111111] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {wishlistItems.length}
              </span>
            )}
          </Link>

          {/* Cart Trigger */}
          <button
            onClick={openCart}
            className="relative text-[#111111] hover:text-[#666666] transition-colors p-1"
            aria-label="Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            {totalCartItems > 0 && (
              <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-[#111111] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {totalCartItems}
              </span>
            )}
          </button>

          {/* Auth Menu */}
          {user ? (
            <div className="relative group">
              <button className="flex items-center gap-1 text-xs text-[#111111] hover:text-[#666666] p-1 font-medium">
                <User className="w-4 h-4" />
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white border border-[#E5E5E5] shadow-lg py-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200">
                <div className="px-4 py-2 border-b border-[#E5E5E5]">
                  <p className="text-xs font-semibold text-[#111111] truncate">{user.name || user.email}</p>
                  <p className="text-[10px] text-[#666666] capitalize">{user.role}</p>
                </div>
                {isAdmin && (
                  <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 text-xs text-[#111111] hover:bg-[#F9F9F9]">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link href="/login" className="text-xs uppercase tracking-wider text-[#111111] hover:text-[#666666]">
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Quick Search Drawer Bar */}
      {searchOpen && (
        <div className="border-t border-[#E5E5E5] bg-[#F9F9F9] py-3 px-4 sm:px-6">
          <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex items-center gap-2">
            <Search className="w-4 h-4 text-[#666666]" />
            <input
              type="text"
              placeholder="Search products, categories, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-xs text-[#111111] placeholder:text-[#999999] focus:outline-none py-1"
              autoFocus
            />
            <button type="submit" className="text-xs font-semibold uppercase tracking-wider text-[#111111]">
              Search
            </button>
          </form>
        </div>
      )}

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E5E5E5] bg-white px-6 py-6 flex flex-col gap-4">
          <Link href="/products" onClick={() => setMobileMenuOpen(false)} className="text-xs uppercase tracking-wider text-[#111111]">
            All Products
          </Link>
          <Link href="/new-arrivals" onClick={() => setMobileMenuOpen(false)} className="text-xs uppercase tracking-wider text-[#111111]">
            New Arrivals
          </Link>
          <Link href="/collections" onClick={() => setMobileMenuOpen(false)} className="text-xs uppercase tracking-wider text-[#111111]">
            Collections
          </Link>
          <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="text-xs uppercase tracking-wider text-[#111111]">
            Contact
          </Link>
        </div>
      )}
    </header>
  );
}
