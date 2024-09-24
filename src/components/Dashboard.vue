<script setup lang="ts">
import { ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-vue-next";
import ChartComponent from "./ChartComponent.vue";
import TimeframeSelect from "./TimeframeSelect.vue";

const store = useStore();
const router = useRouter();

const timeframe = ref("60");

const handleLogout = () => {
  store.dispatch("logout");
  router.push({ name: "Login" });
};
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <header class="sticky top-0 z-10 bg-white shadow-lg">
      <div class="flex items-center justify-between p-6">
        <h1 class="text-xl font-bold">Dashboard</h1>
        <Button variant="destructive" @click="handleLogout">
          <LogOut class="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
    <main class="relative p-6">
      <TimeframeSelect v-model="timeframe" />
      <div class="mt-8">
        <ChartComponent :timeframe="timeframe" />
      </div>
    </main>
  </div>
</template>
