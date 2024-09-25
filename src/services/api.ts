import axios from "axios";
import { SalesDataItem } from "@/types/salesData";

const BaseUrl = "https://iapitest.eva.guru/";

export const loginApi = (email: string, password: string) => {
  return axios.post(`${BaseUrl}oauth/token`, {
    Email: email,
    Password: password,
    GrantType: "password",
    Scope: "amazon_data",
    ClientId: "C0001",
    ClientSecret: "SECRET0001",
    RedirectUri: "https://api.eva.guru",
  });
};

export const fetchUserInfo = (token: string, email: string) => {
  return axios.post(
    `${BaseUrl}user/user-information`,
    { email },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const fetchSalesData = (
  token: string,
  marketplace: string,
  sellerId: string,
  day: number,
): Promise<{ data: { Data: { item: SalesDataItem[] } } }> => {
  return axios.post(
    `${BaseUrl}data/daily-sales-overview`,
    {
      marketplace: marketplace,
      sellerId: sellerId,
      requestStatus: 0,
      day: day,
      excludeYoYData: true,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const fetchSalesSkuList = (
  token: string,
  marketplace: string,
  sellerId: string,
  isDaysCompare: number,
  pageNumber: number,
  pageSize: number,
  salesDate: string,
  salesDate2: string = "",
) => {
  return axios.post(
    `${BaseUrl}data/daily-sales-sku-list`,
    {
      isDaysCompare: isDaysCompare,
      marketplace: marketplace,
      pageNumber: pageNumber,
      pageSize: pageSize,
      salesDate: salesDate,
      salesDate2: salesDate2,
      sellerId: sellerId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const fetchSkuRefundRates = (
  token: string,
  marketplace: string,
  sellerId: string,
  skuList: string[],
  requestedDay: number = 60,
) => {
  return axios.post(
    `${BaseUrl}data/get-sku-refund-rate`,
    {
      marketplace: marketplace,
      sellerId: sellerId,
      skuList: skuList,
      requestedDay: requestedDay,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};
