"use client";

import React from "react";
import Link from "next/link";
import useProducts from "@/hooks/useProducts";

const Blog = () => {
  const { data: response, isLoading } = useProducts({ limit: 50, status: "active" });
  const products = response?.data || [];

  if (isLoading) return <div className="p-24 text-center">Loading...</div>;

  return (
    <div className="px-24 py-8">
      Blog
      <div>Products:{products.length}</div>
      <div className="grid grid-cols-3 gap-8">
        {products.map(({ _id, title, name, photoUrl, images, price, category, productType }) => {
          const displayName = title || name;
          const displayImage = images?.[0] || photoUrl;
          return (
            <div key={_id} className="w-[320px] h-[370px] shadow-lg rounded-md mt-8">
              <div className="flex justify-end m-2 relative">
                <Link href={`/blog/${_id}`}>
                  {displayImage && (
                    <img
                      className="rounded-md w-[300px] relative left-0 top-0 h-[220px] object-cover"
                      src={displayImage}
                      alt={displayName}
                    />
                  )}
                </Link>
                <div className="absolute top-2 right-2 badge badge-secondary">
                  {productType || category}
                </div>
              </div>
              <div className="p-2 m-2">
                <div className="flex justify-between">
                  <h2 className="text-xl font-bold">{displayName}</h2>
                  <h3 className="text-xl">${price}</h3>
                </div>
                <div className="mt-6 flex justify-between">
                  <Link href={`/blog/${_id}`} className="text-pink-600 hover:underline">see more.</Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Blog;
