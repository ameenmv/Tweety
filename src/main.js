import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "./App.vue";
import ToastPlugin from "./plugins/toast";
import router from "./Router";

import "./style.css";
const pinia = createPinia();
gsap.registerPlugin(ScrollTrigger);

createApp(App).use(router).use(ToastPlugin).use(pinia).use(gsap).mount("#app");
