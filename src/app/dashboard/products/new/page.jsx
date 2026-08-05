"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../../lib/api";
import { toast } from "react-toastify";
import { Plus, Trash2, X, Upload, ArrowLeft } from "lucide-react";
import Link from "next/link";

const INITIAL_FORM = {
  title: "", description: "", price: "", compareAtPrice: "",
  vendor: "Ira Fashion", productType: "", tags: "", status: "draft",
  sku: "", barcode: "", collectionIds: [],
};

const INITIAL_VARIANT = { size: "", color: "", stock: 0, price: 0, sku: "" };

const ProductFormPage = ({ isEdit = false }) => {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const productId = params?.id;

  const [form, setForm] = useState(INITIAL_FORM);
  const [variants, setVariants] = useState([]);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  // Fetch existing product for edit mode
  const { data: product, isLoading: isFetching } = useQuery({
    queryKey: ["product-edit", productId],
    queryFn: async () => {
      const res = await api.get(`/products/${productId}`);
      return res.data;
    },
    enabled: !!productId && isEdit,
  });

  // Fetch collections for selector
  const { data: collections = [] } = useQuery({
    queryKey: ["collections-list"],
    queryFn: async () => {
      const res = await api.get("/collections");
      return res.data;
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (product) {
      setForm({
        title: product.title || "",
        description: product.description || "",
        price: product.price || "",
        compareAtPrice: product.compareAtPrice || "",
        vendor: product.vendor || "Ira Fashion",
        productType: product.productType || "",
        tags: (product.tags || []).join(", "),
        status: product.status || "draft",
        sku: product.sku || "",
        barcode: product.barcode || "",
        collectionIds: (product.collectionIds || []).map((c) => c._id || c),
      });
      setVariants(product.variants || []);
      setExistingImages(product.images || []);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
    const previews = files.map((f) => URL.createObjectURL(f));
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  const removeNewImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const addVariant = () => setVariants((prev) => [...prev, { ...INITIAL_VARIANT }]);
  const removeVariant = (i) => setVariants((prev) => prev.filter((_, idx) => idx !== i));
  const updateVariant = (i, field, value) => {
    setVariants((prev) => prev.map((v, idx) => idx === i ? { ...v, [field]: value } : v));
  };

  const toggleCollection = (id) => {
    setForm((prev) => ({
      ...prev,
      collectionIds: prev.collectionIds.includes(id)
        ? prev.collectionIds.filter((c) => c !== id)
        : [...prev.collectionIds, id],
    }));
  };

  const mutation = useMutation({
    mutationFn: async (formData) => {
      if (isEdit) {
        return api.put(`/products/${productId}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
      }
      return api.post("/products", formData, { headers: { "Content-Type": "multipart/form-data" } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success(`Product ${isEdit ? "updated" : "created"} successfully!`);
      router.push("/dashboard/products");
    },
    onError: (err) => toast.error(err.message || "Failed to save product"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (key === "collectionIds") {
        fd.append(key, value.join(","));
      } else {
        fd.append(key, value);
      }
    });

    fd.append("variants", JSON.stringify(variants));

    // Append new image files
    images.forEach((img) => fd.append("images", img));

    // Send existing image URLs as part of the payload (not overwriting all)
    fd.append("existingImages", JSON.stringify(existingImages));

    mutation.mutate(fd);
  };

  if (isFetching) {
    return <div className="p-8 text-stone-500 animate-pulse">Loading product...</div>;
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/products" className="p-2 hover:bg-stone-100 rounded-sm transition">
          <ArrowLeft size={18} className="text-stone-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-stone-900">{isEdit ? "Edit Product" : "Add New Product"}</h1>
          <p className="text-stone-500 text-sm">{isEdit ? "Update product details" : "Create a new product listing"}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* LEFT: Main Product Info */}
          <div className="lg:col-span-2 space-y-5">
            {/* Basic Info */}
            <div className="bg-white border border-stone-100 rounded-sm shadow-sm p-6 space-y-4">
              <h2 className="font-semibold text-stone-800 text-sm">Product Information</h2>
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1.5 uppercase tracking-wider">Title *</label>
                <input type="text" name="title" value={form.title} onChange={handleChange} required
                  className="w-full border border-stone-300 px-4 py-2.5 rounded-sm text-sm focus:outline-none focus:border-indigo-500 transition" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1.5 uppercase tracking-wider">Description *</label>
                <textarea name="description" value={form.description} onChange={handleChange} required rows={5}
                  className="w-full border border-stone-300 px-4 py-2.5 rounded-sm text-sm focus:outline-none focus:border-indigo-500 transition resize-none" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: "Vendor", name: "vendor" },
                  { label: "Product Type", name: "productType" },
                  { label: "SKU", name: "sku" },
                  { label: "Tags (comma separated)", name: "tags" },
                ].map(({ label, name }) => (
                  <div key={name}>
                    <label className="block text-xs font-semibold text-stone-600 mb-1.5 uppercase tracking-wider">{label}</label>
                    <input type="text" name={name} value={form[name]} onChange={handleChange}
                      className="w-full border border-stone-300 px-4 py-2.5 rounded-sm text-sm focus:outline-none focus:border-indigo-500 transition" />
                  </div>
                ))}
              </div>
            </div>

            {/* Images */}
            <div className="bg-white border border-stone-100 rounded-sm shadow-sm p-6 space-y-4">
              <h2 className="font-semibold text-stone-800 text-sm">Product Images</h2>

              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {existingImages.map((img, i) => (
                    <div key={i} className="relative group">
                      <img src={img} alt={`existing-${i}`} className="w-20 h-20 object-cover rounded-sm border border-stone-200" />
                      <button type="button" onClick={() => removeExistingImage(i)}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* New Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {imagePreviews.map((src, i) => (
                    <div key={i} className="relative group">
                      <img src={src} alt={`preview-${i}`} className="w-20 h-20 object-cover rounded-sm border-2 border-dashed border-indigo-300" />
                      <button type="button" onClick={() => removeNewImage(i)}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-stone-300 rounded-sm cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition">
                <Upload size={22} className="text-stone-400 mb-2" />
                <span className="text-xs text-stone-500">Click to upload images (max 5)</span>
                <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
              </label>
            </div>

            {/* Variants */}
            <div className="bg-white border border-stone-100 rounded-sm shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-stone-800 text-sm">Variants (Sizes / Colors)</h2>
                <button type="button" onClick={addVariant}
                  className="flex items-center gap-1.5 text-xs text-indigo-600 font-semibold hover:text-indigo-800 transition">
                  <Plus size={14} /> Add Variant
                </button>
              </div>
              {variants.length === 0 ? (
                <p className="text-xs text-stone-400 py-4 text-center">No variants added. Click above to add sizes or colors.</p>
              ) : (
                <div className="space-y-3">
                  {variants.map((variant, i) => (
                    <div key={i} className="grid grid-cols-5 gap-2 items-center p-3 bg-stone-50 rounded-sm border border-stone-200">
                      {[
                        { placeholder: "Size (e.g. S, M, L)", field: "size" },
                        { placeholder: "Color", field: "color" },
                        { placeholder: "Stock", field: "stock", type: "number" },
                        { placeholder: "Price override", field: "price", type: "number" },
                        { placeholder: "SKU", field: "sku" },
                      ].map(({ placeholder, field, type = "text" }) => (
                        <input key={field} type={type} value={variant[field] || ""} onChange={(e) => updateVariant(i, field, type === "number" ? Number(e.target.value) : e.target.value)}
                          placeholder={placeholder}
                          className="border border-stone-300 px-2 py-1.5 rounded-sm text-xs focus:outline-none focus:border-indigo-400 transition col-span-1" />
                      ))}
                      <button type="button" onClick={() => removeVariant(i)} className="p-1.5 text-red-400 hover:text-red-600 transition justify-self-end">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Sidebar */}
          <div className="space-y-5">
            {/* Status & Pricing */}
            <div className="bg-white border border-stone-100 rounded-sm shadow-sm p-6 space-y-4">
              <h2 className="font-semibold text-stone-800 text-sm">Pricing & Status</h2>
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1.5 uppercase tracking-wider">Price (USD) *</label>
                <input type="number" name="price" value={form.price} onChange={handleChange} required min="0" step="0.01"
                  className="w-full border border-stone-300 px-4 py-2.5 rounded-sm text-sm focus:outline-none focus:border-indigo-500 transition" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1.5 uppercase tracking-wider">Compare-at Price</label>
                <input type="number" name="compareAtPrice" value={form.compareAtPrice} onChange={handleChange} min="0" step="0.01"
                  className="w-full border border-stone-300 px-4 py-2.5 rounded-sm text-sm focus:outline-none focus:border-indigo-500 transition" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1.5 uppercase tracking-wider">Status</label>
                <select name="status" value={form.status} onChange={handleChange}
                  className="w-full border border-stone-300 px-4 py-2.5 rounded-sm text-sm bg-white focus:outline-none focus:border-indigo-500">
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            {/* Collections */}
            <div className="bg-white border border-stone-100 rounded-sm shadow-sm p-6 space-y-3">
              <h2 className="font-semibold text-stone-800 text-sm">Collections</h2>
              {collections.length === 0 ? (
                <p className="text-xs text-stone-400">No collections yet</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {collections.map((col) => (
                    <label key={col._id} className="flex items-center gap-2.5 cursor-pointer">
                      <input type="checkbox" checked={form.collectionIds.includes(col._id)}
                        onChange={() => toggleCollection(col._id)} className="accent-indigo-600 w-4 h-4" />
                      <span className="text-sm text-stone-700">{col.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <button type="submit" disabled={mutation.isPending}
              className="w-full py-4 bg-indigo-600 text-white text-xs uppercase tracking-widest font-semibold hover:bg-indigo-700 transition rounded-sm disabled:opacity-50 flex items-center justify-center gap-2">
              {mutation.isPending ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
              ) : (isEdit ? "Update Product" : "Create Product")}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

// New Product Page
export default function NewProductPage() {
  return <ProductFormPage isEdit={false} />;
}
