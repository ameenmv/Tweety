import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./Router";
import { createPinia } from "pinia";
import "./style.css";
const pinia = createPinia();
gsap.registerPlugin(ScrollTrigger);

createApp(App).use(router).use(pinia).use(gsap).mount("#app");
