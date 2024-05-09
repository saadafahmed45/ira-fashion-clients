"use client";

import Link from "next/link";
import React, { useContext } from "react";
import { CartContext } from "../Context/Context";

const Navbar = () => {
  const { cartItems, user, handleSingOut, subtotal } = useContext(CartContext);
  // const subTotal = cartItems.reduce((total, item) => total + item.price, 0);

  return (
    <div className=' '>
      <div className='navbar  bg-white  md:px-24'>
        <div className='navbar-start'>
          <Link href={"/"} className='btn btn-ghost text-2xl'>
            Ira's <span className='text-[#FF3EA5]'>fashion</span>
          </Link>
        </div>
        {/* <div className="md:flex navbar-center hidden ">
          <ul className="menu menu-horizontal px-1 font-semibold text-xl">
            <li>
              <Link href={"/product"}> Product</Link>
            </li>
            <li>
              <Link href={"/login"}> Login</Link>
            </li>
          </ul>
        </div> */}
        <div className='navbar-end'>
          <ul className='hidden md:flex uppercase menu menu-horizontal text-slate-800 px-1 font-semibold text-[18px]'>
            {/* <li>
              <Link href={"/product"}> Product</Link>
            </li> */}
            {/* <li>
              <Link href={"/dashboard"}> Dashboard</Link>
            </li>
            <li>
              <Link href={"/blog"}> blog</Link>
            </li> */}
            <li>
              <Link href={"/login"}> Login</Link>
            </li>
          </ul>
          <div className='dropdown dropdown-end'>
            <div
              tabIndex={0}
              role='button'
              className='btn btn-ghost btn-circle'>
              <div className='indicator'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'
                  />
                </svg>
                <span className='badge badge-sm indicator-item'>
                  {cartItems.length}
                </span>
              </div>
            </div>
            <div
              tabIndex={0}
              className='mt-3 z-[1] card card-compact dropdown-content w-52 bg-base-100 shadow'>
              <div className='card-body'>
                <span className='font-bold text-lg'>
                  {" "}
                  {cartItems.length}
                  Items
                </span>
                <span className='text-info'>
                  Subtotal: ${subtotal.toFixed(2)}
                </span>
                <div className='card-actions'>
                  <Link
                    href={"/cart"}
                    className='btn  btn-outline hover:bg-pink-500 btn-block'>
                    View cart
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className='dropdown dropdown-end'>
            {user.length == 0 ? (
              " "
            ) : (
              <div
                tabIndex={0}
                role='button'
                className='btn btn-ghost btn-circle avatar'>
                <div className='w-10 rounded-full'>
                  <img alt={user.displayName} src={user.photoURL} />
                </div>
              </div>
            )}
            <ul
              tabIndex={0}
              className='menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52'>
              <li>
                <a className='justify-between'>
                  Profile
                  <span className='badge'>New</span>
                </a>
              </li>
              <li>
                <Link href={"/product"}> Product</Link>
              </li>
              <li>
                <Link href={"/login"}> Login</Link>
              </li>
              <li>
                <a href='' onClick={handleSingOut}>
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
