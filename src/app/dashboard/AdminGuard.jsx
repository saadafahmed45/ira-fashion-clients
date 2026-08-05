"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/features/auth/hooks/useAuth";

export default function AdminGuard({ children }) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.replace("/login");
    }
  }, [loading, isAdmin, router]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#f4f6f9]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-stone-300 border-t-stone-900 rounded-full animate-spin" />
          <p className="text-sm text-stone-500">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return children;
}
