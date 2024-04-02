"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const Blog = () => {
  const [product, setProduct] = useState([]);
  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then((res) => res.json())
      .then((data) => setProduct(data));
  }, []);
  const { _id, name, link, price, des } = product;
  return (
    <div className="h- px-24 py-8">
      Blog
      <div>Products:{product.length}</div>
      <div className="grid grid-cols-3 ">
        {product.map(({ _id, name, link, price, description }) => (
          <div className="  w-[320px] h-[370px] shadow-lg rounded-md   mt-8">
            {/* card  */}
            <div className="flex justify-end m-2">
              <Link href={`/product/${_id}`}>
                <img
                  className="rounded-md w-[300px] relative left-0 top-0"
                  // width={80}
                  // height={80}
                  src={link}
                  alt={name}
                />
              </Link>
              <div className="absolute badge badge-secondary ">
                20% Discount
              </div>
            </div>
            <div className="p-2 m-2">
              <div className="flex justify-between ">
                <h2 className="text-2xl">{name}</h2>
                <title className="text-2xl">{name}</title>
                <h3 className="text-xl">$ {price}</h3>
              </div>
              <div className="mt-6 flex justify-between ">
                {" "}
                <button
                  className=" border-2 border-[#FF3EA5] bg-white text-[#FF3EA5]  hover:bg-[#FF3EA5] hover:text-white  py-1 px-2"
                  onClick={() => handleCartAdded(pd)}>
                  Add to cart
                </button>
                <Link href={`/product/${_id}`}>see more.</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;
