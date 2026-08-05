"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../lib/api";
import { toast } from "react-toastify";
import { TableRowSkeleton } from "../../../components/shared/SkeletonLoader";
import { Pagination } from "../../../components/shared/Pagination";

export default function AdminCustomersPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  const { data: response, isLoading } = useQuery({
    queryKey: ["admin-customers", page],
    queryFn: async () => {
      const res = await api.get("/admin/customers", { params: { page, limit: 10 } });
      return res;
    },
  });

  const roleMutation = useMutation({
    mutationFn: async ({ id, role }) => api.put(`/admin/customers/${id}/role`, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-customers"] });
      toast.success("User role updated");
    },
    onError: (err) => toast.error(err.message || "Failed to update role"),
  });

  const customers = response?.data || [];
  const meta = response?.meta || {};

  const roleBadge = {
    admin: "bg-indigo-100 text-indigo-700",
    staff: "bg-blue-100 text-blue-700",
    customer: "bg-stone-100 text-stone-600",
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Customers</h1>
        <p className="text-stone-500 text-sm">{meta.total || 0} registered customers</p>
      </div>

      <div className="bg-white border border-stone-100 rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-100">
                {["Customer", "Email", "Role", "Joined", "Change Role"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} cols={5} />)
              ) : customers.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-16 text-stone-400">No customers found</td></tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer._id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {customer.photoURL ? (
                          <img src={customer.photoURL} alt={customer.name} className="w-9 h-9 rounded-full object-cover flex-shrink-0 border border-stone-100" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs flex-shrink-0">
                            {(customer.name || "?")[0].toUpperCase()}
                          </div>
                        )}
                        <span className="font-medium text-stone-800 text-xs">{customer.name || "—"}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-stone-500">{customer.email}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 rounded-sm text-[10px] font-semibold uppercase ${roleBadge[customer.role] || "bg-stone-100 text-stone-500"}`}>
                        {customer.role}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-stone-400">{new Date(customer.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-3.5">
                      <select
                        value={customer.role}
                        onChange={(e) => roleMutation.mutate({ id: customer._id, role: e.target.value })}
                        className="text-xs border border-stone-200 rounded-sm px-2 py-1.5 bg-white focus:outline-none focus:border-indigo-400 cursor-pointer"
                      >
                        <option value="customer">Customer</option>
                        <option value="staff">Staff</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {meta.totalPages > 1 && (
          <div className="border-t border-stone-100 px-5 py-3">
            <Pagination currentPage={page} totalPages={meta.totalPages} onPageChange={setPage} hasNextPage={meta.hasNextPage} hasPrevPage={meta.hasPrevPage} />
          </div>
        )}
      </div>
    </div>
  );
}
