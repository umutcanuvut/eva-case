<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useSkuList } from "@/composables/useSkuList";
import { useStore } from "vuex";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, LoaderCircle } from "lucide-vue-next";

const props = defineProps<{ clickedColumns: string[] }>();
const store = useStore();

const salesDate = ref<string>("");
const salesDate2 = ref<string>("");

const currentPage = ref<number>(1);
const itemsPerPage = ref<number>(10);
const isAllDataFetched = ref(false);

const { skuList, refundRates, loading, errorMessage, fetchData } = useSkuList();

const refundRateMap = computed(() => {
  const map: Record<string, number> = {};
  refundRates.value.forEach((rate) => {
    map[rate.sku] = rate.refundRate;
  });
  return map;
});

watch(
  () => props.clickedColumns,
  async (newClickedColumns) => {
    if (newClickedColumns.length === 0) {
      return;
    }

    const token = store.state.token;
    const marketplace = store.getters.getUser.store[0].marketplaceName;
    const sellerId = store.getters.getUser.store[0].storeId;
    const isDaysCompare = newClickedColumns.length === 2 ? 1 : 0;

    salesDate.value = newClickedColumns[0];
    salesDate2.value = newClickedColumns[1] || "";

    skuList.value = [];
    currentPage.value = 1;

    await fetchData(
      token,
      marketplace,
      sellerId,
      isDaysCompare,
      salesDate.value,
      salesDate2.value,
      Math.ceil(currentPage.value / 3),
      30,
    );
  },
  { immediate: true, deep: true },
);

const paginatedSkuList = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return skuList.value.slice(start, end);
});

const nextPage = async () => {
  const totalFetchedItems = skuList.value.length;

  if (
    isAllDataFetched.value &&
    currentPage.value * itemsPerPage.value >= totalFetchedItems
  ) {
    return;
  }

  if (currentPage.value * itemsPerPage.value >= totalFetchedItems) {
    const token = store.state.token;
    const marketplace = store.getters.getUser.store[0].marketplaceName;
    const sellerId = store.getters.getUser.store[0].storeId;
    const isDaysCompare = props.clickedColumns.length === 2 ? 1 : 0;

    currentPage.value++;
    await fetchData(
      token,
      marketplace,
      sellerId,
      isDaysCompare,
      salesDate.value,
      salesDate2.value,
      Math.ceil(currentPage.value / 3),
      30,
    );

    if (skuList.value.length % 30 !== 0) {
      isAllDataFetched.value = true;
    }
  } else {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};
</script>

<template>
  <div class="mt-8">
    <Table v-if="skuList.length > 0" class="bg-white shadow-lg">
      <TableHeader>
        <TableRow>
          <TableHead>SKU</TableHead>
          <TableHead>Product Name</TableHead>
          <TableHead class="text-right">
            {{ salesDate }}<br />Sales / Units<br />Avg. Selling Price
          </TableHead>
          <TableHead v-if="salesDate2" class="text-right">
            {{ salesDate2 }}<br />Sales / Units<br />Avg. Selling Price
          </TableHead>
          <TableHead class="text-right">SKU Refund Rate (60 days)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-if="loading">
          <TableCell colspan="5" class="items-center">
            <LoaderCircle class="animate-spin" />
          </TableCell>
        </TableRow>
        <TableRow v-if="errorMessage">
          <TableCell colspan="5" class="text-center text-red-500">
            {{ errorMessage }}
          </TableCell>
        </TableRow>
        <TableRow v-for="skuItem in paginatedSkuList" :key="skuItem.sku">
          <TableCell>{{ skuItem.sku }}</TableCell>
          <TableCell>{{ skuItem.productName }}</TableCell>
          <TableCell class="text-right text-green-500">
            ${{ skuItem.amount }} / {{ skuItem.qty }}<br />
            <span>{{
              skuItem.qty > 0
                ? "$" + (skuItem.amount / skuItem.qty).toFixed(2)
                : "-"
            }}</span>
          </TableCell>
          <TableCell v-if="salesDate2" class="text-right text-blue-500">
            ${{ skuItem.amount2 }} / {{ skuItem.qty2 }}<br />
            <span>{{
              skuItem.qty2 > 0
                ? "$" + (skuItem.amount2 / skuItem.qty2).toFixed(2)
                : "-"
            }}</span>
          </TableCell>
          <TableCell class="text-right">
            {{
              refundRateMap[skuItem.sku]
                ? refundRateMap[skuItem.sku].toFixed(2)
                : "0.00"
            }}%
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <div
      v-if="clickedColumns.length > 0"
      class="mt-4 flex items-center justify-center"
    >
      <Button @click="prevPage" :disabled="currentPage === 1">
        <ChevronLeft />
      </Button>
      <span class="px-4 py-2">{{ currentPage }}</span>
      <Button
        @click="nextPage"
        :disabled="
          isAllDataFetched && currentPage * itemsPerPage >= skuList.length
        "
      >
        <ChevronRight />
      </Button>
    </div>
  </div>
</template>
