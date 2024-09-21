<script setup lang="ts">
import { ref } from "vue";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useStore } from "vuex";

const email = ref("");
const password = ref("");

const store = useStore();

const handleLogin = () => {
  store.dispatch("login", { email: email.value, password: password.value });
};
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-100">
    <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
      <h2 class="mb-4 text-center text-2xl font-bold">Login</h2>
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
      <Button class="w-full" @click="handleLogin">Login</Button>
    </div>
  </div>
</template>
