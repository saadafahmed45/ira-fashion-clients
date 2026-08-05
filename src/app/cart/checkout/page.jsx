"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// The old /cart/checkout route is now /checkout
// Redirect seamlessly to the new canonical URL
export default function CartCheckoutRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/checkout");
  }, [router]);

  return null;
}