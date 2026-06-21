export type ROIType = 'high' | 'medium' | 'low';

export type CommissionType = 'fixed' | 'per_order' | 'tiered';

export interface CommissionRule {
  type: CommissionType;
  fixedAmount?: number;
  percentage?: number;
  tiers?: {
    threshold: number;
    percentage: number;
  }[];
}

export interface CreatorProject {
  id: string;
  name: string;
  category: 'skincare' | 'hair_removal' | 'anti_aging';
  price: number;
  commission: number;
}

export interface CreatorVideo {
  id: string;
  title: string;
  coverUrl: string;
  videoUrl: string;
  viewCount: number;
  likeCount: number;
  publishDate: string;
}

export interface SettlementRecord {
  id: string;
  month: string;
  customerCount: number;
  dealCount: number;
  totalAmount: number;
  commission: number;
  status: 'pending' | 'confirmed' | 'paid' | 'disputed';
}

export interface Creator {
  id: string;
  name: string;
  avatar: string;
  platform: string;
  followers: number;
  roi: ROIType;
  roiValue: number;
  monthlyData: {
    customerCount: number;
    dealCount: number;
    avgOrderValue: number;
    commission: number;
    totalRevenue: number;
  };
  firstTimeCustomers: number;
  repeatCustomers: number;
  commissionRule: CommissionRule;
  projects: CreatorProject[];
  videos: CreatorVideo[];
  settlementHistory: SettlementRecord[];
  cooperationStartDate: string;
  store: string;
  isHighCommission: boolean;
}

export interface CreatorRanking {
  rank: number;
  creatorId: string;
  creatorName: string;
  avatar: string;
  roi: ROIType;
  roiValue: number;
  customerCount: number;
  dealCount: number;
  revenue: number;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
}
