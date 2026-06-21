export interface Payment {
  id: string;
  settlementId: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  amount: number;
  payDate: string;
  payTime: string;
  payMethod: 'bank' | 'alipay' | 'wechat';
  receiverAccount: string;
  receiverName: string;
  remark?: string;
  operator: string;
  status: 'success' | 'failed' | 'processing';
  period: string;
}

export interface PaymentSummary {
  totalPaid: number;
  totalPending: number;
  monthPaid: number;
  count: number;
}

export interface PaymentFilter {
  startDate?: string;
  endDate?: string;
  creatorId?: string;
  status?: string;
}
