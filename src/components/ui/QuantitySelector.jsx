"use client";

import React from "react";
import { Minus, Plus } from "lucide-react";

export function QuantitySelector({ quantity = 1, onDecrease, onIncrease, min = 1, max = 99 }) {
  return (
    <div className="inline-flex items-center border border-[#E5E5E5] bg-white">
      <button
        type="button"
        disabled={quantity <= min}
        onClick={onDecrease}
        className="p-2 text-[#111111] hover:bg-[#F9F9F9] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>
      <span className="w-9 text-center text-xs font-semibold text-[#111111] select-none">
        {quantity}
      </span>
      <button
        type="button"
        disabled={quantity >= max}
        onClick={onIncrease}
        className="p-2 text-[#111111] hover:bg-[#F9F9F9] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
