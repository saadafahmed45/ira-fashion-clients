import { productData } from "@/app/api/productData";
import React from "react";

const SingleProduct = ({ params }) => {
  const prID = params.id;
  const data = productData.products;
  const product = data.find((p) => p.id === parseInt(prID));
  const { id, name, img, price, description } = product;
  return (
    <div className="h-screen px-4  md:px-24 md:py-8 overflow-hidden flex">
      {/* warpper */}
      <div className=" flex items-center ">
        <div className="shadow-xl h-[500px] md:h-[400px] w-[500px] md:w-full flex flex-col md:flex-row justify-around ">
          {/* img */}
          <div className="flex-2  ">
            <img
              className=" w-[400px]  md:h-[400px] rounded-md"
              src={img}
              alt=""
            />
          </div>
          {/* content */}
          <div className="flex-1 gap-2    m-8">
            <h2 className="text-3xl">Name: {name}</h2>
            <h2 className="text-2xl">Price: ${price}</h2>
            <h2>Name: {description}</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
