"use client";
import React, { useContext, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RiMenu2Line } from "react-icons/ri";
import { IoCloseSharp } from "react-icons/io5";
import { CartContext } from "../Context/Context";

const MyNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { cartItems, user, handleSingOut } = useContext(CartContext);
  const pathname = usePathname(); // Get current path

  // Function to check if the link is active
  const isActive = (href) => pathname === href;

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className=" mx-auto px-4 sm:px-6 lg:px-24">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              Ira's <span className="text-pink-500">Fashion</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex lg:space-x-8 items-center">
            {["/", "/product", "/Collection"].map((link) => (
              <Link
                key={link}
                href={link}
                className={`text-gray-700 font-medium transition-colors ${
                  isActive(link)
                    ? "text-pink-500 border-b-2 border-pink-500"
                    : "hover:text-pink-500"
                }`}
              >
                {link === "/" ? "Home" : link.replace("/", "")}
              </Link>
            ))}

            {/* Cart */}
            <Link
              href="/cart"
              className="relative text-gray-700 hover:text-pink-500 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {/* User */}
            {user?.emailVerified ? (
              <div className="dropdown dropdown-end ml-4">
                <div
                  tabIndex={0}
                  className="cursor-pointer w-10 h-10 rounded-full overflow-hidden"
                >
                  <img
                    src={user.photoURL}
                    alt={user.displayName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <ul
                  tabIndex={0}
                  className="menu dropdown-content mt-2 p-2 shadow bg-white rounded-md w-40 text-gray-700"
                >
                  <li>
                    <Link href="/profile">Profile</Link>
                  </li>
                  <li>
                    <button
                      onClick={handleSingOut}
                      className="w-full text-left"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <Link
                href="/login"
                className="ml-4 px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-pink-500 focus:outline-none"
            >
              {!isOpen ? <RiMenu2Line size={24} /> : <IoCloseSharp size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden bg-white transition-transform duration-300 ${
          isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
      >
        <div className="px-4 pt-4 pb-6 space-y-4">
          {["/", "/product", "/Collection"].map((link) => (
            <Link
              key={link}
              href={link}
              className={`block text-gray-700 font-medium transition-colors ${
                isActive(link) ? "text-pink-500" : "hover:text-pink-500"
              }`}
            >
              {link === "/" ? "Home" : link.replace("/", "")}
            </Link>
          ))}
          <Link
            href="/cart"
            className="block text-gray-700 hover:text-pink-500 font-medium relative"
          >
            Cart
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-2 bg-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </Link>
          {!user?.emailVerified && (
            <Link
              href="/login"
              className="block text-white bg-pink-500 px-4 py-2 rounded-md hover:bg-pink-600 transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default MyNav;
