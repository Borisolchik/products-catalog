<template>
  <div class="container">
    <h1>Product catalog</h1>

    <div class="filters">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search products..."
      />
      <select v-model="selectedCategory">
        <option value="">All categories</option>
        <option
          v-for="category in categories"
          :key="category.id"
          :value="category.slug"
        >
          {{ category.name }}
        </option>
      </select>
    </div>

    <div v-if="productsStore.error" class="error">
      {{ productsStore.error }}
    </div>

    <div v-else class="products-grid">
      <NuxtLink
        v-for="product in filteredProducts"
        :key="product.id"
        :to="`/products/${product.id}`"
        class="product-card"
      >
        <img :src="product.images[0]" :alt="product.title" />
        <h2>{{ product.title }}</h2>
        <p class="category">{{ product.category }}</p>
        <p class="price">{{ product.price }} $</p>
      </NuxtLink>
    </div>

    <div
      v-if="productsStore.loading && productsStore.products.length > 0"
      class="loader"
    >
      Loading...
    </div>

    <div
      v-else-if="!productsStore.loading && filteredProducts.length === 0"
      class="loader"
    >
      Nothing found
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProductsStore } from "@/stores/products";
import { storeToRefs } from "pinia";
import { onMounted, onServerPrefetch, onUnmounted, watch } from "vue";

const productsStore = useProductsStore();
const { searchQuery, selectedCategory, filteredProducts, categories } =
  storeToRefs(productsStore);

let storeReady = false;

onServerPrefetch(async () => {
  await productsStore.fetchCategories();
  await productsStore.fetchProducts();
});

onMounted(async () => {
  if (productsStore.products.length === 0) {
    await productsStore.fetchCategories();
    await productsStore.fetchProducts();
  }

  storeReady = true;

  watch(searchQuery, async (newQuery) => {
    if (storeReady) {
      await productsStore.setSearchQuery(newQuery);
    }
  });

  watch(selectedCategory, async (newCategory) => {
    if (storeReady) {
      await productsStore.setCategory(newCategory);
    }
  });

  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

function handleScroll() {
  const bottom =
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 300;

  if (bottom) {
    productsStore.loadMoreProducts();
  }
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
  justify-content: center;
}

.filters input {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.filters select {
  padding: 10px 40px 10px 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: white;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 140 140' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolyline points='20,50 70,100 120,50' stroke='%23777' stroke-width='15' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px 16px;
  cursor: pointer;
  transition:
    border-color 0.3s,
    box-shadow 0.3s;
}

.filters select:hover {
  border-color: #007bff;
  box-shadow: 0 0 4px rgba(0, 123, 255, 0.5);
}

.filters select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 4px rgba(0, 123, 255, 0.5);
}

.products-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}

.product-card {
  width: clamp(220px, 25%, 280px);
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition:
    box-shadow 0.3s,
    transform 0.3s;
  background-color: white;
}

.product-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transform: translateY(-4px);
}

.product-card img {
  width: 100%;
  object-fit: cover;
}

.product-card h2 {
  font-size: 18px;
  margin: 10px;
}

.product-card .category {
  font-size: 14px;
  color: #555;
  margin: 0 10px 10px;
}

.product-card .price {
  font-weight: bold;
  margin: 0 10px 10px;
  color: #007bff;
}

.loader {
  text-align: center;
  margin: 30px 0;
  color: #555;
}

.error {
  color: #ff4d4f;
  font-weight: bold;
  text-align: center;
  margin: 20px 0;
}
</style>
