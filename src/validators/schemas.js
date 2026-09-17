import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const checkoutSchema = z.object({
  street: z.string().min(3, "Street address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().optional(),
  zip: z.string().optional(),
  phone: z
    .string()
    .min(10, "Please enter a valid phone number (min 10 digits)")
    .regex(/^[+0-9\s-]+$/, "Invalid characters in phone number"),
  notes: z.string().optional(),
});

export const productSchema = z.object({
  name: z.string().min(3, "Product name is required (min 3 characters)"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  discountPrice: z.coerce.number().min(0, "Discount price must be 0 or more").optional(),
  category: z.string().min(1, "Please select a category"),
  brand: z.string().default("Ira Fashion"),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  isFeatured: z.boolean().default(false),
  status: z.enum(["active", "draft", "archived"]).default("active"),
});

export const categorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),
  description: z.string().optional(),
  image: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const couponSchema = z.object({
  code: z.string().min(3, "Code must be at least 3 characters").toUpperCase(),
  discountType: z.enum(["percentage", "fixed"]),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  minPurchase: z.coerce.number().min(0).default(0),
  maxDiscount: z.coerce.number().optional().nullable(),
  expiryDate: z.string().min(1, "Expiry date is required"),
  isActive: z.boolean().default(true),
});
