"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSent(true);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 border border-gray-100 shadow-xl">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block">
            <span className="font-serif text-2xl tracking-[0.25em] text-gray-900 font-bold uppercase">
              IRA FASHION
            </span>
          </Link>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-900 pt-2">
            Reset Password
          </h2>
          <p className="text-xs text-gray-500">
            Enter your registered email address and we will send you a password reset link.
          </p>
        </div>

        {sent ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs text-center space-y-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
            <p className="font-medium">Reset instructions sent!</p>
            <p className="text-[11px] text-emerald-700">
              Please check your inbox at {email} for the link.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Button type="submit" variant="primary" size="md" fullWidth>
              Send Reset Link
            </Button>
          </form>
        )}

        <div className="border-t border-gray-100 pt-6 text-center text-xs text-gray-500">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 font-medium text-gray-700 hover:text-gray-900"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
