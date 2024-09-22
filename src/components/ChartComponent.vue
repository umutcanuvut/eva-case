<script setup lang="ts">
import { ref, onMounted } from "vue";
import { fetchSalesData } from "@/services/api";
import { useStore } from "vuex";

const salesData = ref<any>(null);
const errorMessage = ref<string | null>(null);
const loading = ref(true);

const store = useStore();
const user = store.getters.getUser;

const getSalesData = async () => {
  try {
    const token = store.state.token;
    const marketplace = user.store[0].marketplaceName;
    const sellerId = user.store[0].storeId;

    const response = await fetchSalesData(token, marketplace, sellerId, 60);
    salesData.value = response.data.Data;
  } catch (error: any) {
    errorMessage.value =
      "Failed to fetch sales data: " +
      (error.response?.data?.message || error.message);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  getSalesData();
});
</script>

<template>
  <div>
    <h1>Daily Sales Overview Data</h1>

    <div v-if="loading">Loading sales data...</div>

    <div v-if="errorMessage" class="text-red-500">{{ errorMessage }}</div>

    <div v-if="salesData">
      <pre>{{ salesData }}</pre>
    </div>
  </div>
</template>
