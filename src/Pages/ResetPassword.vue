<script setup>
import { useVuelidate } from "@vuelidate/core";
import { minLength, required, sameAs } from "@vuelidate/validators";
import { computed, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { resetPasswordApi } from "../api/auth.api";

const form = reactive({
   password: "",
   password_confirmation: "",
});

const rules = computed(() => ({
   password: {
      required,
      minLength: minLength(8)
   },
   password_confirmation: {
      required,
      sameAs: sameAs(form.password)
   },
}));

const v$ = useVuelidate(rules, form);
const toast = useToast();
const router = useRouter();
const route = useRoute();
const isLoading = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const submit = async () => {
   const ok = await v$.value.$validate();
   if (!ok) return;

   isLoading.value = true;

   try {
      const response = await resetPasswordApi({
         email: route.query.email,
         password: form.password,
         password_confirmation: form.password_confirmation,
         token: route.query.token
      });

      const toastId = toast.success("Password reset successfully!", {
         timeout: false,
      });

      Object.assign(form, {
         password: "",
         password_confirmation: "",
      });

      v$.value.$reset();

      setTimeout(() => {
         toast.dismiss(toastId);
         router.push("/login");
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
            Choose a new password
         </h1>

         <!-- Subtitle -->
         <p class="text-[#71767b] text-sm mb-8 text-center sm:text-left w-full max-w-sm">
            Make sure your new password is 8 characters or more. Try including numbers, letters, and punctuation marks
            for a strong password.
         </p>

         <!-- Form -->
         <form @submit.prevent="submit" class="flex flex-col gap-6 w-full max-w-sm">
            <!-- New Password -->
            <div class="flex flex-col gap-1">
               <div class="relative group">
                  <input :type="showPassword ? 'text' : 'password'" v-model="form.password" @blur="v$.password.$touch()"
                     placeholder=" " id="password"
                     class="peer w-full border border-[#333639] bg-transparent p-4 pt-6 pr-12 rounded-md outline-none text-[#e7e9ea] focus:border-[#1d9bf0] transition duration-200" />
                  <label for="password"
                     class="absolute left-4 top-4 text-[#71767b] transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#1d9bf0] peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs">
                     Enter your password
                  </label>
                  <button type="button" @click="showPassword = !showPassword"
                     class="absolute right-4 top-1/2 -translate-y-1/2 text-[#71767b] hover:text-[#e7e9ea] transition">
                     <svg v-if="!showPassword" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fill-rule="evenodd"
                           d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                           clip-rule="evenodd" />
                     </svg>
                     <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                           d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                           clip-rule="evenodd" />
                        <path
                           d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                     </svg>
                  </button>
               </div>
               <small v-if="v$.password.$dirty && v$.password.$error" class="text-[#f4212e] text-xs px-1">
                  {{ v$.password.$errors[0].$message || "Password must be at least 8 characters" }}
               </small>
            </div>

            <!-- Confirm Password -->
            <div class="flex flex-col gap-1">
               <div class="relative group">
                  <input :type="showConfirmPassword ? 'text' : 'password'" v-model="form.password_confirmation"
                     @blur="v$.password_confirmation.$touch()" placeholder=" " id="password_confirmation"
                     class="peer w-full border border-[#333639] bg-transparent p-4 pt-6 pr-12 rounded-md outline-none text-[#e7e9ea] focus:border-[#1d9bf0] transition duration-200" />
                  <label for="password_confirmation"
                     class="absolute left-4 top-4 text-[#71767b] transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#1d9bf0] peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs">
                     Confirm your password
                  </label>
                  <button type="button" @click="showConfirmPassword = !showConfirmPassword"
                     class="absolute right-4 top-1/2 -translate-y-1/2 text-[#71767b] hover:text-[#e7e9ea] transition">
                     <svg v-if="!showConfirmPassword" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fill-rule="evenodd"
                           d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                           clip-rule="evenodd" />
                     </svg>
                     <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                           d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                           clip-rule="evenodd" />
                        <path
                           d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                     </svg>
                  </button>
               </div>
               <small v-if="v$.password_confirmation.$dirty && v$.password_confirmation.$error"
                  class="text-[#f4212e] text-xs px-1">
                  {{ v$.password_confirmation.$errors[0].$message || "Passwords must match" }}
               </small>
            </div>

            <button type="submit" :disabled="isLoading"
               class="bg-white text-black cursor-pointer py-2.5 rounded-full mt-2 font-bold hover:bg-[#d6d8da] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
               {{ isLoading ? "Resetting..." : "Reset password" }}
            </button>
         </form>
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
