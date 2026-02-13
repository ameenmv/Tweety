<script setup>
import { useVuelidate } from "@vuelidate/core";
import { email, minLength, required, sameAs } from "@vuelidate/validators";
import { computed, reactive, ref } from "vue";
import { useToast } from "vue-toastification";
import { registerApi } from "../api/auth.api";
import { useAuthStore } from "../stores/auth";

const form = reactive({
  name: "",
  username: "",
  email: "",
  password: "",
  password_confirmation: "",
});

const rules = computed(() => ({
  name: { required },
  username: { required },
  email: { required, email },
  password: { required, minLength: minLength(8) },
  password_confirmation: {
    required,
    sameAs: sameAs(form.password),
  },
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
    const response = await registerApi(form);

    // Store token and user data
    if (response.data.data.token) {
      authStore.setAuth(response.data.data.token);
    }

    const toastId = toast.success("Account created successfully!", {
      timeout: false,
    });

    Object.assign(form, {
      name: "",
      username: "",
      email: "",
      password: "",
      password_confirmation: "",
    });

    v$.value.$reset();

    setTimeout(() => {
      toast.dismiss(toastId);
      // window.location.href = "/login";
    }, 1500);
  } catch (error) {
    handleApiError(error);
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

      const firstError = Object.values(errors)[0][0];
      toast.error(firstError);
      return;
    }
  }

  if (error?.response?.data?.message) {
    toast.error(error.response.data.message);
    return;
  }

  // Network or unknown error
  toast.error("Something went wrong. Please try again.");
};
</script>

<template>
  <div class="min-h-screen bg-black flex justify-center items-center p-4">
    <div class="max-w-[600px] w-full bg-black flex flex-col items-center p-8">
      <!-- Tweety Logo -->
      <div class="mb-6">
        <svg viewBox="0 0 24 24" aria-hidden="true" class="h-8 w-8 fill-[#1d9bf0]">
          <g>
            <path
              d="M23.643 4.937c-.835.37-1.732.62-2.675.733a4.67 4.67 0 0 0 2.048-2.578 9.3 9.3 0 0 1-2.958 1.13 4.66 4.66 0 0 0-7.938 4.25 13.229 13.229 0 0 1-9.602-4.868c-.4.69-.63 1.49-.63 2.342A4.66 4.66 0 0 0 3.96 9.824a4.647 4.647 0 0 1-2.11-.583v.06a4.66 4.66 0 0 0 3.737 4.568 4.692 4.692 0 0 1-2.103.08 4.661 4.661 0 0 0 4.352 3.234 9.348 9.348 0 0 1-5.786 1.995 9.122 9.122 0 0 1-1.112-.065 13.175 13.175 0 0 0 7.14 2.093c8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602a9.47 9.47 0 0 0 2.323-2.41z">
            </path>
          </g>
        </svg>
      </div>

      <!-- Heading -->
      <h1 class="text-[#e7e9ea] text-3xl font-bold mb-8 text-center sm:text-left w-full max-w-sm">
        Join Tweety today
      </h1>

      <form @submit.prevent="submit" class="flex flex-col gap-5 w-full max-w-sm">
        <!-- name -->
        <div class="flex flex-col gap-1">
          <div class="relative group">
            <input v-model="form.name" @blur="v$.name.$touch()" placeholder=" " id="name"
              class="peer w-full border border-[#333639] bg-transparent p-4 pt-6 rounded-md outline-none text-[#e7e9ea] focus:border-[#1d9bf0] transition duration-200" />
            <label for="name"
              class="absolute left-4 top-4 text-[#71767b] transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#1d9bf0] peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs">
              Name
            </label>
          </div>
          <small v-if="v$.name.$dirty && v$.name.$error" class="text-[#f4212e] text-xs px-1">
            Name is required
          </small>
        </div>

        <!-- username -->
        <div class="flex flex-col gap-1">
          <div class="relative group">
            <input v-model="form.username" @blur="v$.username.$touch()" placeholder=" " id="username"
              class="peer w-full border border-[#333639] bg-transparent p-4 pt-6 rounded-md outline-none text-[#e7e9ea] focus:border-[#1d9bf0] transition duration-200" />
            <label for="username"
              class="absolute left-4 top-4 text-[#71767b] transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#1d9bf0] peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs">
              Username
            </label>
          </div>
          <small v-if="v$.username.$dirty && v$.username.$error" class="text-[#f4212e] text-xs px-1">
            Username is required
          </small>
        </div>

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
            Password must be at least 8 characters
          </small>
        </div>

        <!-- password confirmation -->
        <div class="flex flex-col gap-1">
          <div class="relative group">
            <input type="password" v-model="form.password_confirmation" @blur="v$.password_confirmation.$touch()"
              placeholder=" " id="password_confirmation"
              class="peer w-full border border-[#333639] bg-transparent p-4 pt-6 rounded-md outline-none text-[#e7e9ea] focus:border-[#1d9bf0] transition duration-200" />
            <label for="password_confirmation"
              class="absolute left-4 top-4 text-[#71767b] transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#1d9bf0] peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs">
              Confirm Password
            </label>
          </div>
          <small v-if="v$.password_confirmation.$dirty && v$.password_confirmation.$error"
            class="text-[#f4212e] text-xs px-1">
            Passwords must match
          </small>
        </div>

        <button type="submit" :disabled="isLoading"
          class="bg-white text-black cursor-pointer py-2.5 rounded-full mt-4 font-bold hover:bg-[#d6d8da] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
          {{ isLoading ? "Creating account..." : "Create account" }}
        </button>
      </form>

      <div class="mt-8 w-full max-w-sm">
        <p class="text-[#71767b]">
          Already have an account?
          <router-link to="/login" class="text-[#1d9bf0] hover:underline">Log in</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0 30px black inset !important;
  -webkit-text-fill-color: #e7e9ea !important;
}
</style>
