import React from "react";
import { getCollections } from "@/lib/api/collections";
import CollectionsListClient from "./CollectionsListClient";

export const metadata = {
  title: "Collections | Ira Fashion",
  description: "Explore our curated capsule collections, signature aesthetics, and luxury fashion drops.",
};

export default async function CollectionsPage() {
  const collections = await getCollections();
  return <CollectionsListClient initialCollections={collections} />;
}
