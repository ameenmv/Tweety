<script setup>
import { useVuelidate } from "@vuelidate/core";
import { email, minLength, required, sameAs } from "@vuelidate/validators";
import { computed, reactive } from "vue";
import { registerApi } from "../api/auth.api";

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
    sameAs: sameAs(() => form.password),
  },
}));

const v$ = useVuelidate(rules, form);

const submit = async () => {
  const ok = await v$.value.$validate();
  if (!ok) return;

  await registerApi(form);
};
</script>

<template>
  <div class="h-screen bg-[#242D34] flex justify-center items-center">
    <div
      class="flex flex-col justify-center items-center w-fit text-[#e7e9ea] bg-black p-10 rounded-xl"
    >
      <h1 class="font-bold text-3xl mb-4">Create your account</h1>
      <form @submit.prevent="submit" class="flex flex-col gap-6 w-80">
        <!-- name -->
        <div class="flex flex-col gap-2 w-80">
          <input
            v-model="form.name"
            placeholder="Name"
            class="border border-[#ffffff52] bg-transparent p-3 rounded-lg outline-none text-[#e7e9ea]"
          />
          <small v-if="v$.name.$error" class="text-red-500">
            Name is required
          </small>
        </div>
        <!-- username -->
        <div class="flex flex-col gap-2 w-80">
          <input
            v-model="form.username"
            placeholder="Username"
            class="border border-[#ffffff52] bg-transparent p-3 rounded-lg outline-none text-[#e7e9ea]"
          />
          <small v-if="v$.username.$error" class="text-red-500">
            Username is required
          </small>
        </div>
        <!-- email -->
        <div class="flex flex-col gap-2 w-80">
          <input
            v-model="form.email"
            placeholder="Email"
            class="border border-[#ffffff52] bg-transparent p-3 rounded-lg outline-none text-[#e7e9ea]"
          />
          <small v-if="v$.email.$error" class="text-red-500">
            {{ v$.email.$errors[0].$message || "Valid email is required" }}
          </small>
        </div>
        <!-- password -->
        <div class="flex flex-col gap-2 w-80">
          <input
            type="password"
            v-model="form.password"
            placeholder="Password"
            class="border border-[#ffffff52] bg-transparent p-3 rounded-lg outline-none text-[#e7e9ea]"
          />
          <small v-if="v$.password.$error" class="text-red-500">
            Password must be at least 8 characters
          </small>
        </div>
        <!-- password confirmation -->
        <div class="flex flex-col gap-2 w-80">
          <input
            type="password"
            v-model="form.password_confirmation"
            placeholder="Confirm Password"
            class="border border-[#ffffff52] bg-transparent p-3 rounded-lg outline-none text-[#e7e9ea]"
          />
          <small
            v-if="
              v$.password_confirmation.$dirty && v$.password_confirmation.$error
            "
            class="text-red-500"
          >
            Passwords must match
          </small>
        </div>

        <button
          type="submit"
          class="bg-[#e7e9ea] text-black cursor-pointer p-3 rounded-lg mt-2 font-bold hover:bg-[#d6d8da] transition"
        >
          Sign Up
        </button>
      </form>
    </div>
  </div>
</template>
