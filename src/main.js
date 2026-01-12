import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./Router";
import "./style.css";
gsap.registerPlugin(ScrollTrigger);

createApp(App).use(router).use(gsap).mount("#app");
