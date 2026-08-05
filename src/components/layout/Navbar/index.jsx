"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, Heart, User, ShoppingBag, Menu, X, ChevronDown } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import useCartStore from "@/features/cart/store/cartStore";
import { brand } from "@/config/brand";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/product", label: "Shop All" },
  { href: "/new-arrivals", label: "New Arrivals" },
  { href: "/product?productType=Clothing", label: "Clothing" },
  { href: "/product?productType=Accessories", label: "Accessories" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showCartPreview, setShowCartPreview] = useState(false);
  const { user, logout } = useAuth();
  const cartItems = useCartStore((s) => s.cartItems);
  const quantities = useCartStore((s) => s.quantities);
  const subtotal = useCartStore((s) => s.subtotal());
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href.split("?")[0]);
  };

  const cartCount = cartItems.length;
  const cartTotal = subtotal;

  return (
    <>
      <nav
        className={`bg-white sticky top-0 z-50 transition-all duration-300 ${
          isScrolled ? "shadow-md py-2" : "shadow-sm py-3"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 -ml-2 text-stone-600 hover:text-stone-900"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <Link href="/" className="flex items-center gap-1">
              <span className="text-2xl font-bold tracking-tight text-brand">
                {brand.name}
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors relative py-1 ${
                    isActive(link.href)
                      ? "text-brand"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-brand rounded-full" />
                  )}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-stone-600 hover:text-stone-900 transition-colors hidden sm:block"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              <Link
                href="/wishlist"
                className="p-2 text-stone-600 hover:text-stone-900 transition-colors hidden md:block"
                aria-label="Wishlist"
              >
                <Heart size={20} />
              </Link>

              {user ? (
                <div className="relative group">
                  <button className="p-1 text-stone-600 hover:text-stone-900 transition-colors">
                    <div className="w-7 h-7 rounded-full overflow-hidden border-2 border-stone-200 group-hover:border-pink-500 transition-colors relative">
                      {user.photoURL ? (
                        <Image
                          src={user.photoURL}
                          alt={user.name || user.displayName}
                          width={28}
                          height={28}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-stone-100 flex items-center justify-center">
                          <User size={14} className="text-stone-400" />
                        </div>
                      )}
                    </div>
                  </button>
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-sm shadow-xl border border-stone-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 origin-top-right z-50">
                    <div className="p-3 border-b border-stone-100">
                      <p className="font-semibold text-sm text-stone-900 truncate">
                        {user.name || user.displayName}
                      </p>
                      <p className="text-xs text-stone-400 truncate">{user.email}</p>
                      {user.role === "admin" && (
                        <span className="inline-block mt-1 text-[10px] font-semibold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded-sm">
                          Admin
                        </span>
                      )}
                    </div>
                    <div className="py-1">
                      <Link
                        href="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50"
                      >
                        <User size={14} /> My Account
                      </Link>
                      <Link
                        href="/orders"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50"
                      >
                        <ShoppingBag size={14} /> My Orders
                      </Link>
                      {user.role === "admin" && (
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-amber-700 hover:bg-amber-50"
                        >
                          Dashboard
                        </Link>
                      )}
                    </div>
                    <div className="border-t border-stone-100 py-1">
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-stone-900 text-white text-sm font-medium rounded-sm hover:bg-stone-800 transition-all"
                >
                  <User size={16} />
                  <span>Sign In</span>
                </Link>
              )}

              <div
                className="relative"
                onMouseEnter={() => setShowCartPreview(true)}
                onMouseLeave={() => setShowCartPreview(false)}
              >
                <Link
                  href="/cart"
                  className="flex items-center gap-1 p-2 text-stone-600 hover:text-stone-900 transition-colors"
                >
                  <div className="relative">
                    <ShoppingBag size={22} />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-brand text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                        {cartCount > 9 ? "9+" : cartCount}
                      </span>
                    )}
                  </div>
                </Link>

                {showCartPreview && cartCount > 0 && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-sm shadow-xl border border-stone-100 p-4 z-50">
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-semibold text-sm text-stone-900">
                        Cart ({cartCount})
                      </p>
                    </div>
                    <div className="max-h-56 overflow-y-auto space-y-2 mb-3">
                      {cartItems.slice(0, 4).map((item) => {
                        const qty = quantities[item._id] || 1;
                        const img = item.images?.[0] || item.photoUrl || item.image;
                        return (
                          <div key={item._id} className="flex gap-2 pb-2 border-b border-stone-50">
                            <div className="w-12 h-14 flex-shrink-0 rounded-sm overflow-hidden bg-stone-100 relative">
                              {img && (
                                <Image
                                  src={img}
                                  alt={item.title || "Cart Item"}
                                  width={48}
                                  height={56}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-stone-800 truncate">{item.title || item.name}</p>
                              <p className="text-xs text-stone-400">Qty: {qty}</p>
                              <p className="text-xs font-semibold text-stone-900">${(item.price * qty).toFixed(2)}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex justify-between items-center mb-3 pt-1 border-t border-stone-100">
                      <span className="text-sm text-stone-600">Subtotal</span>
                      <span className="font-bold text-stone-900">${cartTotal.toFixed(2)}</span>
                    </div>
                    <Link
                      href="/cart"
                      className="block w-full text-center py-2.5 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-stone-800 transition"
                    >
                      View Cart
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {isSearchOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] flex items-start justify-center pt-24 px-4"
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            className="bg-white w-full max-w-xl rounded-sm shadow-2xl p-6 animate-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <Search size={20} className="text-stone-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search products..."
                className="flex-1 text-base outline-none border-none bg-transparent"
                autoFocus
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X size={20} />
              </button>
            </div>
            <p className="mt-3 text-xs text-stone-400">
              Press ESC or click outside to close
            </p>
          </div>
        </div>
      )}

      <div
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      >
        <div
          className={`bg-white h-full w-72 max-w-[80%] transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-5 border-b border-stone-100">
            <span className="font-bold text-lg text-brand">
              {brand.name}
            </span>
            <button onClick={() => setIsOpen(false)} className="text-stone-400 hover:text-stone-600">
              <X size={22} />
            </button>
          </div>

          {user && (
            <div className="p-4 bg-stone-50 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-pink-200 relative">
                  {user.photoURL ? (
                    <Image
                      src={user.photoURL}
                      alt={user.name || "User Avatar"}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-stone-100 flex items-center justify-center">
                      <User size={20} className="text-stone-400" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-sm text-stone-900">{user.name || user.displayName}</p>
                  <p className="text-xs text-stone-500">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          <div className="py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between px-5 py-3 text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "text-brand bg-brand-light border-l-2 border-brand"
                    : "text-stone-700 hover:bg-stone-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/wishlist"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-5 py-3 text-sm font-medium text-stone-700 hover:bg-stone-50"
            >
              <Heart size={16} /> Wishlist
            </Link>
          </div>

          {user && (
            <div className="border-t border-stone-100 py-2">
              <Link href="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-5 py-3 text-sm text-stone-700 hover:bg-stone-50">
                <User size={16} /> My Account
              </Link>
              {user.role === "admin" && (
                <Link href="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-5 py-3 text-sm text-amber-700 hover:bg-amber-50">
                  Dashboard
                </Link>
              )}
              <button onClick={() => { logout(); setIsOpen(false); }} className="flex items-center gap-2 w-full px-5 py-3 text-sm text-red-600 hover:bg-red-50">
                Sign Out
              </button>
            </div>
          )}

          {!user && (
            <div className="border-t border-stone-100 p-4">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center py-2.5 bg-stone-900 text-white text-sm font-medium rounded-sm hover:bg-stone-800 transition"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .animate-in {
          animation: fadeSlideIn 0.2s ease-out;
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
