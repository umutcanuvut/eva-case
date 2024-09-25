<script setup lang="ts">
import { ref, watch } from "vue";
import { fetchSalesSkuList, fetchSkuRefundRates } from "@/services/api";
import { useStore } from "vuex";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface SkuItem {
  sku: string;
  productName: string;
  qty: number;
  amount: number;
  shippingAmount: number;
  qty2: number;
  amount2: number;
  shippingAmount2: number;
  sortingAmount: number;
  imageUrl: string;
  refundPercantage?: number | null;
}

interface RefundRate {
  sku: string;
  refundRate: number;
}

const props = defineProps<{ clickedColumns: string[] }>();
const store = useStore();

const skuList = ref<SkuItem[]>([]);
const refundRates = ref<RefundRate[]>([]);
const loading = ref(false);
const errorMessage = ref<string | null>(null);

const salesDate = ref<string>("");
const salesDate2 = ref<string>("");

watch(
  () => props.clickedColumns,
  async (newClickedColumns) => {
    if (newClickedColumns.length === 0) {
      skuList.value = [];
      refundRates.value = [];
      salesDate.value = "";
      salesDate2.value = "";
      return;
    }

    try {
      loading.value = true;
      errorMessage.value = null;

      const token = store.state.token;
      const marketplace = store.getters.getUser.store[0].marketplaceName;
      const sellerId = store.getters.getUser.store[0].storeId;

      const isDaysCompare = newClickedColumns.length === 2 ? 1 : 0;
      salesDate.value = newClickedColumns[0] || "";
      salesDate2.value = newClickedColumns[1] || "";

      // Fetch SKU list
      const skuResponse = await fetchSalesSkuList(
        token,
        marketplace,
        sellerId,
        isDaysCompare,
        1,
        30,
        salesDate.value,
        salesDate2.value,
      );

      skuList.value = skuResponse.data.Data.item.skuList;

      // Fetch refund rates
      const skuArray = skuList.value.map((item) => item.sku);
      const refundResponse = await fetchSkuRefundRates(
        token,
        marketplace,
        sellerId,
        skuArray,
        60,
      );

      refundRates.value = refundResponse.data.Data;
    } catch (error: any) {
      errorMessage.value = "Error fetching SKU data: " + error.message;
    } finally {
      loading.value = false;
    }
  },
  { immediate: true, deep: true },
);
</script>

<template>
  <div class="mt-8">
    <div v-if="loading" class="text-blue-500">Loading...</div>
    <div v-if="errorMessage" class="text-red-500">{{ errorMessage }}</div>

    <Table v-if="skuList.length > 0" class="bg-white shadow-lg">
      <TableHeader>
        <TableRow>
          <TableHead>SKU</TableHead>
          <TableHead>Product Name</TableHead>
          <TableHead class="text-right"
            >{{ salesDate }}<br />Sales / Units<br />Avg. Selling
            Price</TableHead
          >

          <TableHead v-if="salesDate2" class="text-right"
            >{{ salesDate2 }}<br />Sales / Units<br />Avg. Selling
            Price</TableHead
          >

          <TableHead class="text-right">SKU Refund Rate (60 days)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="(skuItem, index) in skuList" :key="skuItem.sku">
          <TableCell>{{ skuItem.sku }}</TableCell>
          <TableCell>{{ skuItem.productName }}</TableCell>
          <TableCell class="text-right text-green-500">
            ${{ skuItem.amount }} / {{ skuItem.qty }}<br />
            <span>
              {{
                skuItem.qty > 0
                  ? "$" + (skuItem.amount / skuItem.qty).toFixed(2)
                  : "-"
              }}
            </span>
          </TableCell>
          <TableCell v-if="salesDate2" class="text-right text-blue-500">
            ${{ skuItem.amount2 }} / {{ skuItem.qty2 }}<br />
            <span>
              {{
                skuItem.qty2 > 0
                  ? "$" + (skuItem.amount2 / skuItem.qty2).toFixed(2)
                  : "-"
              }}
            </span>
          </TableCell>
          <TableCell class="text-right">
            {{
              refundRates[index]?.refundRate
                ? refundRates[index].refundRate.toFixed(2)
                : "0.00"
            }}%
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
