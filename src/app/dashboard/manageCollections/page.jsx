"use client";

import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { Edit2, Trash2, X, RefreshCw, Upload, Package, FolderOpen, Check, Loader2 } from "lucide-react";
import api from "@/lib/api";

export default function ManageCollections() {
  const [collections, setCollections] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editCollection, setEditCollection] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchCollections = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/collections");
      setCollections(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast.error("Failed to fetch collections");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await api.get("/products?limit=100");
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchCollections();
    fetchProducts();
  }, [fetchCollections, fetchProducts]);

  const handleDelete = async (_id) => {
    try {
      await api.delete(`/collections/${_id}`);
      setCollections((prev) => prev.filter((c) => c._id !== _id));
      setDeleteConfirm(null);
      toast.success("Collection deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete collection");
    }
  };

  const toggleProductInEdit = (productId) => {
    if (!editCollection) return;
    const currentIds = (editCollection.productIds || []).map((id) =>
      typeof id === "object" ? String(id._id || id) : String(id)
    );
    const pStr = String(productId);
    const updatedIds = currentIds.includes(pStr)
      ? currentIds.filter((id) => id !== pStr)
      : [...currentIds, pStr];
    setEditCollection({ ...editCollection, productIds: updatedIds });
  };

  const isProductSelected = (productId) => {
    if (!editCollection) return false;
    const currentIds = (editCollection.productIds || []).map((id) =>
      typeof id === "object" ? String(id._id || id) : String(id)
    );
    return currentIds.includes(String(productId));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editCollection) return;
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", editCollection.name);
    formData.append("description", editCollection.description);
    if (editCollection.imageFile) {
      formData.append("image", editCollection.imageFile);
    }

    const cleanProductIds = (editCollection.productIds || []).map((id) =>
      typeof id === "object" ? String(id._id || id) : String(id)
    ).filter(Boolean);

    formData.append("productIds", JSON.stringify(cleanProductIds));

    try {
      await api.put(`/collections/${editCollection._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Collection updated successfully!");
      setEditCollection(null);
      fetchCollections();
    } catch (err) {
      toast.error(err.message || "Failed to update collection");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditCollection({ ...editCollection, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setEditCollection({
      ...editCollection,
      imageFile: file,
      imagePreview: URL.createObjectURL(file),
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-[#E5E5E5] p-6">
          <div>
            <h1 className="text-xl font-light uppercase tracking-wider text-[#111111]">
              Manage <span className="font-semibold">Collections</span>
            </h1>
            <p className="text-xs text-[#666666] mt-0.5">
              {collections.length} collection{collections.length !== 1 ? "s" : ""} active in shop catalog
            </p>
          </div>
          <button
            onClick={() => { fetchCollections(); fetchProducts(); }}
            className="flex items-center gap-2 px-4 py-2 border border-[#E5E5E5] text-[#111111] text-xs font-bold uppercase tracking-wider hover:border-[#111111] transition bg-white"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>

        {/* Collections Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white border border-[#E5E5E5] h-64 animate-pulse p-4 space-y-3">
                <div className="h-36 bg-[#F0F0F0]" />
                <div className="h-4 bg-[#F0F0F0] w-3/4" />
                <div className="h-3 bg-[#F0F0F0] w-1/2" />
              </div>
            ))}
          </div>
        ) : collections.length === 0 ? (
          <div className="bg-white border border-[#E5E5E5] p-16 text-center space-y-3">
            <FolderOpen className="w-12 h-12 text-[#CCCCCC] mx-auto" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#111111]">No Collections Found</h3>
            <p className="text-xs text-[#666666]">Create your first collection to group products into curated themes.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {collections.map((c) => {
              const coverImg = c.image || c.imageUrl || "/placeholder.png";
              const productCount = c.productIds?.length || 0;

              return (
                <div key={c._id} className="bg-white border border-[#E5E5E5] overflow-hidden group hover:border-[#111111] transition-all flex flex-col justify-between">
                  <div>
                    <div className="relative h-48 bg-[#FAF9F6]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={coverImg}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        alt={c.name}
                      />
                      <span className="absolute top-2 left-2 bg-[#111111] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
                        {productCount} Product{productCount !== 1 ? "s" : ""}
                      </span>
                    </div>

                    <div className="p-4 space-y-1">
                      <h2 className="font-bold text-xs uppercase tracking-wider text-[#111111] truncate">{c.name}</h2>
                      <p className="text-[#666666] text-xs line-clamp-2 leading-relaxed">{c.description}</p>
                    </div>
                  </div>

                  <div className="p-4 pt-0 border-t border-[#FAF9F6] flex items-center justify-between mt-3">
                    <span className="text-[10px] text-[#888888] font-mono">
                      /collections/{c.slug}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          setEditCollection({
                            ...c,
                            productIds: (c.productIds || []).map((id) => typeof id === "object" ? String(id._id || id) : String(id)),
                            imagePreview: coverImg,
                          })
                        }
                        className="p-1.5 border border-[#E5E5E5] text-[#111111] hover:bg-[#111111] hover:text-white transition"
                        title="Edit Collection"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(c._id)}
                        className="p-1.5 border border-red-200 text-red-600 hover:bg-red-600 hover:text-white transition"
                        title="Delete Collection"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-[#E5E5E5] p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="text-center space-y-2">
              <Trash2 className="w-8 h-8 text-red-600 mx-auto" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#111111]">Delete Collection?</h3>
              <p className="text-xs text-[#666666]">
                This will unassign all products from this collection. Product listings will remain intact.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 border border-[#E5E5E5] text-xs font-bold uppercase tracking-wider text-[#111111] hover:bg-[#FAF9F6]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-2.5 bg-red-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Collection Modal */}
      {editCollection && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white border border-[#E5E5E5] p-6 sm:p-8 max-w-2xl w-full my-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5]">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#111111]">
                Edit Collection
              </h2>
              <button onClick={() => setEditCollection(null)} className="p-1 text-[#666666] hover:text-[#111111]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-5 text-xs">
              <div>
                <label className="block font-bold text-[#111111] uppercase tracking-wider mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={editCollection.name}
                  onChange={handleEditChange}
                  className="w-full border border-[#E5E5E5] p-3 text-xs focus:outline-none focus:border-[#111111]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-[#111111] uppercase tracking-wider mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={editCollection.description}
                  onChange={handleEditChange}
                  rows={3}
                  className="w-full border border-[#E5E5E5] p-3 text-xs focus:outline-none focus:border-[#111111] resize-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-[#111111] uppercase tracking-wider mb-2">
                  Cover Image
                </label>
                {editCollection.imagePreview && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={editCollection.imagePreview}
                    className="h-40 w-full object-cover border border-[#E5E5E5] mb-2"
                    alt="preview"
                  />
                )}
                <label className="inline-flex items-center gap-2 cursor-pointer font-bold uppercase tracking-wider text-[10px] text-[#111111] border border-[#E5E5E5] px-3 py-2 hover:bg-[#FAF9F6]">
                  <Upload className="w-3.5 h-3.5" /> Upload New Image
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>

              <div>
                <label className="block font-bold text-[#111111] uppercase tracking-wider mb-2">
                  Linked Products ({(editCollection.productIds || []).length} selected)
                </label>
                {products.length === 0 ? (
                  <p className="text-xs text-[#888888]">No products available</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-56 overflow-y-auto border border-[#E5E5E5] p-3 bg-[#FAF9F6]">
                    {products.map((p) => {
                      const selected = isProductSelected(p._id);
                      return (
                        <div
                          key={p._id}
                          onClick={() => toggleProductInEdit(p._id)}
                          className={`cursor-pointer border bg-white relative overflow-hidden transition ${
                            selected ? "border-[#111111] ring-1 ring-[#111111]" : "border-[#E5E5E5] hover:border-[#AAAAAA]"
                          }`}
                        >
                          {selected && (
                            <div className="absolute top-1 right-1 bg-[#111111] text-white p-0.5 z-10">
                              <Check className="w-3 h-3" />
                            </div>
                          )}
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={p.images?.[0] || "/placeholder.png"}
                            className="h-20 w-full object-cover"
                            alt={p.title}
                          />
                          <div className="p-1.5 border-t border-[#E5E5E5]">
                            <p className="text-[11px] font-semibold text-[#111111] truncate">{p.title}</p>
                            <p className="text-[10px] text-[#666666]">${(p.price || 0).toFixed(2)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditCollection(null)}
                  className="flex-1 py-3 border border-[#E5E5E5] font-bold uppercase tracking-wider text-[#111111] hover:bg-[#FAF9F6]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-[#111111] text-white font-bold uppercase tracking-wider hover:bg-[#222222] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}