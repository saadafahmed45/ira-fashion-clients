"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadCloud, X, Loader2 } from "lucide-react";
import { categorySchema } from "@/validators/schemas";
import api from "@/lib/api";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export function CategoryDialog({ isOpen, onClose, onSubmit, initialData = null, isLoading = false }) {
  const fileInputRef = useRef(null);
  const [image, setImage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      image: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || "",
        description: initialData.description || "",
        image: initialData.image || "",
        isActive: initialData.isActive !== undefined ? initialData.isActive : true,
      });
      setImage(initialData.image || "");
    } else {
      reset({
        name: "",
        description: "",
        image: "",
        isActive: true,
      });
      setImage("");
    }
    setUploadError("");
  }, [initialData, reset, isOpen]);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError("");

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await api.post("/upload/single", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.success && res.data?.url) {
        setImage(res.data.url);
        setValue("image", res.data.url);
      }
    } catch (err) {
      setUploadError(err.message || "Failed to upload image to Cloudinary");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFormSubmit = async (data) => {
    await onSubmit({ ...data, image });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Category" : "Add New Category"}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <Input
          label="Category Name *"
          placeholder="e.g. Evening Dresses"
          error={errors.name?.message}
          {...register("name")}
        />

        <div>
          <label className="text-[11px] font-medium uppercase tracking-wider text-[#666666] block mb-1">
            Description
          </label>
          <textarea
            rows={3}
            placeholder="Brief narrative of the collection category..."
            className="w-full p-3 bg-white border border-[#E5E5E5] text-xs text-[#111111] focus:outline-none focus:border-[#111111] transition-colors"
            {...register("description")}
          />
        </div>

        {/* Cloudinary File Upload */}
        <div className="space-y-2">
          <label className="text-[11px] font-medium uppercase tracking-wider text-[#666666] block">
            Cover Image (Cloudinary CDN)
          </label>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          {image ? (
            <div className="relative w-full h-36 bg-gray-50 border border-gray-200 overflow-hidden group">
              <Image
                src={image}
                alt="Category preview"
                fill
                className="object-cover"
                sizes="300px"
              />
              <button
                type="button"
                onClick={() => {
                  setImage("");
                  setValue("image", "");
                }}
                className="absolute top-2 right-2 p-1 bg-black/70 hover:bg-rose-600 text-white rounded-full transition-colors"
                title="Remove image"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 hover:border-gray-900 p-4 text-center cursor-pointer transition-colors bg-gray-50/60 hover:bg-gray-50 flex flex-col items-center justify-center gap-1.5"
            >
              {isUploading ? (
                <div className="flex flex-col items-center gap-1.5 text-gray-600">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-900" />
                  <span className="text-xs">Uploading to Cloudinary...</span>
                </div>
              ) : (
                <>
                  <UploadCloud className="w-6 h-6 text-gray-400" />
                  <span className="text-xs font-semibold text-gray-900">
                    Upload image from device
                  </span>
                  <span className="text-[10px] text-gray-400">JPG, PNG, WEBP</span>
                </>
              )}
            </div>
          )}

          {uploadError && (
            <p className="text-[11px] text-rose-600 bg-rose-50 p-2 border border-rose-200">
              {uploadError}
            </p>
          )}
        </div>

        <div className="pt-2 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs uppercase tracking-wider text-gray-500 hover:text-gray-900 font-medium"
          >
            Cancel
          </button>
          <Button type="submit" variant="primary" size="sm" isLoading={isLoading || isUploading}>
            {initialData ? "Save Changes" : "Create Category"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default CategoryDialog;
