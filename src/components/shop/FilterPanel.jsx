"use client";

import React from "react";
import { X, RotateCcw } from "lucide-react";

export function FilterPanel({
  categories = [],
  selectedCategory,
  onSelectCategory,
  minPrice,
  maxPrice,
  onPriceChange,
  sort,
  onSortChange,
  inStock,
  onInStockChange,
  onReset,
  onCloseMobile,
}) {
  return (
    <div className="space-y-6 text-xs">
      {/* Mobile Header */}
      {onCloseMobile && (
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 lg:hidden">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
            Filter & Refine
          </h3>
          <button
            onClick={onCloseMobile}
            className="p-1.5 text-gray-400 hover:text-gray-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Sort Select */}
      <div className="space-y-2">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-900 block">
          Sort By
        </label>
        <select
          value={sort || "newest"}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full py-2 px-3 bg-white border border-gray-200 text-xs text-gray-700 focus:outline-none focus:border-gray-900 transition-colors"
        >
          <option value="newest">Newest Arrivals</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
          <option value="oldest">Classic Releases</option>
        </select>
      </div>

      {/* Categories */}
      <div className="space-y-3 pt-4 border-t border-gray-100">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-900 block">
          Category
        </label>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          <button
            onClick={() => onSelectCategory("")}
            className={`w-full text-left py-1 text-xs transition-colors flex items-center justify-between ${
              !selectedCategory ? "font-semibold text-gray-900" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <span>All Categories</span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => onSelectCategory(cat.slug)}
              className={`w-full text-left py-1 text-xs transition-colors flex items-center justify-between ${
                selectedCategory === cat.slug
                  ? "font-semibold text-gray-900"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3 pt-4 border-t border-gray-100">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-900 block">
          Price Range (৳)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice || ""}
            onChange={(e) => onPriceChange("min", e.target.value)}
            className="w-full py-1.5 px-2.5 bg-white border border-gray-200 text-xs text-gray-700 focus:outline-none focus:border-gray-900"
          />
          <input
            type="number"
            placeholder="Max"
            value={maxPrice || ""}
            onChange={(e) => onPriceChange("max", e.target.value)}
            className="w-full py-1.5 px-2.5 bg-white border border-gray-200 text-xs text-gray-700 focus:outline-none focus:border-gray-900"
          />
        </div>
      </div>

      {/* Availability */}
      <div className="pt-4 border-t border-gray-100">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={inStock === true}
            onChange={(e) => onInStockChange(e.target.checked)}
            className="w-4 h-4 text-gray-900 rounded border-gray-300 focus:ring-gray-900"
          />
          <span className="text-xs text-gray-700">In Stock Only</span>
        </label>
      </div>

      {/* Reset Button */}
      <div className="pt-4 border-t border-gray-100">
        <button
          onClick={onReset}
          className="w-full py-2 px-3 text-xs text-gray-500 hover:text-gray-900 border border-gray-200 hover:border-gray-300 transition-colors flex items-center justify-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset All Filters
        </button>
      </div>
    </div>
  );
}

export default FilterPanel;
