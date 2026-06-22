import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Image, Textarea } from '@tarojs/components';
import Taro, { useRouter, useDidShow } from '@tarojs/taro';
import classnames from 'classnames';
import Empty from '@/components/Empty';
import { useAppStore } from '@/store';
import type { Settlement } from '@/types/settlement';
import {
  formatMoney,
  getProjectCategoryLabel,
} from '@/utils/format';
import { formatDate } from '@/utils/date';
import styles from './index.module.scss';

const SettlementDetailPage: React.FC = () => {
  const router = useRouter();
  const settlements = useAppStore((state) => state.settlements);
  const confirmSettlement = useAppStore((state) => state.confirmSettlement);
  const returnSettlementToDispute = useAppStore((state) => state.returnSettlementToDispute);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectEvidence, setRejectEvidence] = useState<string[]>([]);

  const settlementId = router.params.id || 'set1';

  const evidenceOptions = [
    '到店凭证',
    '消费小票',
    '聊天记录',
    '项目确认单',
    '其他材料',
  ];

  const settlement = useMemo(
    () => settlements.find((s) => s.id === settlementId),
    [settlements, settlementId]
  );

  useDidShow(() => {
  });

  const statusLabels: Record<string, string> = {
    pending: '待确认',
    confirmed: '已确认',
    paid: '已付款',
    disputed: '有争议',
  };

  const handleConfirm = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = () => {
    Taro.showLoading({ title: '确认中...' });
    confirmSettlement(settlementId);
    setTimeout(() => {
      Taro.hideLoading();
      setShowConfirmModal(false);
      Taro.showModal({
        title: '确认成功',
        content: '该结算单已确认，等待财务付款',
        showCancel: false,
        success: () => {
          Taro.navigateBack();
        },
      });
    }, 500);
  };

  const handleReject = () => {
    setRejectReason('');
    setRejectEvidence([]);
    setShowRejectModal(true);
  };

  const toggleEvidence = (item: string) => {
    setRejectEvidence((prev) =>
      prev.includes(item) ? prev.filter((e) => e !== item) : [...prev, item]
    );
  };

  const handleRejectSubmit = () => {
    if (!rejectReason.trim()) {
      Taro.showToast({ title: '请填写退回原因', icon: 'none' });
      return;
    }
    if (rejectEvidence.length === 0) {
      Taro.showToast({ title: '请选择需要补充的材料', icon: 'none' });
      return;
    }
    Taro.showLoading({ title: '处理中...' });
    returnSettlementToDispute(settlementId, rejectReason, rejectEvidence);
    setTimeout(() => {
      Taro.hideLoading();
      setShowRejectModal(false);
      Taro.showModal({
        title: '已退回',
        content: '该结算单已退回给市场人员处理',
        showCancel: false,
        success: () => {
          Taro.navigateBack();
        },
      });
    }, 500);
  };

  if (!settlement) {
    return (
      <View className={styles.page}>
        <Empty
          icon="📋"
          title="结算单不存在"
          description="未找到该结算单的信息"
        />
      </View>
    );
  }

  const canEdit = settlement.status === 'pending';

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header}>
        <View className={styles.creatorInfo}>
          <Image
            className={styles.avatar}
            src={settlement.creatorAvatar}
            mode="aspectFill"
          />
          <View className={styles.info}>
            <Text className={styles.name}>{settlement.creatorName}</Text>
            <Text className={styles.period}>
              {settlement.period} · {settlement.store}
            </Text>
          </View>
          <View className={classnames(styles.statusBadge, styles[settlement.status])}>
            {statusLabels[settlement.status]}
          </View>
        </View>

        {settlement.isHighCommission && (
          <View className={styles.highCommissionAlert}>
            <Text className={styles.alertIcon}>⚠️</Text>
            <Text className={styles.alertText}>高额佣金提醒，请仔细核对成交明细</Text>
          </View>
        )}

        <View className={styles.amountSection}>
          <View>
            <Text className={styles.amountLabel}>应付佣金</Text>
            <Text className={styles.amountValue}>{formatMoney(settlement.commission)}</Text>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.sectionIcon}>📊</Text>
          结算概览
        </Text>
        <View className={styles.statsGrid}>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{settlement.customerCount}</Text>
            <Text className={styles.statLabel}>到院人数</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{settlement.dealCount}</Text>
            <Text className={styles.statLabel}>成交单数</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{formatMoney(settlement.totalAmount)}</Text>
            <Text className={styles.statLabel}>总成交额</Text>
          </View>
        </View>

        <View className={styles.customerStats}>
          <View className={styles.customerItem}>
            <Text className={styles.customerValue}>{settlement.firstTimeCount}</Text>
            <Text className={styles.customerLabel}>首单顾客</Text>
          </View>
          <View className={styles.customerItem}>
            <Text className={styles.customerValue}>{settlement.repeatCount}</Text>
            <Text className={styles.customerLabel}>复购顾客</Text>
          </View>
          <View className={styles.customerItem}>
            <Text className={styles.customerValue}>
              {settlement.customerCount > 0
                ? ((settlement.dealCount / settlement.customerCount) * 100).toFixed(0)
                : 0}%
            </Text>
            <Text className={styles.customerLabel}>转化率</Text>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.sectionIcon}>📝</Text>
          基本信息
        </Text>
        <View className={styles.infoList}>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>结算周期</Text>
            <Text className={styles.infoValue}>
              {formatDate(settlement.periodStart)} 至 {formatDate(settlement.periodEnd)}
            </Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>佣金规则</Text>
            <Text className={styles.infoValue}>{settlement.commissionRule}</Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>提交时间</Text>
            <Text className={styles.infoValue}>{formatDate(settlement.submitDate)}</Text>
          </View>
          {settlement.confirmDate && (
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>确认时间</Text>
              <Text className={styles.infoValue}>{formatDate(settlement.confirmDate)}</Text>
            </View>
          )}
          {settlement.paidDate && (
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>付款时间</Text>
              <Text className={styles.infoValue}>{formatDate(settlement.paidDate)}</Text>
            </View>
          )}
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.sectionIcon}>💼</Text>
          成交明细
          {settlement.isHighCommission && (
            <Text style={{ fontSize: '22rpx', color: '#EF4444', marginLeft: '8rpx' }}>
              （含顾客脱敏信息）
            </Text>
          )}
        </Text>

        {settlement.deals.length > 0 ? (
          <View className={styles.dealList}>
            {settlement.deals.map((deal) => (
              <View key={deal.id} className={styles.dealCard}>
                <View className={styles.dealHeader}>
                  <View className={styles.projectInfo}>
                    <Text className={styles.projectName}>
                      <Text
                        className={classnames(styles.categoryTag, styles[deal.projectCategory])}
                      >
                        {getProjectCategoryLabel(deal.projectCategory)}
                      </Text>
                      {deal.projectName}
                      {deal.isHighCommission && (
                        <Text className={styles.highCommissionTag}>高额</Text>
                      )}
                    </Text>
                  </View>
                  <View className={styles.projectAmount}>
                    <Text className={styles.price}>{formatMoney(deal.price)}</Text>
                    <Text className={styles.commission}>佣金 {formatMoney(deal.commission)}</Text>
                  </View>
                </View>

                <View className={styles.customerInfo}>
                  <Text className={styles.customerDetail}>
                    {deal.customer.nameMasked} · {deal.customer.phoneMasked}
                    <Text
                      className={classnames(
                        styles.customerTag,
                        deal.customer.isFirstTime ? styles.first : styles.repeat
                      )}
                    >
                      {deal.customer.isFirstTime ? '首单' : '复购'}
                    </Text>
                  </Text>
                  <Text className={styles.dates}>
                    咨询 {formatDate(deal.customer.consultDate)}
                    {'\n'}
                    成交 {formatDate(deal.customer.dealDate)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View className={styles.emptyDeals}>暂无成交明细记录</View>
        )}
      </View>

      {settlement.remark && (
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>💬</Text>
            备注
          </Text>
          <View className={styles.remark}>{settlement.remark}</View>
        </View>
      )}

      {canEdit && (
        <View className={styles.actionBar}>
          <View className={styles.btnReject} onClick={handleReject}>
            退回争议
          </View>
          <View className={styles.btnConfirm} onClick={handleConfirm}>
            确认结算
          </View>
        </View>
      )}

      {showConfirmModal && (
        <View className={styles.modal} onClick={() => setShowConfirmModal(false)}>
          <View className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <Text className={styles.modalTitle}>确认结算</Text>
            <Text className={styles.modalText}>
              确认后将提交财务安排付款
              {'\n'}
              应付佣金：{formatMoney(settlement.commission)}
            </Text>
            <View className={styles.modalButtons}>
              <View
                className={styles.modalBtnCancel}
                onClick={() => setShowConfirmModal(false)}
              >
                取消
              </View>
              <View className={styles.modalBtnConfirm} onClick={handleConfirmSubmit}>
                确认
              </View>
            </View>
          </View>
        </View>
      )}

      {showRejectModal && (
        <View
          className={styles.returnModal}
          onClick={() => setShowRejectModal(false)}
        >
          <View className={styles.returnModalContent} onClick={(e) => e.stopPropagation()}>
            <View className={styles.returnModalHeader}>
              <Text className={styles.returnModalTitle}>退回补充材料</Text>
              <Text className={styles.closeBtn} onClick={() => setShowRejectModal(false)}>
                ✕
              </Text>
            </View>

            <View className={styles.returnFormGroup}>
              <Text className={styles.returnLabel}>
                退回原因 <Text className={styles.required}>*</Text>
              </Text>
              <Textarea
                className={styles.returnTextarea}
                placeholder="请详细说明需要补充的内容..."
                value={rejectReason}
                onInput={(e) => setRejectReason(e.detail.value)}
                maxlength={200}
              />
            </View>

            <View className={styles.returnFormGroup}>
              <Text className={styles.returnLabel}>
                需要补充的材料 <Text className={styles.required}>*</Text>
              </Text>
              <View className={styles.returnCheckboxGroup}>
                {evidenceOptions.map((item) => (
                  <View
                    key={item}
                    className={classnames(
                      styles.returnCheckboxItem,
                      rejectEvidence.includes(item) && styles.active
                    )}
                    onClick={() => toggleEvidence(item)}
                  >
                    {rejectEvidence.includes(item) ? '✓ ' : ''}
                    {item}
                  </View>
                ))}
              </View>
            </View>

            <View className={styles.returnModalFooter}>
              <View
                className={styles.returnBtnCancel}
                onClick={() => setShowRejectModal(false)}
              >
                取消
              </View>
              <View className={styles.returnBtnConfirm} onClick={handleRejectSubmit}>
                确认退回
              </View>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default SettlementDetailPage;
