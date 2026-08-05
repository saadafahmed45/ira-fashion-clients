"use client";

import React, { forwardRef } from "react";

export const Input = forwardRef(function Input(
  { label, error, className = "", ...props },
  ref
) {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label className="text-[11px] font-medium uppercase tracking-wider text-[#666666]">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`w-full px-3.5 py-2.5 bg-white border border-[#E5E5E5] text-xs text-[#111111] placeholder:text-[#999999] focus:outline-none focus:border-[#111111] transition-colors rounded-none ${
          error ? "border-red-500" : ""
        } ${className}`}
        {...props}
      />
      {error && <span className="text-[11px] text-red-500">{error}</span>}
    </div>
  );
});
