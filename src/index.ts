import { App } from "vue"
import {createPinia} from "pinia";
import ToolTipDirective from "@/tooltips/module";

export default {
    install: (app: App) => {
        const pinia = createPinia()
        app.use(pinia);
        app.directive('tip', ToolTipDirective)
    }
}
