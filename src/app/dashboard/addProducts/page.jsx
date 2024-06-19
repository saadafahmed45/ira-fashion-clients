"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AddProducts = () => {
  const handleProductAdded = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const des = form.des.value;
    const photoUrl = form.photoUrl.value;
    const category = form.category.value;
    const price = form.price.value;
    const intPrice = parseInt(price); // Corrected parsing
    const product = { name, des, photoUrl, price: intPrice, category }; // Changed intPrice to price
    console.log(product);

    // data post

    fetch("https://ira-fashion-server.onrender.com/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("send", data);
        if (data.insertedId) {
          toast.success("Added the Product", {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          // form.reset();

          setTimeout(function () {
            location.reload(1);
          }, 3000);
        }
      })
      .catch((error) => {
        console.error("Error adding product:", error);
        toast.error("Error adding product", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      });
  };
  return (
    <div className="w-screen px-24 py-8 bg-slate-200">
      <div>
        <div>
          <h2 className="text-2xl font-bold mb-6 ">Add New Product</h2>
        </div>

        <div className="">
          <form
            onSubmit={handleProductAdded}
            method="post"
            className="form-control w-full max-w-lg	 flex gap-4"
          >
            <div>
              <div className="label">
                <label className="block text-gray-700 font-bold mb-2">
                  Product Name
                </label>
              </div>
              <input
                type="text"
                name="name"
                placeholder="Type here"
                className="input input-bordered w-full max-w-md input-secondary "
              />
            </div>
            <div>
              <div className="label">
                <label className="block text-gray-700 font-bold mb-2">
                  Description
                </label>
              </div>
              <textarea
                name="des"
                placeholder="Type Description"
                className="textarea textarea-bordered w-full max-w-md textarea-secondary"
                required
              ></textarea>
            </div>

            <div>
              <div className="label">
                <label className="block text-gray-700 font-bold mb-2">
                  Image URL
                </label>
              </div>
              <input
                type="text"
                name="photoUrl"
                placeholder="Type here"
                className="input input-bordered w-full max-w-md  input-secondary "
              />
            </div>

            <div>
              <div className="label">
                <label className="block text-gray-700 font-bold mb-2">
                  Price
                </label>
              </div>
              <input
                required
                type="number"
                name="price"
                placeholder="Type here"
                className="input input-bordered  input-secondary "
              />
            </div>

            <div>
              <div className="label">
                <label className="block text-gray-700 font-bold mb-2">
                  Category
                </label>
              </div>
              <select
                className="select select-secondary w-full max-w-xs"
                required
                type="text"
                name="category"
              >
                <option disabled selected>
                  Select product Category?
                </option>
                <option>Shoes</option>
                <option>T-shirt</option>
                <option>Dress</option>
                <option>Pant</option>
              </select>
            </div>

            <div className="button">
              <input
                type="submit"
                value="Add product"
                className="btn btn-outline btn-secondary"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProducts;
