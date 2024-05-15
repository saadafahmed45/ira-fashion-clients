"use client";

import productApi from "@/app/api/productApi";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ManageProduct = () => {
  const [product, setProduct] = useState([]);
  
  useEffect(() => {
    fetch(productApi)
      .then((res) => res.json())
      .then((data) => setProduct(data));
  }, []);

  // delete product

  const handleDelete = (_id) => {
    console.log("dlt", _id);

    fetch(`https://ira-fashion-server.onrender.com/products/${_id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.deletedCount > 0) {
          location.reload();
        }
      });
    toast.warn("Product is Deleted!", {
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
    <div className="px-8 py-8">
      <div>
        <div className="overflow-x-auto">
          {product.length === 0 ? (
            <div className="flex items-center place-content-center">
              <span className="loading loading-bars loading-[50px]"></span>
            </div>
          ) : (
            <table className="table">
              {/* head */}
              <thead>
                <tr>
                  <th>
                    <label>
                      <input type="checkbox" className="checkbox" />
                    </label>
                  </th>
                  <th>Name</th>
                  <th>Job</th>
                  <th>Favorite Color</th>
                  <th> Color</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {/* row 1 */}
                {product.map(({ _id, name, link, price, des }) => (
                  <tr key={_id}>
                    <th>
                      <label>
                        {/* <input type="checkbox" className="checkbox" /> */}
                      </label>
                    </th>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle w-12 h-12">
                            <img
                              src={link}
                              alt="Avatar Tailwind CSS Component"
                            />
                          </div>
                        </div>

                        <div>
                          <div className="font-bold">{name}</div>
                          <div className="text-sm opacity-50">${price}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      ${price}
                      <br />
                      <span className="badge badge-ghost badge-sm">
                        Desktop Support Technician
                      </span>
                    </td>
                    <td>
                      <Link
                        href={`/dashboard/manageProduct/${_id}`}
                        className="btn btn-outline btn-success">
                        Edit
                      </Link>
                    </td>
                    <th>
                      <button
                        className="btn btn-outline btn-error"
                        onClick={() => handleDelete(_id)}>
                        Delete
                      </button>
                    </th>
                  </tr>
                ))}
              </tbody>
              {/* foot */}
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageProduct;
