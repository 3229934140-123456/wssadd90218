export interface CustomerInfo {
  id: string;
  nameMasked: string;
  phoneMasked: string;
  isFirstTime: boolean;
  consultDate: string;
  dealDate: string;
}

export interface DealItem {
  id: string;
  projectName: string;
  projectCategory: 'skincare' | 'hair_removal' | 'anti_aging';
  price: number;
  commission: number;
  commissionSource: 'fixed' | 'per_order' | 'tiered';
  customer: CustomerInfo;
  isHighCommission: boolean;
}

export interface Settlement {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  period: string;
  periodStart: string;
  periodEnd: string;
  customerCount: number;
  firstTimeCount: number;
  repeatCount: number;
  dealCount: number;
  totalAmount: number;
  commission: number;
  commissionRule: string;
  status: 'pending' | 'confirmed' | 'paid' | 'disputed';
  deals: DealItem[];
  submitDate: string;
  confirmDate?: string;
  paidDate?: string;
  remark?: string;
  isHighCommission: boolean;
  store: string;
}

export interface SettlementDay {
  date: string;
  status: 'pending' | 'today' | 'past' | 'future';
  hasSettlement: boolean;
  settlementCount: number;
  totalCommission: number;
}

export interface PendingSettlement {
  id: string;
  creatorName: string;
  creatorAvatar: string;
  period: string;
  commission: number;
  dealCount: number;
  deadline: string;
  isHighCommission: boolean;
}
