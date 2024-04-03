"use client";
import React, { useEffect, useState } from "react";

const UpdatedProduct = ({ params }) => {
  const id = params.id;

  const [products, setProducts] = useState([]);

  const { _id, name, link, price, des } = products;
  useEffect(() => {
    fetch(`http://localhost:5000/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        console.log("data here", data);
      });
  }, []);

  const handleProductAdded = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const des = form.des.value;
    const link = form.link.value;
    const price = form.price.value;
    const intPrice = parseInt(price); // Corrected parsing
    const product = { name, des, link, price: intPrice }; // Changed intPrice to price
    console.log(product);

    // data post

    fetch("http://localhost:5000/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("send", data);
        // const newUsers = [...users, data];
        if (data.insertedId) {
          form.reset();
          location.reload();
        }
        // setUsers(newUsers);
      });
    toast.success("added the Product", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };

  return (
    <>
      <div className="w-screen px-24 py-8 bg-slate-200">
        <div>
          <div>
            <h2 className="text-2xl ">Update Product</h2>
            <h2>id : {id}</h2>
            <h2>Name : {products.name}</h2>
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
                  <span className="label-text">Description</span>
                </div>
                <input
                  type="text"
                  name="des"
                  placeholder="type Description"
                  className="input input-bordered w-full max-w-md  input-secondary "
                />
              </div>

              <div>
                <div className="label">
                  <span className="label-text">Image Link</span>
                </div>
                <input
                  type="text"
                  name="link"
                  placeholder="Type here"
                  className="input input-bordered w-full max-w-md  input-secondary "
                />
              </div>

              <div>
                <div className="label">
                  <span className="label-text">Product Price</span>
                </div>
                <input
                  type="number"
                  name="price"
                  placeholder="Type here"
                  className="input input-bordered  input-secondary "
                />
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
    </>
  );
};

export default UpdatedProduct;
