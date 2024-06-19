"use client";

import { productApiUrl } from "@/app/api/productApi";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ManageProduct = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  useEffect(() => {
    fetch(productApiUrl)
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  const handleDelete = (_id) => {
    fetch(`https://ira-fashion-server.onrender.com/products/${_id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.deletedCount > 0) {
          setProducts(products.filter((product) => product._id !== _id));
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
        }
      });
  };

  const handleEdit = (product) => {
    setCurrentProduct(product);
    setIsModalOpen(true);
  };

  const handleUpdate = (updatedProduct) => {
    fetch(
      `https://ira-fashion-server.onrender.com/products/${updatedProduct._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProduct),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.modifiedCount > 0) {
          setProducts(
            products.map((product) =>
              product._id === updatedProduct._id ? updatedProduct : product
            )
          );
          setIsModalOpen(false);
          toast.success("Product is Updated!", {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        }
      });
  };

  return (
    <div className="px-8 py-8 w-full max-w-screen-lg mx-auto">
      <div>
        {products.length === 0 ? (
          <Link
            className="text-lg text-blue-500"
            href={"/dashboard/addProducts"}
          >
            Add the products...
          </Link>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-auto w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2">Item</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Category</th>
                  <th className="px-4 py-2">Price</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map(
                  ({ _id, name, photoUrl, price, des, category }, index) => (
                    <tr key={_id} className="border-b">
                      <th className="px-4 py-2">{index + 1}</th>
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="mask mask-squircle w-12 h-12">
                              <img src={photoUrl} alt="Product Image" />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">{name}</div>
                            <div className="text-sm opacity-50">${price}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <span className="badge badge-ghost badge-sm">
                          {category}
                        </span>
                      </td>
                      <td className="px-4 py-2">${price}</td>
                      <td className="px-4 py-2 flex space-x-2">
                        <button
                          onClick={() =>
                            handleEdit({
                              _id,
                              name,
                              photoUrl,
                              price,
                              des,
                              category,
                            })
                          }
                          className="btn btn-outline btn-success"
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-outline btn-error"
                          onClick={() => handleDelete(_id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && currentProduct && (
        <EditProductModal
          product={currentProduct}
          onClose={() => setIsModalOpen(false)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

const EditProductModal = ({ product, onClose, onUpdate }) => {
  const [updatedProduct, setUpdatedProduct] = useState({ ...product });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProduct({ ...updatedProduct, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(updatedProduct);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl mb-4">Edit Product</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={updatedProduct.name}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Price</label>
            <input
              type="number"
              name="price"
              value={updatedProduct.price}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Description</label>
            <textarea
              name="des"
              value={updatedProduct.des}
              onChange={handleChange}
              className="textarea textarea-bordered w-full"
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Category</label>
            <input
              type="text"
              name="category"
              value={updatedProduct.category}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="btn btn-outline mr-2"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-success">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageProduct;
