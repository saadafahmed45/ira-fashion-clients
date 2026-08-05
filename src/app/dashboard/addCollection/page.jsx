"use client";

import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Upload, X, FolderPlus, Loader2, Check, Package, Image as ImageIcon } from "lucide-react";
import api from "@/lib/api";

const inputCls =
  "w-full border border-[#E5E5E5] bg-white px-4 py-2.5 rounded-none text-xs text-[#111111] focus:outline-none focus:border-[#111111] transition placeholder:text-[#AAAAAA]";
const labelCls = "block text-[11px] font-bold text-[#111111] uppercase tracking-wider mb-1.5";

export default function AddCollectionPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showProducts, setShowProducts] = useState(false);

  // Fetch products using API client
  const { data: productsData } = useQuery({
    queryKey: ["products-all-light"],
    queryFn: async () => {
      const res = await api.get("/products?limit=100&status=active");
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });
  const products = productsData || [];

  const createMutation = useMutation({
    mutationFn: async () => {
      const fd = new FormData();
      fd.append("name", name);
      fd.append("description", description);
      if (imageFile) fd.append("image", imageFile);
      const validIds = selectedProducts.filter(Boolean);
      fd.append("productIds", JSON.stringify(validIds));
      return api.post("/collections", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      toast.success("Collection created successfully!");
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      queryClient.invalidateQueries({ queryKey: ["collections-all"] });
      router.push("/dashboard/manageCollections");
    },
    onError: (err) => toast.error(err.message || "Failed to create collection"),
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const toggleProduct = (id) =>
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );

  const saving = createMutation.isPending;

  return (
    <div className="min-h-screen bg-[#FAF9F6] p-6 lg:p-8 pb-20">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Page Header */}
        <div className="flex items-center justify-between bg-white border border-[#E5E5E5] p-6">
          <div>
            <h1 className="text-xl font-light uppercase tracking-wider text-[#111111]">
              Create New <span className="font-semibold">Collection</span>
            </h1>
            <p className="text-xs text-[#666666] mt-0.5">
              Organize products into curated luxury collections
            </p>
          </div>
          <FolderPlus className="w-6 h-6 text-[#111111]" />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            createMutation.mutate();
          }}
          encType="multipart/form-data"
          className="space-y-6"
        >
          {/* Details */}
          <div className="bg-white border border-[#E5E5E5] p-6 space-y-4">
            <h2 className="text-xs font-bold text-[#111111] uppercase tracking-wider pb-2 border-b border-[#E5E5E5]">
              Collection Information
            </h2>

            <div>
              <label className={labelCls}>Collection Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputCls}
                placeholder="e.g. Summer Edition '25"
                required
              />
            </div>

            <div>
              <label className={labelCls}>Description *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className={`${inputCls} resize-none`}
                placeholder="Describe this curated collection..."
                required
              />
            </div>
          </div>

          {/* Cover Image Upload */}
          <div className="bg-white border border-[#E5E5E5] p-6 space-y-4">
            <h2 className="text-xs font-bold text-[#111111] uppercase tracking-wider pb-2 border-b border-[#E5E5E5]">
              Cover Banner Image *
            </h2>

            {imagePreview ? (
              <div className="relative border border-[#E5E5E5]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imagePreview} className="w-full h-56 object-cover" alt="preview" />
                <button
                  type="button"
                  onClick={() => { setImageFile(null); setImagePreview(null); }}
                  className="absolute top-3 right-3 bg-[#111111] text-white p-1.5 hover:bg-red-600 transition shadow"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-[#E5E5E5] bg-[#FAF9F6] cursor-pointer hover:border-[#111111] hover:bg-white transition group">
                <ImageIcon className="w-8 h-8 text-[#AAAAAA] group-hover:text-[#111111] mb-2 transition" />
                <span className="text-xs font-semibold text-[#111111] uppercase tracking-wider">
                  Upload Collection Cover Image
                </span>
                <span className="text-[10px] text-[#888888] mt-1">Supports JPG, PNG, WebP (Max 5MB)</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" required />
              </label>
            )}
          </div>

          {/* Select Products */}
          <div className="bg-white border border-[#E5E5E5] p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E5E5E5]">
              <div>
                <h2 className="text-xs font-bold text-[#111111] uppercase tracking-wider">
                  Assigned Products
                </h2>
                <p className="text-[10px] text-[#888888] mt-0.5">
                  {selectedProducts.length > 0
                    ? `${selectedProducts.length} product(s) selected`
                    : "Optional — click Browse to link products"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowProducts(!showProducts)}
                className="text-xs font-bold uppercase tracking-wider text-[#111111] hover:underline"
              >
                {showProducts ? "Close Grid" : "Browse Products"}
              </button>
            </div>

            {showProducts && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-72 overflow-y-auto border border-[#E5E5E5] p-3 bg-[#FAF9F6]">
                {products.length === 0 ? (
                  <p className="col-span-3 text-center text-xs text-[#888888] py-8">
                    No active products found
                  </p>
                ) : (
                  products.map((product) => {
                    const isSelected = selectedProducts.includes(product._id);
                    return (
                      <div
                        key={product._id}
                        onClick={() => toggleProduct(product._id)}
                        className={`cursor-pointer border text-left bg-white transition relative group overflow-hidden ${
                          isSelected ? "border-[#111111] ring-1 ring-[#111111]" : "border-[#E5E5E5] hover:border-[#AAAAAA]"
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 bg-[#111111] text-white p-0.5 z-10">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={product.images?.[0] || "/placeholder.png"}
                          alt={product.title}
                          className="h-24 w-full object-cover"
                        />
                        <div className="p-2 border-t border-[#E5E5E5]">
                          <p className="text-xs font-semibold text-[#111111] truncate">{product.title}</p>
                          <p className="text-[10px] text-[#666666]">${(product.price || 0).toFixed(2)}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {selectedProducts.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {selectedProducts.map((id) => {
                  const p = products.find((pr) => pr._id === id);
                  return p ? (
                    <span
                      key={id}
                      className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-[#111111] text-white px-3 py-1"
                    >
                      {p.title}
                      <button
                        type="button"
                        onClick={() => toggleProduct(id)}
                        className="hover:text-red-400"
                      >
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
            disabled={saving}
            className="w-full bg-[#111111] text-white py-4 font-bold uppercase tracking-widest text-xs hover:bg-[#222222] transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Saving Collection...</>
            ) : (
              "Publish Collection"
            )}
          </button>
        </form>

      </div>
    </div>
  );
}