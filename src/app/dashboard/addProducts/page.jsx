"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Plus, X, Upload, Tag } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const AddProducts = () => {
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [variants, setVariants] = useState([{ size: "", color: "#6366f1", stock: 0, price: 0 }]);
  const [status, setStatus] = useState("draft");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [collections, setCollections] = useState([]);
  const [selectedCollections, setSelectedCollections] = useState([]);

  useEffect(() => {
    fetch(`${API}/collections`)
      .then((res) => res.json())
      .then((data) => setCollections(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Collections fetch error:", err));
  }, []);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + imageFiles.length > 5) {
      toast.warning("Max 5 images allowed");
      return;
    }
    setImageFiles((prev) => [...prev, ...files]);
    const previews = files.map((f) => URL.createObjectURL(f));
    setImagePreview((prev) => [...prev, ...previews]);
  };

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreview((prev) => prev.filter((_, i) => i !== index));
  };

  const addVariant = () => {
    setVariants([...variants, { size: "", color: "#6366f1", stock: 0, price: 0 }]);
  };

  const removeVariant = (index) => {
    if (variants.length === 1) return;
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = field === "stock" || field === "price" ? Number(value) : value;
    setVariants(updated);
  };

const toggleCollection = (id, name) => {
    setSelectedCollections((prev) =>
      prev.some((c) => c.id === id)
        ? prev.filter((c) => c.id !== id)
        : [...prev, { id, name }]
    );
  };

  const isCollectionSelected = (id) => selectedCollections.some((c) => c.id === id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.target;
    const formData = new FormData();

    formData.append("title", form.title.value);
    formData.append("description", form.description.value);
    formData.append("price", form.price.value);
    formData.append("productType", form.productType.value);
    formData.append("vendor", form.vendor?.value || "");
    formData.append("sku", form.sku?.value || "");
    formData.append("status", status);
    formData.append("variants", JSON.stringify(variants));

    // ✅ FIX: Send as comma-separated string (backend parseIds handles both formats)
    formData.append("collectionIds", selectedCollections.map((c) => c.id).join(","));

    imageFiles.forEach((file) => formData.append("images", file));

    try {
      const res = await fetch(`${API}/products`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");

      toast.success("✅ Product saved successfully!");
      console.log(formData);
      
      form.reset();
      setImageFiles([]);
      setImagePreview([]);
      setVariants([{ size: "", color: "#6366f1", stock: 0, price: 0 }]);
      setSelectedCollections([]);
    } catch (err) {
      toast.error("❌ " + (err.message || "Upload failed"));
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-32">
      <form onSubmit={handleSubmit} className="max-w-7xl mx-auto p-6" encType="multipart/form-data">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-gray-500 mt-1">Fill in the details to create a new product listing</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* LEFT SIDE */}
          <div className="lg:col-span-3 space-y-6">

            {/* Product Info */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5 text-indigo-500" /> Product Information
              </h2>
              <div className="space-y-4">
                <input
                  name="title"
                  placeholder="Product title *"
                  required
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                />
                <textarea
                  name="description"
                  placeholder="Product description *"
                  rows={4}
                  required
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition resize-none"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    name="vendor"
                    placeholder="Vendor / Brand"
                    className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  />
                  <input
                    name="sku"
                    placeholder="SKU (optional)"
                    className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  />
                </div>
              </div>
            </div>

            {/* Media */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-indigo-500" /> Media
              </h2>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition">
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Click to upload images (max 5)</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              {imagePreview.length > 0 && (
                <div className="grid grid-cols-5 gap-3 mt-4">
                  {imagePreview.map((img, i) => (
                    <div key={i} className="relative group">
                      <img src={img} className="h-24 w-full object-cover rounded-lg" alt={`preview-${i}`} />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pricing & Type */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Pricing & Category</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Base Price *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">$</span>
                    <input
                      type="number"
                      name="price"
                      required
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      className="w-full border border-gray-300 pl-8 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Type</label>
                  <input
                    name="productType"
                    placeholder="e.g. Shirt, Pants, Dress"
                    className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  />
                </div>
              </div>
            </div>

            {/* Variants */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Variants</h2>
              <div className="space-y-3">
                {variants.map((variant, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <select
                      className="border border-gray-300 px-3 py-2 rounded-lg text-sm flex-1 focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={variant.size}
                      onChange={(e) => updateVariant(index, "size", e.target.value)}
                    >
                      <option value="">Size</option>
                      <option>XS</option>
                      <option>S</option>
                      <option>M</option>
                      <option>L</option>
                      <option>XL</option>
                      <option>XXL</option>
                    </select>
                    <div className="flex items-center gap-1">
                      <label className="text-xs text-gray-500">Color</label>
                      <input
                        type="color"
                        value={variant.color}
                        onChange={(e) => updateVariant(index, "color", e.target.value)}
                        className="w-10 h-10 rounded border cursor-pointer"
                      />
                    </div>
                    <input
                      type="number"
                      placeholder="Stock"
                      value={variant.stock}
                      min="0"
                      onChange={(e) => updateVariant(index, "stock", e.target.value)}
                      className="border border-gray-300 px-3 py-2 rounded-lg text-sm w-24 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                    <div className="relative w-28">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                      <input
                        type="number"
                        placeholder="Price"
                        value={variant.price}
                        min="0"
                        step="0.01"
                        onChange={(e) => updateVariant(index, "price", e.target.value)}
                        className="border border-gray-300 pl-6 pr-2 py-2 rounded-lg text-sm w-full focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      disabled={variants.length === 1}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-30"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addVariant}
                className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mt-4 text-sm font-medium transition"
              >
                <Plus className="w-4 h-4" /> Add variant
              </button>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-6">
            {/* Status */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold mb-3 text-gray-800">Status</h3>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border border-gray-300 px-3 py-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              >
                <option value="draft">📝 Draft</option>
                <option value="active">✅ Active</option>
              </select>
              <p className="text-xs text-gray-400 mt-2">
                {status === "draft" ? "Product is not visible to customers" : "Product is live and visible"}
              </p>
            </div>

          {/* Collections */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold mb-3 text-gray-800">Collections</h3>
              {collections.length === 0 ? (
                <p className="text-xs text-gray-400">No collections found. Create a collection first.</p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {collections.map((c) => (
                    <label key={c._id} className="flex items-center gap-2.5 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={isCollectionSelected(c._id)}
                        onChange={() => toggleCollection(c._id, c.name)}
                        className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                      />
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {c.imageUrl && (
                          <img src={c.imageUrl} className="w-7 h-7 rounded object-cover" alt={c.name} />
                        )}
                        <span className="text-sm text-gray-700 group-hover:text-indigo-600 truncate transition">
                          {c.name}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
            {/* Summary */}
            {selectedCollections.length > 0 && (
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                <p className="text-xs font-semibold text-indigo-700 mb-1">
                  Added to {selectedCollections.length} collection{selectedCollections.length > 1 ? "s" : ""}
                </p>
                <div className="flex flex-wrap gap-1">
                  {selectedCollections.map((id) => {
                    const col = collections.find((c) => c._id === id);
                    return col ? (
                      <span key={id} className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                        {col.name}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sticky Save Bar */}
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-lg p-4 flex items-center justify-between z-50">
          <div className="text-sm text-gray-500">
            {imageFiles.length > 0 && `${imageFiles.length} image(s) ready · `}
            {variants.length} variant(s)
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStatus("draft")}
              className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition"
            >
              Save as Draft
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              onClick={() => setStatus("active")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 rounded-lg text-sm font-semibold transition shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                "Publish Product"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProducts;