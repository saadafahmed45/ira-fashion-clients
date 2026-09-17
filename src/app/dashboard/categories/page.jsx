"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, CheckCircle2 } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import api from "@/lib/api";
import CategoryDialog from "@/components/dashboard/CategoryDialog";
import Badge from "@/components/ui/Badge";
import Skeleton from "@/components/ui/Skeleton";

export default function DashboardCategoriesPage() {
  const { data: categories = [], isLoading, refetch } = useCategories(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleCreateOrUpdate = async (data) => {
    setActionLoading(true);
    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory._id}`, data);
        setMsg("Category updated successfully!");
      } else {
        await api.post("/categories", data);
        setMsg("Category created successfully!");
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
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await api.delete(`/categories/${id}`);
      refetch();
      setMsg("Category deleted successfully");
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      alert(err.message || "Failed to delete category");
    }
  };

  return (
    <div className="p-6 sm:p-10 space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-gray-400 font-semibold block mb-1">
            Store Taxonomy
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-gray-900 font-bold uppercase tracking-wider">
            Category Management
          </h1>
        </div>

        <button
          onClick={() => {
            setEditingCategory(null);
            setIsDialogOpen(true);
          }}
          className="px-5 py-2.5 bg-gray-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-gray-800 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {msg && (
        <div className="p-3 bg-emerald-50 text-emerald-800 text-xs border border-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{msg}</span>
        </div>
      )}

      <div className="bg-white border border-gray-100 shadow-xs overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50/70 border-b border-gray-100 text-gray-400 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="px-6 py-3 font-semibold">Category Name</th>
              <th className="px-6 py-3 font-semibold">Slug</th>
              <th className="px-6 py-3 font-semibold">Description</th>
              <th className="px-6 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                  Loading categories...
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No categories created yet.
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded bg-gray-100 overflow-hidden flex-shrink-0">
                        {cat.image && (
                          <Image
                            src={cat.image}
                            alt={cat.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        )}
                      </div>
                      <span className="font-semibold text-gray-900">{cat.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-gray-500 text-[11px]">
                    {cat.slug}
                  </td>
                  <td className="px-6 py-4 text-gray-500 max-w-xs truncate">
                    {cat.description || "—"}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={cat.isActive ? "success" : "default"}>
                      {cat.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingCategory(cat);
                          setIsDialogOpen(true);
                        }}
                        className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                        title="Edit category"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat._id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete category"
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

      <CategoryDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingCategory(null);
        }}
        onSubmit={handleCreateOrUpdate}
        initialData={editingCategory}
        isLoading={actionLoading}
      />
    </div>
  );
}
