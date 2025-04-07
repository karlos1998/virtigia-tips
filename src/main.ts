import { createApp } from 'vue'
import App from './App.vue'
import ToolTipDirective from "./tooltips/module";
// import {createPinia} from "pinia";
// const pinia = createPinia()

createApp(App)
    .directive('tip', ToolTipDirective)
    // .use(pinia)
    .mount('#app')
