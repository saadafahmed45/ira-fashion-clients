"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../lib/api";
import { toast } from "react-toastify";
import { Plus, Tag } from "lucide-react";

export default function AdminCouponsPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    code: "", type: "percentage", value: "", minOrderAmount: 0, maxUses: "", expiresAt: "",
  });

  const { data: coupons = [], isLoading } = useQuery({
    queryKey: ["admin-coupons"],
    queryFn: async () => {
      const res = await api.get("/admin/coupons");
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data) => api.post("/admin/coupons", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
      toast.success("Coupon created!");
      setShowForm(false);
      setForm({ code: "", type: "percentage", value: "", minOrderAmount: 0, maxUses: "", expiresAt: "" });
    },
    onError: (err) => toast.error(err.message || "Failed to create coupon"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate({ ...form, value: Number(form.value), minOrderAmount: Number(form.minOrderAmount), maxUses: form.maxUses ? Number(form.maxUses) : null });
  };

  const typeBadge = { percentage: "bg-indigo-100 text-indigo-700", fixed: "bg-amber-100 text-amber-700" };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1000px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Coupons</h1>
          <p className="text-stone-500 text-sm">{coupons.length} active coupons</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-indigo-700 transition">
          <Plus size={15} /> Create Coupon
        </button>
      </div>

      {/* Create Coupon Form */}
      {showForm && (
        <div className="bg-white border border-stone-100 rounded-sm shadow-sm p-6">
          <h2 className="font-semibold text-stone-800 mb-4">New Coupon</h2>
          <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
            {[
              { label: "Coupon Code", name: "code", type: "text", placeholder: "e.g. SAVE20" },
              { label: "Discount Value", name: "value", type: "number", placeholder: "e.g. 20" },
              { label: "Min Order Amount ($)", name: "minOrderAmount", type: "number", placeholder: "0" },
              { label: "Max Uses (blank = unlimited)", name: "maxUses", type: "number", placeholder: "e.g. 100" },
              { label: "Expires At", name: "expiresAt", type: "date" },
            ].map(({ label, name, type, placeholder }) => (
              <div key={name}>
                <label className="block text-xs font-semibold text-stone-600 mb-1.5 uppercase tracking-wider">{label}</label>
                <input type={type} value={form[name]} placeholder={placeholder}
                  onChange={(e) => setForm((p) => ({ ...p, [name]: e.target.value }))}
                  required={["code", "value", "expiresAt"].includes(name)}
                  className="w-full border border-stone-300 px-4 py-2.5 rounded-sm text-sm focus:outline-none focus:border-indigo-500 transition" />
              </div>
            ))}
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1.5 uppercase tracking-wider">Discount Type</label>
              <select value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
                className="w-full border border-stone-300 px-4 py-2.5 rounded-sm text-sm bg-white focus:outline-none focus:border-indigo-500">
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount ($)</option>
              </select>
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <button type="submit" disabled={createMutation.isPending}
                className="px-6 py-2.5 bg-indigo-600 text-white text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-indigo-700 transition disabled:opacity-50">
                {createMutation.isPending ? "Creating..." : "Create Coupon"}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="px-6 py-2.5 border border-stone-300 text-stone-600 text-xs font-medium rounded-sm hover:bg-stone-50 transition">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Coupons List */}
      <div className="bg-white border border-stone-100 rounded-sm shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-14 bg-stone-100 rounded animate-pulse" />)}</div>
        ) : coupons.length === 0 ? (
          <div className="text-center py-16">
            <Tag size={40} className="mx-auto text-stone-300 mb-3" strokeWidth={1} />
            <p className="text-stone-400 text-sm">No coupons yet</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-100">
                {["Code", "Type", "Value", "Min Order", "Used / Max", "Expires", "Active"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {coupons.map((coupon) => (
                <tr key={coupon._id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="px-5 py-3.5 font-mono font-bold text-stone-900 text-xs">{coupon.code}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-sm text-[10px] font-semibold uppercase ${typeBadge[coupon.type]}`}>{coupon.type}</span>
                  </td>
                  <td className="px-5 py-3.5 text-xs font-semibold">{coupon.type === "percentage" ? `${coupon.value}%` : `$${coupon.value}`}</td>
                  <td className="px-5 py-3.5 text-xs text-stone-500">${coupon.minOrderAmount}</td>
                  <td className="px-5 py-3.5 text-xs text-stone-500">{coupon.usedCount} / {coupon.maxUses ?? "∞"}</td>
                  <td className="px-5 py-3.5 text-xs text-stone-400">{new Date(coupon.expiresAt).toLocaleDateString()}</td>
                  <td className="px-5 py-3.5">
                    <span className={`w-2 h-2 rounded-full inline-block ${coupon.isActive ? "bg-emerald-500" : "bg-red-400"}`} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
