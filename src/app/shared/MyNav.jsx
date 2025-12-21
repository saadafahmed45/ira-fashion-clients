"use client";
import React, { useContext, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  RiMenu2Line,
  RiSearchLine,
  RiHeartLine,
  RiUser3Line,
} from "react-icons/ri";
import { IoCloseSharp } from "react-icons/io5";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { CartContext } from "../Context/Context";

const MyNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartHovered, setIsCartHovered] = useState(false);
  const { cartItems, user, handleSingOut, subtotal } = useContext(CartContext);
  const pathname = usePathname();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href) => pathname === href;

  const navigationLinks = [
    { href: "/", label: "Home" },
    { href: "/product", label: "Shop All" },
    { href: "/Collection", label: "Collections" },
    { href: "/new-arrivals", label: "New Arrivals" },
    { href: "/sale", label: "Sale", badge: "Hot" },
  ];

  return (
    <>
      {/* Main Navigation */}
      <nav
        className={`bg-white sticky top-0 z-50 transition-all duration-300 ${
          isScrolled ? "shadow-md py-3" : "shadow-sm py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 -ml-2 text-gray-700 hover:text-pink-600 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <IoCloseSharp size={28} /> : <RiMenu2Line size={28} />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center group">
              <div className="text-2xl lg:text-3xl font-bold tracking-tight">
                <span className="text-gray-900">Ira's</span>{" "}
                <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Fashion
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-8 xl:space-x-10">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative group"
                >
                  <span
                    className={`text-[15px] font-medium tracking-wide transition-colors ${
                      isActive(link.href)
                        ? "text-pink-600"
                        : "text-gray-700 hover:text-pink-600"
                    }`}
                  >
                    {link.label}
                  </span>
                  {link.badge && (
                    <span className="absolute -top-2 -right-8 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                      {link.badge}
                    </span>
                  )}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-pink-600 to-purple-600 transition-all duration-300 ${
                      isActive(link.href) ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              ))}
            </div>

            {/* Right Icons */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Search Icon */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-gray-700 hover:text-pink-600 transition-colors hidden sm:block"
                aria-label="Search"
              >
                <RiSearchLine size={22} />
              </button>

              {/* Wishlist Icon */}
              <Link
                href="/wishlist"
                className="p-2 text-gray-700 hover:text-pink-600 transition-colors hidden md:block"
                aria-label="Wishlist"
              >
                <RiHeartLine size={22} />
              </Link>

              {/* User Account */}
              {user?.emailVerified ? (
                <div className="relative group">
                  <button className="p-2 text-gray-700 hover:text-pink-600 transition-colors">
                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200 group-hover:border-pink-600 transition-colors">
                      <img
                        src={user.photoURL}
                        alt={user.displayName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </button>

                  {/* User Dropdown */}
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                    <div className="p-4 border-b border-gray-100">
                      <p className="font-semibold text-gray-900 truncate">
                        {user.displayName}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>
                    <div className="py-2">
                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                      >
                        <RiUser3Line className="mr-3" size={18} />
                        My Account
                      </Link>
                      <Link
                        href="/orders"
                        className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                      >
                        <HiOutlineShoppingBag className="mr-3" size={18} />
                        My Orders
                      </Link>
                      <Link
                        href="/wishlist"
                        className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                      >
                        <RiHeartLine className="mr-3" size={18} />
                        Wishlist
                      </Link>
                    </div>
                    <div className="border-t border-gray-100 py-2">
                      <button
                        onClick={handleSingOut}
                        className="w-full text-left px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors font-medium"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-all font-medium text-sm"
                >
                  <RiUser3Line size={18} />
                  <span>Sign In</span>
                </Link>
              )}

              {/* Shopping Cart */}
              <div
                className="relative"
                onMouseEnter={() => setIsCartHovered(true)}
                onMouseLeave={() => setIsCartHovered(false)}
              >
                <Link
                  href="/cart"
                  className="flex items-center gap-2 p-2 text-gray-700 hover:text-pink-600 transition-colors"
                >
                  <div className="relative">
                    <HiOutlineShoppingBag size={26} />
                    {cartItems.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                        {cartItems.length}
                      </span>
                    )}
                  </div>
                </Link>

                {/* Cart Preview Dropdown */}
                {isCartHovered && cartItems.length > 0 && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-2xl border border-gray-100 p-5 animate-fadeIn">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-lg text-gray-900">
                        Shopping Cart
                      </h3>
                      <span className="text-sm text-gray-500">
                        {cartItems.length} items
                      </span>
                    </div>

                    {/* Cart Items Preview (Show first 3) */}
                    <div className="max-h-64 overflow-y-auto space-y-3 mb-4">
                      {cartItems.slice(0, 3).map((item, index) => (
                        <div
                          key={index}
                          className="flex gap-3 pb-3 border-b border-gray-100"
                        >
                          <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-gray-900 truncate">
                              {item.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              Qty: {item.quantity || 1}
                            </p>
                            <p className="font-semibold text-pink-600 text-sm">
                              ${(item.price * (item.quantity || 1)).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Subtotal */}
                    <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                      <span className="font-medium text-gray-700">
                        Subtotal:
                      </span>
                      <span className="font-bold text-xl text-gray-900">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <Link
                        href="/cart"
                        className="block w-full bg-white border-2 border-gray-900 text-gray-900 text-center py-3 rounded-full font-semibold hover:bg-gray-900 hover:text-white transition-all"
                      >
                        View Cart
                      </Link>
                      <Link
                        href="/checkout"
                        className="block w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white text-center py-3 rounded-full font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                      >
                        Checkout
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Search Bar Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 animate-fadeIn">
          <div className="bg-white max-w-3xl mx-auto mt-20 rounded-lg shadow-2xl p-6 animate-slideDown">
            <div className="flex items-center gap-4">
              <RiSearchLine size={24} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search for products..."
                className="flex-1 text-lg outline-none"
                autoFocus
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <IoCloseSharp size={28} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      >
        <div
          className={`bg-white h-full w-80 max-w-[85%] transition-transform duration-300 transform ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="text-xl font-bold">
              <span className="text-gray-900">Ira's</span>{" "}
              <span className="text-pink-600">Fashion</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-600 hover:text-pink-600"
            >
              <IoCloseSharp size={28} />
            </button>
          </div>

          {/* Mobile Menu Content */}
          <div className="overflow-y-auto h-[calc(100%-80px)]">
            {/* User Section */}
            {user?.emailVerified ? (
              <div className="p-6 bg-gradient-to-r from-pink-50 to-purple-50 border-b border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-pink-600">
                    <img
                      src={user.photoURL}
                      alt={user.displayName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {user.displayName}
                    </p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 border-b border-gray-200">
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 rounded-full font-semibold"
                  onClick={() => setIsOpen(false)}
                >
                  <RiUser3Line size={20} />
                  Sign In
                </Link>
              </div>
            )}

            {/* Navigation Links */}
            <div className="py-4">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between px-6 py-4 text-base font-medium transition-colors ${
                    isActive(link.href)
                      ? "text-pink-600 bg-pink-50 border-l-4 border-pink-600"
                      : "text-gray-700 hover:bg-gray-50 hover:text-pink-600"
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}

              <Link
                href="/wishlist"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-6 py-4 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-pink-600"
              >
                <span className="flex items-center gap-3">
                  <RiHeartLine size={20} />
                  Wishlist
                </span>
              </Link>
            </div>

            {/* User Actions */}
            {user?.emailVerified && (
              <div className="border-t border-gray-200 py-4">
                <Link
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50"
                >
                  <RiUser3Line className="mr-3" size={20} />
                  My Account
                </Link>
                <Link
                  href="/orders"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50"
                >
                  <HiOutlineShoppingBag className="mr-3" size={20} />
                  My Orders
                </Link>
                <button
                  onClick={() => {
                    handleSingOut();
                    setIsOpen(false);
                  }}
                  className="flex items-center w-full px-6 py-3 text-red-600 hover:bg-red-50 font-medium"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideDown {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default MyNav;
