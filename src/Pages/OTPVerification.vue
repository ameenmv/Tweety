<script setup>
import { computed, nextTick, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { verifyOtpApi } from "../api/auth.api";

const otpInputs = reactive({
   digit1: "",
   digit2: "",
   digit3: "",
   digit4: "",
   digit5: "",
   digit6: "",
});

const inputRefs = ref([]);
const toast = useToast();
const router = useRouter();
const route = useRoute();
const isLoading = ref(false);
const isResending = ref(false);

const otpCode = computed(() => {
   return Object.values(otpInputs).join("");
});

const isComplete = computed(() => {
   return otpCode.value.length === 6;
});

const handleInput = (index, event) => {
   const value = event.target.value;

   // Only allow numbers
   if (!/^\d*$/.test(value)) {
      event.target.value = otpInputs[`digit${index + 1}`];
      return;
   }

   otpInputs[`digit${index + 1}`] = value.slice(-1);

   // Auto-focus next input
   if (value && index < 5) {
      inputRefs.value[index + 1]?.focus();
   }

   // Auto-submit when all digits are filled
   if (isComplete.value) {
      submit();
   }
};

const handleKeyDown = (index, event) => {
   // Handle backspace
   if (event.key === "Backspace" && !otpInputs[`digit${index + 1}`] && index > 0) {
      inputRefs.value[index - 1]?.focus();
   }

   // Handle paste
   if (event.key === "v" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      handlePaste(event);
   }
};

const handlePaste = async (event) => {
   event.preventDefault();
   const pastedData = event.clipboardData.getData("text").trim();

   if (!/^\d{6}$/.test(pastedData)) {
      toast.error("Please paste a valid 6-digit code");
      return;
   }

   // Fill all inputs with pasted data
   pastedData.split("").forEach((digit, index) => {
      otpInputs[`digit${index + 1}`] = digit;
   });

   await nextTick();
   inputRefs.value[5]?.focus();

   // Auto-submit
   submit();
};

const submit = async () => {
   if (!isComplete.value) {
      toast.error("Please enter the complete 6-digit code");
      return;
   }

   isLoading.value = true;

   try {
      const response = await verifyOtpApi({
         email: route.query.email,
         otp: otpCode.value
      });

      toast.success("OTP verified successfully!");

      // Navigate to reset password page with token
      router.push({
         name: "ResetPassword",
         query: {
            email: route.query.email,
            token: response.data.data.token || "verified_token"
         }
      });
   } catch (error) {
      handleApiError(error);
      // Clear OTP inputs on error
      Object.keys(otpInputs).forEach(key => {
         otpInputs[key] = "";
      });
      inputRefs.value[0]?.focus();
   } finally {
      isLoading.value = false;
   }
};

const resendOtp = async () => {
   isResending.value = true;

   try {
      await forgotPasswordApi({
         email: route.query.email
      });

      toast.success("New code sent to your email!");
   } catch (error) {
      handleApiError(error);
   } finally {
      isResending.value = false;
   }
};

const handleApiError = (error) => {
   if (error?.response?.data?.message) {
      toast.error(error.response.data.message);
      return;
   }

   toast.error("Something went wrong. Please try again.");
};

onMounted(() => {
   inputRefs.value[0]?.focus();
});
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
            We sent you a code
         </h1>

         <!-- Subtitle -->
         <p class="text-[#71767b] text-sm mb-8 text-center sm:text-left w-full max-w-sm">
            Enter it below to verify {{ route.query.email || "your email" }}.
         </p>

         <!-- OTP Input -->
         <div class="w-full max-w-sm mb-6">
            <div class="flex gap-2 justify-between mb-2">
               <input v-for="(_, index) in 6" :key="index" :ref="el => inputRefs[index] = el"
                  v-model="otpInputs[`digit${index + 1}`]" @input="handleInput(index, $event)"
                  @keydown="handleKeyDown(index, $event)" @paste="handlePaste" type="text" inputmode="numeric"
                  maxlength="1"
                  class="w-full aspect-square text-center text-2xl font-bold border border-[#333639] bg-transparent rounded-md outline-none text-[#e7e9ea] focus:border-[#1d9bf0] transition duration-200"
                  :class="{ 'border-[#1d9bf0]': otpInputs[`digit${index + 1}`] }" />
            </div>
            <p class="text-[#71767b] text-xs text-center mt-4">
               Paste your code or enter it manually
            </p>
         </div>

         <!-- Verify Button -->
         <button @click="submit" :disabled="!isComplete || isLoading"
            class="w-full max-w-sm bg-white text-black cursor-pointer py-2.5 rounded-full font-bold hover:bg-[#d6d8da] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed mb-4">
            {{ isLoading ? "Verifying..." : "Verify" }}
         </button>

         <!-- Resend Code -->
         <div class="w-full max-w-sm text-center">
            <p class="text-[#71767b] text-sm">
               Didn't receive email?
               <button @click="resendOtp" :disabled="isResending"
                  class="text-[#1d9bf0] hover:underline disabled:opacity-50 disabled:cursor-not-allowed">
                  {{ isResending ? "Sending..." : "Click to resend" }}
               </button>
            </p>
         </div>

         <!-- Back to Login -->
         <div class="mt-10 w-full max-w-sm">
            <p class="text-[#71767b]">
               <router-link to="/login" class="text-[#1d9bf0] hover:underline">Back to login</router-link>
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

/* Remove number input arrows */
input[type="text"]::-webkit-outer-spin-button,
input[type="text"]::-webkit-inner-spin-button {
   -webkit-appearance: none;
   margin: 0;
}

input[type="text"] {
   -moz-appearance: textfield;
   appearance: textfield;
}
</style>
