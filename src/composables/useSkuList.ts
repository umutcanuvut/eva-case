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
    pageNumber: number,
    pageSize: number = 30,
  ) => {
    try {
      loading.value = true;
      errorMessage.value = null;

      const skuResponse = await fetchSalesSkuList(
        token,
        marketplace,
        sellerId,
        isDaysCompare,
        pageNumber,
        pageSize,
        salesDate,
        salesDate2,
      );

      const newSkuList = skuResponse.data.Data.item.skuList;

      skuList.value = [...skuList.value, ...newSkuList];

      const newSkuArray = newSkuList.map((item: SkuItem) => item.sku);

      if (newSkuArray.length > 0) {
        const refundResponse = await fetchSkuRefundRates(
          token,
          marketplace,
          sellerId,
          newSkuArray,
          60,
        );

        refundRates.value = [...refundRates.value, ...refundResponse.data.Data];
      }
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
