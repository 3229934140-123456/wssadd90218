import type { Dispute } from '@/types/dispute';

export const mockDisputes: Dispute[] = [
  {
    id: 'disp1',
    settlementId: 'set6',
    creatorId: '5',
    creatorName: '小白医美日记',
    creatorAvatar: 'https://picsum.photos/id/177/200/200',
    type: 'customer',
    typeLabel: '顾客异议',
    description: '顾客张**表示未到店消费，但系统记录为已成交，需要核实预约记录和到店凭证',
    status: 'pending',
    statusLabel: '待处理',
    raiseDate: '2026-06-18 10:30:00',
    raiseBy: '李审核',
    currentHandler: '市场部-小王',
    dealItemId: 'd5',
    projectName: '光子嫩肤',
    disputedAmount: 464,
    evidence: [
      {
        id: 'e1',
        type: 'screenshot',
        url: 'https://picsum.photos/id/1/750/500',
        uploadDate: '2026-06-18 10:32:00',
        uploader: '李审核',
        remark: '顾客异议聊天记录',
      },
    ],
  },
  {
    id: 'disp2',
    settlementId: 'set4',
    creatorId: '4',
    creatorName: '医美博主大V',
    creatorAvatar: 'https://picsum.photos/id/338/200/200',
    type: 'amount',
    typeLabel: '金额争议',
    description: '佣金计算有误，按阶梯规则应按22%计算而非18%，涉及金额差额约8000元',
    status: 'returned',
    statusLabel: '已退回',
    raiseDate: '2026-06-15 14:20:00',
    raiseBy: '王审核',
    returnDate: '2026-06-16 09:15:00',
    currentHandler: '市场部-小李',
    disputedAmount: 8000,
    evidence: [
      {
        id: 'e2',
        type: 'document',
        url: 'https://picsum.photos/id/2/750/500',
        uploadDate: '2026-06-15 14:25:00',
        uploader: '王审核',
        remark: '佣金计算表',
      },
    ],
  },
  {
    id: 'disp3',
    settlementId: 'set_s7',
    creatorId: '6',
    creatorName: '抗衰达人张医生',
    creatorAvatar: 'https://picsum.photos/id/64/200/200',
    type: 'project',
    typeLabel: '项目不符',
    description: '成交项目"线雕提升"不在合作项目列表中，需要确认是否新增合作',
    status: 'resolved',
    statusLabel: '已解决',
    raiseDate: '2026-06-10 11:00:00',
    raiseBy: '张审核',
    resolveDate: '2026-06-12 16:30:00',
    currentHandler: '已完成',
    projectName: '线雕提升',
    disputedAmount: 2844,
    evidence: [
      {
        id: 'e3',
        type: 'screenshot',
        url: 'https://picsum.photos/id/3/750/500',
        uploadDate: '2026-06-10 11:05:00',
        uploader: '张审核',
        remark: '合作项目协议截图',
      },
      {
        id: 'e4',
        type: 'document',
        url: 'https://picsum.photos/id/119/750/500',
        uploadDate: '2026-06-12 10:00:00',
        uploader: '市场部-小王',
        remark: '补充合作协议',
      },
    ],
  },
  {
    id: 'disp4',
    settlementId: 'set_s4',
    creatorId: '3',
    creatorName: '脱毛专家莉莉',
    creatorAvatar: 'https://picsum.photos/id/1027/200/200',
    type: 'customer',
    typeLabel: '顾客异议',
    description: '顾客为复购客户，按规则佣金应减半，但目前按全额计算',
    status: 'rejected',
    statusLabel: '已驳回',
    raiseDate: '2026-06-08 15:40:00',
    raiseBy: '李审核',
    resolveDate: '2026-06-09 11:20:00',
    currentHandler: '已完成',
    disputedAmount: 250,
    evidence: [
      {
        id: 'e5',
        type: 'screenshot',
        url: 'https://picsum.photos/id/160/750/500',
        uploadDate: '2026-06-08 15:45:00',
        uploader: '李审核',
        remark: '顾客历史消费记录',
      },
    ],
    remark: '经核实，该顾客为首单客户，异议不成立',
  },
  {
    id: 'disp5',
    settlementId: 'set_s6',
    creatorId: '5',
    creatorName: '小白医美日记',
    creatorAvatar: 'https://picsum.photos/id/177/200/200',
    type: 'amount',
    typeLabel: '金额争议',
    description: '某订单实际成交价与系统记录不符，需要核对POS机小票',
    status: 'pending',
    statusLabel: '待处理',
    raiseDate: '2026-06-19 09:30:00',
    raiseBy: '张审核',
    currentHandler: '市场部-小王',
    projectName: '水光针',
    disputedAmount: 200,
    evidence: [],
  },
];

export const getDisputes = (status?: string): Dispute[] => {
  if (status && status !== 'all') {
    return mockDisputes.filter(d => d.status === status);
  }
  return mockDisputes;
};

export const getDisputeById = (id: string): Dispute | undefined => {
  return mockDisputes.find(d => d.id === id);
};

export const getPendingDisputeCount = (): number => {
  return mockDisputes.filter(d => d.status === 'pending').length;
};
