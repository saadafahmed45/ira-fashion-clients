"use client";

import React, { useState } from "react";
import { Plus, Trash2, Tag, CheckCircle2 } from "lucide-react";
import { useCoupons, useCreateCoupon, useDeleteCoupon } from "@/hooks/useCoupons";
import { formatDate } from "@/lib/utils";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

export default function DashboardCouponsPage() {
  const { data: coupons = [], isLoading } = useCoupons();
  const createCouponMutation = useCreateCoupon();
  const deleteCouponMutation = useDeleteCoupon();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState("percentage");
  const [amount, setAmount] = useState(10);
  const [minPurchase, setMinPurchase] = useState(1000);
  const [maxDiscount, setMaxDiscount] = useState("");
  const [expiryDate, setExpiryDate] = useState("2028-12-31");
  const [msg, setMsg] = useState("");

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      await createCouponMutation.mutateAsync({
        code: code.trim().toUpperCase(),
        discountType,
        amount: Number(amount),
        minPurchase: Number(minPurchase),
        maxDiscount: maxDiscount ? Number(maxDiscount) : null,
        expiryDate,
        isActive: true,
      });
      setIsModalOpen(false);
      setCode("");
      setMsg("Promotional coupon generated successfully!");
      setTimeout(() => setMsg(""), 4000);
    } catch (err) {
      alert(err.message || "Failed to create coupon");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    try {
      await deleteCouponMutation.mutateAsync(id);
      setMsg("Coupon deleted");
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      alert(err.message || "Failed to delete");
    }
  };

  return (
    <div className="p-6 sm:p-10 space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-gray-400 font-semibold block mb-1">
            Marketing & Incentives
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-gray-900 font-bold uppercase tracking-wider">
            Promotional Coupons
          </h1>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-gray-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-gray-800 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create Coupon
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
              <th className="px-6 py-3 font-semibold">Coupon Code</th>
              <th className="px-6 py-3 font-semibold">Type & Value</th>
              <th className="px-6 py-3 font-semibold">Min Spend (৳)</th>
              <th className="px-6 py-3 font-semibold">Expiry Date</th>
              <th className="px-6 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                  Loading coupons...
                </td>
              </tr>
            ) : coupons.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No promotional coupons created yet.
                </td>
              </tr>
            ) : (
              coupons.map((c) => (
                <tr key={c._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-gray-900 flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-amber-600" />
                    {c.code}
                  </td>
                  <td className="px-6 py-4">
                    {c.discountType === "percentage" ? `${c.amount}% OFF` : `৳${c.amount} Flat OFF`}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    ৳{c.minPurchase || 0}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {formatDate(c.expiryDate)}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={c.isActive ? "success" : "danger"}>
                      {c.isActive ? "Active" : "Disabled"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 rounded transition-colors"
                      title="Delete coupon"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Promotional Coupon"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateCoupon} className="space-y-4">
          <Input
            label="Promo Code *"
            placeholder="e.g. SUMMER15"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-medium uppercase tracking-wider text-[#666666] block mb-1">
                Discount Type *
              </label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#E5E5E5] text-xs"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (৳)</option>
              </select>
            </div>

            <Input
              label="Discount Value *"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Min Order Amount (৳)"
              type="number"
              value={minPurchase}
              onChange={(e) => setMinPurchase(e.target.value)}
            />
            <Input
              label="Max Discount Cap (৳)"
              type="number"
              placeholder="Optional"
              value={maxDiscount}
              onChange={(e) => setMaxDiscount(e.target.value)}
            />
          </div>

          <Input
            label="Expiry Date *"
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            required
          />

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs uppercase tracking-wider text-gray-500 font-medium"
            >
              Cancel
            </button>
            <Button type="submit" variant="primary" size="sm" isLoading={createCouponMutation.isPending}>
              Create Coupon
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
