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
  <div class="h-screen bg-[#242D34] flex justify-center items-center">
    <div
      class="flex flex-col justify-center items-center w-fit text-[#e7e9ea] bg-black p-10 rounded-xl"
    >
      <h1 class="font-bold text-3xl mb-4">Login to your account</h1>
      <form @submit.prevent="submit" class="flex flex-col gap-6 w-80">
        <!-- email -->
        <div class="flex flex-col gap-2 w-80">
          <input
            v-model="form.email"
            @blur="v$.email.$touch()"
            placeholder="Email"
            class="border border-[#ffffff52] bg-transparent p-3 rounded-lg outline-none text-[#e7e9ea]"
          />
          <small v-if="v$.email.$dirty && v$.email.$error" class="text-red-500">
            {{ v$.email.$errors[0].$message || "Valid email is required" }}
          </small>
        </div>
        <!-- password -->
        <div class="flex flex-col gap-2 w-80">
          <input
            type="password"
            v-model="form.password"
            @blur="v$.password.$touch()"
            placeholder="Password"
            class="border border-[#ffffff52] bg-transparent p-3 rounded-lg outline-none text-[#e7e9ea]"
          />
          <small
            v-if="v$.password.$dirty && v$.password.$error"
            class="text-red-500"
          >
            Password is required
          </small>
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="bg-[#e7e9ea] text-black cursor-pointer p-3 rounded-lg mt-2 font-bold hover:bg-[#d6d8da] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isLoading ? "Logging in..." : "Login" }}
        </button>
      </form>
    </div>
  </div>
</template>
