"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Old /product listing page - redirect to new /products canonical route
export default function ProductListingRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/products");
  }, [router]);

  return null;
}
