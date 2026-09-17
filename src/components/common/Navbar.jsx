"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ShoppingBag,
  Heart,
  User as UserIcon,
  Search,
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  Package,
  ChevronDown,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import CartDrawer from "@/components/shop/CartDrawer";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const { user, isAuthenticated, isAdmin, logout } = useAuthStore();
  const { openCart, getTotalCount } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();

  const totalCartCount = getTotalCount();
  const totalWishlistCount = wishlistItems.length;

  // Don't render general store navbar on dashboard routes
  const isDashboard = pathname?.startsWith("/dashboard");

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  if (isDashboard) {
    return null;
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const navLinks = [
    { label: "Collection", href: "/products" },
    { label: "Dresses", href: "/products?category=dresses" },
    { label: "Abayas", href: "/products?category=abayas-modest-wear" },
    { label: "Tops", href: "/products?category=tops-tunics" },
    { label: "Sarees", href: "/products?category=sarees-traditional" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 transition-all">
        {/* Top notification announcement bar */}
        <div className="bg-gray-900 text-white text-[11px] uppercase tracking-widest text-center py-2 px-4 font-medium flex items-center justify-center gap-2">
          <span>Complimentary Delivery on all domestic orders over ৳2,000</span>
          <span className="hidden md:inline text-gray-400">|</span>
          <span className="hidden md:inline text-amber-300">Use code WELCOME10 for 10% off</span>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-gray-900 transition-colors"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Brand Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="group flex flex-col items-center">
                <span className="font-serif text-xl sm:text-2xl tracking-[0.25em] text-gray-900 font-bold uppercase transition-transform group-hover:scale-[1.02]">
                  IRA FASHION
                </span>
                <span className="text-[9px] tracking-[0.35em] text-gray-400 uppercase -mt-1 font-sans">
                  Haute Couture & Modest
                </span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs font-medium uppercase tracking-widest transition-colors hover:text-gray-900 relative py-1 ${
                    pathname === link.href ? "text-gray-900" : "text-gray-500"
                  }`}
                >
                  {link.label}
                  {pathname === link.href && (
                    <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-gray-900" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Action Icons */}
            <div className="flex items-center space-x-4 sm:space-x-6">
              {/* Search Toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="Search store"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Wishlist Link */}
              <Link
                href="/wishlist"
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors relative"
                aria-label="Wishlist"
              >
                <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                {totalWishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {totalWishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Drawer Trigger */}
              <button
                onClick={openCart}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors relative"
                aria-label="Open cart"
              >
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                {totalCartCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-gray-900 text-white text-[10px] font-bold flex items-center justify-center">
                    {totalCartCount}
                  </span>
                )}
              </button>

              {/* User Menu */}
              <div className="relative">
                {isAuthenticated ? (
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-full sm:rounded-md hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all text-left group"
                    title={user?.email || "My Account"}
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-900 text-white flex items-center justify-center border border-gray-200 shrink-0 font-bold text-xs overflow-hidden shadow-2xs">
                      {user?.photoURL ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={user.photoURL}
                          alt={user.name || "User"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>{(user?.name || user?.email || "U")[0]?.toUpperCase()}</span>
                      )}
                    </div>
                    <div className="hidden sm:flex flex-col text-left leading-tight max-w-[140px]">
                      <span className="text-xs font-semibold text-gray-900 truncate">
                        {user?.name || user?.email?.split("@")[0]}
                      </span>
                      <span className="text-[10px] text-gray-500 truncate font-mono">
                        {user?.email}
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-700 hidden sm:inline transition-transform" />
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="text-xs font-medium uppercase tracking-wider text-gray-700 hover:text-gray-900 flex items-center gap-1.5"
                  >
                    <UserIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">Sign In</span>
                  </Link>
                )}

                {/* Dropdown Menu */}
                {isAuthenticated && userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white border border-gray-100 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/60">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <p className="text-xs font-semibold text-gray-900 truncate">
                          {user?.name || "Customer"}
                        </p>
                        <span className={`text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded ${
                          isAdmin ? "bg-amber-100 text-amber-900 border border-amber-200" : "bg-gray-200 text-gray-700"
                        }`}>
                          {isAdmin ? "Admin" : "Customer"}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-600 truncate font-mono" title={user?.email}>
                        {user?.email}
                      </p>
                    </div>

                    {isAdmin && (
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2 px-4 py-2 text-xs text-amber-700 hover:bg-amber-50 font-medium"
                      >
                        <LayoutDashboard className="w-4 h-4 text-amber-600" />
                        Admin Dashboard
                      </Link>
                    )}

                    <Link
                      href="/orders"
                      className="flex items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50"
                    >
                      <Package className="w-4 h-4 text-gray-400" />
                      My Orders
                    </Link>

                    <Link
                      href="/wishlist"
                      className="flex items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50"
                    >
                      <Heart className="w-4 h-4 text-gray-400" />
                      Wishlist ({totalWishlistCount})
                    </Link>

                    <Link
                      href="/account"
                      className="flex items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50"
                    >
                      <UserIcon className="w-4 h-4 text-gray-400" />
                      Profile Settings
                    </Link>

                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar Dropdown */}
        {searchOpen && (
          <div className="border-t border-gray-100 bg-gray-50/90 py-4 px-4 sm:px-6 transition-all">
            <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search dresses, abayas, silk sarees..."
                  className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-gray-200 focus:outline-none focus:border-gray-900 transition-colors"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2 text-xs uppercase tracking-wider font-semibold bg-gray-900 text-white hover:bg-gray-800 transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white px-6 py-6 space-y-4">
            {isAuthenticated ? (
              <div className="p-3.5 bg-gray-50 border border-gray-200/80 rounded-sm mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden">
                    {user?.photoURL ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={user.photoURL}
                        alt={user.name || "User"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      (user?.name || user?.email || "U")[0]?.toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-gray-900 truncate">
                      {user?.name || "Customer"}
                    </p>
                    <p className="text-[11px] text-gray-600 truncate font-mono">
                      {user?.email}
                    </p>
                    <span className="inline-block text-[9px] uppercase font-bold tracking-wider text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded mt-1 border border-amber-200">
                      {isAdmin ? "Administrator" : "Customer"}
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-200/60 grid grid-cols-2 gap-2 text-center text-xs">
                  <Link
                    href="/account"
                    className="py-1.5 px-2 bg-white border border-gray-200 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                  >
                    My Profile
                  </Link>
                  <Link
                    href="/orders"
                    className="py-1.5 px-2 bg-white border border-gray-200 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                  >
                    My Orders
                  </Link>
                </div>
              </div>
            ) : (
              <div className="mb-4">
                <Link
                  href="/login"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-900 text-white text-xs uppercase tracking-wider font-semibold"
                >
                  <UserIcon className="w-4 h-4" />
                  Sign In / Register
                </Link>
              </div>
            )}

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-xs uppercase tracking-widest font-medium text-gray-800 py-1.5 hover:text-gray-900"
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/dashboard"
                className="block text-xs uppercase tracking-widest font-semibold text-amber-700 py-1.5"
              >
                Admin Dashboard
              </Link>
            )}

            {isAuthenticated && (
              <div className="pt-4 border-t border-gray-100">
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2 py-2 text-xs text-rose-600 font-semibold uppercase tracking-wider"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Global Slide-Over Cart Drawer */}
      <CartDrawer />
    </>
  );
}

export default Navbar;
