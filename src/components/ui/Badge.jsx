"use client";

import React from "react";

export function Badge({ children, variant = "default", className = "" }) {
  const variants = {
    default: "bg-[#F9F9F9] text-[#111111] border border-[#E5E5E5]",
    dark: "bg-[#111111] text-white",
    sale: "bg-red-50 text-red-600 border border-red-200",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border border-amber-200",
    danger: "bg-rose-50 text-rose-700 border border-rose-200",
    info: "bg-sky-50 text-sky-700 border border-sky-200",
    purple: "bg-purple-50 text-purple-700 border border-purple-200",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase ${
        variants[variant] || variants.default
      } ${className}`}
    >
      {children}
    </span>
  );
}

export default Badge;
