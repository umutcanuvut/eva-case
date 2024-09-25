import { SalesDataItem } from "@/types/salesData";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getChartOptions = (
  dates: string[],
  fbaData: number[],
  fbmData: number[],
  profitData: number[],
  handleColumnClick: (clickedCategory: string) => void,
) => ({
  chart: { type: "column", height: 600 },
  title: { text: "Daily Sales", align: "left" },
  xAxis: { categories: dates },
  yAxis: { title: { text: "Amount ($)" } },
  plotOptions: {
    column: {
      stacking: "normal",
      events: {
        click: function (event: any) {
          const clickedCategory =
            event.point.series.chart.xAxis[0].categories[event.point.x];
          handleColumnClick(clickedCategory);
        },
      },
    },
  },
  tooltip: { shared: true, useHTML: true, formatter: undefined },
  series: [
    {
      name: "Profit",
      data: profitData.map((profit) => (profit < 0 ? null : profit)),
      color: "#82E0AA",
    },
    { name: "FBM Sales", data: fbmData, color: "#5e2ca5" },
    { name: "FBA Sales", data: fbaData, color: "#a4a9f5" },
  ],
});

export const tooltipFormatter = function (
  this: Highcharts.TooltipFormatterContextObject,
  salesData: SalesDataItem[],
) {
  const fbaSales =
    this.points?.find((point) => point.series.name === "FBA Sales")?.y || 0;
  const fbmSales =
    this.points?.find((point) => point.series.name === "FBM Sales")?.y || 0;

  const dataItem = salesData.find((item) => item.date === this.x);
  const profit = dataItem?.profit || 0;

  const totalSales = fbaSales + fbmSales;
  const shippingAmount = dataItem?.fbaShippingAmount || 0;

  return `
    <strong>${this.x}</strong><br>
    <span>●</span> <strong>Total Sales:</strong> $${totalSales.toFixed(2)}<br>
    <span>●</span> <strong>Shipping:</strong> $${shippingAmount.toFixed(2)}<br>
    <span style="color: #82E0AA">●</span> <strong>Profit:</strong> $${profit.toFixed(2)}<br>
    <span style="color: #a4a9f5">●</span> <strong>FBA Sales:</strong> $${fbaSales.toFixed(2)}<br>
    <span style="color: #5e2ca5">●</span> <strong>FBM Sales:</strong> $${fbmSales.toFixed(2)}
  `;
};
