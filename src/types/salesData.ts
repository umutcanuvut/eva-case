export interface SalesDataItem {
  date: string;
  amount: number;
  fbaAmount: number;
  fbmAmount: number;
  orderCount: number;
  fbaOrderCount: number;
  fbmOrderCount: number;
  unitCount: number;
  fbaUnitCount: number;
  fbmUnitCount: number;
  avgSalesPrev30Days: number;
  prevYearDate: number;
  prevYearAmount: number;
  prevYearFbaAmount: number;
  prevYearFbmAmount: number;
  prevYearShippingAmount: number;
  prevYearFbaShippingAmount: number;
  prevYearFbmShippingAmount: number;
  prevYearOrderCount: number;
  prevYearUnitCount: number;
  yoy30DailySalesGrowth: number;
  prevYearAvgSalesPrev30Days: number;
  profit: number;
  cogs: number;
  amazonExpense: number;
  totalExpense: number;
  shippingAmount: number;
  fbaShippingAmount: number;
  fbmShippingAmount: number;
  avgProfitPrev30Days: number;
  avgAdvertisingCostPrev30Days: number;
  advertisingCost: number;
  acos: number;
  refundTotalAmount: number;
  totalVatAmount: number;
  otherFee: number;
}

export interface SkuItem {
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

export interface RefundRate {
  sku: string;
  refundRate: number;
}
