"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  Package,
  DollarSign,
  Tag,
  Image as ImageIcon,
  Info,
  Palette,
  Ruler,
  Box,
  Save,
  X,
} from "lucide-react";

const AddProducts = () => {
  const [imagePreview, setImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#000000");

  const handleImageUrlChange = (e) => {
    setImagePreview(e.target.value);
  };

  const handleColorChange = (e) => {
    setSelectedColor(e.target.value);
  };

  const handleProductAdded = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.target;

    const product = {
      title: form.title.value,
      description: form.description.value,
      price: Number(form.price.value),
      category: form.category.value,
      productType: form.productType.value,
      images: [form.image.value],
      variants: [
        {
          size: form.size.value,
          color: selectedColor,
          stock: Number(form.stock.value),
        },
      ],
      metafields: {
        fabric: form.fabric.value,
        fit: form.fit.value,
        occasion: form.occasion.value,
      },
      status: "active",
      createdAt: new Date(),
    };

    try {
      const res = await fetch(
        "https://ira-fashion-server.onrender.com/products",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(product),
        }
      );

      if (!res.ok) throw new Error("Failed to add product");

      toast.success("Product added successfully! 🎉", {
        position: "bottom-right",
        autoClose: 3000,
      });

      form.reset();
      setImagePreview("");
      setSelectedColor("#000000");
    } catch (error) {
      toast.error("Failed to add product. Please try again.", {
        position: "bottom-right",
        autoClose: 3000,
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Add New Product
          </h1>
          <p className="text-gray-600">
            Fill in the details below to add a new product to your inventory
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleProductAdded} className="space-y-6">
              {/* Basic Information */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Info className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Basic Information
                  </h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Product Title *
                    </label>
                    <input
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      name="title"
                      placeholder="e.g., Premium Cotton T-Shirt"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Product Image URL *
                    </label>
                    <div className="relative">
                      <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        name="image"
                        placeholder="https://example.com/image.jpg"
                        onChange={handleImageUrlChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                      name="description"
                      placeholder="Describe your product in detail..."
                      rows={4}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Pricing & Category */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Pricing & Category
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Price ($) *
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      name="price"
                      placeholder="29.99"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      defaultValue=""
                      required
                    >
                      <option value="" disabled>
                        Select Category
                      </option>
                      <option>Men</option>
                      <option>Women</option>
                      <option>Kids</option>
                      <option>Unisex</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Product Type *
                    </label>
                    <select
                      name="productType"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      defaultValue=""
                      required
                    >
                      <option value="" disabled>
                        Select Product Type
                      </option>
                      <option>Dress</option>
                      <option>T-Shirt</option>
                      <option>Shirt</option>
                      <option>Pant</option>
                      <option>Jeans</option>
                      <option>Hoodie</option>
                      <option>Jacket</option>
                      <option>Sweater</option>
                      <option>Shorts</option>
                      <option>Skirt</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Variant Details */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Tag className="w-6 h-6 text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Variant Details
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Ruler className="w-4 h-4 inline mr-1" />
                      Size
                    </label>
                    <select
                      name="size"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select Size
                      </option>
                      <option>XS</option>
                      <option>S</option>
                      <option>M</option>
                      <option>L</option>
                      <option>XL</option>
                      <option>XXL</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Palette className="w-4 h-4 inline mr-1" />
                      Color
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        name="color"
                        value={selectedColor}
                        onChange={handleColorChange}
                        className="h-12 w-20 border border-gray-300 rounded-lg cursor-pointer"
                      />
                      <div className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-sm font-mono">
                        {selectedColor}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Box className="w-4 h-4 inline mr-1" />
                      Stock *
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      name="stock"
                      placeholder="100"
                      min="0"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Product Attributes */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Package className="w-6 h-6 text-orange-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Product Attributes
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Fabric
                    </label>
                    <input
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      name="fabric"
                      placeholder="e.g., Cotton, Denim, Polyester"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Fit
                    </label>
                    <input
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      name="fit"
                      placeholder="e.g., Slim, Regular, Relaxed"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Occasion
                    </label>
                    <input
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      name="occasion"
                      placeholder="e.g., Casual, Formal, Party, Sports"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition font-semibold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Adding Product...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Add Product
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Preview Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Image Preview
              </h3>

              {imagePreview ? (
                <div className="relative group">
                  <img
                    src={imagePreview}
                    alt="Product Preview"
                    className="w-full h-64 object-cover rounded-lg shadow-md"
                    onError={(e) => {
                      e.target.src = "";
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg" />
                  <button
                    type="button"
                    onClick={() => setImagePreview("")}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                  >
                    <X className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              ) : null}

              <div
                className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex flex-col items-center justify-center"
                style={{ display: imagePreview ? "none" : "flex" }}
              >
                <ImageIcon className="w-16 h-16 text-gray-400 mb-3" />
                <p className="text-gray-500 text-sm text-center">
                  Enter an image URL to see preview
                </p>
              </div>

              {/* Quick Tips */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2 text-sm">
                  💡 Quick Tips
                </h4>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• Use high-quality product images</li>
                  <li>• Write detailed descriptions</li>
                  <li>• Set competitive pricing</li>
                  <li>• Keep stock updated regularly</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProducts;
