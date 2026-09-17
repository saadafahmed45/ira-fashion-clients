"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadCloud, X, Plus, Trash2, CheckCircle2, Loader2, Image as ImageIcon } from "lucide-react";
import { productSchema } from "@/validators/schemas";
import api from "@/lib/api";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export function ProductDialog({
  isOpen,
  onClose,
  onSubmit,
  categories = [],
  initialData = null,
  isLoading = false,
}) {
  const fileInputRef = useRef(null);
  const [images, setImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [manualUrl, setManualUrl] = useState("");
  const [showManualUrl, setShowManualUrl] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      discountPrice: 0,
      category: "",
      brand: "Ira Fashion",
      stock: 10,
      isFeatured: false,
      status: "active",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || "",
        description: initialData.description || "",
        price: initialData.price || 0,
        discountPrice: initialData.discountPrice || 0,
        category: initialData.category?._id || initialData.category || "",
        brand: initialData.brand || "Ira Fashion",
        stock: initialData.stock || 0,
        isFeatured: initialData.isFeatured || false,
        status: initialData.status || "active",
      });
      setImages(initialData.images || []);
    } else {
      reset({
        name: "",
        description: "",
        price: 0,
        discountPrice: 0,
        category: categories[0]?._id || "",
        brand: "Ira Fashion",
        stock: 15,
        isFeatured: false,
        status: "active",
      });
      setImages([]);
    }
    setUploadError("");
  }, [initialData, categories, reset, isOpen]);

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    setUploadError("");

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const res = await api.post("/upload/multiple", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.success && res.data?.urls) {
        setImages((prev) => [...prev, ...res.data.urls]);
      }
    } catch (err) {
      setUploadError(err.message || "Failed to upload images to Cloudinary");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleAddManualUrl = (e) => {
    e.preventDefault();
    if (!manualUrl.trim()) return;
    setImages((prev) => [...prev, manualUrl.trim()]);
    setManualUrl("");
    setShowManualUrl(false);
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleFormSubmit = async (data) => {
    const payload = {
      ...data,
      images: images.length > 0 ? images : undefined,
    };
    await onSubmit(payload);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Garment" : "Create New Garment"}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
        <Input
          label="Garment Title *"
          placeholder="e.g. Midnight Blossom Silk Maxi Dress"
          error={errors.name?.message}
          {...register("name")}
        />

        <div>
          <label className="text-[11px] font-medium uppercase tracking-wider text-[#666666] block mb-1">
            Description *
          </label>
          <textarea
            rows={3}
            placeholder="Fabric composition, embroidery details, fit notes..."
            className="w-full p-3 bg-white border border-[#E5E5E5] text-xs text-[#111111] focus:outline-none focus:border-[#111111] transition-colors"
            {...register("description")}
          />
          {errors.description && (
            <span className="text-[11px] text-red-500">{errors.description.message}</span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Regular Price (৳) *"
            type="number"
            placeholder="3450"
            error={errors.price?.message}
            {...register("price")}
          />
          <Input
            label="Discounted Price (৳)"
            type="number"
            placeholder="2950"
            error={errors.discountPrice?.message}
            {...register("discountPrice")}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-medium uppercase tracking-wider text-[#666666] block mb-1">
              Category *
            </label>
            <select
              className="w-full px-3 py-2.5 bg-white border border-[#E5E5E5] text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
              {...register("category")}
            >
              <option value="">Select category...</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <span className="text-[11px] text-red-500">{errors.category.message}</span>
            )}
          </div>

          <Input
            label="Stock Quantity *"
            type="number"
            placeholder="25"
            error={errors.stock?.message}
            {...register("stock")}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Brand"
            placeholder="Ira Fashion"
            error={errors.brand?.message}
            {...register("brand")}
          />
          <div>
            <label className="text-[11px] font-medium uppercase tracking-wider text-[#666666] block mb-1">
              Status
            </label>
            <select
              className="w-full px-3 py-2.5 bg-white border border-[#E5E5E5] text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
              {...register("status")}
            >
              <option value="active">Active (Visible in Store)</option>
              <option value="draft">Draft (Hidden)</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Cloudinary Image Upload Section */}
        <div className="space-y-3 pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-900 block">
                Product Images (Cloudinary CDN)
              </label>
              <p className="text-[10px] text-gray-500">
                Upload files from your computer to Cloudinary or paste external URLs
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowManualUrl(!showManualUrl)}
              className="text-[11px] text-gray-600 hover:text-gray-900 underline"
            >
              {showManualUrl ? "Upload File Instead" : "+ Add by URL"}
            </button>
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          {/* Drag & Drop / Click Upload Box */}
          {!showManualUrl && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 hover:border-gray-900 p-6 text-center cursor-pointer transition-colors bg-gray-50/60 hover:bg-gray-50 flex flex-col items-center justify-center gap-2 group"
            >
              {isUploading ? (
                <div className="flex flex-col items-center gap-2 text-gray-600">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-900" />
                  <span className="text-xs font-medium">Uploading to Cloudinary CDN...</span>
                </div>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-white shadow-xs border border-gray-200 flex items-center justify-center text-gray-500 group-hover:text-gray-900 transition-colors">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-900 block">
                      Click to browse or drop images here
                    </span>
                    <span className="text-[10px] text-gray-400">
                      Supports JPG, PNG, WEBP up to 5MB (Max 10 images)
                    </span>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Manual URL Input */}
          {showManualUrl && (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="https://res.cloudinary.com/... or Unsplash URL"
                value={manualUrl}
                onChange={(e) => setManualUrl(e.target.value)}
                className="flex-1 px-3 py-2 bg-white border border-gray-200 text-xs focus:outline-none focus:border-gray-900"
              />
              <button
                type="button"
                onClick={handleAddManualUrl}
                className="px-4 py-2 bg-gray-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-gray-800"
              >
                Add
              </button>
            </div>
          )}

          {uploadError && (
            <p className="text-[11px] text-rose-600 bg-rose-50 p-2 border border-rose-200">
              {uploadError}
            </p>
          )}

          {/* Uploaded Images Preview Grid */}
          {images.length > 0 && (
            <div className="space-y-1 pt-2">
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold block">
                Active Gallery ({images.length}) — First image is primary:
              </span>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                {images.map((url, idx) => (
                  <div
                    key={idx}
                    className={`relative aspect-[3/4] bg-gray-100 border overflow-hidden group ${
                      idx === 0 ? "ring-2 ring-gray-900 border-gray-900" : "border-gray-200"
                    }`}
                  >
                    <Image
                      src={url}
                      alt={`Product image ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="100px"
                    />

                    {/* Primary Badge */}
                    {idx === 0 && (
                      <span className="absolute top-1 left-1 bg-gray-900 text-white text-[8px] uppercase tracking-widest font-bold px-1 py-0.2">
                        Cover
                      </span>
                    )}

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 w-5 h-5 bg-black/70 hover:bg-rose-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                      aria-label="Remove image"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="pt-4 flex items-center justify-between border-t border-gray-100">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 text-gray-900 focus:ring-gray-900"
              {...register("isFeatured")}
            />
            <span className="text-xs text-gray-700 font-medium">Highlight as Featured</span>
          </label>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs uppercase tracking-wider text-gray-500 hover:text-gray-900 font-medium"
            >
              Cancel
            </button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isLoading || isUploading}
            >
              {initialData ? "Save Garment" : "Create Garment"}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

export default ProductDialog;
