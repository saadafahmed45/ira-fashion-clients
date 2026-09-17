"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { registerSchema } from "@/validators/schemas";
import { useAuth } from "@/hooks/useAuth";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser, isRegistering, loginWithGoogle, isGoogleLoggingIn } = useAuth();
  const [authError, setAuthError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    setAuthError("");
    try {
      const res = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      if (res?.user?.role === "admin") {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
    } catch (err) {
      setAuthError(err.message || "Registration failed. Please try again.");
    }
  };

  const handleGoogleSignUp = async () => {
    setAuthError("");
    try {
      const res = await loginWithGoogle();
      if (res?.user?.role === "admin") {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
    } catch (err) {
      if (err?.code !== "auth/popup-closed-by-user") {
        setAuthError(err.message || "Google sign-up failed. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
      <div className="max-w-md w-full space-y-6 bg-white p-8 sm:p-10 border border-gray-100 shadow-xl">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block">
            <span className="font-serif text-2xl tracking-[0.25em] text-gray-900 font-bold uppercase">
              IRA FASHION
            </span>
          </Link>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-900 pt-1">
            Create an Account
          </h2>
          <p className="text-xs text-gray-500">
            Join Ira Fashion for priority access, order tracking, and private offers.
          </p>
        </div>

        {authError && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {authError}
          </div>
        )}

        {/* Google Sign-in Option */}
        <div>
          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={isGoogleLoggingIn || isRegistering}
            className="w-full flex items-center justify-center py-2.5 px-4 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold uppercase tracking-wider transition-colors disabled:opacity-50 shadow-sm"
          >
            {isGoogleLoggingIn ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin text-gray-500" />
            ) : (
              <svg className="w-4 h-4 mr-2.5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>{isGoogleLoggingIn ? "Connecting to Google..." : "Continue with Google"}</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-gray-200 w-full" />
          <span className="bg-white px-3 text-[10px] uppercase tracking-wider text-gray-400 shrink-0 font-medium">
            Or register with email
          </span>
          <div className="border-t border-gray-200 w-full" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="Fatima Noor"
            error={errors.name?.message}
            {...register("name")}
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="you@domain.com"
            error={errors.email?.message}
            {...register("email")}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password")}
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />

          <div className="pt-1">
            <Button
              type="submit"
              variant="primary"
              size="md"
              fullWidth
              isLoading={isRegistering}
            >
              Create Account with Email
            </Button>
          </div>
        </form>

        <div className="border-t border-gray-100 pt-5 text-center text-xs text-gray-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-gray-900 hover:underline uppercase tracking-wider ml-1"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
