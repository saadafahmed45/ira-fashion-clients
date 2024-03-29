"use client";
import React, { useContext, useState } from "react";

import { app } from "../firebase/firebase.init";
import { CartContext } from "../Context/Context";
import { redirect, useRouter } from "next/navigation";
// import { useRouter } from "next/router";

const Login = () => {
  const { handleGoogleSign, user, handleSingOut } = useContext(CartContext);

  const { photoURL, displayName, email } = user;

  const router = useRouter();
  const redirectToCart = () => {};

  if (user.emailVerified == true) {
    router.push("/cart"); // Redirecting to /cart route
  }
  return (
    <div className="h-screen px-24 py-8 flex justify-center ">
      <div className="flex flex-col items-center gap-4 mt-24 ">
        {user.length === 0 ? (
          <h2 className="text-2xl text-red-800">Please login..</h2>
        ) : (
          <div>
            {" "}
            <div>
              <img className="h-[200px] rounded-full" src={photoURL} alt="" />
            </div>
            <h2 className="text-2xl "> {displayName}</h2>
            <h2 className="text-1xl "> {email}</h2>
          </div>
        )}
        <button
          className="bg-green-700 text-white px-3 py-2 text-2xl "
          onClick={handleGoogleSign}>
          Google Sign In
        </button>

        <button
          className="bg-red-500 text-white px-3 py-2 text-2xl"
          onClick={handleSingOut}>
          Google Sign out
        </button>
      </div>
    </div>
  );
};

export default Login;
