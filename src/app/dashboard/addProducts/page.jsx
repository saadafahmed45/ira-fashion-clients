"use client";
import React from "react";

const AddProducts = () => {
  const handleProductAdded = (event) => {
    event.preventDefault();
    const from = event.target;
  };

  return (
    <div className="w-screen px-8 py-8 bg-slate-200">
      <div>
        <div>
          <h2 className="text-2xl ">Add New Product </h2>
        </div>

        <div className="">
          <form
            onSubmit={handleProductAdded}
            method="post"
            className="form-control w-full max-w-lg	 flex gap-4">
            <div>
              <div className="label">
                <span className="label-text">What is your Product name?</span>
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
                <span className="label-text">Product Description?</span>
              </div>
              <input
                type="text"
                name="name"
                placeholder="type Description"
                className="input input-bordered w-full max-w-md  input-secondary "
              />
            </div>

            <div>
              <input
                type="file"
                className="file-input file-input-bordered file-input-secondary w-full max-w-xs"
              />
            </div>
            <div>
              <div className="label">
                <span className="label-text">Product Price?</span>
              </div>
              <input
                type="text"
                placeholder="Type here"
                className="input input-bordered  input-secondary "
              />
            </div>
            <div className="">
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
