<script setup>
import { useVuelidate } from "@vuelidate/core";
import { email, required } from "@vuelidate/validators";
import { computed, reactive, ref } from "vue";
import { useToast } from "vue-toastification";
import { loginApi } from "../api/auth.api";
import { useAuthStore } from "../stores/auth";

const form = reactive({
  email: "",
  password: "",
});

const rules = computed(() => ({
  email: { required, email },
  password: { required },
}));

const v$ = useVuelidate(rules, form);
const toast = useToast();
const authStore = useAuthStore();
const isLoading = ref(false);

const submit = async () => {
  const ok = await v$.value.$validate();
  if (!ok) return;

  isLoading.value = true;

  try {
    const response = await loginApi(form);

    // Store token and user data
    if (response.data.data.token) {
      authStore.setAuth(response.data.data.token);
    }

    const toastId = toast.success("Logged in successfully!", {
      timeout: false,
    });

    Object.assign(form, {
      email: "",
      password: "",
    });

    v$.value.$reset();

    setTimeout(() => {
      toast.dismiss(toastId);
      window.location.href = "/";
    }, 1500);
  } catch (error) {
    handleApiError(error);
    return;
  } finally {
    isLoading.value = false;
  }
};
const handleApiError = (error) => {
  if (error?.response?.status === 422) {
    const errors = error.response.data.errors;

    if (errors) {
      Object.keys(errors).forEach((field) => {
        if (v$.value[field]) {
          v$.value[field].$touch();
        }
      });
    }

    toast.error("Please fix the highlighted errors.");
    return;
  }

  if (error?.response?.data?.message) {
    toast.error(error.response.data.message);
    return;
  }

  // Network / Unknown
  toast.error("Something went wrong. Please try again.");
};
</script>

<template>
  <div class="min-h-screen bg-black flex justify-center items-center p-4">
    <div class="max-w-[600px] w-full bg-black flex flex-col items-center p-8 sm:p-12">
      <!-- Tweety Logo -->
      <div class="mb-8">
        <svg viewBox="0 0 24 24" aria-hidden="true" class="h-10 w-10 fill-[#1d9bf0]">
          <g>
            <path
              d="M23.643 4.937c-.835.37-1.732.62-2.675.733a4.67 4.67 0 0 0 2.048-2.578 9.3 9.3 0 0 1-2.958 1.13 4.66 4.66 0 0 0-7.938 4.25 13.229 13.229 0 0 1-9.602-4.868c-.4.69-.63 1.49-.63 2.342A4.66 4.66 0 0 0 3.96 9.824a4.647 4.647 0 0 1-2.11-.583v.06a4.66 4.66 0 0 0 3.737 4.568 4.692 4.692 0 0 1-2.103.08 4.661 4.661 0 0 0 4.352 3.234 9.348 9.348 0 0 1-5.786 1.995 9.122 9.122 0 0 1-1.112-.065 13.175 13.175 0 0 0 7.14 2.093c8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602a9.47 9.47 0 0 0 2.323-2.41z">
            </path>
          </g>
        </svg>
      </div>

      <!-- Heading -->
      <h1 class="text-[#e7e9ea] text-3xl font-bold mb-8 text-center sm:text-left w-full max-w-sm">
        Sign in to Tweety
      </h1>

      <!-- Social Login Mockups (Twitter Style) -->
      <div class="flex flex-col gap-3 w-full max-w-sm mb-6">
        <button
          class="bg-white text-black font-bold py-2.5 px-4 rounded-full flex items-center justify-center gap-2 hover:bg-[#d6d8da] transition duration-200">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" class="w-5 h-5" alt="Google">
          Sign in with Google
        </button>
        <button
          class="bg-white text-black font-bold py-2.5 px-4 rounded-full flex items-center justify-center gap-2 hover:bg-[#d6d8da] transition duration-200">
          <svg viewBox="0 0 24 24" class="w-5 h-5 fill-black" aria-hidden="true">
            <g>
              <path
                d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.988 1.57-.12 0-.24-.01-.3-.02.03-1.2.57-2.32 1.25-3.1.74-.85 1.95-1.53 3.04-1.53.11 0 .22.01.27.02-.01.12-.1.25-.1.35zM17.76 10.1c0 2.49 1.43 4.49 3.07 4.49.06 0 .12 0 .17-.01-.36 1.17-1.39 2.14-2.33 2.84-1.08.8-2.32 1.6-3.86 1.6-1.47 0-2.23-.84-3.58-.84-1.35 0-2.21.84-3.58.84-1.54 0-2.78-.8-3.86-1.6-1.08-.8-2.12-2.14-2.12-4.14 0-1.2.22-2.52.75-3.52.92-1.74 2.87-2.84 4.81-2.84 1.1 0 1.96.6 2.81.6.85 0 1.71-.6 2.81-.6.78 0 1.9 0 3 .6-1.4 1.2-1.89 2.58-1.89 4.14z">
              </path>
            </g>
          </svg>
          Sign in with Apple
        </button>
      </div>

      <div class="flex items-center gap-2 w-full max-w-sm mb-6">
        <div class="h-[1px] bg-[#2f3336] flex-1"></div>
        <span class="text-[#e7e9ea] text-sm">or</span>
        <div class="h-[1px] bg-[#2f3336] flex-1"></div>
      </div>

      <!-- Form -->
      <form @submit.prevent="submit" class="flex flex-col gap-6 w-full max-w-sm">
        <!-- email -->
        <div class="flex flex-col gap-1">
          <div class="relative group">
            <input v-model="form.email" @blur="v$.email.$touch()" placeholder=" " id="email"
              class="peer w-full border border-[#333639] bg-transparent p-4 pt-6 rounded-md outline-none text-[#e7e9ea] focus:border-[#1d9bf0] transition duration-200" />
            <label for="email"
              class="absolute left-4 top-4 text-[#71767b] transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#1d9bf0] peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs">
              Email
            </label>
          </div>
          <small v-if="v$.email.$dirty && v$.email.$error" class="text-[#f4212e] text-xs px-1">
            {{ v$.email.$errors[0].$message || "Valid email is required" }}
          </small>
        </div>

        <!-- password -->
        <div class="flex flex-col gap-1">
          <div class="relative group">
            <input type="password" v-model="form.password" @blur="v$.password.$touch()" placeholder=" " id="password"
              class="peer w-full border border-[#333639] bg-transparent p-4 pt-6 rounded-md outline-none text-[#e7e9ea] focus:border-[#1d9bf0] transition duration-200" />
            <label for="password"
              class="absolute left-4 top-4 text-[#71767b] transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#1d9bf0] peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs">
              Password
            </label>
          </div>
          <small v-if="v$.password.$dirty && v$.password.$error" class="text-[#f4212e] text-xs px-1">
            Password is required
          </small>
        </div>

        <button type="submit" :disabled="isLoading"
          class="bg-white text-black cursor-pointer py-2.5 rounded-full mt-2 font-bold hover:bg-[#d6d8da] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
          {{ isLoading ? "Logging in..." : "Log in" }}
        </button>

        <router-link to="/forgot-password"
          class="bg-transparent border border-[#536471] text-white font-bold py-2.5 px-4 rounded-full hover:bg-[#ffffff1a] transition duration-200 text-center block">
          Forgot password?
        </router-link>
      </form>

      <div class="mt-10 w-full max-w-sm">
        <p class="text-[#71767b]">
          Don't have an account?
          <router-link to="/register" class="text-[#1d9bf0] hover:underline">Sign up</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom thin scrollbar if needed, or other non-tailwind tweaks */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0 30px black inset !important;
  -webkit-text-fill-color: #e7e9ea !important;
}
</style>
