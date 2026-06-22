import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Image, Textarea } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import classnames from 'classnames';
import Empty from '@/components/Empty';
import { useAppStore } from '@/store';
import type { Dispute, DisputeStatus } from '@/types/dispute';
import { formatMoney } from '@/utils/format';
import { getRelativeTime } from '@/utils/date';
import styles from './index.module.scss';

type TabType = 'all' | DisputeStatus;

const DisputesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnReason, setReturnReason] = useState('');
  const [selectedEvidence, setSelectedEvidence] = useState<string[]>([]);
  const [currentDisputeId, setCurrentDisputeId] = useState<string | null>(null);

  const disputes = useAppStore((state) => state.disputes);
  const returnDispute = useAppStore((state) => state.returnDispute);
  const resolveDispute = useAppStore((state) => state.resolveDispute);

  const tabs: { value: TabType; label: string }[] = [
    { value: 'all', label: '全部' },
    { value: 'pending', label: '待处理' },
    { value: 'returned', label: '已退回' },
    { value: 'resolved', label: '已解决' },
    { value: 'rejected', label: '已驳回' },
  ];

  const evidenceOptions = [
    '到店凭证',
    '消费小票',
    '聊天记录',
    '项目确认单',
    '其他材料',
  ];

  useDidShow(() => {
  });

  const filteredDisputes = useMemo(() => {
    if (activeTab === 'all') return disputes;
    return disputes.filter((d) => d.status === activeTab);
  }, [disputes, activeTab]);

  const pendingCount = disputes.filter((d) => d.status === 'pending').length;
  const returnedCount = disputes.filter((d) => d.status === 'returned').length;

  const handleReturn = (dispute: Dispute) => {
    setCurrentDisputeId(dispute.id);
    setReturnReason('');
    setSelectedEvidence([]);
    setShowReturnModal(true);
  };

  const handleConfirmReturn = () => {
    if (!returnReason.trim()) {
      Taro.showToast({ title: '请填写退回原因', icon: 'none' });
      return;
    }
    if (selectedEvidence.length === 0) {
      Taro.showToast({ title: '请选择需要补充的材料', icon: 'none' });
      return;
    }
    if (!currentDisputeId) return;

    Taro.showLoading({ title: '提交中...' });
    returnDispute(currentDisputeId, returnReason, selectedEvidence);
    setTimeout(() => {
      Taro.hideLoading();
      Taro.showToast({ title: '已退回市场人员', icon: 'success' });
      setShowReturnModal(false);
      setCurrentDisputeId(null);
    }, 500);
  };

  const handleResolve = (dispute: Dispute) => {
    Taro.showModal({
      title: '确认解决',
      content: '确定该争议已解决吗？',
      success: (res) => {
        if (res.confirm) {
          Taro.showLoading({ title: '处理中...' });
          resolveDispute(dispute.id);
          setTimeout(() => {
            Taro.hideLoading();
            Taro.showToast({ title: '已标记为解决', icon: 'success' });
          }, 500);
        }
      },
    });
  };

  const toggleEvidence = (item: string) => {
    setSelectedEvidence((prev) =>
      prev.includes(item) ? prev.filter((e) => e !== item) : [...prev, item]
    );
  };

  const parseRequiredEvidence = (remark?: string): string[] => {
    if (!remark || !remark.startsWith('需补充材料：')) return [];
    return remark.replace('需补充材料：', '').split('、');
  };

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.tabBar}>
        {tabs.map((tab) => (
          <View
            key={tab.value}
            className={classnames(styles.tabItem, activeTab === tab.value && styles.active)}
            onClick={() => setActiveTab(tab.value)}
          >
            <Text>{tab.label}</Text>
            {tab.value === 'pending' && pendingCount > 0 && (
              <View className={styles.badge}>{pendingCount}</View>
            )}
            {tab.value === 'returned' && returnedCount > 0 && (
              <View className={styles.badge}>{returnedCount}</View>
            )}
          </View>
        ))}
      </View>

      <View className={styles.content}>
        {filteredDisputes.length > 0 ? (
          filteredDisputes.map((dispute) => (
            <View key={dispute.id} className={styles.disputeCard}>
              <View className={styles.header}>
                <Image className={styles.avatar} src={dispute.creatorAvatar} mode="aspectFill" />
                <View className={styles.info}>
                  <View className={styles.nameRow}>
                    <Text className={styles.name}>{dispute.creatorName}</Text>
                  </View>
                  <Text className={styles.meta}>
                    {getRelativeTime(dispute.raiseDate)} · {dispute.raiseBy}提出
                  </Text>
                </View>
                <View className={classnames(styles.statusBadge, styles[dispute.status])}>
                  {dispute.statusLabel}
                </View>
              </View>

              <View className={styles.typeTag}>
                {dispute.typeLabel}
                {dispute.projectName && ` · ${dispute.projectName}`}
              </View>

              <Text className={styles.description}>{dispute.description}</Text>

              {dispute.status === 'returned' && parseRequiredEvidence(dispute.remark).length > 0 && (
                <View className={styles.returnInfo}>
                  <View className={styles.returnInfoHeader}>
                    <Text className={styles.returnInfoIcon}>📌</Text>
                    <Text className={styles.returnInfoTitle}>已退回补充材料</Text>
                    {dispute.returnDate && (
                      <Text className={styles.returnDate}>{dispute.returnDate}</Text>
                    )}
                  </View>
                  <View className={styles.requiredList}>
                    <Text className={styles.requiredLabel}>需要补充：</Text>
                    {parseRequiredEvidence(dispute.remark).map((item, idx) => (
                      <Text key={idx} className={styles.requiredItem}>
                        • {item}
                      </Text>
                    ))}
                  </View>
                </View>
              )}

              {dispute.evidence.length > 0 && (
                <View className={styles.evidenceSection}>
                  <Text className={styles.evidenceTitle}>凭证材料 ({dispute.evidence.length})</Text>
                  <ScrollView className={styles.evidenceList} scrollX>
                    {dispute.evidence.map((ev) => (
                      <View key={ev.id} className={styles.evidenceItem}>
                        <Image
                          className={styles.evidenceImg}
                          src={ev.url}
                          mode="aspectFill"
                        />
                        <Text className={styles.evidenceName}>{ev.remark || '凭证'}</Text>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              )}

              <View className={styles.amountRow}>
                <View className={styles.amountInfo}>
                  <Text className={styles.label}>争议金额</Text>
                  <Text className={styles.amount}>{formatMoney(dispute.disputedAmount)}</Text>
                </View>
                <View className={styles.handler}>
                  <Text className={styles.label}>当前处理人</Text>
                  <Text className={styles.name}>{dispute.currentHandler}</Text>
                </View>
              </View>

              {dispute.status === 'pending' && (
                <View className={styles.footer}>
                  <View className={styles.btnReturn} onClick={() => handleReturn(dispute)}>
                    退回补充
                  </View>
                  <View className={styles.btnResolve} onClick={() => handleResolve(dispute)}>
                    标记解决
                  </View>
                </View>
              )}

              {dispute.status === 'returned' && (
                <View className={styles.footer}>
                  <View className={styles.btnEvidence}>等待补充材料</View>
                  <View className={styles.btnResolve} onClick={() => handleResolve(dispute)}>
                    标记解决
                  </View>
                </View>
              )}
            </View>
          ))
        ) : (
          <Empty
            icon="⚖️"
            title="暂无争议记录"
            description={activeTab === 'all' ? '目前没有争议需要处理' : '该状态下暂无争议'}
          />
        )}
      </View>

      {showReturnModal && (
        <View className={styles.returnModal} onClick={() => setShowReturnModal(false)}>
          <View className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <View className={styles.modalHeader}>
              <Text className={styles.modalTitle}>退回补充材料</Text>
              <Text className={styles.closeBtn} onClick={() => setShowReturnModal(false)}>
                ✕
              </Text>
            </View>

            <View className={styles.formGroup}>
              <Text className={styles.label}>
                退回原因 <Text className={styles.required}>*</Text>
              </Text>
              <Textarea
                className={styles.textarea}
                placeholder="请详细说明需要补充的内容..."
                value={returnReason}
                onInput={(e) => setReturnReason(e.detail.value)}
                maxlength={200}
              />
            </View>

            <View className={styles.formGroup}>
              <Text className={styles.label}>
                需要补充的材料 <Text className={styles.required}>*</Text>
              </Text>
              <View className={styles.checkboxGroup}>
                {evidenceOptions.map((item) => (
                  <View
                    key={item}
                    className={classnames(
                      styles.checkboxItem,
                      selectedEvidence.includes(item) && styles.active
                    )}
                    onClick={() => toggleEvidence(item)}
                  >
                    {selectedEvidence.includes(item) ? '✓ ' : ''}
                    {item}
                  </View>
                ))}
              </View>
            </View>

            <View className={styles.modalFooter}>
              <View className={styles.btnCancel} onClick={() => setShowReturnModal(false)}>
                取消
              </View>
              <View className={styles.btnConfirm} onClick={handleConfirmReturn}>
                确认退回
              </View>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default DisputesPage;
