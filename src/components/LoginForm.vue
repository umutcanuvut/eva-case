<script setup lang="ts">
import { ref } from "vue";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { LoaderCircle } from "lucide-vue-next";

const email = ref("");
const password = ref("");
const loading = ref(false);
const errorMessage = ref("");

const store = useStore();
const router = useRouter();

const handleLogin = async () => {
  loading.value = true;
  errorMessage.value = "";

  try {
    await store.dispatch("login", {
      email: email.value,
      password: password.value,
    });

    router.push({ path: "/" });
  } catch (error: any) {
    errorMessage.value = error.message;
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-100">
    <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
      <h2 class="mb-4 text-center text-2xl font-bold">Login</h2>
      <p v-if="errorMessage" class="mb-4 text-center text-red-500">
        {{ errorMessage }}
      </p>
      <div class="mb-4">
        <Label for="email">Email</Label>
        <Input
          v-model="email"
          type="email"
          id="email"
          placeholder="Enter your email"
        />
      </div>
      <div class="mb-6">
        <Label for="password">Password</Label>
        <Input
          v-model="password"
          type="password"
          id="password"
          placeholder="Enter your password"
        />
      </div>
      <Button class="w-full" @click="handleLogin" :disabled="loading">
        <template v-if="loading">
          <LoaderCircle class="mr-3 h-5 w-5 animate-spin" />
        </template>
        <template v-else> Login </template>
      </Button>
    </div>
  </div>
</template>
