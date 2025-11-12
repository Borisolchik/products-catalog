module.exports = {
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  globals: {
    useRuntimeConfig: "readonly",
    useRoute: "readonly",
    $fetch: "readonly",
    onServerPrefetch: "readonly",
    defineNuxtComponent: "readonly",
  },
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
    ecmaVersion: 2021,
    sourceType: "module",
  },
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  plugins: ["vue", "@typescript-eslint", "prettier"],
  rules: {
    "no-console": "warn",
    "no-debugger": "warn",
    "vue/multi-word-component-names": "off",
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "prettier/prettier": "warn",
  },
};
