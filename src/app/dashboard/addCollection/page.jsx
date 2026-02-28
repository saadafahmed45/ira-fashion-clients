"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Upload, Images, X } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const AddCollection = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showProducts, setShowProducts] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API}/products`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const toggleProduct = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !description || !imageFile) {
      toast.error("Name, description and image are required!");
      return;
    }
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("image", imageFile);
    // ✅ FIX: Send as comma-separated string
    formData.append("productIds", selectedProducts.join(","));

    try {
      const res = await fetch(`${API}/collections`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save collection");

      toast.success("✅ Collection created successfully!");
      setName("");
      setDescription("");
      setImageFile(null);
      setImagePreview(null);
      setSelectedProducts([]);
    } catch (err) {
      toast.error("❌ " + (err.message || "Failed to save collection"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Create Collection</h1>
          <p className="text-gray-500 mt-1">Group products into a themed collection</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="font-semibold text-gray-800">Collection Details</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Collection Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                placeholder="e.g. Summer Collection 2025"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition resize-none"
                placeholder="Describe this collection..."
                required
              />
            </div>
          </div>

          {/* Image */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="font-semibold text-gray-800 mb-3">Cover Image *</h2>
            {imagePreview ? (
              <div className="relative">
                <img src={imagePreview} className="w-full h-48 object-cover rounded-lg" alt="preview" />
                <button
                  type="button"
                  onClick={() => { setImageFile(null); setImagePreview(null); }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition">
                <Upload className="w-10 h-10 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Click to upload cover image</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" required />
              </label>
            )}
          </div>

          {/* Products Selection */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="font-semibold text-gray-800">Add Products</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {selectedProducts.length > 0 ? `${selectedProducts.length} selected` : "Optional — add products later"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowProducts(!showProducts)}
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
              >
                {showProducts ? "Hide" : "Browse Products"}
              </button>
            </div>

            {showProducts && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-64 overflow-y-auto border border-gray-100 rounded-lg p-3 bg-gray-50">
                {products.length === 0 ? (
                  <p className="col-span-3 text-center text-sm text-gray-400 py-4">No products available</p>
                ) : (
                  products.map((product) => (
                    <div
                      key={product._id}
                      onClick={() => toggleProduct(product._id)}
                      className={`cursor-pointer border-2 rounded-lg overflow-hidden transition ${
                        selectedProducts.includes(product._id)
                          ? "border-indigo-500 ring-2 ring-indigo-200"
                          : "border-transparent hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={product.images?.[0] || "/placeholder.png"}
                        alt={product.title}
                        className="h-20 w-full object-cover"
                      />
                      <div className="p-2 bg-white">
                        <p className="text-xs text-gray-700 font-medium truncate">{product.title}</p>
                        <p className="text-xs text-gray-400">${product.price}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {selectedProducts.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {selectedProducts.map((id) => {
                  const p = products.find((pr) => pr._id === id);
                  return p ? (
                    <span key={id} className="flex items-center gap-1 text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                      {p.title}
                      <button type="button" onClick={() => toggleProduct(id)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ) : null;
                })}
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 text-white px-6 py-3.5 rounded-xl hover:bg-indigo-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Creating Collection...
              </>
            ) : (
              "Create Collection"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCollection;