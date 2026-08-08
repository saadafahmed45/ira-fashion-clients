const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

/**
 * Fetch all collections with Next.js revalidation caching (300 seconds)
 */
export async function getCollections(params = {}) {
  try {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== "" && v != null)
    );
    const queryString = new URLSearchParams(cleanParams).toString();
    const url = `${BASE_URL}/collections${queryString ? `?${queryString}` : ""}`;

    const res = await fetch(url, {
      next: {
        revalidate: 300,
        tags: ["collections"],
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch collections: ${res.statusText}`);
    }

    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Error fetching collections:", error);
    return [];
  }
}

/**
 * Fetch single collection by ID or Slug with Next.js revalidation caching
 */
export async function getCollectionBySlug(idOrSlug) {
  if (!idOrSlug) return null;

  try {
    const url = `${BASE_URL}/collections/${idOrSlug}`;
    const res = await fetch(url, {
      next: {
        revalidate: 300,
        tags: [`collection-${idOrSlug}`],
      },
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Failed to fetch collection ${idOrSlug}`);
    }

    const json = await res.json();
    return json.data || null;
  } catch (error) {
    console.error(`Error fetching collection (${idOrSlug}):`, error);
    return null;
  }
}
