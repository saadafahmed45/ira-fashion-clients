"use client";

import React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";

export default function ProductsClientToolbar({ currentVendor = "", currentSort = "-createdAt" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Reset page on filter change
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 p-4 bg-[#F9F9F9] border border-[#E5E5E5]">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#111111]">
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </div>

        <select
          value={currentVendor}
          onChange={(e) => updateParam("vendor", e.target.value)}
          className="bg-white border border-[#E5E5E5] text-xs px-3 py-1.5 focus:outline-none cursor-pointer"
        >
          <option value="">All Brands</option>
          <option value="IRA Fashion">IRA Fashion</option>
          <option value="IRA Fragrance">IRA Fragrance</option>
          <option value="IRA Couture">IRA Couture</option>
          <option value="IRA Atelier">IRA Atelier</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs uppercase font-medium text-[#666666]">Sort By:</span>
        <select
          value={currentSort}
          onChange={(e) => updateParam("sort", e.target.value)}
          className="bg-white border border-[#E5E5E5] text-xs px-3 py-1.5 focus:outline-none font-medium cursor-pointer"
        >
          <option value="-createdAt">Newest Arrivals</option>
          <option value="price">Price: Low to High</option>
          <option value="-price">Price: High to Low</option>
          <option value="title">Alphabetical (A-Z)</option>
        </select>
      </div>
    </div>
  );
}
