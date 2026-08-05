"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useCartStore } from "@/features/cart/store/cartStore";
import api from "@/lib/api";

const checkoutSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email address is required"),
  phone: z.string().min(8, "Phone number is required"),
  street: z.string().min(5, "Street address is required"),
  city: z.string().min(2, "City is required"),
  zip: z.string().min(2, "Postal code is required"),
});

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCartStore();
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  const subtotal = getSubtotal();
  const shipping = subtotal > 150 ? 0 : 15;
  const total = subtotal + shipping;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
  });

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const payload = {
        customer: {
          name: data.name,
          email: data.email,
          phone: data.phone,
        },
        shippingAddress: {
          street: data.street,
          city: data.city,
          zip: data.zip,
          country: "Bangladesh",
        },
        products: items.map((item) => ({
          productId: item.productId,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          variant: item.variant,
        })),
        pricing: {
          subtotal,
          shipping,
          total,
        },
        paymentMethod,
      };

      const res = await api.post("/orders", payload);
      const createdOrder = res?.data || res;

      clearCart();
      const orderNum = createdOrder.orderNumber || createdOrder._id;
      router.push(`/order-success?orderNumber=${orderNum}`);
    } catch (err) {
      console.error("Order submission failed:", err);
      alert(err.message || "Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center flex flex-col items-center gap-6">
        <CheckCircle2 className="w-16 h-16 text-emerald-600" />
        <h1 className="text-3xl font-light uppercase tracking-wide text-[#111111]">
          Thank You For Your Order
        </h1>
        <p className="text-xs text-[#666666] leading-relaxed max-w-md">
          Your order <span className="font-semibold text-[#111111]">{orderSuccess.orderNumber}</span> has been confirmed. A confirmation receipt has been sent to your email.
        </p>
        <Button onClick={() => router.push("/products")} variant="primary" size="lg" className="mt-4">
          Continue Shopping
        </Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center flex flex-col items-center gap-4">
        <h1 className="text-xl font-semibold uppercase tracking-wider text-[#111111]">
          Your Cart is Empty
        </h1>
        <p className="text-xs text-[#666666]">Please add items to your cart before proceeding to checkout.</p>
        <Button onClick={() => router.push("/products")} variant="outline" size="md">
          Return To Shop
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-light uppercase tracking-wider text-[#111111] mb-8 pb-4 border-b border-[#E5E5E5]">
        Express Checkout
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Shipping Form Column */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
              1. Contact & Shipping Details
            </h3>
            
            <Input label="Full Name" error={errors.name?.message} {...register("name")} />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Email Address" type="email" error={errors.email?.message} {...register("email")} />
              <Input label="Phone Number" error={errors.phone?.message} {...register("phone")} />
            </div>

            <Input label="Street Address" error={errors.street?.message} {...register("street")} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="City" error={errors.city?.message} {...register("city")} />
              <Input label="Postal Code" error={errors.zip?.message} {...register("zip")} />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="flex flex-col gap-4 border-t border-[#E5E5E5] pt-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
              2. Payment Method
            </h3>

            <div className="flex flex-col gap-3">
              {[
                { id: "cod", label: "Cash on Delivery (COD)", desc: "Pay with cash upon package delivery" },
                { id: "bkash", label: "bKash / Mobile Banking", desc: "Pay securely via bKash gateway" },
                { id: "card", label: "Credit / Debit Card", desc: "Pay with Visa, Mastercard, or AMEX" },
              ].map((method) => (
                <label
                  key={method.id}
                  className={`flex items-start gap-3 p-4 border transition-colors cursor-pointer ${
                    paymentMethod === method.id ? "border-[#111111] bg-[#F9F9F9]" : "border-[#E5E5E5] bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={paymentMethod === method.id}
                    onChange={() => setPaymentMethod(method.id)}
                    className="mt-1 accent-[#111111]"
                  />
                  <div>
                    <span className="text-xs font-semibold text-[#111111] block">{method.label}</span>
                    <span className="text-[11px] text-[#666666]">{method.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <Button type="submit" isLoading={isSubmitting} size="lg" fullWidth className="py-4 mt-2">
            Complete Order (${total.toFixed(2)})
          </Button>
        </div>

        {/* Order Summary Column */}
        <div className="lg:col-span-5 bg-[#F9F9F9] p-6 border border-[#E5E5E5] flex flex-col gap-6 h-fit">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111] border-b border-[#E5E5E5] pb-3">
            Order Summary ({items.length} items)
          </h3>

          <div className="flex flex-col divide-y divide-[#E5E5E5] max-h-80 overflow-y-auto">
            {items.map((item) => (
              <div key={item.key} className="py-3 flex gap-3 items-center">
                <div className="relative w-14 aspect-[3/4] bg-white border border-[#E5E5E5] flex-shrink-0">
                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-medium text-[#111111] line-clamp-1">{item.title}</h4>
                  {item.variant && <span className="text-[10px] text-[#666666]">{item.variant.name}</span>}
                  <span className="text-[11px] text-[#666666] block">Qty: {item.quantity}</span>
                </div>
                <span className="text-xs font-semibold text-[#111111]">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-[#E5E5E5] pt-4 flex flex-col gap-2 text-xs">
            <div className="flex justify-between text-[#666666]">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[#666666]">
              <span>Shipping</span>
              <span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-[#111111] font-bold text-sm border-t border-[#E5E5E5] pt-3">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
