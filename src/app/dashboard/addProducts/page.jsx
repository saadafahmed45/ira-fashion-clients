"use client";

import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Plus, X, Upload, Tag, Package, Loader2 } from "lucide-react";
import api from "../../../lib/api";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

const inputCls =
  "w-full border border-stone-200 bg-white px-4 py-2.5 rounded-sm text-sm focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition placeholder-stone-400";
const labelCls = "block text-xs font-semibold text-stone-600 uppercase tracking-wide mb-1.5";

export default function AddProductPage() {
  const router = useRouter();

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [variants, setVariants] = useState([{ size: "M", color: "#6366f1", stock: 0, price: 0 }]);
  const [status, setStatus] = useState("draft");
  const [selectedCollections, setSelectedCollections] = useState([]);

  // Fetch collections from API using TanStack Query + api client (not raw fetch)
  const { data: collectionsData } = useQuery({
    queryKey: ["collections-all"],
    queryFn: async () => {
      const res = await api.get("/collections");
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });
  const collections = collectionsData || [];

  // Submit mutation
  const createMutation = useMutation({
    mutationFn: async ({ formData, publishStatus }) => {
      formData.set("status", publishStatus);
      return api.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      toast.success("Product published successfully!");
      router.push("/dashboard/manageProduct");
    },
    onError: (err) => toast.error(err.message || "Failed to create product"),
  });

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + imageFiles.length > 5) {
      toast.warning("Maximum 5 images allowed");
      return;
    }
    setImageFiles((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const removeImage = (i) => {
    setImageFiles((prev) => prev.filter((_, idx) => idx !== i));
    setImagePreviews((prev) => prev.filter((_, idx) => idx !== i));
  };

  const addVariant = () => setVariants((v) => [...v, { size: "M", color: "#6366f1", stock: 0, price: 0 }]);
  const removeVariant = (i) => {
    if (variants.length === 1) return;
    setVariants((v) => v.filter((_, idx) => idx !== i));
  };
  const updateVariant = (i, field, value) => {
    setVariants((v) => {
      const copy = [...v];
      copy[i] = { ...copy[i], [field]: field === "stock" || field === "price" ? Number(value) : value };
      return copy;
    });
  };

  const toggleCollection = (id) =>
    setSelectedCollections((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );

  const buildFormData = (form) => {
    const fd = new FormData();
    fd.append("title", form.title.value);
    fd.append("description", form.description.value);
    fd.append("price", form.price.value);
    fd.append("compareAtPrice", form.compareAtPrice.value || "");
    fd.append("productType", form.productType.value || "");
    fd.append("vendor", form.vendor.value || "");
    fd.append("sku", form.sku.value || "");
    fd.append("barcode", form.barcode.value || "");
    fd.append("weight", form.weight.value || "");
    fd.append("tags", form.tags.value || "");
    fd.append("variants", JSON.stringify(variants));
    // Only append non-empty collection IDs as a JSON array
    const validCollections = selectedCollections.filter(Boolean);
    fd.append("collectionIds", JSON.stringify(validCollections));
    imageFiles.forEach((f) => fd.append("images", f));
    return fd;
  };

  const handleSubmit = (e, publishStatus) => {
    e.preventDefault();
    createMutation.mutate({ formData: buildFormData(e.target), publishStatus });
  };

  const saving = createMutation.isPending;

  return (
    <div className="min-h-screen bg-stone-50 pb-28">
      <form
        onSubmit={(e) => handleSubmit(e, status)}
        encType="multipart/form-data"
        className="max-w-[1200px] mx-auto p-6 md:p-8 space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-stone-900">Add New Product</h1>
            <p className="text-stone-500 text-sm mt-0.5">Fill in the details to create a new product listing</p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs text-stone-400">
            <Package size={14} />
            Product form
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── LEFT: main info ─────────────────────── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Product Info */}
            <div className="bg-white border border-stone-100 rounded-sm shadow-sm p-6">
              <h2 className="text-sm font-bold text-stone-800 uppercase tracking-widest mb-5 flex items-center gap-2">
                <Tag size={14} className="text-indigo-500" /> Product Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>Title *</label>
                  <input name="title" placeholder="e.g. Classic Linen Shirt" required className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Description *</label>
                  <textarea
                    name="description"
                    placeholder="Describe the product..."
                    rows={4}
                    required
                    className={`${inputCls} resize-none`}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className={labelCls}>Vendor / Brand</label>
                    <input name="vendor" placeholder="e.g. Ira Fashion" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>SKU</label>
                    <input name="sku" placeholder="Optional SKU" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Barcode (ISBN, UPC)</label>
                    <input name="barcode" placeholder="Optional barcode" className={inputCls} />
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing & Category */}
            <div className="bg-white border border-stone-100 rounded-sm shadow-sm p-6">
              <h2 className="text-sm font-bold text-stone-800 uppercase tracking-widest mb-5">Pricing & Classification</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Base Price *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm font-medium">$</span>
                    <input
                      type="number"
                      name="price"
                      required
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      className={`${inputCls} pl-7`}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Compare-at Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm font-medium">$</span>
                    <input
                      type="number"
                      name="compareAtPrice"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      className={`${inputCls} pl-7`}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Product Type</label>
                  <input name="productType" placeholder="e.g. Shirt, Dress, Pants" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Tags (comma separated)</label>
                  <input name="tags" placeholder="e.g. summer, vintage, cotton" className={inputCls} />
                </div>
              </div>
            </div>

            {/* Media */}
            <div className="bg-white border border-stone-100 rounded-sm shadow-sm p-6">
              <h2 className="text-sm font-bold text-stone-800 uppercase tracking-widest mb-5 flex items-center gap-2">
                <Upload size={14} className="text-indigo-500" /> Media (max 5 images)
              </h2>
              <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-stone-200 rounded-sm cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/40 transition">
                <Upload className="w-6 h-6 text-stone-300 mb-2" />
                <span className="text-sm text-stone-400">Click to upload images</span>
                <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-5 gap-3 mt-4">
                  {imagePreviews.map((src, i) => (
                    <div key={i} className="relative group aspect-square">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt={`preview-${i}`} className="w-full h-full object-cover rounded-sm" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition shadow"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Variants */}
            <div className="bg-white border border-stone-100 rounded-sm shadow-sm p-6">
              <h2 className="text-sm font-bold text-stone-800 uppercase tracking-widest mb-5">Variants</h2>
              <div className="space-y-2">
                {variants.map((variant, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-stone-50 rounded-sm border border-stone-100">
                    <select
                      value={variant.size}
                      onChange={(e) => updateVariant(i, "size", e.target.value)}
                      className="border border-stone-200 px-3 py-2 rounded-sm text-sm flex-1 focus:outline-none focus:border-indigo-400 bg-white"
                    >
                      <option value="">Size</option>
                      {SIZES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                    <div className="flex items-center gap-1.5">
                      <label className="text-[11px] text-stone-400">Color</label>
                      <input
                        type="color"
                        value={variant.color}
                        onChange={(e) => updateVariant(i, "color", e.target.value)}
                        className="w-9 h-9 rounded border border-stone-200 cursor-pointer p-0.5"
                      />
                    </div>
                    <input
                      type="number"
                      placeholder="Stock"
                      value={variant.stock}
                      min="0"
                      onChange={(e) => updateVariant(i, "stock", e.target.value)}
                      className="border border-stone-200 px-3 py-2 rounded-sm text-sm w-20 focus:outline-none focus:border-indigo-400"
                    />
                    <div className="relative w-24">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-stone-400 text-sm">$</span>
                      <input
                        type="number"
                        placeholder="Price"
                        value={variant.price}
                        min="0"
                        step="0.01"
                        onChange={(e) => updateVariant(i, "price", e.target.value)}
                        className="border border-stone-200 pl-5 pr-2 py-2 rounded-sm text-sm w-full focus:outline-none focus:border-indigo-400"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeVariant(i)}
                      disabled={variants.length === 1}
                      className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-sm transition disabled:opacity-25"
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

          {/* ── RIGHT: sidebar ──────────────────────── */}
          <div className="space-y-5">
            {/* Status */}
            <div className="bg-white border border-stone-100 rounded-sm shadow-sm p-5">
              <h3 className={labelCls}>Status</h3>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={inputCls}
              >
                <option value="draft">📝 Draft (hidden)</option>
                <option value="active">✅ Active (published)</option>
              </select>
              <p className="text-[11px] text-stone-400 mt-2">
                {status === "draft" ? "Not visible to customers yet." : "Live and visible to all customers."}
              </p>
            </div>

            {/* Collections */}
            <div className="bg-white border border-stone-100 rounded-sm shadow-sm p-5">
              <h3 className={labelCls}>Collections</h3>
              {collections.length === 0 ? (
                <p className="text-xs text-stone-400 py-2">No collections available. Create one first.</p>
              ) : (
                <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                  {collections.map((c) => (
                    <label key={c._id} className="flex items-center gap-2.5 cursor-pointer group py-1">
                      <input
                        type="checkbox"
                        checked={selectedCollections.includes(c._id)}
                        onChange={() => toggleCollection(c._id)}
                        className="w-4 h-4 text-indigo-600 rounded border-stone-300 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-stone-700 group-hover:text-indigo-600 transition truncate">
                        {c.name}
                      </span>
                    </label>
                  ))}
                </div>
              )}
              {selectedCollections.length > 0 && (
                <div className="mt-3 pt-3 border-t border-stone-100 flex flex-wrap gap-1">
                  {selectedCollections.map((id) => {
                    const col = collections.find((c) => c._id === id);
                    return col ? (
                      <span key={id} className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">
                        {col.name}
                      </span>
                    ) : null;
                  })}
                </div>
              )}
            </div>

            {/* Shipping */}
            <div className="bg-white border border-stone-100 rounded-sm shadow-sm p-5">
              <h3 className={labelCls}>Shipping</h3>
              <div>
                <label className="block text-[10px] text-stone-400 uppercase tracking-wider mb-1">Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  step="0.01"
                  placeholder="0.0"
                  className={inputCls}
                />
              </div>
            </div>

            {/* Summary */}
            <div className="bg-stone-50 border border-stone-100 rounded-sm p-4 text-xs text-stone-500 space-y-1">
              <div className="flex justify-between"><span>Images</span><span className="font-semibold text-stone-700">{imageFiles.length}/5</span></div>
              <div className="flex justify-between"><span>Variants</span><span className="font-semibold text-stone-700">{variants.length}</span></div>
              <div className="flex justify-between"><span>Collections</span><span className="font-semibold text-stone-700">{selectedCollections.length}</span></div>
            </div>
          </div>
        </div>

        {/* Sticky Save Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 shadow-xl px-6 py-4 flex items-center justify-between z-50">
          <p className="text-xs text-stone-400 hidden sm:block">
            {imageFiles.length > 0 ? `${imageFiles.length} image(s) · ` : ""}
            {variants.length} variant(s)
          </p>
          <div className="flex gap-3 ml-auto">
            <button
              type="button"
              disabled={saving}
              onClick={(e) => {
                setStatus("draft");
                e.currentTarget.form.requestSubmit();
              }}
              className="px-5 py-2.5 border border-stone-300 text-stone-700 rounded-sm hover:bg-stone-50 text-sm font-medium transition disabled:opacity-50"
            >
              Save Draft
            </button>
            <button
              type="submit"
              disabled={saving}
              onClick={() => setStatus("active")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 rounded-sm text-sm font-semibold transition shadow-sm disabled:opacity-60 flex items-center gap-2"
            >
              {saving ? <><Loader2 size={15} className="animate-spin" /> Saving...</> : "Publish Product"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}