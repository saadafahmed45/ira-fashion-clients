import React from "react";

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  hasNextPage,
  hasPrevPage,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 py-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrevPage}
        className="px-4 py-2 border border-stone-300 text-stone-700 rounded-sm text-xs font-medium hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        ← Previous
      </button>

      <div className="flex items-center gap-1.5 text-xs text-stone-600">
        Page <span className="font-semibold text-stone-900">{currentPage}</span> of{" "}
        <span className="font-semibold text-stone-900">{totalPages}</span>
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
        className="px-4 py-2 border border-stone-300 text-stone-700 rounded-sm text-xs font-medium hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        Next →
      </button>
    </div>
  );
};

export default Pagination;
