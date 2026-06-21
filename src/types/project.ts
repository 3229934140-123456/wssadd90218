export interface StoreProjectStats {
  storeName: string;
  storeId: string;
  projects: {
    category: 'skincare' | 'hair_removal' | 'anti_aging';
    categoryName: string;
    customerCount: number;
    dealCount: number;
    totalRevenue: number;
    avgOrderValue: number;
    conversionRate: number;
    topCreators: {
      creatorId: string;
      creatorName: string;
      customerCount: number;
      dealCount: number;
    }[];
  }[];
}

export interface ProjectComparison {
  category: 'skincare' | 'hair_removal' | 'anti_aging';
  categoryName: string;
  stores: {
    storeName: string;
    customerCount: number;
    dealCount: number;
    revenue: number;
  }[];
}
