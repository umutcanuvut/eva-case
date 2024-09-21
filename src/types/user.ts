export interface User {
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  callingCode: string;
  telephoneNumber: string;
  isAdmin: string;
  store: {
    storeName: string;
    storeId: string;
    evaStoreId: string;
    storeType: number;
    region: string;
    paidStatus: number;
    pricingStatus: number;
    paidDate: string;
    reimbursementPackageTrialEndDate: string;
    linkedDate: string;
    marketplaceName: string;
    marketplaceCode: string;
    enableRepricing: boolean;
  }[];
}
