"use client";

// Edit Product — reuses same form component with isEdit=true
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../../lib/api";
import { toast } from "react-toastify";
import { Plus, Trash2, X, Upload, ArrowLeft } from "lucide-react";
import Link from "next/link";

const INITIAL_VARIANT = { size: "", color: "", stock: 0, price: 0, sku: "" };

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const productId = params?.id;

  const [form, setForm] = useState({
    title: "", description: "", price: "", compareAtPrice: "",
    vendor: "Ira Fashion", productType: "", tags: "", status: "draft",
    sku: "", barcode: "", collectionIds: [],
  });
  const [variants, setVariants] = useState([]);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product-edit", productId],
    queryFn: async () => {
      const res = await api.get(`/products/${productId}`);
      return res.data;
    },
    enabled: !!productId,
  });

  const { data: collections = [] } = useQuery({
    queryKey: ["collections-list"],
    queryFn: async () => {
      const res = await api.get("/collections");
      return res.data;
    },
  });

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

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const mutation = useMutation({
    mutationFn: async (formData) => api.put(`/products/${productId}`, formData, { headers: { "Content-Type": "multipart/form-data" } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("Product updated successfully!");
      router.push("/dashboard/products");
    },
    onError: (err) => toast.error(err.message || "Failed to update product"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      fd.append(key, key === "collectionIds" ? value.join(",") : value);
    });
    fd.append("variants", JSON.stringify(variants));
    images.forEach((img) => fd.append("images", img));
    fd.append("existingImages", JSON.stringify(existingImages));
    mutation.mutate(fd);
  };

  if (isLoading) return <div className="p-8 text-stone-500 animate-pulse">Loading product data...</div>;

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/products" className="p-2 hover:bg-stone-100 rounded-sm transition">
          <ArrowLeft size={18} className="text-stone-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Edit Product</h1>
          <p className="text-stone-500 text-sm">{product?.title}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white border border-stone-100 rounded-sm shadow-sm p-6 space-y-4">
            <h2 className="font-semibold text-stone-800 text-sm">Product Information</h2>
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1.5 uppercase tracking-wider">Title *</label>
              <input type="text" name="title" value={form.title} onChange={handleChange} required
                className="w-full border border-stone-300 px-4 py-2.5 rounded-sm text-sm focus:outline-none focus:border-indigo-500 transition" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1.5 uppercase tracking-wider">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={5}
                className="w-full border border-stone-300 px-4 py-2.5 rounded-sm text-sm focus:outline-none focus:border-indigo-500 transition resize-none" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {[{ label: "Vendor", name: "vendor" }, { label: "Product Type", name: "productType" }, { label: "SKU", name: "sku" }, { label: "Tags", name: "tags" }].map(({ label, name }) => (
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
            <h2 className="font-semibold text-stone-800 text-sm">Images</h2>
            {existingImages.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {existingImages.map((img, i) => (
                  <div key={i} className="relative group">
                    <img src={img} alt="" className="w-20 h-20 object-cover rounded-sm border border-stone-200" />
                    <button type="button" onClick={() => setExistingImages((p) => p.filter((_, idx) => idx !== i))}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {imagePreviews.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {imagePreviews.map((src, i) => (
                  <div key={i} className="relative group">
                    <img src={src} alt="" className="w-20 h-20 object-cover rounded-sm border-2 border-dashed border-indigo-300" />
                    <button type="button" onClick={() => { setImages((p) => p.filter((_, idx) => idx !== i)); setImagePreviews((p) => p.filter((_, idx) => idx !== i)); }}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-stone-300 rounded-sm cursor-pointer hover:border-indigo-400 transition">
              <Upload size={20} className="text-stone-400 mb-1" />
              <span className="text-xs text-stone-500">Click to upload more images</span>
              <input type="file" accept="image/*" multiple onChange={(e) => {
                const files = Array.from(e.target.files);
                setImages((p) => [...p, ...files]);
                setImagePreviews((p) => [...p, ...files.map((f) => URL.createObjectURL(f))]);
              }} className="hidden" />
            </label>
          </div>

          {/* Variants */}
          <div className="bg-white border border-stone-100 rounded-sm shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-stone-800 text-sm">Variants</h2>
              <button type="button" onClick={() => setVariants((p) => [...p, { ...INITIAL_VARIANT }])}
                className="flex items-center gap-1.5 text-xs text-indigo-600 font-semibold hover:text-indigo-800 transition">
                <Plus size={14} /> Add Variant
              </button>
            </div>
            {variants.map((v, i) => (
              <div key={i} className="grid grid-cols-5 gap-2 items-center p-3 bg-stone-50 rounded-sm border border-stone-200">
                {[["size", "Size"], ["color", "Color"], ["stock", "Stock", "number"], ["price", "Price", "number"], ["sku", "SKU"]].map(([field, placeholder, type = "text"]) => (
                  <input key={field} type={type} value={v[field] || ""} placeholder={placeholder}
                    onChange={(e) => setVariants((p) => p.map((vv, idx) => idx === i ? { ...vv, [field]: type === "number" ? Number(e.target.value) : e.target.value } : vv))}
                    className="border border-stone-300 px-2 py-1.5 rounded-sm text-xs focus:outline-none focus:border-indigo-400 transition" />
                ))}
                <button type="button" onClick={() => setVariants((p) => p.filter((_, idx) => idx !== i))} className="p-1.5 text-red-400 hover:text-red-600 justify-self-end">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="bg-white border border-stone-100 rounded-sm shadow-sm p-6 space-y-4">
            <h2 className="font-semibold text-stone-800 text-sm">Pricing & Status</h2>
            {[{ label: "Price (USD) *", name: "price" }, { label: "Compare-at Price", name: "compareAtPrice" }].map(({ label, name }) => (
              <div key={name}>
                <label className="block text-xs font-semibold text-stone-600 mb-1.5 uppercase tracking-wider">{label}</label>
                <input type="number" name={name} value={form[name]} onChange={handleChange} min="0" step="0.01"
                  className="w-full border border-stone-300 px-4 py-2.5 rounded-sm text-sm focus:outline-none focus:border-indigo-500 transition" />
              </div>
            ))}
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

          <div className="bg-white border border-stone-100 rounded-sm shadow-sm p-6 space-y-3">
            <h2 className="font-semibold text-stone-800 text-sm">Collections</h2>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {collections.map((col) => (
                <label key={col._id} className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" checked={form.collectionIds.includes(col._id)}
                    onChange={() => setForm((p) => ({
                      ...p,
                      collectionIds: p.collectionIds.includes(col._id)
                        ? p.collectionIds.filter((c) => c !== col._id)
                        : [...p.collectionIds, col._id],
                    }))} className="accent-indigo-600 w-4 h-4" />
                  <span className="text-sm text-stone-700">{col.name}</span>
                </label>
              ))}
            </div>
          </div>

          <button type="submit" disabled={mutation.isPending}
            className="w-full py-4 bg-indigo-600 text-white text-xs uppercase tracking-widest font-semibold hover:bg-indigo-700 transition rounded-sm disabled:opacity-50 flex items-center justify-center gap-2">
            {mutation.isPending ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</> : "Update Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
