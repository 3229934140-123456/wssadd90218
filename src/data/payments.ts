import type { Payment, PaymentSummary } from '@/types/payment';

export const mockPayments: Payment[] = [
  {
    id: 'pay1',
    settlementId: 'set5',
    creatorId: '3',
    creatorName: '脱毛专家莉莉',
    creatorAvatar: 'https://picsum.photos/id/1027/200/200',
    amount: 15360,
    payDate: '2026-06-10',
    payTime: '14:30:25',
    payMethod: 'bank',
    receiverAccount: '6222 **** **** 8899',
    receiverName: '李*丽',
    remark: '5月佣金结算',
    operator: '张财务',
    status: 'success',
    period: '2026年5月',
  },
  {
    id: 'pay2',
    settlementId: 'set4',
    creatorId: '4',
    creatorName: '医美博主大V',
    creatorAvatar: 'https://picsum.photos/id/338/200/200',
    amount: 67620,
    payDate: '2026-06-08',
    payTime: '10:15:42',
    payMethod: 'alipay',
    receiverAccount: '138****5678',
    receiverName: '王*明',
    remark: '5月佣金结算',
    operator: '张财务',
    status: 'success',
    period: '2026年5月',
  },
  {
    id: 'pay3',
    settlementId: 'set_s1',
    creatorId: '1',
    creatorName: '美美说医美',
    creatorAvatar: 'https://picsum.photos/id/64/200/200',
    amount: 48360,
    payDate: '2026-06-05',
    payTime: '16:20:18',
    payMethod: 'bank',
    receiverAccount: '6225 **** **** 1234',
    receiverName: '陈*美',
    remark: '4月佣金结算',
    operator: '李财务',
    status: 'success',
    period: '2026年4月',
  },
  {
    id: 'pay4',
    settlementId: 'set_s2',
    creatorId: '1',
    creatorName: '美美说医美',
    creatorAvatar: 'https://picsum.photos/id/64/200/200',
    amount: 39780,
    payDate: '2026-05-10',
    payTime: '09:45:33',
    payMethod: 'wechat',
    receiverAccount: 'wx_****_1234',
    receiverName: '陈*美',
    remark: '3月佣金结算',
    operator: '张财务',
    status: 'success',
    period: '2026年3月',
  },
  {
    id: 'pay5',
    settlementId: 'set_s3',
    creatorId: '2',
    creatorName: '护肤达人小雨',
    creatorAvatar: 'https://picsum.photos/id/91/200/200',
    amount: 33600,
    payDate: '2026-06-05',
    payTime: '11:30:00',
    payMethod: 'alipay',
    receiverAccount: '139****1234',
    receiverName: '林*雨',
    remark: '5月佣金结算',
    operator: '张财务',
    status: 'success',
    period: '2026年5月',
  },
  {
    id: 'pay6',
    settlementId: 'set_s5',
    creatorId: '6',
    creatorName: '抗衰达人张医生',
    creatorAvatar: 'https://picsum.photos/id/64/200/200',
    amount: 79500,
    payDate: '2026-06-08',
    payTime: '15:00:00',
    payMethod: 'bank',
    receiverAccount: '6220 **** **** 5678',
    receiverName: '张*生',
    remark: '5月佣金结算',
    operator: '李财务',
    status: 'success',
    period: '2026年5月',
  },
];

export const mockPaymentSummary: PaymentSummary = {
  totalPaid: 284220,
  totalPending: 117600,
  monthPaid: 148580,
  count: 6,
};

export const getPayments = (): Payment[] => {
  return mockPayments;
};

export const getPaymentSummary = (): PaymentSummary => {
  return mockPaymentSummary;
};

export const getPaymentById = (id: string): Payment | undefined => {
  return mockPayments.find(p => p.id === id);
};
