"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import api from "@/lib/api";

export default function CreateProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [vendor, setVendor] = useState("IRA Fashion");
  const [price, setPrice] = useState("");
  const [compareAtPrice, setCompareAtPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // Shopify options matrix e.g. [{ name: "Capacity", values: ["30ml", "50ml"] }]
  const [options, setOptions] = useState([
    { name: "Size", values: ["S", "M", "L"] },
  ]);

  const [variants, setVariants] = useState([
    { name: "S", price: 49.99, stock: 10, sku: "IRA-S" },
    { name: "M", price: 49.99, stock: 15, sku: "IRA-M" },
    { name: "L", price: 49.99, stock: 12, sku: "IRA-L" },
  ]);

  const addOption = () => {
    setOptions([...options, { name: "", values: [""] }]);
  };

  const removeOption = (idx) => {
    setOptions(options.filter((_, i) => i !== idx));
  };

  const updateOptionName = (idx, name) => {
    const updated = [...options];
    updated[idx].name = name;
    setOptions(updated);
  };

  const updateOptionValues = (idx, valuesString) => {
    const updated = [...options];
    updated[idx].values = valuesString.split(",").map((v) => v.trim()).filter(Boolean);
    setOptions(updated);
  };

  const addVariantRow = () => {
    setVariants([...variants, { name: "", price: Number(price) || 0, stock: 10, sku: "" }]);
  };

  const updateVariantRow = (idx, field, value) => {
    const updated = [...variants];
    updated[idx][field] = value;
    setVariants(updated);
  };

  const removeVariantRow = (idx) => {
    setVariants(variants.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !price) {
      alert("Please fill in required fields (Title, Description, Base Price).");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        title,
        description,
        vendor,
        price: Number(price),
        compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
        images: imageUrl ? [imageUrl] : ["https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&auto=format&fit=crop&q=80"],
        options,
        variants,
        status: "active",
      };

      await api.post("/products", payload);
      alert("Product created successfully!");
      router.push("/dashboard");
    } catch (err) {
      alert(err.message || "Failed to create product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs uppercase font-semibold text-[#666666] hover:text-[#111111]"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <div className="bg-white p-8 border border-[#E5E5E5] flex flex-col gap-6">
          <h1 className="text-2xl font-light uppercase tracking-wider text-[#111111] pb-4 border-b border-[#E5E5E5]">
            Create Shopify Product
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* General Info */}
            <div className="flex flex-col gap-4">
              <Input label="Product Title *" value={title} onChange={(e) => setTitle(e.target.value)} required />
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-medium uppercase tracking-wider text-[#666666]">
                  Description *
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E5E5E5] text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input label="Vendor / Brand" value={vendor} onChange={(e) => setVendor(e.target.value)} />
                <Input label="Base Price ($) *" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required />
                <Input label="Compare At Price ($)" type="number" step="0.01" value={compareAtPrice} onChange={(e) => setCompareAtPrice(e.target.value)} />
              </div>

              <Input label="Main Image URL" placeholder="https://..." value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
            </div>

            {/* Shopify Options Builder */}
            <div className="border-t border-[#E5E5E5] pt-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                  Product Options (e.g. Size, Color, Capacity)
                </h3>
                <Button type="button" onClick={addOption} variant="outline" size="sm" className="flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> Add Option
                </Button>
              </div>

              {options.map((opt, idx) => (
                <div key={idx} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center bg-[#F9F9F9] p-3 border border-[#E5E5E5]">
                  <div className="sm:col-span-4">
                    <Input
                      placeholder="Option Name (e.g. Size)"
                      value={opt.name}
                      onChange={(e) => updateOptionName(idx, e.target.value)}
                    />
                  </div>
                  <div className="sm:col-span-7">
                    <Input
                      placeholder="Values (comma separated e.g. S, M, L)"
                      value={opt.values.join(", ")}
                      onChange={(e) => updateOptionValues(idx, e.target.value)}
                    />
                  </div>
                  <div className="sm:col-span-1 flex justify-center">
                    <button type="button" onClick={() => removeOption(idx)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Shopify Variants Matrix */}
            <div className="border-t border-[#E5E5E5] pt-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                  Variants Matrix
                </h3>
                <Button type="button" onClick={addVariantRow} variant="outline" size="sm" className="flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> Add Variant Row
                </Button>
              </div>

              <div className="flex flex-col gap-3">
                {variants.map((v, idx) => (
                  <div key={idx} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center bg-[#F9F9F9] p-3 border border-[#E5E5E5]">
                    <div className="sm:col-span-4">
                      <Input
                        placeholder="Variant Title (e.g. Black / S)"
                        value={v.name}
                        onChange={(e) => updateVariantRow(idx, "name", e.target.value)}
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <Input
                        placeholder="Price"
                        type="number"
                        step="0.01"
                        value={v.price}
                        onChange={(e) => updateVariantRow(idx, "price", Number(e.target.value))}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Input
                        placeholder="Stock"
                        type="number"
                        value={v.stock}
                        onChange={(e) => updateVariantRow(idx, "stock", Number(e.target.value))}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Input
                        placeholder="SKU"
                        value={v.sku}
                        onChange={(e) => updateVariantRow(idx, "sku", e.target.value)}
                      />
                    </div>
                    <div className="sm:col-span-1 flex justify-center">
                      <button type="button" onClick={() => removeVariantRow(idx)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button type="submit" isLoading={loading} size="lg" fullWidth className="py-4 mt-4">
              Publish Product
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
