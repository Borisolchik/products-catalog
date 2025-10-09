import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Product, Category } from "@/types/product";

export const useProductsStore = defineStore("products", () => {
  const products = ref<Product[]>([]);
  const categories = ref<Category[]>([]);
  const searchQuery = ref("");
  const selectedCategory = ref<string | null>("");
  const page = ref(1);
  const limit = ref(12);
  const total = ref(0);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const filteredProducts = computed(() => {
    return products.value.filter((product) => {
      const matchCategory = selectedCategory.value
        ? product.category.toLowerCase() ===
          selectedCategory.value.toLowerCase()
        : true;
      const matchSearch = product.title
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase());
      return matchCategory && matchSearch;
    });
  });

  const fetchCategories = async () => {
    try {
      const res = await $fetch<{ slug: string; name: string; url: string }[]>(
        "https://dummyjson.com/products/categories"
      );
      categories.value = res.map((cat, index) => ({
        id: index,
        name: cat.name,
        slug: cat.slug,
      }));
    } catch (err: unknown) {
      console.error("Error fetching products:", err);
      if (err instanceof Error) {
        error.value = err.message;
      } else {
        error.value = "Unknown error";
      }
    }
  };

  const fetchProducts = async (reset = false) => {
    if (loading.value) return;
    loading.value = true;

    try {
      if (reset) {
        page.value = 1;
        products.value = [];
      }

      const skip = (page.value - 1) * limit.value;
      let url = "";

      if (selectedCategory.value) {
        url = `https://dummyjson.com/products/category/${selectedCategory.value}?limit=${limit.value}&skip=${skip}`;
      } else if (searchQuery.value) {
        url = `https://dummyjson.com/products/search?q=${encodeURIComponent(
          searchQuery.value
        )}&limit=${limit.value}&skip=${skip}`;
      } else {
        url = `https://dummyjson.com/products?limit=${limit.value}&skip=${skip}`;
      }

      const res = await $fetch<{ products: Product[]; total: number }>(url);
      products.value = [...products.value, ...res.products];
      total.value = res.total;
    } catch (err) {
      console.error("Error fetching products:", err);
      error.value = "Error loading products";
    } finally {
      loading.value = false;
    }
  };

  const setSearchQuery = async (query: string) => {
    searchQuery.value = query;
    page.value = 1;
    products.value = [];
    await fetchProducts(true);
  };

  const setCategory = async (category: string | null) => {
    selectedCategory.value = category;
    page.value = 1;
    products.value = [];
    await fetchProducts(true);
  };

  const loadMoreProducts = async () => {
    if (loading.value) return;
    if (products.value.length >= total.value) return;

    page.value++;
    await fetchProducts();
  };

  return {
    products,
    categories,
    searchQuery,
    selectedCategory,
    page,
    limit,
    total,
    loading,
    error,
    filteredProducts,
    fetchProducts,
    fetchCategories,
    setSearchQuery,
    setCategory,
    loadMoreProducts,
  };
});
