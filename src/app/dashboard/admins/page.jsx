"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Users,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Mail,
  UserX,
} from "lucide-react";
import api from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function DashboardAdminsPage() {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuthStore();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  // Modal State
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignEmail, setAssignEmail] = useState("");
  const [assignName, setAssignName] = useState("");
  const [modalError, setModalError] = useState("");

  // Fetch Admins only (role=admin)
  const { data: adminsData, isLoading } = useQuery({
    queryKey: ["adminManagers", { search, status: statusFilter, page }],
    queryFn: async () => {
      const res = await api.get("/users", {
        params: { search, role: "admin", status: statusFilter, page, limit: 15 },
      });
      return res;
    },
  });

  const admins = adminsData?.data || [];
  const meta = adminsData?.meta || { total: 0, page: 1, totalPages: 1 };

  // Quick metrics
  const totalAdmins = meta.total || admins.length;
  const activeCount = admins.filter((a) => a.status === "active").length;
  const suspendedCount = admins.filter((a) => a.status === "blocked").length;

  // Revoke Admin (Demote to user) Mutation
  const demoteMutation = useMutation({
    mutationFn: async ({ id }) => {
      const res = await api.put(`/users/${id}/role`, { role: "user" });
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminManagers"] });
      queryClient.invalidateQueries({ queryKey: ["adminCustomers"] });
      setFeedback({
        type: "success",
        message: "Administrator role revoked successfully (reverted to Customer)",
      });
      setTimeout(() => setFeedback({ type: "", message: "" }), 4000);
    },
    onError: (err) => {
      setFeedback({
        type: "error",
        message: err.message || "Failed to revoke administrator role",
      });
      setTimeout(() => setFeedback({ type: "", message: "" }), 4000);
    },
  });

  // Status Toggle Mutation
  const statusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const res = await api.put(`/users/${id}/status`, { status });
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminManagers"] });
      setFeedback({
        type: "success",
        message: "Administrator status updated successfully",
      });
      setTimeout(() => setFeedback({ type: "", message: "" }), 4000);
    },
    onError: (err) => {
      setFeedback({
        type: "error",
        message: err.message || "Failed to update administrator status",
      });
      setTimeout(() => setFeedback({ type: "", message: "" }), 4000);
    },
  });

  // Assign Admin Mutation
  const assignAdminMutation = useMutation({
    mutationFn: async ({ email, name }) => {
      const res = await api.post("/users/assign-admin", { email, name });
      return res;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["adminManagers"] });
      setIsAssignModalOpen(false);
      setAssignEmail("");
      setAssignName("");
      setFeedback({
        type: "success",
        message: data?.message || "Administrator privileges granted successfully",
      });
      setTimeout(() => setFeedback({ type: "", message: "" }), 4000);
    },
    onError: (err) => {
      setModalError(err.message || "Failed to assign administrator role");
    },
  });

  const handleAssignAdminSubmit = (e) => {
    e.preventDefault();
    setModalError("");
    if (!assignEmail.trim()) {
      setModalError("Please enter an email address");
      return;
    }
    assignAdminMutation.mutate({ email: assignEmail, name: assignName });
  };

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Header & Page Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-[0.25em] text-amber-700 font-bold">
              Governance & Access Control
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-gray-900 font-bold uppercase tracking-wider">
            Administrators & Access
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Supervise team members with elevated dashboard permissions, assign new admins, and manage governance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Dedicated Page Toggle Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-md border border-gray-200">
            <Link
              href="/dashboard/customers"
              className="px-3.5 py-1.5 text-gray-500 hover:text-gray-900 text-xs font-medium rounded uppercase tracking-wider flex items-center gap-1.5 transition-colors"
            >
              <Users className="w-3.5 h-3.5 text-gray-500" />
              Customers
            </Link>
            <Link
              href="/dashboard/admins"
              className="px-3.5 py-1.5 bg-white text-gray-900 text-xs font-semibold shadow-2xs rounded uppercase tracking-wider flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              Administrators
            </Link>
          </div>

          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={() => {
              setModalError("");
              setIsAssignModalOpen(true);
            }}
            className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-4 py-2 shadow-xs uppercase tracking-wider text-xs font-semibold"
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            Assign Admin Role
          </Button>
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
        <div className="bg-amber-50/50 border border-amber-200/80 p-5 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-amber-800">
            <span className="text-[10px] uppercase tracking-wider font-semibold">Total Administrators</span>
            <Shield className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-bold font-serif text-amber-900">{totalAdmins}</div>
        </div>

        <div className="bg-white border border-gray-200/80 p-5 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-emerald-700">
            <span className="text-[10px] uppercase tracking-wider font-semibold">Active Admins</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
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
            placeholder="Search administrators by name or email..."
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
            <option value="active">Active Admins Only</option>
            <option value="blocked">Suspended Only</option>
          </select>
        </div>
      </div>

      {/* Administrators Table */}
      <div className="bg-white border border-gray-200/80 shadow-xs overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-400 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="px-6 py-3.5 font-semibold">Administrator Profile</th>
              <th className="px-6 py-3.5 font-semibold">Email</th>
              <th className="px-6 py-3.5 font-semibold">Role & Access</th>
              <th className="px-6 py-3.5 font-semibold">Account Status</th>
              <th className="px-6 py-3.5 font-semibold">Appointed Date</th>
              <th className="px-6 py-3.5 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                    <span>Loading administrators directory...</span>
                  </div>
                </td>
              </tr>
            ) : admins.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  No administrators found matching your criteria.
                </td>
              </tr>
            ) : (
              admins.map((a) => {
                const isCurrent = currentUser?.email?.toLowerCase() === a.email?.toLowerCase();

                return (
                  <tr key={a._id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {a.photoURL ? (
                          <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-200 relative shrink-0">
                            <Image
                              src={a.photoURL}
                              alt={a.name || "Administrator"}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-amber-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                            {(a.name || a.email || "A")[0].toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="font-semibold text-gray-900">{a.name || "Administrator"}</p>
                            {isCurrent && (
                              <span className="text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded">
                                Current User
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-gray-400">ID: #{a._id.slice(-6).toUpperCase()}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-gray-800 font-mono text-[11px]">
                        <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span>{a.email}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-100 text-amber-900 font-bold text-[10px] uppercase tracking-wider border border-amber-200">
                        <Shield className="w-3 h-3 text-amber-600" />
                        Administrator
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <Badge variant={a.status === "active" ? "success" : "danger"}>
                        {a.status === "active" ? "Active" : "Suspended"}
                      </Badge>
                    </td>

                    <td className="px-6 py-4 text-gray-500 font-mono text-[11px]">
                      {formatDate(a.createdAt)}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Revoke Admin Role */}
                        <button
                          type="button"
                          disabled={isCurrent || demoteMutation.isPending}
                          onClick={() => {
                            if (
                              confirm(
                                `Revoke administrator privileges from ${a.name || a.email}? They will become a regular customer.`
                              )
                            ) {
                              demoteMutation.mutate({ id: a._id });
                            }
                          }}
                          className={`px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider transition-colors ${
                            isCurrent
                              ? "text-gray-300 border border-gray-200 cursor-not-allowed"
                              : "text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200"
                          }`}
                          title={isCurrent ? "You cannot revoke your own administrator role" : "Revoke admin role"}
                        >
                          Revoke Role
                        </button>

                        {/* Suspend / Reactivate */}
                        <button
                          type="button"
                          disabled={isCurrent || statusMutation.isPending}
                          onClick={() => {
                            const newStatus = a.status === "active" ? "blocked" : "active";
                            if (
                              confirm(
                                `Are you sure you want to ${
                                  newStatus === "blocked" ? "SUSPEND" : "REACTIVATE"
                                } admin account ${a.email}?`
                              )
                            ) {
                              statusMutation.mutate({ id: a._id, status: newStatus });
                            }
                          }}
                          className={`px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider transition-colors ${
                            isCurrent
                              ? "text-gray-300 border border-gray-200 cursor-not-allowed"
                              : a.status === "active"
                              ? "text-rose-600 hover:bg-rose-50 border border-rose-200"
                              : "text-emerald-600 hover:bg-emerald-50 border border-emerald-200"
                          }`}
                          title={isCurrent ? "You cannot suspend your own account" : "Suspend or reactivate account"}
                        >
                          {a.status === "active" ? "Suspend" : "Reactivate"}
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

      {/* Assign Admin Role Modal */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title="Assign Administrator Role"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleAssignAdminSubmit} className="space-y-4">
          <p className="text-xs text-gray-500 leading-relaxed">
            Enter the email address of the user or team member you wish to promote to Administrator. If an account does not exist yet, one will be created.
          </p>

          {modalError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{modalError}</span>
            </div>
          )}

          <Input
            label="Email Address *"
            type="email"
            placeholder="colleague@domain.com"
            value={assignEmail}
            onChange={(e) => setAssignEmail(e.target.value)}
            required
          />

          <Input
            label="Full Name (Optional)"
            type="text"
            placeholder="e.g. John Doe"
            value={assignName}
            onChange={(e) => setAssignName(e.target.value)}
          />

          <div className="p-3 bg-amber-50/70 border border-amber-200 text-amber-900 text-[11px] space-y-1">
            <div className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
              Administrative Permissions Note:
            </div>
            <p className="text-amber-800 leading-normal">
              Administrators have full read and write access to store products, categories, orders, coupons, customer profiles, and system settings.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAssignModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={assignAdminMutation.isPending}
              className="bg-gray-900 hover:bg-black text-white"
            >
              Grant Admin Privileges
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
