import { defineNuxtConfig } from "nuxt/config";
import tsconfigPaths from "vite-tsconfig-paths";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-11-13",
  typescript: {
    strict: true,
    typeCheck: true,
  },
  vite: {
    plugins: [tsconfigPaths()],
  },
  modules: ["@pinia/nuxt"],
  runtimeConfig: {
    public: {
      apiBase: "https://dummyjson.com",
    },
  },
});
