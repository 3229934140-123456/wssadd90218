import type { StoreProjectStats, ProjectComparison } from '@/types/project';

export const mockStoreProjectStats: StoreProjectStats[] = [
  {
    storeName: '朝阳门店',
    storeId: 'store1',
    projects: [
      {
        category: 'skincare',
        categoryName: '水光',
        customerCount: 156,
        dealCount: 68,
        totalRevenue: 286000,
        avgOrderValue: 4206,
        conversionRate: 0.436,
        topCreators: [
          {
            creatorId: '2',
            creatorName: '护肤达人小雨',
            customerCount: 68,
            dealCount: 26,
          },
          {
            creatorId: '8',
            creatorName: '水光针专家',
            customerCount: 58,
            dealCount: 22,
          },
        ],
      },
      {
        category: 'hair_removal',
        categoryName: '脱毛',
        customerCount: 89,
        dealCount: 35,
        totalRevenue: 128000,
        avgOrderValue: 3657,
        conversionRate: 0.393,
        topCreators: [
          {
            creatorId: '3',
            creatorName: '脱毛专家莉莉',
            customerCount: 52,
            dealCount: 18,
          },
          {
            creatorId: '7',
            creatorName: '脱毛小能手',
            customerCount: 35,
            dealCount: 10,
          },
        ],
      },
      {
        category: 'anti_aging',
        categoryName: '抗衰',
        customerCount: 234,
        dealCount: 112,
        totalRevenue: 892000,
        avgOrderValue: 7964,
        conversionRate: 0.479,
        topCreators: [
          {
            creatorId: '6',
            creatorName: '抗衰达人张医生',
            customerCount: 95,
            dealCount: 42,
          },
          {
            creatorId: '1',
            creatorName: '美美说医美',
            customerCount: 86,
            dealCount: 32,
          },
          {
            creatorId: '4',
            creatorName: '医美博主大V',
            customerCount: 45,
            dealCount: 18,
          },
        ],
      },
    ],
  },
  {
    storeName: '海淀分店',
    storeId: 'store2',
    projects: [
      {
        category: 'skincare',
        categoryName: '水光',
        customerCount: 98,
        dealCount: 38,
        totalRevenue: 156000,
        avgOrderValue: 4105,
        conversionRate: 0.388,
        topCreators: [
          {
            creatorId: '8',
            creatorName: '水光针专家',
            customerCount: 58,
            dealCount: 22,
          },
          {
            creatorId: '5',
            creatorName: '小白医美日记',
            customerCount: 28,
            dealCount: 8,
          },
        ],
      },
      {
        category: 'hair_removal',
        categoryName: '脱毛',
        customerCount: 67,
        dealCount: 24,
        totalRevenue: 86000,
        avgOrderValue: 3583,
        conversionRate: 0.358,
        topCreators: [
          {
            creatorId: '3',
            creatorName: '脱毛专家莉莉',
            customerCount: 52,
            dealCount: 18,
          },
        ],
      },
      {
        category: 'anti_aging',
        categoryName: '抗衰',
        customerCount: 123,
        dealCount: 52,
        totalRevenue: 428000,
        avgOrderValue: 8231,
        conversionRate: 0.423,
        topCreators: [
          {
            creatorId: '4',
            creatorName: '医美博主大V',
            customerCount: 75,
            dealCount: 17,
          },
        ],
      },
    ],
  },
];

export const mockProjectComparisons: ProjectComparison[] = [
  {
    category: 'skincare',
    categoryName: '水光',
    stores: [
      {
        storeName: '朝阳门店',
        customerCount: 156,
        dealCount: 68,
        revenue: 286000,
      },
      {
        storeName: '海淀分店',
        customerCount: 98,
        dealCount: 38,
        revenue: 156000,
      },
    ],
  },
  {
    category: 'hair_removal',
    categoryName: '脱毛',
    stores: [
      {
        storeName: '朝阳门店',
        customerCount: 89,
        dealCount: 35,
        revenue: 128000,
      },
      {
        storeName: '海淀分店',
        customerCount: 67,
        dealCount: 24,
        revenue: 86000,
      },
    ],
  },
  {
    category: 'anti_aging',
    categoryName: '抗衰',
    stores: [
      {
        storeName: '朝阳门店',
        customerCount: 234,
        dealCount: 112,
        revenue: 892000,
      },
      {
        storeName: '海淀分店',
        customerCount: 123,
        dealCount: 52,
        revenue: 428000,
      },
    ],
  },
];

export const getStoreProjectStats = (): StoreProjectStats[] => {
  return mockStoreProjectStats;
};

export const getProjectComparisons = (): ProjectComparison[] => {
  return mockProjectComparisons;
};
