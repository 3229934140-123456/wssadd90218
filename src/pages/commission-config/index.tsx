import React, { useState, useEffect } from 'react';
import { View, Text, Input, Image } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import { getCreatorById } from '@/data/creators';
import type { Creator, CommissionType, CommissionRule } from '@/types/creator';
import { formatMoney, getCommissionTypeLabel } from '@/utils/format';
import styles from './index.module.scss';

interface Tier {
  id: string;
  threshold: string;
  percentage: string;
}

const CommissionConfigPage: React.FC = () => {
  const router = useRouter();
  const [creator, setCreator] = useState<Creator | null>(null);
  const [ruleType, setRuleType] = useState<CommissionType>('fixed');
  const [fixedAmount, setFixedAmount] = useState('');
  const [percentage, setPercentage] = useState('');
  const [tiers, setTiers] = useState<Tier[]>([
    { id: '1', threshold: '100000', percentage: '15' },
    { id: '2', threshold: '200000', percentage: '20' },
  ]);

  const creatorId = router.params.id || '1';

  const ruleTypes: { value: CommissionType; label: string; icon: string; desc: string }[] = [
    { value: 'fixed', label: '固定佣金', icon: '💵', desc: '每单固定金额' },
    { value: 'per_order', label: '按单提成', icon: '📊', desc: '按成交额比例' },
    { value: 'tiered', label: '阶梯奖励', icon: '📈', desc: '超额累进提成' },
  ];

  useEffect(() => {
    loadData();
  }, [creatorId]);

  const loadData = () => {
    const data = getCreatorById(creatorId);
    if (data) {
      setCreator(data);
      setRuleType(data.commissionRule.type);
      if (data.commissionRule.type === 'fixed') {
        setFixedAmount(String(data.commissionRule.fixedAmount || ''));
      } else if (data.commissionRule.type === 'per_order') {
        setPercentage(String(((data.commissionRule.percentage || 0) * 100)));
      } else if (data.commissionRule.type === 'tiered' && data.commissionRule.tiers) {
        setTiers(
          data.commissionRule.tiers.map((tier, index) => ({
            id: String(index + 1),
            threshold: String(tier.threshold),
            percentage: String(tier.percentage * 100),
          }))
        );
      }
    }
  };

  const getCurrentRuleDisplay = () => {
    if (!creator) return '';
    const rule = creator.commissionRule;
    switch (rule.type) {
      case 'fixed':
        return `固定佣金 ${formatMoney(rule.fixedAmount || 0)}/单`;
      case 'per_order':
        return `按单提成 ${((rule.percentage || 0) * 100).toFixed(0)}%`;
      case 'tiered':
        return `阶梯奖励（${rule.tiers?.length || 0}档）`;
      default:
        return '';
    }
  };

  const handleAddTier = () => {
    const newId = String(tiers.length + 1);
    setTiers([...tiers, { id: newId, threshold: '', percentage: '' }]);
  };

  const handleDeleteTier = (id: string) => {
    if (tiers.length <= 1) {
      Taro.showToast({ title: '至少保留1档', icon: 'none' });
      return;
    }
    setTiers(tiers.filter(t => t.id !== id));
  };

  const handleTierChange = (id: string, field: 'threshold' | 'percentage', value: string) => {
    setTiers(tiers.map(t => (t.id === id ? { ...t, [field]: value } : t)));
  };

  const handleSave = () => {
    let newRule: CommissionRule;

    switch (ruleType) {
      case 'fixed':
        if (!fixedAmount || Number(fixedAmount) <= 0) {
          Taro.showToast({ title: '请输入有效的佣金金额', icon: 'none' });
          return;
        }
        newRule = {
          type: 'fixed',
          fixedAmount: Number(fixedAmount),
        };
        break;

      case 'per_order':
        if (!percentage || Number(percentage) <= 0 || Number(percentage) > 100) {
          Taro.showToast({ title: '请输入有效的提成比例', icon: 'none' });
          return;
        }
        newRule = {
          type: 'per_order',
          percentage: Number(percentage) / 100,
        };
        break;

      case 'tiered':
        const validTiers = tiers.filter(t => t.threshold && t.percentage);
        if (validTiers.length === 0) {
          Taro.showToast({ title: '请填写有效的阶梯配置', icon: 'none' });
          return;
        }
        const sortedTiers = [...validTiers]
          .sort((a, b) => Number(a.threshold) - Number(b.threshold))
          .map(t => ({
            threshold: Number(t.threshold),
            percentage: Number(t.percentage) / 100,
          }));
        newRule = {
          type: 'tiered',
          tiers: sortedTiers,
        };
        break;

      default:
        return;
    }

    Taro.showLoading({ title: '保存中...' });
    setTimeout(() => {
      Taro.hideLoading();
      Taro.showModal({
        title: '保存成功',
        content: `已将佣金规则更新为：${getCommissionTypeLabel(newRule.type)}`,
        showCancel: false,
        success: () => {
          Taro.navigateBack();
        },
      });
    }, 1000);
  };

  const handleCancel = () => {
    Taro.navigateBack();
  };

  const calculateCommission = (amount: number): number => {
    switch (ruleType) {
      case 'fixed':
        return Number(fixedAmount) || 0;
      case 'per_order':
        return amount * ((Number(percentage) || 0) / 100);
      case 'tiered':
        const sortedTiers = [...tiers]
          .filter(t => t.threshold && t.percentage)
          .sort((a, b) => Number(a.threshold) - Number(b.threshold));
        let commission = 0;
        let prevThreshold = 0;
        for (const tier of sortedTiers) {
          const threshold = Number(tier.threshold);
          const pct = Number(tier.percentage) / 100;
          if (amount > threshold) {
            commission += (threshold - prevThreshold) * pct;
            prevThreshold = threshold;
          } else {
            commission += (amount - prevThreshold) * pct;
            return commission;
          }
        }
        if (amount > prevThreshold && sortedTiers.length > 0) {
          const lastTier = sortedTiers[sortedTiers.length - 1];
          commission += (amount - prevThreshold) * (Number(lastTier.percentage) / 100);
        }
        return commission;
      default:
        return 0;
    }
  };

  const exampleAmounts = [50000, 150000, 250000, 500000];

  return (
    <View className={styles.page}>
      {creator && (
        <View className={styles.creatorInfo}>
          <Image className={styles.avatar} src={creator.avatar} mode="aspectFill" />
          <View className={styles.info}>
            <Text className={styles.name}>{creator.name}</Text>
            <Text className={styles.platform}>{creator.platform} · {creator.store}</Text>
          </View>
        </View>
      )}

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>选择佣金规则</Text>

        {creator && (
          <View className={styles.currentRule}>
            <Text className={styles.currentRuleLabel}>当前规则</Text>
            <Text className={styles.currentRuleValue}>{getCurrentRuleDisplay()}</Text>
          </View>
        )}

        <View className={styles.ruleTypeSelector}>
          {ruleTypes.map(type => (
            <View
              key={type.value}
              className={classnames(styles.ruleTypeCard, ruleType === type.value && styles.active)}
              onClick={() => setRuleType(type.value)}
            >
              <Text className={styles.ruleIcon}>{type.icon}</Text>
              <Text className={styles.ruleLabel}>{type.label}</Text>
              <Text className={styles.ruleDesc}>{type.desc}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>配置参数</Text>

        {ruleType === 'fixed' && (
          <View className={styles.formGroup}>
            <Text className={styles.formLabel}>
              固定佣金金额 <Text className={styles.required}>*</Text>
            </Text>
            <View className={styles.inputWrapper}>
              <Text className={styles.inputPrefix}>¥</Text>
              <Input
                className={styles.input}
                type="digit"
                placeholder="请输入每单固定佣金"
                value={fixedAmount}
                onInput={e => setFixedAmount(e.detail.value)}
              />
              <Text className={styles.inputSuffix}>元/单</Text>
            </View>
            <Text className={styles.formHint}>例如：500元/单，每成交一单支付500元佣金</Text>
          </View>
        )}

        {ruleType === 'per_order' && (
          <View className={styles.formGroup}>
            <Text className={styles.formLabel}>
              提成比例 <Text className={styles.required}>*</Text>
            </Text>
            <View className={styles.inputWrapper}>
              <Input
                className={styles.input}
                type="digit"
                placeholder="请输入提成比例"
                value={percentage}
                onInput={e => setPercentage(e.detail.value)}
              />
              <Text className={styles.inputSuffix}>%</Text>
            </View>
            <Text className={styles.formHint}>例如：20%，每单成交额的20%作为佣金</Text>
          </View>
        )}

        {ruleType === 'tiered' && (
          <View className={styles.formGroup}>
            <Text className={styles.formLabel}>
              阶梯配置 <Text className={styles.required}>*</Text>
            </Text>
            <View className={styles.tierList}>
              {tiers.map((tier, index) => (
                <View key={tier.id} className={styles.tierItem}>
                  <Text className={styles.tierIndex}>{index + 1}</Text>
                  <View className={styles.tierInputs}>
                    <View className={styles.tierInput}>
                      <Text className={styles.tierInputLabel}>成交额≥（元）</Text>
                      <View className={styles.tierInputField}>
                        <Input
                          className={styles.tierInput}
                          type="digit"
                          placeholder="100000"
                          value={tier.threshold}
                          onInput={e => handleTierChange(tier.id, 'threshold', e.detail.value)}
                        />
                      </View>
                    </View>
                    <View className={styles.tierInput}>
                      <Text className={styles.tierInputLabel}>提成比例（%）</Text>
                      <View className={styles.tierInputField}>
                        <Input
                          className={styles.tierInput}
                          type="digit"
                          placeholder="15"
                          value={tier.percentage}
                          onInput={e => handleTierChange(tier.id, 'percentage', e.detail.value)}
                        />
                      </View>
                    </View>
                  </View>
                  <Text
                    className={styles.deleteTierBtn}
                    onClick={() => handleDeleteTier(tier.id)}
                  >
                    ✕
                  </Text>
                </View>
              ))}
            </View>
            <View className={styles.addTierBtn} onClick={handleAddTier}>
              + 添加阶梯
            </View>
            <Text className={styles.formHint}>
              例如：10万以下15%，10-20万20%，20万以上25%
            </Text>
          </View>
        )}

        <View className={styles.preview}>
          <Text className={styles.previewTitle}>💰 佣金试算</Text>
          <Text className={styles.previewContent}>
            基于当前配置，不同成交额对应的佣金：
          </Text>
          <View className={styles.previewExample}>
            {exampleAmounts.map(amount => (
              <View key={amount} className={styles.exampleRow}>
                <Text className={styles.exampleLabel}>成交额 {formatMoney(amount)}</Text>
                <Text className={styles.exampleValue}>
                  佣金 {formatMoney(calculateCommission(amount))}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View className={styles.actionBar}>
        <View className={styles.btnCancel} onClick={handleCancel}>
          取消
        </View>
        <View className={styles.btnSave} onClick={handleSave}>
          保存配置
        </View>
      </View>
    </View>
  );
};

export default CommissionConfigPage;
