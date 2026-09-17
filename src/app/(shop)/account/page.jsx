"use client";

import React, { useState } from "react";
import Link from "next/link";
import { User, MapPin, Plus, Trash2, LogOut, CheckCircle2 } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function AccountPage() {
  const { user, isAuthenticated, logout, setAuth, accessToken } = useAuthStore();
  const [addingAddress, setAddingAddress] = useState(false);
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [msg, setMsg] = useState("");

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4 text-gray-400">
          <User className="w-8 h-8 stroke-1" />
        </div>
        <h1 className="font-serif text-2xl text-gray-900 mb-2">My Profile</h1>
        <p className="text-xs text-gray-500 mb-6">
          Sign in to access your saved addresses and personal preferences.
        </p>
        <Link
          href="/login?redirect=/account"
          className="inline-block px-6 py-2.5 bg-gray-900 text-white text-xs uppercase tracking-wider font-semibold hover:bg-gray-800 transition-colors"
        >
          Sign In
        </Link>
      </div>
    );
  }

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!street || !city || !phone) return;

    try {
      const currentAddresses = user?.addresses || [];
      const newAddresses = [
        ...currentAddresses,
        {
          street,
          city,
          state: "Dhaka",
          zip: "1200",
          country: "Bangladesh",
          phone,
          isDefault: currentAddresses.length === 0,
        },
      ];

      const res = await api.put("/users/profile", { addresses: newAddresses });
      if (res.success) {
        setAuth({ ...user, addresses: newAddresses }, accessToken);
        setStreet("");
        setCity("");
        setPhone("");
        setAddingAddress(false);
        setMsg("Address saved successfully!");
        setTimeout(() => setMsg(""), 4000);
      }
    } catch (err) {
      alert(err.message || "Failed to save address");
    }
  };

  const handleDeleteAddress = async (index) => {
    try {
      const newAddresses = user?.addresses.filter((_, i) => i !== index);
      const res = await api.put("/users/profile", { addresses: newAddresses });
      if (res.success) {
        setAuth({ ...user, addresses: newAddresses }, accessToken);
      }
    } catch (err) {
      alert(err.message || "Failed to remove address");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="border-b border-gray-100 pb-6 mb-8 flex justify-between items-end">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-gray-400 block mb-1">
            Account Management
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-gray-900 font-bold uppercase tracking-wider">
            Profile & Addresses
          </h1>
        </div>

        <button
          onClick={logout}
          className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1.5 uppercase tracking-wider"
        >
          <LogOut className="w-3.5 h-3.5" /> Sign Out
        </button>
      </div>

      {msg && (
        <div className="mb-6 p-3 bg-emerald-50 text-emerald-800 text-xs border border-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{msg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* User Info Card */}
        <div className="md:col-span-1 bg-gray-50/70 border border-gray-100 p-6 space-y-4">
          <div className="w-14 h-14 rounded-full bg-gray-900 text-white flex items-center justify-center font-serif text-xl font-bold overflow-hidden border border-gray-200">
            {user?.photoURL ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.photoURL}
                alt={user.name || "User"}
                className="w-full h-full object-cover"
              />
            ) : (
              (user?.name || user?.email || "U")[0]?.toUpperCase()
            )}
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              {user?.name || "Customer"}
            </h3>
            <p className="text-xs text-gray-600 font-mono mt-0.5" title="Registered Email">
              {user?.email}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                user?.role === "admin"
                  ? "bg-amber-100 text-amber-900 border border-amber-200"
                  : "bg-gray-200 text-gray-800"
              }`}>
                {user?.role === "admin" ? "Administrator" : "Customer"}
              </span>
              <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                Verified
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200/60 space-y-2 text-xs">
            <Link
              href="/orders"
              className="block text-gray-700 hover:text-gray-900 font-medium py-1"
            >
              View Order History →
            </Link>
            <Link
              href="/wishlist"
              className="block text-gray-700 hover:text-gray-900 font-medium py-1"
            >
              Saved Garments ({user?.wishlist?.length || 0}) →
            </Link>
          </div>
        </div>

        {/* Address Book */}
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-600" />
              Saved Shipping Addresses
            </h3>
            <button
              onClick={() => setAddingAddress(!addingAddress)}
              className="text-xs font-semibold text-gray-900 hover:text-gray-600 flex items-center gap-1 uppercase tracking-wider"
            >
              <Plus className="w-3.5 h-3.5" />
              {addingAddress ? "Cancel" : "Add Address"}
            </button>
          </div>

          {/* Add Address Form */}
          {addingAddress && (
            <form
              onSubmit={handleAddAddress}
              className="p-5 bg-white border border-gray-200 space-y-4 shadow-sm"
            >
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-900">
                New Delivery Address
              </h4>
              <Input
                label="Street Address *"
                placeholder="House 12, Road 4, Sector 7"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                required
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="City *"
                  placeholder="Dhaka"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
                <Input
                  label="Phone *"
                  placeholder="+8801711000000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" variant="primary" size="sm">
                Save Address
              </Button>
            </form>
          )}

          {/* Addresses List */}
          {(!user?.addresses || user.addresses.length === 0) ? (
            <p className="text-xs text-gray-500 py-6 border border-dashed border-gray-200 p-6 text-center">
              No delivery addresses saved yet. Click &quot;Add Address&quot; above to add one.
            </p>
          ) : (
            <div className="space-y-3">
              {user.addresses.map((addr, idx) => (
                <div
                  key={idx}
                  className="p-4 border border-gray-100 bg-white flex items-start justify-between gap-4"
                >
                  <div className="space-y-1 text-xs">
                    <p className="font-semibold text-gray-900">{addr.street}</p>
                    <p className="text-gray-500">
                      {addr.city}, {addr.country || "Bangladesh"}
                    </p>
                    <p className="text-gray-500">Phone: {addr.phone}</p>
                    {addr.isDefault && (
                      <span className="inline-block text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 font-bold uppercase mt-1">
                        Default Address
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleDeleteAddress(idx)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    aria-label="Delete address"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
