import React from "react";
import { brand } from "@/config/brand";

const NoticeBanner = () => {
  if (!brand.promoBar) return null;

  return (
    <div className="bg-brand text-white text-center py-2.5 text-sm font-medium">
      <p className="flex items-center justify-center gap-2">
        <span className="hidden sm:inline">🎉</span>
        <span>{brand.promoBar}</span>
        <span className="hidden sm:inline">🎉</span>
      </p>
    </div>
  );
};

export default NoticeBanner;
