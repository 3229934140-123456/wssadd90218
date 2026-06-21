import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import Empty from '@/components/Empty';
import { mockPayments, getPayments, getPaymentSummary } from '@/data/payments';
import type { Payment, PaymentSummary } from '@/types/payment';
import { formatMoney, getPayMethodLabel } from '@/utils/format';
import styles from './index.module.scss';

type FilterType = 'all' | 'success' | 'processing' | 'failed';

const PaymentsPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [payments, setPayments] = useState<Payment[]>([]);
  const [summary, setSummary] = useState<PaymentSummary | null>(null);

  const filters: { value: FilterType; label: string }[] = [
    { value: 'all', label: '全部' },
    { value: 'success', label: '付款成功' },
    { value: 'processing', label: '处理中' },
    { value: 'failed', label: '付款失败' },
  ];

  const payMethodIcons: Record<string, string> = {
    bank: '🏦',
    alipay: '💙',
    wechat: '💚',
  };

  const statusLabels: Record<string, string> = {
    success: '付款成功',
    processing: '处理中',
    failed: '付款失败',
  };

  useEffect(() => {
    loadData();
  }, [activeFilter]);

  const loadData = () => {
    const allPayments = getPayments();
    const filtered = activeFilter === 'all'
      ? allPayments
      : allPayments.filter(p => p.status === activeFilter);
    setPayments(filtered);
    setSummary(getPaymentSummary());
  };

  const handleViewDetail = (payment: Payment) => {
    Taro.showModal({
      title: '付款详情',
      content: `
达人：${payment.creatorName}
金额：${formatMoney(payment.amount)}
付款时间：${payment.payDate} ${payment.payTime}
收款账户：${payment.receiverAccount}
收款人：${payment.receiverName}
付款方式：${getPayMethodLabel(payment.payMethod)}
操作员：${payment.operator}
备注：${payment.remark || '无'}
      `.trim(),
      showCancel: false,
    });
  };

  const successCount = mockPayments.filter(p => p.status === 'success').length;
  const processingCount = mockPayments.filter(p => p.status === 'processing').length;
  const failedCount = mockPayments.filter(p => p.status === 'failed').length;

  return (
    <ScrollView
      className={styles.page}
      scrollY
    >
      <View className={styles.header}>
        <Text className={styles.headerTitle}>付款概览</Text>
        {summary && (
          <View className={styles.statsGrid}>
            <View className={styles.statItem}>
              <Text className={styles.statLabel}>累计已付</Text>
              <Text className={styles.statValue}>{formatMoney(summary.totalPaid)}</Text>
              <Text className={styles.statSub}>共{summary.count}笔</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.statLabel}>待付款</Text>
              <Text className={styles.statValue}>{formatMoney(summary.totalPending)}</Text>
              <Text className={styles.statSub}>等待结算确认</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.statLabel}>本月已付</Text>
              <Text className={styles.statValue}>{formatMoney(summary.monthPaid)}</Text>
              <Text className={styles.statSub}>6月付款</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.statLabel}>付款笔数</Text>
              <Text className={styles.statValue}>{summary.count}</Text>
              <Text className={styles.statSub}>历史总笔数</Text>
            </View>
          </View>
        )}
      </View>

      <View className={styles.filterBar}>
        {filters.map(filter => (
          <View
            key={filter.value}
            className={classnames(styles.filterItem, activeFilter === filter.value && styles.active)}
            onClick={() => setActiveFilter(filter.value)}
          >
            <Text>{filter.label}</Text>
            {filter.value === 'success' && successCount > 0 && (
              <Text style={{ marginLeft: '8rpx', fontSize: '20rpx' }}>({successCount})</Text>
            )}
            {filter.value === 'processing' && processingCount > 0 && (
              <Text style={{ marginLeft: '8rpx', fontSize: '20rpx' }}>({processingCount})</Text>
            )}
            {filter.value === 'failed' && failedCount > 0 && (
              <Text style={{ marginLeft: '8rpx', fontSize: '20rpx' }}>({failedCount})</Text>
            )}
          </View>
        ))}
      </View>

      <View className={styles.list}>
        {payments.length > 0 ? (
          payments.map(payment => (
            <View
              key={payment.id}
              className={styles.paymentCard}
              onClick={() => handleViewDetail(payment)}
            >
              <View className={styles.cardHeader}>
                <Image
                  className={styles.avatar}
                  src={payment.creatorAvatar}
                  mode="aspectFill"
                />
                <View className={styles.creatorInfo}>
                  <Text className={styles.creatorName}>{payment.creatorName}</Text>
                  <Text className={styles.period}>{payment.period}佣金</Text>
                </View>
                <View className={classnames(styles.statusBadge, styles[payment.status])}>
                  {statusLabels[payment.status]}
                </View>
              </View>

              <View className={styles.amountRow}>
                <Text className={styles.amountLabel}>付款金额</Text>
                <Text className={styles.amount}>{formatMoney(payment.amount)}</Text>
              </View>

              <View className={styles.detailsGrid}>
                <View className={styles.detailItem}>
                  <Text className={styles.detailLabel}>收款账户</Text>
                  <Text className={styles.detailValue}>{payment.receiverAccount}</Text>
                </View>
                <View className={styles.detailItem}>
                  <Text className={styles.detailLabel}>收款人</Text>
                  <Text className={styles.detailValue}>{payment.receiverName}</Text>
                </View>
                <View className={styles.detailItem}>
                  <Text className={styles.detailLabel}>付款方式</Text>
                  <Text className={styles.detailValue}>
                    <Text className={styles.payMethodIcon}>{payMethodIcons[payment.payMethod]}</Text>
                    {getPayMethodLabel(payment.payMethod)}
                  </Text>
                </View>
                <View className={styles.detailItem}>
                  <Text className={styles.detailLabel}>结算单号</Text>
                  <Text className={styles.detailValue}>{payment.settlementId}</Text>
                </View>
              </View>

              {payment.remark && (
                <View className={styles.remark}>
                  💬 {payment.remark}
                </View>
              )}

              <View className={styles.footer}>
                <Text className={styles.payTime}>
                  🕐 {payment.payDate} {payment.payTime}
                </Text>
                <Text className={styles.operator}>操作员：{payment.operator}</Text>
              </View>
            </View>
          ))
        ) : (
          <View className={styles.empty}>
            <Empty
              icon="💰"
              title="暂无付款记录"
              description={activeFilter === 'all' ? '还没有付款记录' : '该筛选条件下暂无记录'}
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default PaymentsPage;
