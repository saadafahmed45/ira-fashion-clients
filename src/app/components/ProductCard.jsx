import Image from "next/image";
import Link from "next/link";
import React, { useContext } from "react";
import { CartContext } from "../Context/Context";

const ProductCard = ({ pd }) => {
  const { id, name, img, price, description } = pd;
  const { handleCartAdded } = useContext(CartContext);

  return (
    <div className="  w-[320px] h-[370px] shadow-lg rounded-md   mt-8">
      {/* card  */}
      <div className="flex justify-center m-2">
        <Image
          className="rounded-md w-[300px]"
          width={80}
          height={80}
          src={img}
          alt=""
        />
      </div>
      <div className="p-2 m-2">
        <div className="flex justify-between ">
          <h2 className="text-2xl">{name}</h2>
          <h3 className="text-xl">$ {price}</h3>
        </div>
        <div className="mt-6 flex justify-between ">
          {" "}
          <button
            className=" border-2 border-[#FF3EA5] bg-white text-[#FF3EA5]  hover:bg-[#FF3EA5] hover:text-white  py-1 px-2"
            onClick={() => handleCartAdded(pd)}>
            Add to cart
          </button>
          <Link href={`/product/${id}`}>see more.</Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
