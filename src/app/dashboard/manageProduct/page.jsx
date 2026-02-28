"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { Search, Edit2, Trash2, Plus, X, Package, RefreshCw, Upload } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const ManageProduct = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch(`${API}/products`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();

    // ✅ Real-time polling every 10 seconds
    const interval = setInterval(fetchProducts, 10000);
    return () => clearInterval(interval);
  }, [fetchProducts]);

  useEffect(() => {
    let filtered = [...products];

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.productType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.vendor?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "All") {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    setFilteredProducts(filtered);
  }, [searchTerm, statusFilter, products]);

  const handleDelete = async (_id) => {
    try {
      const res = await fetch(`${API}/products/${_id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      // ✅ Instant UI update
      setProducts((prev) => prev.filter((p) => p._id !== _id));
      setDeleteConfirm(null);
      toast.success("Product deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete product");
    }
  };

  const handleEdit = (product) => {
    setCurrentProduct(product);
    setIsModalOpen(true);
  };

  const handleUpdate = (updatedProduct) => {
    // ✅ Instant UI update from modal
    setProducts((prev) =>
      prev.map((p) => (p._id === updatedProduct._id ? updatedProduct : p))
    );
    setIsModalOpen(false);
  };

  const getStatusBadge = (status) => {
    if (status === "active")
      return <span className="text-xs font-semibold bg-green-100 text-green-700 px-2.5 py-1 rounded-full">Active</span>;
    return <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">Draft</span>;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto" />
          <p className="mt-3 text-gray-500">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-500 mt-1">
              {filteredProducts.length} of {products.length} products
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchProducts}
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 text-sm font-medium transition"
            >
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
            <Link
              href="/dashboard/addProducts"
              className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition font-semibold text-sm shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add Product
            </Link>
          </div>
        </div>

        {/* Search & Filter */}
        {products.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by title, type, vendor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            >
              <option value="All">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        )}

        {/* Empty States */}
        {products.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border p-16 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Products Yet</h3>
            <p className="text-gray-400 mb-6">Start by adding your first product</p>
            <Link
              href="/dashboard/addProducts"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition font-semibold"
            >
              <Plus className="w-4 h-4" /> Add Product
            </Link>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border p-12 text-center">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-700">No matching products</h3>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filter</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Variants</th>
                    <th className="px-5 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map((product, index) => (
                    <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4 text-sm text-gray-400">{index + 1}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {/* ✅ FIX: Use images[0] not photoUrl */}
                          {product.images?.[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.title}
                              className="w-10 h-10 object-cover rounded-lg border border-gray-200 flex-shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Package className="w-5 h-5 text-gray-300" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{product.title}</p>
                            {product.vendor && (
                              <p className="text-xs text-gray-400">{product.vendor}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600">
                        {product.productType || <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold text-gray-900">
                        ${parseFloat(product.price || 0).toFixed(2)}
                      </td>
                      <td className="px-5 py-4">{getStatusBadge(product.status)}</td>
                      <td className="px-5 py-4 text-sm text-gray-500">
                        {product.variants?.length || 0} variant{(product.variants?.length || 0) !== 1 ? "s" : ""}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(product._id)}
                            className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isModalOpen && currentProduct && (
        <EditProductModal
          product={currentProduct}
          onClose={() => setIsModalOpen(false)}
          onUpdate={handleUpdate}
        />
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="text-center">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-7 h-7 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Delete Product?</h3>
              <p className="text-gray-500 text-sm mb-5">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// =========================
// Edit Modal Component
// =========================
const EditProductModal = ({ product, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: product.title || "",
    description: product.description || "",
    price: product.price || 0,
    productType: product.productType || "",
    vendor: product.vendor || "",
    status: product.status || "draft",
  });
  const [newImages, setNewImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState(product.images || []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(files);
    setImagePreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // ✅ FIX: Use FormData (multipart) since backend uses multer
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("productType", formData.productType);
    data.append("vendor", formData.vendor);
    data.append("status", formData.status);

    newImages.forEach((file) => data.append("images", file));

    try {
      const res = await fetch(`${API}/products/${product._id}`, {
        method: "PUT",
        body: data,
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Update failed");

      // Return updated product merged with form data
      onUpdate({
        ...product,
        ...formData,
        price: Number(formData.price),
        images: newImages.length > 0 ? imagePreviews : product.images,
      });
      toast.success("✅ Product updated successfully!");
    } catch (err) {
      toast.error("❌ " + (err.message || "Failed to update product"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl p-6 max-w-xl w-full shadow-2xl my-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-900">Edit Product</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image preview */}
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-5 gap-2">
              {imagePreviews.slice(0, 5).map((img, i) => (
                <img key={i} src={img} className="h-16 w-full object-cover rounded-lg" alt="" />
              ))}
            </div>
          )}

          <label className="flex items-center gap-2 cursor-pointer text-sm text-indigo-600 font-medium hover:text-indigo-800 transition">
            <Upload className="w-4 h-4" /> Replace images
            <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Title *</label>
              <input name="title" value={formData.title} onChange={handleChange} className="w-full border border-gray-300 px-3 py-2.5 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" required />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full border border-gray-300 px-3 py-2.5 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Price *</label>
              <input name="price" type="number" value={formData.price} onChange={handleChange} min="0" step="0.01" className="w-full border border-gray-300 px-3 py-2.5 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Product Type</label>
              <input name="productType" value={formData.productType} onChange={handleChange} className="w-full border border-gray-300 px-3 py-2.5 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Vendor</label>
              <input name="vendor" value={formData.vendor} onChange={handleChange} className="w-full border border-gray-300 px-3 py-2.5 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full border border-gray-300 px-3 py-2.5 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                <option value="draft">Draft</option>
                <option value="active">Active</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="flex-1 px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center gap-2">
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
  );
};

export default ManageProduct;