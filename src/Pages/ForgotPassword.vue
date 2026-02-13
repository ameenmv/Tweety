<script setup>
import { useVuelidate } from "@vuelidate/core";
import { email, required } from "@vuelidate/validators";
import { computed, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { forgotPasswordApi } from "../api/auth.api";

const form = reactive({
   email: "",
});

const rules = computed(() => ({
   email: { required, email },
}));

const v$ = useVuelidate(rules, form);
const toast = useToast();
const router = useRouter();
const isLoading = ref(false);

const submit = async () => {
   const ok = await v$.value.$validate();
   if (!ok) return;

   isLoading.value = true;

   try {
      const response = await forgotPasswordApi(form);

      toast.success("Verification code sent to your email!");

      // Navigate to OTP verification page
      router.push({
         name: "OTPVerification",
         query: { email: form.email }
      });
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
      }

      toast.error("Please fix the highlighted errors.");
      return;
   }

   if (error?.response?.data?.message) {
      toast.error(error.response.data.message);
      return;
   }

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
         <h1 class="text-[#e7e9ea] text-3xl font-bold mb-4 text-center sm:text-left w-full max-w-sm">
            Find your Tweety account
         </h1>

         <!-- Subtitle -->
         <p class="text-[#71767b] text-sm mb-8 text-center sm:text-left w-full max-w-sm">
            Enter your email address and we'll send you a link to reset your password.
         </p>

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

            <button type="submit" :disabled="isLoading"
               class="bg-white text-black cursor-pointer py-2.5 rounded-full mt-2 font-bold hover:bg-[#d6d8da] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
               {{ isLoading ? "Sending..." : "Next" }}
            </button>
         </form>

         <div class="mt-10 w-full max-w-sm">
            <p class="text-[#71767b]">
               Remember your password?
               <router-link to="/login" class="text-[#1d9bf0] hover:underline">Sign in</router-link>
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
