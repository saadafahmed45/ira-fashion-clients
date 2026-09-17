"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Plus, Search, Edit2, Trash2, CheckCircle2, Star, Sparkles } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import api from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import ProductDialog from "@/components/dashboard/ProductDialog";
import Badge from "@/components/ui/Badge";
import Skeleton from "@/components/ui/Skeleton";

export default function DashboardProductsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [page, setPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const { data: categories = [] } = useCategories();
  const { data: productsData, isLoading, refetch } = useProducts({
    search,
    category: selectedCategory,
    page,
    limit: 15,
    status: "", // Admin can view active, draft, archived
  });

  const products = productsData?.data || [];
  const meta = productsData?.meta || { total: 0, page: 1, totalPages: 1 };

  const handleCreateOrUpdate = async (productData) => {
    setActionLoading(true);
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, productData);
        setMsg("Product updated successfully!");
      } else {
        await api.post("/products", productData);
        setMsg("Product created successfully!");
      }
      refetch();
      setTimeout(() => setMsg(""), 4000);
    } catch (err) {
      alert(err.message || "Operation failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      refetch();
      setMsg("Product deleted successfully");
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      alert(err.message || "Failed to delete product");
    }
  };

  return (
    <div className="p-6 sm:p-10 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-gray-400 font-semibold block mb-1">
            Inventory & Catalog
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-gray-900 font-bold uppercase tracking-wider">
            Garment Management
          </h1>
        </div>

        <button
          onClick={() => {
            setEditingProduct(null);
            setIsDialogOpen(true);
          }}
          className="px-5 py-2.5 bg-gray-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-gray-800 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add New Garment
        </button>
      </div>

      {msg && (
        <div className="p-3 bg-emerald-50 text-emerald-800 text-xs border border-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{msg}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white p-4 border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title, brand, sku..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 text-xs focus:outline-none focus:border-gray-900"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-auto px-3 py-2 bg-gray-50 border border-gray-200 text-xs text-gray-700 focus:outline-none"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 shadow-xs overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50/70 border-b border-gray-100 text-gray-400 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="px-6 py-3 font-semibold">Garment</th>
              <th className="px-6 py-3 font-semibold">Category</th>
              <th className="px-6 py-3 font-semibold">Price (৳)</th>
              <th className="px-6 py-3 font-semibold">Stock</th>
              <th className="px-6 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                  Loading products catalog...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No garments match your filters.
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-16 bg-gray-50 flex-shrink-0 border border-gray-100 overflow-hidden">
                        {p.images?.[0] && (
                          <Image
                            src={p.images[0]}
                            alt={p.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="font-semibold text-gray-900 truncate max-w-xs">{p.name}</p>
                          {p.isFeatured && (
                            <span title="Featured Item">
                              <Sparkles className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-400 truncate">{p.brand || "Ira Fashion"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {p.category?.name || "Uncategorized"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">{formatPrice(p.price)}</div>
                    {p.discountPrice > 0 && (
                      <div className="text-[11px] text-emerald-600">
                        Sale: {formatPrice(p.discountPrice)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {p.stock > 0 ? (
                      <span className="font-medium text-gray-900">{p.stock} units</span>
                    ) : (
                      <span className="text-red-500 font-medium">Out of Stock</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={p.status === "active" ? "success" : "default"}>
                      {p.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingProduct(p);
                          setIsDialogOpen(true);
                        }}
                        className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                        title="Edit garment"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete garment"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
          <span>
            Showing {(meta.page - 1) * meta.limit + 1} to{" "}
            {Math.min(meta.page * meta.limit, meta.total)} of {meta.total} products
          </span>
          <div className="flex gap-2">
            <button
              disabled={meta.page <= 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1.5 border border-gray-200 hover:bg-gray-50 disabled:opacity-40"
            >
              Previous
            </button>
            <button
              disabled={meta.page >= meta.totalPages}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1.5 border border-gray-200 hover:bg-gray-50 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Create / Edit Dialog */}
      <ProductDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={handleCreateOrUpdate}
        categories={categories}
        initialData={editingProduct}
        isLoading={actionLoading}
      />
    </div>
  );
}
