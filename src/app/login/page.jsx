"use client";
import React, { useContext } from "react";
import { CartContext } from "../Context/Context";
import { useRouter } from "next/navigation";

const Login = () => {
  const { handleGoogleSign, user, handleSingOut } = useContext(CartContext);
  const router = useRouter();

  // ✅ SAFE destructuring
  const photoURL = user?.photoURL;
  const displayName = user?.displayName;
  const email = user?.email;

  return (
    <div className="py-8 px-2 min-h-screen">
      <div className="flex flex-col items-center gap-4">

        {/* ================= LOGIN FORM ================= */}
        {!user ? (
          <div className="w-full max-w-md p-8 space-y-4 rounded-xl shadow bg-white">
            <h1 className="text-2xl font-bold text-center">Login</h1>

            <button
              onClick={handleGoogleSign}
              className="w-full bg-black text-white py-3 rounded-lg flex items-center justify-center gap-2"
            >
              Login with Google
            </button>
          </div>
        ) : (
          /* ================= USER PROFILE ================= */
          <div className="max-w-md p-6 bg-white shadow rounded-xl text-center">
            
            {photoURL && (
              <img
                src={photoURL}
                alt="user"
                className="w-24 h-24 mx-auto rounded-full mb-4"
              />
            )}

            <h2 className="text-xl font-semibold">{displayName}</h2>
            <p className="text-gray-500">{email}</p>

            <button
              onClick={handleSingOut}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;