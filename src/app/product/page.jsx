// "use client"; // This ensures the component is client-side.
// import React, { useState, useEffect, useRef } from "react";
import productApi from "../api/productApi";
import ProductCard from "../components/ProductCard";

const Product = async () => {
  const productsData = await productApi()
  // const [shoeItems, setShoeItems] = useState([]);
  // const [dressItems, setDressItems] = useState([]);
  // const [shirtItems, setShirtItems] = useState([]);
  // const [page, setPage] = useState(1); // for pagination
  // const [loading, setLoading] = useState(false);
  // const loaderRef = useRef(null);

  // // Function to fetch more products
  // const fetchMoreProducts = async () => {
  //   setLoading(true);
  //   const data = await productApi(page); // Assuming your API supports pagination with a page number

  //   // Filter the products by categories
  //   const newShoeItems = data?.filter((item) => item.category === "Shoes");
  //   const newDressItems = data?.filter((item) => item.category === "Dress");
  //   const newShirtItems = data?.filter((item) => item.category === "T-shirt");

  //   // Append the new items to the existing list
  //   setShoeItems((prev) => [...newShoeItems]);
  //   setDressItems((prev) => [...newDressItems]);
  //   setShirtItems((prev) => [...newShirtItems]);

  //   setLoading(false);
  // };

  // // Infinite scroll observer
  // useEffect(() => {
  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       if (entries[0].isIntersecting) {
  //         setPage((prevPage) => prevPage + 1); // Trigger next page
  //       }
  //     },
  //     { threshold: 1 }
  //   );

  //   if (loaderRef.current) {
  //     observer.observe(loaderRef.current);
  //   }

  //   return () => {
  //     if (loaderRef.current) {
  //       observer.unobserve(loaderRef.current);
  //     }
  //   };
  // }, []);

  // // Fetch more products when page changes
  // useEffect(() => {
  //   fetchMoreProducts();
  // }, [page]);


  const newShoeItems = productsData?.filter((item) => item.category === "Shoes");
  const newDressItems = productsData?.filter((item) => item.category === "Dress");
  const newShirtItems = productsData?.filter((item) => item.category === "T-shirt");

  return (
    <div className="h-full py-8 px-4  md:px-24 my-8 space-y-6">
      <div>
        <h2 className="text-2xl px-2">Shoes Collection</h2>
      </div>
      {/* Shoe Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 justify-items-center">
        {newShoeItems?.map((pd) => (
          <ProductCard pd={pd} key={pd._id} />
        ))}
      </div>

      <div>
        <h2 className="text-2xl py-2">Dress Collection</h2>
      </div>
      {/* Dress Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 justify-items-center">
        {newDressItems?.map((pd) => (
          <ProductCard pd={pd} key={pd._id} />
        ))}
      </div>

      <div>
        <h2 className="text-2xl py-2">T-Shirt Collection</h2>
      </div>
      {/* Shirt Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 justify-items-center">
        {newShirtItems?.map((pd) => (
          <ProductCard pd={pd} key={pd._id} />
        ))}
      </div>

      {/* Infinite Scroll Loader */}
      {/* <div ref={loaderRef} className="h-12  flex justify-center items-center">
        {loading ? "Loading more products..." : ""}
      </div> */}
    </div>
  );
};

export default Product;
