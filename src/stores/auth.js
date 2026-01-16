import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const token = ref(localStorage.getItem("token") || null);
  const user = ref(JSON.parse(localStorage.getItem("user") || "null"));

  const setAuth = (authToken, userData) => {
    token.value = authToken;
    user.value = userData;
    localStorage.setItem("token", authToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const clearAuth = () => {
    token.value = null;
    user.value = null;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const isAuthenticated = () => {
    return !!token.value;
  };

  return {
    token,
    user,
    setAuth,
    clearAuth,
    isAuthenticated,
  };
});
