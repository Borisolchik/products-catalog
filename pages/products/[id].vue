<template>
  <div v-if="error" class="error">
    {{ error }}
  </div>

  <div v-if="product" class="container">
    <h1 class="title">{{ product.title }}</h1>

    <div class="product-details">
      <img
        :src="product.images?.[0] || 'https://via.placeholder.com/400'"
        :alt="product.title"
        class="product-image"
      />

      <div class="product-info">
        <p class="category">Category: {{ product.category }}</p>
        <p class="price">Price: {{ product.price }} $</p>
        <p class="description">{{ product.description }}</p>

        <div class="qr-code">
          <h2>QR code for the product</h2>
          <QRCodeVue :value="`${baseURL}/products/${product.id}`" />
        </div>
      </div>
    </div>
  </div>

  <div v-else class="container">
    <p>Loading...</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useProductsStore } from "@/stores/products";
import type { Product } from "@/types/product";
import QRCodeVue from "qrcode.vue";

const config = useRuntimeConfig();
const baseURL = ref(config.public.apiBase);
const error = ref<string | null>(null);

const productsStore = useProductsStore();
const product = ref<Product | null>(null);
const route = useRoute();
const productId = Number(route.params.id);

const fetchProduct = async (id: number) => {
  try {
    const found = productsStore.products.find((p) => p.id === id);
    if (found) {
      product.value = found;
    } else {
      const res = await $fetch<Product>(`${baseURL}/products/${id}`);
      product.value = res;
    }
  } catch (err) {
    console.error("Error fetching product:", err);
    error.value = "Error loading product";
  }
};

onServerPrefetch(async () => {
  await fetchProduct(productId);
});

onMounted(async () => {
  if (!product.value) {
    await fetchProduct(productId);
  }
});
</script>

<style scoped>
.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.title {
  text-align: center;
  font-size: 28px;
  margin-bottom: 20px;
}

.product-details {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

@media (min-width: 768px) {
  .product-details {
    flex-direction: row;
  }
}

.product-image {
  width: 100%;
  max-width: 400px;
  height: 400px;
  object-fit: cover;
  border-radius: 8px;
}

.product-info {
  flex: 1;
}

.category {
  font-size: 16px;
  color: #555;
  margin-bottom: 10px;
}

.price {
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 10px;
  color: #007bff;
}

.description {
  margin-bottom: 20px;
}

.qr-code h2 {
  font-weight: bold;
  margin-bottom: 10px;
}

.qr-code canvas {
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 8px;
}

.error {
  color: #ff4d4f;
  font-weight: bold;
  text-align: center;
  margin: 20px 0;
}
</style>
