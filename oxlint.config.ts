import { defineConfig } from "oxlint"

export default defineConfig({
  plugins: ["eslint", "typescript", "oxc", "unicorn", "import", "react"],
})
