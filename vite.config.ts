import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import dts from "vite-plugin-dts"

export default defineConfig({
    plugins: [vue(), dts()],
    server: {
        port: 5676
    },
    build: {
        lib: {
            entry: "src/index.ts",
            name: "VirtigiaTips",
            fileName: (format) => `virtigia-tips.${format}.js`
        },
        cssCodeSplit: false,
        rollupOptions: {
            external: ["vue"],
            output: {
                globals: {
                    vue: "Vue",
                    exports: 'named'
                }
            }
        }
    },
    resolve: {
        alias: {
            // '@': '/src' //niee, bo bedzie przeskzac w paczce
        }
    },

})
