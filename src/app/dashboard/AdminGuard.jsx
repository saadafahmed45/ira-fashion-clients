"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, User as UserIcon, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export default function AdminGuard({ children }) {
  const { user, isLoading, hasHydrated, isAdmin, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // If not authenticated at all after rehydration and mounting, redirect to login
    if (isMounted && hasHydrated && !isLoading && !isAuthenticated) {
      router.replace("/login?redirect=/dashboard");
    }
  }, [isMounted, hasHydrated, isLoading, isAuthenticated, router]);

  // Loading / hydration state
  if (!isMounted || !hasHydrated || isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Verifying Admin Authorization...
          </p>
        </div>
      </div>
    );
  }

  // Case: User is authenticated as a customer, but lacks the admin role
  if (isAuthenticated && !isAdmin) {
    return (
      <div className="min-h-screen bg-[#FBFBFA] flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-md w-full bg-white border border-[#EBEBEB] shadow-2xl p-8 sm:p-10 text-center space-y-6">
          <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto border border-rose-100">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] tracking-[0.3em] uppercase text-rose-600 font-bold block">
              Authorization Required
            </span>
            <h1 className="text-xl font-serif font-bold text-gray-900 uppercase tracking-wider">
              Access Restricted
            </h1>
            <p className="text-xs text-gray-500 leading-relaxed">
              This area is restricted to administrators. Your current account does not have administrative privileges.
            </p>
          </div>

          <div className="p-4 bg-gray-50 border border-gray-200/70 text-left space-y-1.5">
            <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
              Signed in account
            </div>
            <div className="text-xs font-medium text-gray-800 flex items-center justify-between">
              <span className="truncate max-w-[200px]">{user?.email || "Unknown"}</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full">
                {user?.role || "Customer"}
              </span>
            </div>
          </div>

          <div className="space-y-2.5 pt-2">
            <Link
              href="/"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gray-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-black transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Storefront
            </Link>

            <Link
              href="/account"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white border border-gray-300 text-gray-800 text-xs font-semibold uppercase tracking-wider hover:bg-gray-50 transition-colors"
            >
              <UserIcon className="w-4 h-4" />
              Go to Customer Account
            </Link>

            <button
              type="button"
              onClick={async () => {
                await logout();
                router.push("/login?redirect=/dashboard");
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-rose-600 hover:text-rose-700 text-xs font-semibold uppercase tracking-wider transition-colors pt-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign in with an Admin Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Not admin and not authenticated (during redirect)
  if (!isAdmin) return null;

  return children;
}
