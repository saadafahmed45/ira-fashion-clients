"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/features/auth/hooks/useAuth";

const loginSchema = z.object({
  email: z.string().email("Valid email address is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = loginSchema.extend({
  name: z.string().min(2, "Full name is required"),
});

export default function LoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { loginWithGoogle, loginWithEmailPassword, registerWithEmailPassword, loading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(isRegister ? registerSchema : loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      setErrorMsg("");
      if (isRegister) {
        await registerWithEmailPassword(data);
      } else {
        await loginWithEmailPassword(data.email, data.password);
      }
      router.push("/");
    } catch (err) {
      setErrorMsg(err.message || "Authentication failed. Please check your credentials.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setErrorMsg("");
      await loginWithGoogle();
      router.push("/");
    } catch (err) {
      setErrorMsg(err.message || "Google login failed.");
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-16 px-4 bg-white">
      <div className="w-full max-w-md bg-white border border-[#E5E5E5] p-8 flex flex-col gap-6">
        <div className="text-center flex flex-col gap-1">
          <h1 className="text-2xl font-light uppercase tracking-wider text-[#111111]">
            {isRegister ? "Create Account" : "Customer Login"}
          </h1>
          <p className="text-xs text-[#666666]">
            {isRegister ? "Join IRA Fashion for exclusive access" : "Sign in to access your orders and saved items"}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
            {errorMsg}
          </div>
        )}

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-3 px-4 bg-[#F9F9F9] border border-[#E5E5E5] text-xs font-semibold uppercase tracking-wider text-[#111111] hover:bg-[#E5E5E5] transition-colors flex items-center justify-center gap-3"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
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
          Continue With Google
        </button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-[#E5E5E5] w-full" />
          <span className="bg-white px-3 text-[10px] uppercase tracking-widest text-[#999999] absolute">
            Or With Email
          </span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {isRegister && (
            <Input label="Full Name" error={errors.name?.message} {...register("name")} />
          )}

          <Input label="Email Address" type="email" error={errors.email?.message} {...register("email")} />

          <Input label="Password" type="password" error={errors.password?.message} {...register("password")} />

          <Button type="submit" isLoading={loading} size="lg" fullWidth className="py-3.5 mt-2">
            {isRegister ? "Register Account" : "Sign In"}
          </Button>
        </form>

        <div className="text-center pt-2 border-t border-[#E5E5E5]">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setErrorMsg("");
            }}
            className="text-xs text-[#666666] hover:text-[#111111] hover:underline uppercase tracking-wider font-medium"
          >
            {isRegister ? "Already have an account? Sign In" : "Don't have an account? Register"}
          </button>
        </div>
      </div>
    </div>
  );
}
