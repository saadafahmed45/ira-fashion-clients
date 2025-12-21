import React from "react";

const NoticeBannar = () => {
  return (
    <div className="bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 text-white text-center py-2.5 text-sm font-medium">
      <p className="flex items-center justify-center gap-2">
        <span className="hidden sm:inline">🎉</span>
        <span>Free Shipping on Orders Over $50 | Use Code: FREESHIP</span>
        <span className="hidden sm:inline">🎉</span>
      </p>
    </div>
  );
};

export default NoticeBannar;
