import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import Empty from '@/components/Empty';
import { getCreatorById } from '@/data/creators';
import type { Creator, CommissionRule } from '@/types/creator';
import {
  formatMoney,
  formatNumber,
  formatROI,
  getROILabel,
  getROIType,
  getCommissionTypeLabel,
  getProjectCategoryLabel,
} from '@/utils/format';
import { formatDate } from '@/utils/date';
import styles from './index.module.scss';

const CreatorDetailPage: React.FC = () => {
  const router = useRouter();
  const [creator, setCreator] = useState<Creator | null>(null);
  const [loading, setLoading] = useState(true);

  const creatorId = router.params.id || '1';

  useEffect(() => {
    loadData();
  }, [creatorId]);

  const loadData = () => {
    setLoading(true);
    setTimeout(() => {
      const data = getCreatorById(creatorId);
      setCreator(data || null);
      setLoading(false);
    }, 500);
  };

  const handleConfigureCommission = () => {
    Taro.navigateTo({
      url: `/pages/commission-config/index?id=${creatorId}`,
    });
  };

  const handleViewSettlements = () => {
    Taro.showToast({ title: '查看历史结算', icon: 'none' });
  };

  const handlePlayVideo = (videoTitle: string) => {
    Taro.showToast({ title: `播放：${videoTitle}`, icon: 'none' });
  };

  const getCommissionRuleDisplay = (rule: CommissionRule) => {
    switch (rule.type) {
      case 'fixed':
        return {
          typeLabel: '固定佣金',
          detail: `每单固定佣金 ${formatMoney(rule.fixedAmount || 0)}`,
        };
      case 'per_order':
        return {
          typeLabel: '按单提成',
          detail: `每单提成 ${((rule.percentage || 0) * 100).toFixed(0)}%`,
        };
      case 'tiered':
        return {
          typeLabel: '阶梯奖励',
          detail: '按成交额阶梯提成',
          tiers: rule.tiers || [],
        };
      default:
        return {
          typeLabel: getCommissionTypeLabel(rule.type),
          detail: '',
        };
    }
  };

  const settlementStatusLabels: Record<string, string> = {
    pending: '待确认',
    confirmed: '已确认',
    paid: '已付款',
    disputed: '有争议',
  };

  if (loading) {
    return (
      <View className={styles.page}>
        <View style={{ padding: '200rpx 0', textAlign: 'center' }}>
          <Text>加载中...</Text>
        </View>
      </View>
    );
  }

  if (!creator) {
    return (
      <View className={styles.page}>
        <Empty
          icon="👤"
          title="达人不存在"
          description="未找到该达人的信息"
        />
      </View>
    );
  }

  const roiType = getROIType(creator.roiValue);
  const commissionDisplay = getCommissionRuleDisplay(creator.commissionRule);

  return (
    <ScrollView
      className={styles.page}
      scrollY
    >
      <View className={styles.header}>
        <View className={styles.profile}>
          <Image
            className={styles.avatar}
            src={creator.avatar}
            mode="aspectFill"
          />
          <View className={styles.info}>
            <View className={styles.nameRow}>
              <Text className={styles.name}>{creator.name}</Text>
              {creator.isHighCommission && (
                <View className={styles.highCommissionTag}>🔥 高额佣金</View>
              )}
            </View>
            <Text className={styles.platform}>{creator.platform}达人</Text>
            <Text className={styles.followers}>
              粉丝 {formatNumber(creator.followers)}
            </Text>
          </View>
        </View>

        <View className={styles.storeInfo}>
          <View className={styles.storeInfoItem}>
            🏠 {creator.store}
          </View>
          <View className={styles.storeInfoItem}>
            📅 合作自 {formatDate(creator.cooperationStartDate)}
          </View>
        </View>

        <View className={styles.roiSection}>
          <View>
            <Text className={styles.roiLabel}>投产比</Text>
            <Text className={styles.roiValue}>{formatROI(creator.roiValue)}</Text>
          </View>
          <View className={classnames(styles.roiTag, styles[roiType])}>
            {getROILabel(creator.roiValue)}
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.sectionIcon}>📊</Text>
          本月数据
        </Text>
        <View className={styles.statsGrid}>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{creator.monthlyData.customerCount}</Text>
            <Text className={styles.statLabel}>到院人数</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{creator.monthlyData.dealCount}</Text>
            <Text className={styles.statLabel}>有效成交</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{formatMoney(creator.monthlyData.avgOrderValue)}</Text>
            <Text className={styles.statLabel}>客单价</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{formatMoney(creator.monthlyData.commission)}</Text>
            <Text className={styles.statLabel}>应付佣金</Text>
          </View>
        </View>

        <View className={styles.customerAnalysis}>
          <View className={styles.customerItem}>
            <Text className={styles.customerValue}>{creator.firstTimeCustomers}</Text>
            <Text className={styles.customerLabel}>首单顾客</Text>
          </View>
          <View className={styles.customerItem}>
            <Text className={styles.customerValue}>{creator.repeatCustomers}</Text>
            <Text className={styles.customerLabel}>复购顾客</Text>
          </View>
          <View className={styles.customerItem}>
            <Text className={styles.customerValue}>
              {((creator.repeatCustomers / (creator.firstTimeCustomers + creator.repeatCustomers)) * 100).toFixed(0)}%
            </Text>
            <Text className={styles.customerLabel}>复购率</Text>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.sectionIcon}>🎬</Text>
          探店视频
        </Text>
        {creator.videos.length > 0 ? (
          <View className={styles.videoList}>
            {creator.videos.map(video => (
              <View
                key={video.id}
                className={styles.videoCard}
                onClick={() => handlePlayVideo(video.title)}
              >
                <View className={styles.videoCover}>
                  <Image
                    className={styles.coverImg}
                    src={video.coverUrl}
                    mode="aspectFill"
                  />
                  <View className={styles.playIcon}>▶</View>
                </View>
                <View className={styles.videoInfo}>
                  <Text className={styles.videoTitle}>{video.title}</Text>
                  <View className={styles.videoMeta}>
                    <Text>👁 {formatNumber(video.viewCount)}</Text>
                    <Text>❤️ {formatNumber(video.likeCount)}</Text>
                    <Text>{formatDate(video.publishDate)}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <Empty icon="🎬" title="暂无视频" description="该达人还没有探店视频" />
        )}
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.sectionIcon}>💼</Text>
          合作项目
        </Text>
        {creator.projects.length > 0 ? (
          <View className={styles.projectList}>
            {creator.projects.map(project => (
              <View key={project.id} className={styles.projectItem}>
                <View className={styles.projectInfo}>
                  <View className={styles.projectName}>
                    <Text className={classnames(styles.categoryTag, styles[project.category])}>
                      {getProjectCategoryLabel(project.category)}
                    </Text>
                    {project.name}
                  </View>
                  <Text className={styles.projectCategory}>
                    项目编号：{project.id}
                  </Text>
                </View>
                <View className={styles.projectPrice}>
                  <Text className={styles.price}>{formatMoney(project.price)}</Text>
                  <Text className={styles.commission}>
                    佣金 {formatMoney(project.commission)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <Empty icon="💼" title="暂无合作项目" description="该达人还没有合作项目" />
        )}
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.sectionIcon}>💰</Text>
          佣金规则
        </Text>
        <View className={styles.commissionRule}>
          <Text className={styles.ruleType}>
            {commissionDisplay.typeLabel}
          </Text>
          {'tiers' in commissionDisplay && commissionDisplay.tiers ? (
            <View>
              {commissionDisplay.tiers.map((tier, index) => (
                <View key={index} className={styles.tierItem}>
                  <Text className={styles.tierThreshold}>
                    {index === 0 ? '0' : formatMoney(commissionDisplay.tiers![index - 1].threshold)} - {formatMoney(tier.threshold)}
                  </Text>
                  <Text className={styles.tierPercentage}>
                    {(tier.percentage * 100).toFixed(0)}% 提成
                  </Text>
                </View>
              ))}
              <View className={styles.tierItem}>
                <Text className={styles.tierThreshold}>
                  {formatMoney(commissionDisplay.tiers[commissionDisplay.tiers.length - 1].threshold)} 以上
                </Text>
                <Text className={styles.tierPercentage}>
                  {(commissionDisplay.tiers[commissionDisplay.tiers.length - 1].percentage * 100).toFixed(0)}% 提成
                </Text>
              </View>
            </View>
          ) : (
            <Text className={styles.ruleDetail}>{commissionDisplay.detail}</Text>
          )}
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.sectionIcon}>📋</Text>
          历史结算
        </Text>
        {creator.settlementHistory.length > 0 ? (
          <View className={styles.settlementList}>
            {creator.settlementHistory.map(record => (
              <View key={record.id} className={styles.settlementItem}>
                <View className={styles.settlementInfo}>
                  <Text className={styles.settlementMonth}>{record.month}</Text>
                  <Text className={styles.settlementMeta}>
                    到院{record.customerCount}人 · 成交{record.dealCount}单 · 营收{formatMoney(record.totalAmount)}
                  </Text>
                </View>
                <View className={styles.settlementAmount}>
                  <Text className={styles.commissionAmount}>
                    {formatMoney(record.commission)}
                  </Text>
                  <Text className={classnames(styles.settlementStatus, styles[record.status])}>
                    {settlementStatusLabels[record.status]}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <Empty icon="📋" title="暂无结算记录" description="该达人还没有结算记录" />
        )}
      </View>

      <View className={styles.actionBar}>
        <View className={styles.btnSecondary} onClick={handleConfigureCommission}>
          佣金配置
        </View>
        <View className={styles.btnPrimary} onClick={handleViewSettlements}>
          查看结算
        </View>
      </View>
    </ScrollView>
  );
};

export default CreatorDetailPage;
