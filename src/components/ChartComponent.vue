<script setup lang="ts">
import { ref, watch } from "vue";
import { fetchSalesData } from "@/services/api";
import { useStore } from "vuex";
import { Chart } from "highcharts-vue";
import { SalesDataItem } from "@/types/salesData";

const props = defineProps<{ timeframe: string }>();

const chartOptions = ref<any>({
  chart: {
    type: "column",
    height: 600,
  },
  title: {
    text: "Daily Sales",
    align: "left",
  },
  xAxis: {
    categories: [],
  },
  yAxis: {
    title: {
      text: "Amount ($)",
    },
  },
  plotOptions: {
    column: {
      stacking: "normal",
    },
  },
  tooltip: {
    shared: true,
    useHTML: true,
    formatter: function (
      this: Highcharts.TooltipFormatterContextObject,
    ): string {
      const fbaSales =
        this.points?.find((point) => point.series.name === "FBA Sales")?.y || 0;
      const fbmSales =
        this.points?.find((point) => point.series.name === "FBM Sales")?.y || 0;
      const profit =
        this.points?.find((point) => point.series.name === "Profit")?.y || 0;

      const dataItem: SalesDataItem | undefined = salesData.value?.find(
        (item: SalesDataItem) => item.date === this.x,
      );

      const totalSales = fbaSales + fbmSales;
      const shippingAmount = dataItem?.fbaShippingAmount || 0;

      return `
        <strong>${this.x}</strong><br>
        <span style="color: #82E0AA">●</span> <strong>Total Sales:</strong> $${totalSales.toFixed(2)}<br>
        <span>●</span> <strong>Shipping:</strong> $${shippingAmount.toFixed(2)}<br>
        <span>●</span> <strong>Profit:</strong> $${profit.toFixed(2)}<br>
        <span style="color: #5e2ca5">●</span> <strong>FBA Sales:</strong> $${fbaSales.toFixed(2)}<br>
        <span style="color: #a4a9f5">●</span> <strong>FBM Sales:</strong> $${fbmSales.toFixed(2)}
      `;
    },
  },
  series: [
    {
      name: "Profit",
      data: [],
      color: "#82E0AA",
    },
    {
      name: "FBM Sales",
      data: [],
      color: "#5e2ca5",
    },
    {
      name: "FBA Sales",
      data: [],
      color: "#a4a9f5",
    },
  ],
});

const salesData = ref<SalesDataItem[]>([]);
const errorMessage = ref<string | null>(null);
const loading = ref(true);

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

    chartOptions.value.xAxis.categories = dates;
    chartOptions.value.series[0].data = profitAmounts;
    chartOptions.value.series[1].data = fbmAmounts;
    chartOptions.value.series[2].data = fbaAmounts;
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
    <div v-if="salesData">
      <Chart :options="chartOptions" />
    </div>
  </div>
</template>
