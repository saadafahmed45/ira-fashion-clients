"use client";
import React, { useEffect, useState } from "react";

const SingleBlog = ({ params }) => {
  const prID = params.id;

  const [product, setProduct] = useState([]);
  useEffect(() => {
    fetch(`http://localhost:5000/products/${prID}`)
      .then((res) => res.json())
      .then((data) => setProduct(data));
  }, []);
  const { _id, name, photoUrl, price, des } = product;

  return (
    <div className="    px-2  md:px-24 md:py-8">
      <div className="m-8 p-4 text-2xl text-center md:text-left md:text-3xl">
        Product Details
      </div>
      {/* warpper */}
      <div className=" flex place-items-center">
        <div className="shadow-xl bg-white w-[400px] md:w-full flex flex-col md:flex-row justify-around  items-center ">
          {/* img */}
          <div className="flex-2  ">
            <img
              className=" w-[400px]  md:h-[400px] rounded-md"
              src={photoUrl}
              alt={name}
            />
          </div>
          {/* content */}
          <div className="flex-1 flex flex-col gap-2  w-[80%]    m-8">
            <h2 className="text-2xl"> {name}</h2>
            <h2 className="text-xl md:text-2xl">Price: ${price}</h2>
            <h2>Details: {des}</h2>
            <div>
              <button
                className="mt-8 border-2 border-[#FF3EA5] bg-white text-[#FF3EA5]  hover:bg-[#FF3EA5] hover:text-white  py-1 px-2"
                onClick={() => handleCartAdded(product)}
              >
                Add to cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleBlog;
