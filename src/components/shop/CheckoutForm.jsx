"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCard, Truck, ShieldCheck, Tag, CheckCircle2 } from "lucide-react";
import { checkoutSchema } from "@/validators/schemas";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useCreateOrder } from "@/hooks/useOrders";
import { useValidateCoupon } from "@/hooks/useCoupons";
import { formatPrice } from "@/lib/utils";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export function CheckoutForm() {
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    items,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    getSubtotal,
    getDiscountAmount,
    getShippingPrice,
    getTotalPrice,
    clearCart,
  } = useCartStore();

  const createOrderMutation = useCreateOrder();
  const validateCouponMutation = useValidateCoupon();

  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [orderError, setOrderError] = useState("");

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const shipping = getShippingPrice();
  const total = getTotalPrice();

  // Prepopulate default address if available
  const defaultAddress = user?.addresses?.find((a) => a.isDefault) || user?.addresses?.[0];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      street: defaultAddress?.street || "",
      city: defaultAddress?.city || "",
      state: defaultAddress?.state || "",
      zip: defaultAddress?.zip || "",
      phone: defaultAddress?.phone || "",
      notes: "",
    },
  });

  const handleApplyCoupon = async () => {
    setCouponError("");
    if (!couponCodeInput.trim()) {
      setCouponError("Please enter a code");
      return;
    }

    try {
      const res = await validateCouponMutation.mutateAsync({
        code: couponCodeInput.trim(),
        subtotal,
      });
      if (res.success && res.data) {
        applyCoupon(res.data);
        setCouponCodeInput("");
      }
    } catch (err) {
      setCouponError(err.message || "Invalid coupon code");
    }
  };

  const onSubmit = async (data) => {
    setOrderError("");
    if (items.length === 0) {
      setOrderError("Your shopping bag is empty");
      return;
    }

    const orderPayload = {
      orderItems: items.map((i) => ({
        product: i.id,
        quantity: i.quantity,
      })),
      shippingAddress: {
        street: data.street,
        city: data.city,
        state: data.state || "",
        zip: data.zip || "",
        phone: data.phone,
      },
      paymentMethod: "COD",
      couponCode: appliedCoupon?.code || undefined,
      notes: data.notes || undefined,
    };

    try {
      const order = await createOrderMutation.mutateAsync(orderPayload);
      clearCart();
      router.push(`/orders?placed=${order._id}`);
    } catch (err) {
      setOrderError(err.message || "Failed to place order. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {orderError && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs">
          {orderError}
        </div>
      )}

      {/* Customer Account Identity */}
      {user?.email && (
        <div className="p-3 bg-gray-50/80 border border-gray-200 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-[11px] uppercase tracking-wider font-medium">Ordering as:</span>
            <span className="font-semibold text-gray-900 font-mono">{user.email}</span>
          </div>
          <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-medium">
            Account Connected
          </span>
        </div>
      )}

      {/* 1. Shipping Address */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
          <Truck className="w-4 h-4 text-gray-700" />
          1. Delivery Address
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Input
              label="Street Address *"
              placeholder="e.g. House 45, Road 11, Block D"
              error={errors.street?.message}
              {...register("street")}
            />
          </div>

          <Input
            label="City / District *"
            placeholder="e.g. Dhaka"
            error={errors.city?.message}
            {...register("city")}
          />

          <Input
            label="Contact Phone Number *"
            placeholder="e.g. +8801711000000"
            error={errors.phone?.message}
            {...register("phone")}
          />

          <Input
            label="Postal / Zip Code"
            placeholder="e.g. 1212"
            error={errors.zip?.message}
            {...register("zip")}
          />

          <Input
            label="State / Province"
            placeholder="e.g. Dhaka Division"
            error={errors.state?.message}
            {...register("state")}
          />
        </div>

        <div>
          <label className="text-[11px] font-medium uppercase tracking-wider text-gray-600 block mb-1">
            Delivery Instructions (Optional)
          </label>
          <textarea
            rows={2}
            placeholder="Special landmark or preferred delivery time..."
            className="w-full p-3 bg-white border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-gray-900 transition-colors"
            {...register("notes")}
          />
        </div>
      </div>

      {/* 2. Payment Method */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-gray-700" />
          2. Payment Method
        </h3>

        <div className="space-y-3">
          {/* Cash on Delivery Option (Default & Active) */}
          <label className="flex items-start gap-3 p-4 border-2 border-gray-900 bg-gray-50/60 cursor-pointer transition-colors">
            <input
              type="radio"
              name="paymentMethod"
              value="COD"
              defaultChecked
              className="mt-1 w-4 h-4 text-gray-900 focus:ring-gray-900"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
                  Cash on Delivery (COD)
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.2 rounded-xs uppercase">
                  Available Nationwide
                </span>
              </div>
              <p className="text-[11px] text-gray-500">
                Inspect your garment upon arrival and pay cash directly to the courier agent.
              </p>
            </div>
          </label>

          {/* Online Payment Option (Disabled with Coming Soon Badge) */}
          <label className="flex items-start gap-3 p-4 border border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed">
            <input
              type="radio"
              name="paymentMethod"
              value="ONLINE"
              disabled
              className="mt-1 w-4 h-4 text-gray-400"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Credit / Debit Card / bKash / Nagad
                </span>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-semibold px-2 py-0.2 uppercase">
                  Coming Soon
                </span>
              </div>
              <p className="text-[11px] text-gray-400">
                Digital checkout integration via Stripe & SSLCommerz will be activated shortly.
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* 3. Coupon Code Input */}
      <div className="space-y-3 bg-gray-50 p-4 border border-gray-100">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-900 flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-gray-600" />
          Promo Code / Gift Voucher
        </label>

        {appliedCoupon ? (
          <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>
                Code <strong>{appliedCoupon.code}</strong> applied (-{formatPrice(discount)})
              </span>
            </div>
            <button
              type="button"
              onClick={removeCoupon}
              className="text-xs font-semibold text-red-600 hover:underline"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. WELCOME10"
              value={couponCodeInput}
              onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
              className="flex-1 px-3 py-2 bg-white border border-gray-200 text-xs uppercase focus:outline-none focus:border-gray-900"
            />
            <button
              type="button"
              onClick={handleApplyCoupon}
              disabled={validateCouponMutation.isPending}
              className="px-4 py-2 bg-gray-900 text-white text-xs font-medium uppercase tracking-wider hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              Apply
            </button>
          </div>
        )}

        {couponError && (
          <p className="text-[11px] text-red-500">{couponError}</p>
        )}
      </div>

      {/* 4. Order Summary Breakdown */}
      <div className="border border-gray-200 p-6 bg-white space-y-3 text-xs">
        <h4 className="font-semibold uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-2">
          Order Summary
        </h4>

        <div className="flex justify-between text-gray-600">
          <span>Items Subtotal ({items.reduce((acc, i) => acc + i.quantity, 0)} items)</span>
          <span className="font-medium text-gray-900">{formatPrice(subtotal)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-emerald-600">
            <span>Coupon Discount</span>
            <span>-{formatPrice(discount)}</span>
          </div>
        )}

        <div className="flex justify-between text-gray-600">
          <span>Delivery Charges</span>
          <span>{shipping === 0 ? "FREE" : formatPrice(shipping)}</span>
        </div>

        <div className="border-t border-gray-100 pt-3 flex justify-between items-baseline text-sm font-semibold text-gray-900">
          <span>Total Payable</span>
          <span className="text-base text-gray-900 font-bold">{formatPrice(total)}</span>
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={createOrderMutation.isPending}
          >
            Confirm Order (Cash on Delivery)
          </Button>
        </div>

        <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Risk-Free Ordering. Inspect before paying courier.</span>
        </div>
      </div>
    </form>
  );
}

export default CheckoutForm;
