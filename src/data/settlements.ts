import type { Settlement, PendingSettlement, SettlementDay } from '@/types/settlement';
import dayjs from 'dayjs';

export const mockSettlements: Settlement[] = [
  {
    id: 'set1',
    creatorId: '1',
    creatorName: '美美说医美',
    creatorAvatar: 'https://picsum.photos/id/64/200/200',
    period: '2026年6月上半月',
    periodStart: '2026-06-01',
    periodEnd: '2026-06-15',
    customerCount: 45,
    firstTimeCount: 15,
    repeatCount: 5,
    dealCount: 20,
    totalAmount: 128000,
    commission: 38400,
    commissionRule: '阶梯奖励',
    status: 'pending',
    submitDate: '2026-06-16',
    isHighCommission: true,
    store: '朝阳门店',
    deals: [
      {
        id: 'd1',
        projectName: '热玛吉',
        projectCategory: 'anti_aging',
        price: 12800,
        commission: 2560,
        isHighCommission: true,
        customer: {
          id: 'c1',
          nameMasked: '王**',
          phoneMasked: '138****5678',
          isFirstTime: true,
          consultDate: '2026-06-02',
          dealDate: '2026-06-05',
        },
      },
      {
        id: 'd2',
        projectName: '玻尿酸填充',
        projectCategory: 'anti_aging',
        price: 6800,
        commission: 1360,
        isHighCommission: false,
        customer: {
          id: 'c2',
          nameMasked: '李**',
          phoneMasked: '139****1234',
          isFirstTime: false,
          consultDate: '2026-06-03',
          dealDate: '2026-06-06',
        },
      },
    ],
  },
  {
    id: 'set2',
    creatorId: '6',
    creatorName: '抗衰达人张医生',
    creatorAvatar: 'https://picsum.photos/id/64/200/200',
    period: '2026年6月上半月',
    periodStart: '2026-06-01',
    periodEnd: '2026-06-15',
    customerCount: 52,
    firstTimeCount: 18,
    repeatCount: 6,
    dealCount: 24,
    totalAmount: 186000,
    commission: 55800,
    commissionRule: '阶梯奖励',
    status: 'pending',
    submitDate: '2026-06-16',
    isHighCommission: true,
    store: '朝阳门店',
    deals: [
      {
        id: 'd3',
        projectName: '线雕提升',
        projectCategory: 'anti_aging',
        price: 15800,
        commission: 3160,
        isHighCommission: true,
        customer: {
          id: 'c3',
          nameMasked: '张**',
          phoneMasked: '136****8899',
          isFirstTime: true,
          consultDate: '2026-06-01',
          dealDate: '2026-06-04',
        },
      },
    ],
  },
  {
    id: 'set3',
    creatorId: '2',
    creatorName: '护肤达人小雨',
    creatorAvatar: 'https://picsum.photos/id/91/200/200',
    period: '2026年6月上半月',
    periodStart: '2026-06-01',
    periodEnd: '2026-06-15',
    customerCount: 38,
    firstTimeCount: 12,
    repeatCount: 4,
    dealCount: 16,
    totalAmount: 78000,
    commission: 23400,
    commissionRule: '按单提成 20%',
    status: 'pending',
    submitDate: '2026-06-16',
    isHighCommission: false,
    store: '朝阳门店',
    deals: [],
  },
  {
    id: 'set4',
    creatorId: '4',
    creatorName: '医美博主大V',
    creatorAvatar: 'https://picsum.photos/id/338/200/200',
    period: '2026年5月',
    periodStart: '2026-05-01',
    periodEnd: '2026-05-31',
    customerCount: 108,
    firstTimeCount: 35,
    repeatCount: 12,
    dealCount: 47,
    totalAmount: 256000,
    commission: 67620,
    commissionRule: '阶梯奖励',
    status: 'confirmed',
    submitDate: '2026-06-01',
    confirmDate: '2026-06-03',
    isHighCommission: true,
    store: '朝阳门店',
    deals: [],
  },
  {
    id: 'set5',
    creatorId: '3',
    creatorName: '脱毛专家莉莉',
    creatorAvatar: 'https://picsum.photos/id/1027/200/200',
    period: '2026年5月',
    periodStart: '2026-05-01',
    periodEnd: '2026-05-31',
    customerCount: 48,
    firstTimeCount: 16,
    repeatCount: 4,
    dealCount: 20,
    totalAmount: 48000,
    commission: 15360,
    commissionRule: '固定佣金 500元/单',
    status: 'paid',
    submitDate: '2026-06-01',
    confirmDate: '2026-06-02',
    paidDate: '2026-06-10',
    isHighCommission: false,
    store: '海淀分店',
    deals: [],
  },
  {
    id: 'set6',
    creatorId: '5',
    creatorName: '小白医美日记',
    creatorAvatar: 'https://picsum.photos/id/177/200/200',
    period: '2026年5月',
    periodStart: '2026-05-01',
    periodEnd: '2026-05-31',
    customerCount: 24,
    firstTimeCount: 8,
    repeatCount: 2,
    dealCount: 10,
    totalAmount: 22800,
    commission: 6840,
    commissionRule: '按单提成 18%',
    status: 'disputed',
    submitDate: '2026-06-01',
    isHighCommission: false,
    store: '海淀分店',
    deals: [],
  },
];

export const mockPendingSettlements: PendingSettlement[] = [
  {
    id: 'set1',
    creatorName: '美美说医美',
    creatorAvatar: 'https://picsum.photos/id/64/200/200',
    period: '2026年6月上半月',
    commission: 38400,
    dealCount: 20,
    deadline: '2026-06-25',
    isHighCommission: true,
  },
  {
    id: 'set2',
    creatorName: '抗衰达人张医生',
    creatorAvatar: 'https://picsum.photos/id/64/200/200',
    period: '2026年6月上半月',
    commission: 55800,
    dealCount: 24,
    deadline: '2026-06-25',
    isHighCommission: true,
  },
  {
    id: 'set3',
    creatorName: '护肤达人小雨',
    creatorAvatar: 'https://picsum.photos/id/91/200/200',
    period: '2026年6月上半月',
    commission: 23400,
    dealCount: 16,
    deadline: '2026-06-25',
    isHighCommission: false,
  },
];

export const generateSettlementDays = (year: number, month: number): SettlementDay[] => {
  const daysInMonth = dayjs(`${year}-${month}-01`).daysInMonth();
  const days: SettlementDay[] = [];
  const today = dayjs();

  for (let i = 1; i <= daysInMonth; i++) {
    const date = dayjs(`${year}-${month}-${i}`);
    const dateStr = date.format('YYYY-MM-DD');
    const isToday = date.isSame(today, 'day');
    const isPast = date.isBefore(today, 'day');

    let status: SettlementDay['status'] = 'future';
    if (isToday) status = 'today';
    else if (isPast) status = 'past';

    const hasSettlement = i % 5 === 0 || i === 15 || i === daysInMonth;
    const settlementCount = hasSettlement ? Math.floor(Math.random() * 3) + 1 : 0;
    const totalCommission = hasSettlement ? Math.floor(Math.random() * 50000) + 10000 : 0;

    days.push({
      date: dateStr,
      status,
      hasSettlement,
      settlementCount,
      totalCommission,
    });
  }

  return days;
};

export const getSettlementById = (id: string): Settlement | undefined => {
  return mockSettlements.find(s => s.id === id);
};

export const getPendingSettlements = (): PendingSettlement[] => {
  return mockPendingSettlements;
};
