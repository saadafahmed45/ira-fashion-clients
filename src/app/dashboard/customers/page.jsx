"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Search,
  Users,
  UserCheck,
  UserX,
  Shield,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Mail,
  MapPin,
  Calendar,
} from "lucide-react";
import api from "@/lib/api";
import { formatDate } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

export default function DashboardCustomersPage() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  // Fetch Customers only (role=user)
  const { data: usersData, isLoading } = useQuery({
    queryKey: ["adminCustomers", { search, status: statusFilter, page }],
    queryFn: async () => {
      const res = await api.get("/users", {
        params: { search, role: "user", status: statusFilter, page, limit: 15 },
      });
      return res;
    },
  });

  const customers = usersData?.data || [];
  const meta = usersData?.meta || { total: 0, page: 1, totalPages: 1 };

  // Quick metrics
  const totalCustomers = meta.total || customers.length;
  const activeCount = customers.filter((c) => c.status === "active").length;
  const suspendedCount = customers.filter((c) => c.status === "blocked").length;

  // Status Toggle Mutation
  const statusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const res = await api.put(`/users/${id}/status`, { status });
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminCustomers"] });
      setFeedback({
        type: "success",
        message: "Customer status updated successfully",
      });
      setTimeout(() => setFeedback({ type: "", message: "" }), 4000);
    },
    onError: (err) => {
      setFeedback({
        type: "error",
        message: err.message || "Failed to update customer status",
      });
      setTimeout(() => setFeedback({ type: "", message: "" }), 4000);
    },
  });

  // Promote to Admin Mutation
  const promoteMutation = useMutation({
    mutationFn: async ({ id }) => {
      const res = await api.put(`/users/${id}/role`, { role: "admin" });
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminCustomers"] });
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      setFeedback({
        type: "success",
        message: "Customer promoted to Administrator successfully!",
      });
      setTimeout(() => setFeedback({ type: "", message: "" }), 4000);
    },
    onError: (err) => {
      setFeedback({
        type: "error",
        message: err.message || "Failed to promote customer",
      });
      setTimeout(() => setFeedback({ type: "", message: "" }), 4000);
    },
  });

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Header & Page Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-[0.25em] text-gray-500 font-bold">
              Client Directory
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-gray-900 font-bold uppercase tracking-wider">
            Customers Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Supervise registered retail customer profiles, order addresses, and account moderation.
          </p>
        </div>

        {/* Dedicated Page Toggle Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-md border border-gray-200">
          <Link
            href="/dashboard/customers"
            className="px-3.5 py-1.5 bg-white text-gray-900 text-xs font-semibold shadow-2xs rounded uppercase tracking-wider flex items-center gap-1.5"
          >
            <Users className="w-3.5 h-3.5 text-gray-800" />
            Customers
          </Link>
          <Link
            href="/dashboard/admins"
            className="px-3.5 py-1.5 text-gray-500 hover:text-gray-900 text-xs font-medium rounded uppercase tracking-wider flex items-center gap-1.5 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            Administrators
          </Link>
        </div>
      </div>

      {/* Feedback Alert */}
      {feedback.message && (
        <div
          className={`p-3.5 text-xs border flex items-center gap-2.5 transition-all ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-rose-50 text-rose-800 border-rose-200"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span className="font-medium">{feedback.message}</span>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200/80 p-5 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-[10px] uppercase tracking-wider font-semibold">Total Customers</span>
            <Users className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-3xl font-bold font-serif text-gray-900">{totalCustomers}</div>
        </div>

        <div className="bg-white border border-gray-200/80 p-5 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-emerald-700">
            <span className="text-[10px] uppercase tracking-wider font-semibold">Active Customers</span>
            <UserCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-bold font-serif text-emerald-700">{activeCount}</div>
        </div>

        <div className="bg-white border border-gray-200/80 p-5 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-rose-700">
            <span className="text-[10px] uppercase tracking-wider font-semibold">Suspended</span>
            <UserX className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-3xl font-bold font-serif text-rose-700">{suspendedCount}</div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 border border-gray-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search customers by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-gray-900"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 bg-gray-50 border border-gray-200 text-xs text-gray-700 focus:outline-none focus:border-gray-900"
          >
            <option value="">All Account Statuses</option>
            <option value="active">Active Accounts Only</option>
            <option value="blocked">Suspended Only</option>
          </select>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white border border-gray-200/80 shadow-xs overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-400 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="px-6 py-3.5 font-semibold">Customer Profile</th>
              <th className="px-6 py-3.5 font-semibold">Email & Contact</th>
              <th className="px-6 py-3.5 font-semibold">Status</th>
              <th className="px-6 py-3.5 font-semibold">Saved Addresses</th>
              <th className="px-6 py-3.5 font-semibold">Registered</th>
              <th className="px-6 py-3.5 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                    <span>Loading customers list...</span>
                  </div>
                </td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  No customers found matching your criteria.
                </td>
              </tr>
            ) : (
              customers.map((c) => {
                const defaultAddr = c.addresses?.find((a) => a.isDefault) || c.addresses?.[0];

                return (
                  <tr key={c._id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {c.photoURL ? (
                          <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-200 relative shrink-0">
                            <Image
                              src={c.photoURL}
                              alt={c.name || "Customer"}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                            {(c.name || c.email || "C")[0].toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-900">{c.name || "Unnamed Customer"}</p>
                          <span className="text-[10px] text-gray-400">ID: #{c._id.slice(-6).toUpperCase()}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-gray-800 font-mono text-[11px]">
                          <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span>{c.email}</span>
                        </div>
                        {defaultAddr?.phone && (
                          <p className="text-[11px] text-gray-500">{defaultAddr.phone}</p>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <Badge variant={c.status === "active" ? "success" : "danger"}>
                        {c.status === "active" ? "Active" : "Suspended"}
                      </Badge>
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {c.addresses?.length > 0 ? (
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span>
                            {defaultAddr?.city || "Address on file"} ({c.addresses.length})
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-[11px]">No addresses saved</span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-gray-500 font-mono text-[11px]">
                      {formatDate(c.createdAt)}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Promote to Admin */}
                        <button
                          type="button"
                          disabled={promoteMutation.isPending}
                          onClick={() => {
                            if (
                              confirm(
                                `Promote customer ${c.name || c.email} to Administrator? They will have full access to the admin dashboard.`
                              )
                            ) {
                              promoteMutation.mutate({ id: c._id });
                            }
                          }}
                          className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors"
                          title="Grant administrator privileges"
                        >
                          Make Admin
                        </button>

                        {/* Suspend / Reactivate */}
                        <button
                          type="button"
                          disabled={statusMutation.isPending}
                          onClick={() => {
                            const newStatus = c.status === "active" ? "blocked" : "active";
                            if (
                              confirm(
                                `Are you sure you want to ${
                                  newStatus === "blocked" ? "SUSPEND" : "REACTIVATE"
                                } account ${c.email}?`
                              )
                            ) {
                              statusMutation.mutate({ id: c._id, status: newStatus });
                            }
                          }}
                          className={`px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider transition-colors ${
                            c.status === "active"
                              ? "text-rose-600 hover:bg-rose-50 border border-rose-200"
                              : "text-emerald-600 hover:bg-emerald-50 border border-emerald-200"
                          }`}
                        >
                          {c.status === "active" ? "Suspend" : "Reactivate"}
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
    </div>
  );
}
