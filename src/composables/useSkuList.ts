import { ref } from "vue";
import { fetchSalesSkuList, fetchSkuRefundRates } from "@/services/api";
import { RefundRate, SkuItem } from "@/types/salesData";

export function useSkuList() {
  const skuList = ref<SkuItem[]>([]);
  const refundRates = ref<RefundRate[]>([]);
  const loading = ref(false);
  const errorMessage = ref<string | null>(null);

  const fetchData = async (
    token: string,
    marketplace: string,
    sellerId: string,
    isDaysCompare: number,
    salesDate: string,
    salesDate2: string,
  ) => {
    try {
      loading.value = true;
      errorMessage.value = null;

      const skuResponse = await fetchSalesSkuList(
        token,
        marketplace,
        sellerId,
        isDaysCompare,
        1,
        30,
        salesDate,
        salesDate2,
      );
      skuList.value = skuResponse.data.Data.item.skuList;

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
      errorMessage.value = `Error fetching SKU data: ${error.message}`;
    } finally {
      loading.value = false;
    }
  };

  return {
    skuList,
    refundRates,
    loading,
    errorMessage,
    fetchData,
  };
}
