"use client";

import React from "react";
import { useRouter } from "next/navigation";
import useAuth from "../../features/auth/hooks/useAuth";
import { Chrome } from "lucide-react";

const LoginPage = () => {
  const { loginWithGoogle, user, logout, loading } = useAuth();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {!user ? (
          <div className="bg-surface rounded-sm shadow-sm border p-10 text-center">
            <div className="mb-8">
              <h1 className="text-3xl font-serif text-stone-900 mb-2">Welcome Back</h1>
              <p className="text-stone-500 text-sm">Sign in to access your account, orders & wishlist</p>
            </div>

            <button
              onClick={async () => {
                try {
                  await loginWithGoogle();
                  router.push("/");
                } catch (_) {}
              }}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-4 border rounded-sm hover:bg-background transition text-sm font-semibold text-stone-700 disabled:opacity-50"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {loading ? "Signing in..." : "Continue with Google"}
            </button>

            <p className="mt-6 text-xs text-stone-400 leading-relaxed">
              By signing in, you agree to our{" "}
              <span className="underline cursor-pointer">Terms of Service</span> and{" "}
              <span className="underline cursor-pointer">Privacy Policy</span>
            </p>
          </div>
        ) : (
          <div className="bg-surface rounded-sm shadow-sm border p-10 text-center">
            <img
              src={user.photoURL}
              alt={user.name}
              className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-stone-200"
            />
            <h2 className="text-xl font-serif text-stone-900">{user.name || user.displayName}</h2>
            <p className="text-stone-400 text-sm mb-6">{user.email}</p>
            {user.role === "admin" && (
              <a
                href="/dashboard"
                className="block mb-3 py-3 bg-indigo-600 text-white text-xs uppercase tracking-widest font-semibold hover:bg-indigo-700 transition rounded-sm"
              >
                Go to Admin Dashboard
              </a>
            )}
            <button
              onClick={logout}
              className="w-full py-3 border text-stone-600 text-xs uppercase tracking-widest font-medium hover:bg-background transition rounded-sm"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;