"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../lib/api";
import Link from "next/link";
import { Plus, Search, Edit2, Trash2, Eye, Package } from "lucide-react";
import { ConfirmDialog } from "../../../components/shared/ConfirmDialog";
import { Pagination } from "../../../components/shared/Pagination";
import { TableRowSkeleton } from "../../../components/shared/SkeletonLoader";
import { toast } from "react-toastify";
import { useDebounce } from "../../../hooks/useDebounce";

const statusBadge = {
  active: "bg-emerald-100 text-emerald-700",
  draft: "bg-stone-100 text-stone-600",
  archived: "bg-red-100 text-red-600",
};

const AdminProductsPage = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const debouncedSearch = useDebounce(search, 400);

  const { data: response, isLoading } = useQuery({
    queryKey: ["admin-products", { page, search: debouncedSearch, status: statusFilter }],
    queryFn: async () => {
      const res = await api.get("/products", {
        params: { page, limit: 10, search: debouncedSearch, status: statusFilter || undefined },
      });
      return res;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => api.delete(`/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("Product deleted successfully");
      setDeleteId(null);
    },
    onError: (err) => toast.error(err.message || "Failed to delete"),
  });

  const products = response?.data || [];
  const meta = response?.meta || {};

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Products</h1>
          <p className="text-stone-500 text-sm">{meta.total || 0} total products</p>
        </div>
        <Link
          href="/dashboard/products/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-indigo-700 transition self-start sm:self-auto"
        >
          <Plus size={15} />
          Add Product
        </Link>
      </div>

      {/* Controls */}
      <div className="bg-white border border-stone-100 rounded-sm shadow-sm p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2.5 border border-stone-200 rounded-sm text-sm focus:outline-none focus:border-indigo-500 transition"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-3 py-2.5 border border-stone-200 rounded-sm text-sm bg-white focus:outline-none focus:border-indigo-500"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-stone-100 rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-100">
                {["Product", "Type", "Price", "Stock", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} cols={6} />)
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16">
                    <Package size={40} className="mx-auto text-stone-300 mb-3" strokeWidth={1} />
                    <p className="text-stone-400 text-sm">No products found</p>
                    <Link href="/dashboard/products/new" className="text-indigo-600 text-xs hover:underline mt-1 inline-block">Add your first product</Link>
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const image = product.images?.[0];
                  const totalStock = product.variants?.reduce((s, v) => s + (v.stock || 0), 0) ?? "—";
                  return (
                    <tr key={product._id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          {image ? (
                            <img src={image} alt={product.title} className="w-10 h-10 rounded-sm object-cover flex-shrink-0" />
                          ) : (
                            <div className="w-10 h-10 rounded-sm bg-stone-100 flex-shrink-0" />
                          )}
                          <span className="font-medium text-stone-800 text-xs line-clamp-2 max-w-[200px]">{product.title}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-stone-500 text-xs">{product.productType || "—"}</td>
                      <td className="px-5 py-3.5 font-semibold text-stone-900 text-xs">${product.price}</td>
                      <td className="px-5 py-3.5 text-stone-500 text-xs">{totalStock}</td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2.5 py-1 rounded-sm text-[10px] font-semibold uppercase ${statusBadge[product.status] || "bg-stone-100 text-stone-500"}`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <Link href={`/product/${product._id}`} className="p-1.5 text-stone-400 hover:text-stone-700 transition" title="View">
                            <Eye size={15} />
                          </Link>
                          <Link href={`/dashboard/products/${product._id}`} className="p-1.5 text-indigo-400 hover:text-indigo-700 transition" title="Edit">
                            <Edit2 size={15} />
                          </Link>
                          <button onClick={() => setDeleteId(product._id)} className="p-1.5 text-red-400 hover:text-red-600 transition" title="Delete">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="border-t border-stone-100 px-5 py-3">
            <Pagination currentPage={page} totalPages={meta.totalPages} onPageChange={setPage} hasNextPage={meta.hasNextPage} hasPrevPage={meta.hasPrevPage} />
          </div>
        )}
      </div>

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Product?"
        description="This will permanently remove the product. This action cannot be undone."
        confirmLabel={deleteMutation.isPending ? "Deleting..." : "Delete"}
        onConfirm={() => deleteMutation.mutate(deleteId)}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};

export default AdminProductsPage;
