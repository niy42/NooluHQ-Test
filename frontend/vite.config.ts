import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), svgr(), tailwindcss(), tsconfigPaths()],
});
