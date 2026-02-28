"use client";

import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { Edit2, Trash2, X, RefreshCw, Upload, Package } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const ManageCollections = () => {
  const [collections, setCollections] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editCollection, setEditCollection] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchCollections = useCallback(async () => {
    try {
      const res = await fetch(`${API}/collections`);
      const data = await res.json();
      setCollections(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Failed to fetch collections");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch(`${API}/products`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchCollections();
    fetchProducts();

    // ✅ Real-time polling every 15 seconds
    const interval = setInterval(() => {
      fetchCollections();
      fetchProducts();
    }, 15000);

    return () => clearInterval(interval);
  }, [fetchCollections, fetchProducts]);

  const handleDelete = async (_id) => {
    try {
      const res = await fetch(`${API}/collections/${_id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      // ✅ Instant UI update
      setCollections((prev) => prev.filter((c) => c._id !== _id));
      setDeleteConfirm(null);
      toast.success("Collection deleted!");
    } catch (err) {
      toast.error("Failed to delete collection");
    }
  };

  const toggleProductInEdit = (productId) => {
    if (!editCollection) return;
    const currentIds = editCollection.productIds || [];
    // Handle both string IDs and ObjectId strings
    const currentStrings = currentIds.map((id) => String(id));
    const productIdStr = String(productId);
    const updatedIds = currentStrings.includes(productIdStr)
      ? currentStrings.filter((id) => id !== productIdStr)
      : [...currentStrings, productIdStr];
    setEditCollection({ ...editCollection, productIds: updatedIds });
  };

  const isProductSelected = (productId) => {
    const ids = (editCollection?.productIds || []).map((id) => String(id));
    return ids.includes(String(productId));
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
    // ✅ FIX: Send as comma-separated string
    formData.append("productIds", (editCollection.productIds || []).join(","));

    try {
      const res = await fetch(`${API}/collections/${editCollection._id}`, {
        method: "PUT",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");

      toast.success("✅ Collection updated!");
      setEditCollection(null);
      fetchCollections(); // Refresh to get updated data
    } catch (err) {
      toast.error("❌ " + (err.message || "Failed to update collection"));
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto" />
          <p className="mt-3 text-gray-500">Loading collections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Collections</h1>
            <p className="text-gray-500 mt-1">{collections.length} collection{collections.length !== 1 ? "s" : ""}</p>
          </div>
          <button
            onClick={() => { fetchCollections(); fetchProducts(); }}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 text-sm font-medium transition"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>

        {collections.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border p-16 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Collections Yet</h3>
            <p className="text-gray-400 mb-4">Create your first collection to group products</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {collections.map((c) => (
              <div key={c._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group">
                <div className="relative">
                  <img
                    src={c.imageUrl || "/placeholder.png"}
                    className="h-44 w-full object-cover"
                    alt={c.name}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />
                </div>
                <div className="p-4">
                  <h2 className="font-bold text-gray-900 truncate">{c.name}</h2>
                  <p className="text-gray-500 text-sm mt-1 line-clamp-2">{c.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs bg-indigo-50 text-indigo-600 font-medium px-2.5 py-1 rounded-full">
                      {c.productIds?.length || 0} product{(c.productIds?.length || 0) !== 1 ? "s" : ""}
                    </span>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => setEditCollection({ ...c, productIds: (c.productIds || []).map(String), imagePreview: c.imageUrl })}
                        className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(c._id)}
                        className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="text-center">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-7 h-7 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Delete Collection?</h3>
              <p className="text-gray-500 text-sm mb-5">This will also unlink all associated products.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editCollection && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-2xl my-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Edit Collection</h2>
              <button
                onClick={() => setEditCollection(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={editCollection.name}
                  onChange={handleEditChange}
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  name="description"
                  value={editCollection.description}
                  onChange={handleEditChange}
                  rows={3}
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
                {editCollection.imagePreview && (
                  <img
                    src={editCollection.imagePreview}
                    className="h-36 w-full object-cover rounded-lg mb-2"
                    alt="preview"
                  />
                )}
                <label className="flex items-center gap-2 cursor-pointer text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                  <Upload className="w-4 h-4" /> Change image
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Products ({(editCollection.productIds || []).length} selected)
                </label>
                {products.length === 0 ? (
                  <p className="text-sm text-gray-400">No products available</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-56 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50">
                    {products.map((p) => (
                      <div
                        key={p._id}
                        onClick={() => toggleProductInEdit(p._id)}
                        className={`cursor-pointer border-2 rounded-lg overflow-hidden transition ${
                          isProductSelected(p._id)
                            ? "border-indigo-500 ring-2 ring-indigo-200"
                            : "border-transparent hover:border-gray-300"
                        }`}
                      >
                        <img
                          src={p.images?.[0] || "/placeholder.png"}
                          className="h-20 w-full object-cover"
                          alt={p.title}
                        />
                        <div className="p-1.5 bg-white">
                          <p className="text-xs text-gray-700 truncate font-medium">{p.title}</p>
                          <p className="text-xs text-gray-400">${p.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditCollection(null)}
                  className="flex-1 px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
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
};

export default ManageCollections;