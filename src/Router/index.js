import { createRouter, createWebHistory } from "vue-router";
import ForgotPassword from "../Pages/ForgotPassword.vue";
import Home from "../Pages/Home.vue";
import Login from "../Pages/Login.vue";
import OTPVerification from "../Pages/OTPVerification.vue";
import Register from "../Pages/Register.vue";
import ResetPassword from "../Pages/ResetPassword.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/forgot-password",
    name: "ForgotPassword",
    component: ForgotPassword,
  },
  {
    path: "/verify-otp",
    name: "OTPVerification",
    component: OTPVerification,
  },
  {
    path: "/reset-password",
    name: "ResetPassword",
    component: ResetPassword,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
