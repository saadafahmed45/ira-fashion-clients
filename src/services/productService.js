import api from "@/lib/api";

export const productService = {
  async getProducts(params = {}) {
    // Strip empty/null/undefined params to keep query string clean
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== "" && v != null)
    );
    const response = await api.get("/products", { params: cleanParams });
    return response;
  },

  async getProduct(idOrSlug) {
    const response = await api.get(`/products/${idOrSlug}`);
    return response.data;
  },

  async createProduct(formData) {
    const response = await api.post("/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  async updateProduct(id, formData) {
    const response = await api.put(`/products/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  async deleteProduct(id) {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};
