import { defineConfig } from "oxlint"

export default defineConfig({
  categories: { correctness: "error", suspicious: "warn" },
  rules: {
    "react/react-in-jsx-scope": "off",
    "no-underscore-dangle": ["warn", { allow: ["_id", "_creationTime"] }],
  },
  plugins: [
    "eslint",
    "typescript",
    "unicorn",
    "oxc",
    "import",
    "promise",
    "react",
    "jsx-a11y",
    "react-perf",
  ],
})
