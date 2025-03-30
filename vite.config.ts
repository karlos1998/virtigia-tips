import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import dts from "vite-plugin-dts"

export default defineConfig({
    plugins: [vue(), dts()],
    build: {
        lib: {
            entry: "src/index.ts",
            name: "VirtigiaTips",
            fileName: (format) => `virtigia-tips.${format}.js`
        },
        rollupOptions: {
            external: ["vue"],
            output: {
                globals: {
                    vue: "Vue"
                }
            }
        }
    },
    resolve: {
        alias: {
            '@': '/src'
        }
    }
})
