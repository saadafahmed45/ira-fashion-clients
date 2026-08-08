import React from "react";
import { getProductBySlug, getProducts } from "@/lib/api/products";
import ProductDetailClient from "./ProductDetailClient";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const product = await getProductBySlug(resolvedParams?.slug);

  if (!product) {
    return {
      title: "Product Not Found | Ira Fashion",
      description: "The requested fashion piece could not be found.",
    };
  }

  const primaryImage = product.images?.[0] || "";

  return {
    title: `${product.title} | Ira Fashion`,
    description: product.description || "Discover handcrafted luxury fashion and accessories.",
    openGraph: {
      title: product.title,
      description: product.description,
      images: primaryImage ? [{ url: primaryImage }] : [],
    },
  };
}

export default async function ProductDetailPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  // Parallel data fetching for product detail and related products
  const [product, relatedProductsRes] = await Promise.all([
    getProductBySlug(slug),
    getProducts({ limit: 8 }),
  ]);

  const relatedProducts = relatedProductsRes?.data || [];

  const images = product?.images?.length > 0 ? product.images : [
    "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop&q=80"
  ];

  // Server-rendered JSON-LD Product Schema for SEO
  const jsonLd = product ? {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.title,
    image: images[0],
    description: product.description,
    brand: {
      "@type": "Brand",
      name: product.vendor || "IRA Fashion",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: product.price,
      availability: "https://schema.org/InStock",
    },
  } : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ProductDetailClient product={product} relatedProducts={relatedProducts} />
    </>
  );
}
