<script setup lang="ts">
import { ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-vue-next";
import ChartComponent from "./ChartComponent.vue";
import TimeframeSelect from "./TimeframeSelect.vue";
import RefundTable from "./RefundTable.vue";

const store = useStore();
const router = useRouter();

const timeframe = ref("60");
const clickedColumns = ref<string[]>([]);

const handleColumnClick = (clickedDate: string) => {
  if (clickedColumns.value.includes(clickedDate)) {
    clickedColumns.value = clickedColumns.value.filter(
      (date) => date !== clickedDate,
    );
  } else if (clickedColumns.value.length < 2) {
    clickedColumns.value.push(clickedDate);
  } else {
    clickedColumns.value = [clickedColumns.value[1], clickedDate];
  }
};

const resetClickedColumns = () => {
  clickedColumns.value = [];
};

const handleLogout = () => {
  store.dispatch("logout");
  router.push({ name: "Login" });
};
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <header class="sticky top-0 z-20 bg-white shadow-lg">
      <div class="flex items-center justify-between p-6">
        <h1 class="text-xl font-bold">Dashboard</h1>
        <Button variant="destructive" @click="handleLogout">
          <LogOut class="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
    <main class="relative p-6">
      <TimeframeSelect
        v-model="timeframe"
        @update:model-value="resetClickedColumns"
      />
      <div class="mt-8">
        <ChartComponent
          :timeframe="timeframe"
          :handleColumnClick="handleColumnClick"
          :clickedColumns="clickedColumns"
        />
      </div>
      <div class="mt-8">
        <RefundTable :clickedColumns="clickedColumns" />
      </div>
    </main>
  </div>
</template>
