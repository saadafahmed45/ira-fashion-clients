"use client";

import React from "react";

export function Skeleton({ className = "", ...props }) {
  return (
    <div
      className={`animate-pulse bg-[#F1F1F1] rounded-none ${className}`}
      {...props}
    />
  );
}

export function ProductSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="w-full aspect-[3/4]" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-4 w-1/4" />
    </div>
  );
}
