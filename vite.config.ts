import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === "production" ? "/sacred-beetle/" : "/",
  define: {
    "import.meta.env.BASE_URL": JSON.stringify(
      mode === "production" ? "/sacred-beetle/" : "/",
    ),
  },
}));
