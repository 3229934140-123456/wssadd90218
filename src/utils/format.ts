export const formatMoney = (amount: number, showSymbol = true): string => {
  const formatted = amount.toLocaleString('zh-CN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return showSymbol ? `¥${formatted}` : formatted;
};

export const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
};

export const formatPercent = (value: number): string => {
  return (value * 100).toFixed(1) + '%';
};

export const formatROI = (roi: number): string => {
  return `1:${roi.toFixed(1)}`;
};

export const maskName = (name: string): string => {
  if (!name) return '';
  if (name.length <= 1) return name;
  return name.charAt(0) + '*'.repeat(name.length - 1);
};

export const maskPhone = (phone: string): string => {
  if (!phone || phone.length < 11) return phone;
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
};

export const getROIColor = (roi: number): string => {
  if (roi >= 3) return '#10B981';
  if (roi >= 1.5) return '#F59E0B';
  return '#EF4444';
};

export const getROIType = (roi: number): 'high' | 'medium' | 'low' => {
  if (roi >= 3) return 'high';
  if (roi >= 1.5) return 'medium';
  return 'low';
};

export const getROILabel = (roi: number): string => {
  if (roi >= 3) return '高投产';
  if (roi >= 1.5) return '中投产';
  return '低投产';
};

export const getCommissionTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    fixed: '固定佣金',
    per_order: '按单提成',
    tiered: '阶梯奖励',
  };
  return labels[type] || type;
};

export const getProjectCategoryLabel = (category: string): string => {
  const labels: Record<string, string> = {
    skincare: '水光',
    hair_removal: '脱毛',
    anti_aging: '抗衰',
  };
  return labels[category] || category;
};

export const getDisputeTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    customer: '顾客异议',
    amount: '金额争议',
    project: '项目不符',
    other: '其他问题',
  };
  return labels[type] || type;
};

export const getDisputeStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    pending: '待处理',
    returned: '已退回',
    resolved: '已解决',
    rejected: '已驳回',
  };
  return labels[status] || status;
};

export const getPayMethodLabel = (method: string): string => {
  const labels: Record<string, string> = {
    bank: '银行转账',
    alipay: '支付宝',
    wechat: '微信支付',
  };
  return labels[method] || method;
};
