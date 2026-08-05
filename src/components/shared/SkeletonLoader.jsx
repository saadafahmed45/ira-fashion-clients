import React from "react";

export const Skeleton = ({ className = "", ...props }) => {
  return (
    <div
      className={`animate-pulse rounded bg-stone-200/80 dark:bg-stone-800 ${className}`}
      {...props}
    />
  );
};

export const ProductCardSkeleton = () => {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="aspect-[3/4] w-full rounded-sm" />
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-6 w-2/3" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-1/4" />
        <Skeleton className="h-8 w-1/4 rounded-sm" />
      </div>
    </div>
  );
};

export const TableRowSkeleton = ({ cols = 5 }) => {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: cols }).map((_, idx) => (
        <td key={idx} className="p-4">
          <Skeleton className="h-5 w-full" />
        </td>
      ))}
    </tr>
  );
};

export default Skeleton;
