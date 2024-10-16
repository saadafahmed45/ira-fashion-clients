"use client";
import { CartContext } from "@/app/Context/Context";
import { productData } from "@/app/api/productData";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";

const SingleProduct = ({ params }) => {
  const id = params.id;
  // const data = productData.products;
  // const product = data.find((p) => p.id === parseInt(prID));

  const { handleCartAdded } = useContext(CartContext);
  const [product, setProduct] = useState([]);

  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    fetch(`https://ira-fashion-server.onrender.com/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data));
  }, [id]);

  // Fetch related products based on category
  useEffect(() => {
    if (product.category) {
      fetch(`https://ira-fashion-server.onrender.com/products/${id}/related`)
        .then((res) => res.json())
        .then((data) => setRelatedProducts(data));
    }
  }, [product]);
  console.log(relatedProducts);

  const { _id, name, photoUrl, price, des } = product;

  return (
    <div className=" py-2 md:px-16 ">
      <div class="text-gray-600 body-font overflow-hidden">
        <div class="container px-4  mx-auto">
          <div className="text-sm breadcrumbs m-2 ">
            <ul>
              <li>
                <Link href={"/"}>Home</Link>
              </li>
              <li>
                <a className="font-semibold">Product Details</a>
              </li>
            </ul>
          </div>
          <div class="lg:w-4/5 mx-auto flex flex-wrap  py-16">
            <img
              alt="ecommerce"
              class="lg:w-1/2 w-full lg:h-auto h-64 object-contain object-center rounded"
              src={photoUrl}
            />
            <div class="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
              <h2 class="text-sm title-font text-gray-500 tracking-widest">
                Adidas
              </h2>
              <h1 class="text-gray-900 text-3xl title-font font-medium mb-1">
                {name}
              </h1>
              <div class="flex mb-4">
                <span class="flex items-center">
                  <svg
                    fill="currentColor"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeL
                    inejoin="round"
                    strokeWidth="2"
                    class="w-4 h-4 text-pink-500"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                  </svg>
                  <svg
                    fill="currentColor"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeL
                    inejoin="round"
                    strokeWidth="2"
                    class="w-4 h-4 text-pink-500"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                  </svg>
                  <svg
                    fill="currentColor"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeL
                    inejoin="round"
                    strokeWidth="2"
                    class="w-4 h-4 text-pink-500"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                  </svg>
                  <svg
                    fill="currentColor"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeL
                    inejoin="round"
                    strokeWidth="2"
                    class="w-4 h-4 text-pink-500"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                  </svg>
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeL
                    inejoin="round"
                    strokeWidth="2"
                    class="w-4 h-4 text-pink-500"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                  </svg>
                  <span class="text-gray-600 ml-3">4 Reviews</span>
                </span>
                <span class="flex ml-3 pl-3 py-2 border-l-2 border-gray-200 space-x-2s">
                  <a class="text-gray-500">
                    <svg
                      fill="currentColor"
                      strokeLinecap="round"
                      strokeL
                      inejoin="round"
                      strokeWidth="2"
                      class="w-5 h-5"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                    </svg>
                  </a>
                  <a class="text-gray-500">
                    <svg
                      fill="currentColor"
                      strokeLinecap="round"
                      strokeL
                      inejoin="round"
                      strokeWidth="2"
                      class="w-5 h-5"
                      viewBox="0 0 24 24"
                    >
                      <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                    </svg>
                  </a>
                  <a class="text-gray-500">
                    <svg
                      fill="currentColor"
                      strokeLinecap="round"
                      strokeL
                      inejoin="round"
                      strokeWidth="2"
                      class="w-5 h-5"
                      viewBox="0 0 24 24"
                    >
                      <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
                    </svg>
                  </a>
                </span>
              </div>
              <p class="leading-relaxed">{des}</p>
              <div class="flex mt-6 items-center pb-5 border-b-2 border-gray-100 mb-5">
                <div class="flex">
                  <span class="mr-3">Color</span>
                  <button class="border-2 border-gray-300 rounded-full w-6 h-6 focus:outline-none"></button>
                  <button class="border-2 border-gray-300 ml-1 bg-gray-700 rounded-full w-6 h-6 focus:outline-none"></button>
                  <button class="border-2 border-gray-300 ml-1 bg-pink-500 rounded-full w-6 h-6 focus:outline-none"></button>
                </div>
                <div class="flex ml-6 items-center">
                  <span class="mr-3">Size</span>
                  <div class="relative">
                    <select class="rounded border appearance-none border-gray-300 py-2 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-500 text-base pl-3 pr-10">
                      <option>SM</option>
                      <option>M</option>
                      <option>L</option>
                      <option>XL</option>
                    </select>
                    <span class="absolute right-0 top-0 h-full w-10 text-center text-gray-600 pointer-events-none flex items-center justify-center">
                      <svg
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        class="w-4 h-4"
                        viewBox="0 0 24 24"
                      >
                        <path d="M6 9l6 6 6-6"></path>
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
              <div class="flex">
                <span class="title-font font-medium text-2xl text-gray-900">
                  $ {price}
                </span>
                <button
                  class="flex ml-auto text-white bg-pink-500 border-0 py-2 px-6 focus:outline-none hover:bg-pink-600 rounded"
                  onClick={() => handleCartAdded(product)}
                >
                  Add to Cart
                </button>
                <button class="rounded-full w-10 h-10 bg-gray-200 p-0 border-0 inline-flex items-center justify-center text-gray-500 ml-4">
                  <svg
                    fill="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    class="w-5 h-5"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className="related-products">
            <h2 className="text-xl font-semibold mb-4">Related Products</h2>
            <div className="grid grid-cols-4 gap-4">
              {relatedProducts.map((relatedProduct) => (
                <div
                  key={relatedProduct._id}
                  className="related-product border p-4 rounded-lg"
                >
                  <img
                    src={relatedProduct.photoUrl}
                    alt={relatedProduct.name}
                    className="object-contain h-48 w-full mb-2"
                  />
                  <h3 className="text-lg">{relatedProduct.name}</h3>
                  <p>${relatedProduct.price}</p>
                  <Link href={`/product/${relatedProduct._id}`}>
                    <button className="mt-2 text-white bg-pink-500 px-4 py-2 rounded">
                      View
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
