const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

/**
 * Fetch paginated products with Next.js revalidation caching
 */
export async function getProducts(params = {}) {
  try {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== "" && v != null)
    );
    const queryString = new URLSearchParams(cleanParams).toString();
    const url = `${BASE_URL}/products${queryString ? `?${queryString}` : ""}`;

    const res = await fetch(url, {
      next: {
        revalidate: 60,
        tags: ["products"],
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch products: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return { success: false, data: [], meta: { page: 1, totalPages: 1, total: 0 } };
  }
}

/**
 * Fetch a single product by slug or ID with Next.js revalidation caching
 */
export async function getProductBySlug(slug) {
  if (!slug) return null;

  try {
    const url = `${BASE_URL}/products/${slug}`;
    const res = await fetch(url, {
      next: {
        revalidate: 60,
        tags: [`product-${slug}`],
      },
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Failed to fetch product ${slug}`);
    }

    const json = await res.json();
    return json.data || null;
  } catch (error) {
    console.error(`Error fetching product by slug (${slug}):`, error);
    return null;
  }
}

/**
 * Fetch featured products for landing sections
 */
export async function getFeaturedProducts(limit = 4) {
  return getProducts({ limit, status: "active" });
}
