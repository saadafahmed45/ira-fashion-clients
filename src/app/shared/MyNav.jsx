"use client";
import React, { useContext, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaHeart, FaShoppingCart } from "react-icons/fa"; // Example for icons
import { RiMenu2Line } from "react-icons/ri";
import { IoCloseSharp } from "react-icons/io5";
import { CartContext } from "../Context/Context";

const MyNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { cartItems, user, handleSingOut, subtotal } = useContext(CartContext);

  return (
    <div>
      <nav className="relative bg-white shadow px-2  md:px-24">
        <div className="container px-6 py-4 mx-auto md:flex md:justify-between md:items-center">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href={"/"} className="btn btn-ghost text-2xl">
              Ira's <span className="text-[#FF3EA5]">fashion</span>
            </Link>

            {/* Mobile menu button */}
            <div className="flex lg:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="text-gray-500 hover:text-gray-600 text-2xl  focus:outline-none focus:text-gray-600 "
                aria-label="toggle menu"
              >
                {/* Hamburger menu icon */}
                {!isOpen ? <RiMenu2Line /> : <IoCloseSharp />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div
            className={`${isOpen
              ? "translate-x-0 opacity-100"
              : "opacity-0 -translate-x-full"
              } absolute inset-x-0 z-20 w-full px-6 py-4 transition-all duration-300 ease-in-out bg-white  md:mt-0 md:p-0 md:top-0 md:relative md:bg-transparent md:w-auto md:opacity-100 md:translate-x-0 md:flex md:items-center text-center`}
          >
            {/* Navigation Links */}
            <div className="flex flex-col md:flex-row md:mx-6">
              <Link
                className="my-2 text-gray-700 transition-colors duration-300 transform hover:text-blue-500  md:mx-4 md:my-0"
                href={"/"}
              >
                Home
              </Link>
              <Link
                className="my-2 text-gray-700 transition-colors duration-300 transform hover:text-blue-500  md:mx-4 md:my-0"
                href={"/product"}
              >
                Product
              </Link>
              <Link
                className="my-2 text-gray-700 transition-colors duration-300 transform hover:text-blue-500  md:mx-4 md:my-0"
                href={"/Collection"}
              >
                Collection
              </Link>
            </div>

            {/* Cart Icon */}
            <div className="flex justify-center md:block">
              <Link
                className="relative text-gray-700 transition-colors duration-300 transform hover:text-gray-600 "
                href={"cart"}
              >
                <div className="indicator">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
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
                  <span className="badge badge-sm indicator-item">
                    {cartItems.length}
                  </span>
                </div>
              </Link>
            </div>

            <div>
              {user.emailVerified === true ? (
                " "
              ) : (
                <Link
                  className="my-2 text-gray-700 transition-colors duration-300 transform hover:text-blue-500  md:mx-4 md:my-0"
                  href={"login"}
                >
                  Login
                </Link>
              )}
            </div>

            <div className="dropdown dropdown-end ml-2">
              {user.length == 0 ? (
                " "
              ) : (
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar"
                >
                  <div className="w-10 rounded-full">
                    <img alt={user.displayName} src={user.photoURL} />
                  </div>
                </div>
              )}
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li>
                  <Link href={"/login"}> Profile</Link>
                </li>
                <li>
                  <a href="" onClick={handleSingOut}>
                    Logout
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default MyNav;
