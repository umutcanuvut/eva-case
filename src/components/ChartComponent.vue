<script setup lang="ts">
import { ref, watch } from "vue";
import { fetchSalesData } from "@/services/api";
import { getChartOptions, tooltipFormatter } from "@/lib/utils";
import { useStore } from "vuex";
import { Chart } from "highcharts-vue";
import { SalesDataItem } from "@/types/salesData";

const props = defineProps<{ timeframe: string }>();

const salesData = ref<SalesDataItem[]>([]);
const errorMessage = ref<string | null>(null);
const loading = ref(true);
const chartOptions = ref<any>({});

const store = useStore();
const user = store.getters.getUser;

const getSalesData = async (timeframe: string) => {
  try {
    const token = store.state.token;
    const marketplace = user.store[0].marketplaceName;
    const sellerId = user.store[0].storeId;

    const response = await fetchSalesData(
      token,
      marketplace,
      sellerId,
      +timeframe,
    );
    salesData.value = response.data.Data.item;

    const dates = salesData.value.map((item: SalesDataItem) => item.date);
    const fbaAmounts = salesData.value.map(
      (item: SalesDataItem) => item.fbaAmount,
    );
    const fbmAmounts = salesData.value.map(
      (item: SalesDataItem) => item.fbmAmount,
    );
    const profitAmounts = salesData.value.map(
      (item: SalesDataItem) => item.profit,
    );

    chartOptions.value = getChartOptions(
      dates,
      fbaAmounts,
      fbmAmounts,
      profitAmounts,
    );
    chartOptions.value.tooltip.formatter = function () {
      return tooltipFormatter.call(this, salesData.value);
    };
  } catch (error: any) {
    errorMessage.value =
      "Failed to fetch sales data: " +
      (error.response?.data?.message || error.message);
  } finally {
    loading.value = false;
  }
};

watch(
  () => props.timeframe,
  (newTimeframe) => {
    getSalesData(newTimeframe);
  },
  { immediate: true },
);
</script>

<template>
  <div class="mt-8">
    <div v-if="errorMessage" class="text-red-500">{{ errorMessage }}</div>
    <div v-if="!errorMessage && !loading">
      <Chart :options="chartOptions" />
    </div>
  </div>
</template>
