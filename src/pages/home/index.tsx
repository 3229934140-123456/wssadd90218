import React, { useMemo } from 'react';
import { View, Text, ScrollView, Image } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import classnames from 'classnames';
import dayjs from 'dayjs';
import StatCard from '@/components/StatCard';
import Tag from '@/components/Tag';
import { useAppStore } from '@/store';
import { getProjectComparisons } from '@/data/projects';
import { formatMoney, getROILabel } from '@/utils/format';
import { formatDate } from '@/utils/date';
import styles from './index.module.scss';

const HomePage: React.FC = () => {
  const settlements = useAppStore((state) => state.settlements);
  const disputes = useAppStore((state) => state.disputes);
  const creatorRankings = useAppStore((state) => state.creatorRankings);
  const creators = useAppStore((state) => state.creators);

  useDidShow(() => {
  });

  const pendingSettlements = useMemo(
    () => settlements.filter((s) => s.status === 'pending'),
    [settlements]
  );
  const pendingCount = pendingSettlements.length;
  const disputeCount = disputes.filter((d) => d.status === 'pending').length;
  const totalCommission = pendingSettlements.reduce((sum, s) => sum + s.commission, 0);

  const projectComparisons = useMemo(() => getProjectComparisons(), []);

  const greeting = dayjs().hour() < 12 ? '早上好' : dayjs().hour() < 18 ? '下午好' : '晚上好';

  const handleViewAllCreators = () => {
    Taro.switchTab({ url: '/pages/creators/index' });
  };

  const handleViewPending = () => {
    Taro.switchTab({ url: '/pages/calendar/index' });
  };

  const handleViewDisputes = () => {
    Taro.switchTab({ url: '/pages/disputes/index' });
  };

  const handleCreatorClick = (creatorId: string) => {
    Taro.navigateTo({
      url: `/pages/creator-detail/index?id=${creatorId}`,
    });
  };

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header}>
        <Text className={styles.greeting}>{greeting}，老板</Text>
        <Text className={styles.date}>{formatDate(dayjs().toDate(), 'YYYY年MM月DD日 dddd')}</Text>
        <View className={styles.summary}>
          <View className={styles.summaryItem}>
            <Text className={styles.value}>542</Text>
            <Text className={styles.label}>本月到院</Text>
          </View>
          <View className={styles.summaryItem}>
            <Text className={styles.value}>195</Text>
            <Text className={styles.label}>有效成交</Text>
          </View>
          <View className={styles.summaryItem}>
            <Text className={styles.value}>¥198万</Text>
            <Text className={styles.label}>总成交额</Text>
          </View>
          <View className={styles.summaryItem}>
            <Text className={styles.value}>{creators.length}位</Text>
            <Text className={styles.label}>合作达人</Text>
          </View>
        </View>
      </View>

      <View className={styles.content}>
        <View className={styles.section}>
          <View className={styles.statsGrid}>
            <StatCard
              label="本月营收"
              value={formatMoney(1980000)}
              iconColor="blue"
              iconText="💰"
              isAmount
              trend={{ value: 12.5, direction: 'up' }}
            />
            <StatCard
              label="应付佣金"
              value={formatMoney(358000)}
              iconColor="orange"
              iconText="💵"
              isAmount
              trend={{ value: 8.3, direction: 'up' }}
            />
            <StatCard
              label="平均投产比"
              value="1:3.2"
              iconColor="green"
              iconText="📈"
              trend={{ value: 5.2, direction: 'up' }}
            />
            <StatCard
              label="转化率"
              value="35.9%"
              iconColor="green"
              iconText="✅"
              trend={{ value: 2.1, direction: 'stable' }}
            />
          </View>
        </View>

        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>达人投产比排行</Text>
            <Text className={styles.viewAll} onClick={handleViewAllCreators}>
              查看全部 ›
            </Text>
          </View>
          <View className={styles.rankingList}>
            {creatorRankings.slice(0, 5).map((item, index) => (
              <View
                key={item.creatorId}
                className={styles.rankingItem}
                onClick={() => handleCreatorClick(item.creatorId)}
              >
                <View
                  className={classnames(
                    styles.rank,
                    index === 0 && styles.rank1,
                    index === 1 && styles.rank2,
                    index === 2 && styles.rank3,
                    index > 2 && styles.other
                  )}
                >
                  {item.rank}
                </View>
                <Image className={styles.avatar} src={item.avatar} mode="aspectFill" />
                <View className={styles.info}>
                  <Text className={styles.name}>{item.creatorName}</Text>
                  <View style={{ display: 'flex', alignItems: 'center', gap: '12rpx' }}>
                    <Tag type={item.roi} text={getROILabel(item.roiValue)} />
                    <Text className={styles.meta}>
                      {item.customerCount}人到院 · {item.dealCount}单成交
                    </Text>
                  </View>
                </View>
                <View className={styles.revenue}>
                  <Text className={styles.amount}>{formatMoney(item.revenue, false)}</Text>
                  <Text className={styles.label}>营收</Text>
                </View>
                <Text
                  className={classnames(
                    styles.trend,
                    item.trend === 'up' && styles.up,
                    item.trend === 'down' && styles.down,
                    item.trend === 'stable' && styles.stable
                  )}
                >
                  {item.trend === 'up' ? '↑' : item.trend === 'down' ? '↓' : '→'} {Math.abs(item.trendValue)}%
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>待审批事项</Text>
          </View>
          <View className={styles.pendingCards}>
            <View
              className={classnames(styles.pendingCard, styles.settlement)}
              onClick={handleViewPending}
            >
              <View className={styles.cardHeader}>
                <Text className={styles.cardTitle}>待确认结算</Text>
                {pendingCount > 0 && <View className={styles.badge}>{pendingCount}</View>}
              </View>
              <View className={styles.cardContent}>
                <Text className={styles.count}>{pendingCount} 笔</Text>
                <Text className={styles.amount}>待确认金额 {formatMoney(totalCommission)}</Text>
                <Text className={styles.desc}>请在结算日前确认</Text>
              </View>
            </View>
            <View
              className={classnames(styles.pendingCard, styles.dispute)}
              onClick={handleViewDisputes}
            >
              <View className={styles.cardHeader}>
                <Text className={styles.cardTitle}>待处理争议</Text>
                {disputeCount > 0 && <View className={styles.badge}>{disputeCount}</View>}
              </View>
              <View className={styles.cardContent}>
                <Text className={styles.count}>{disputeCount} 项</Text>
                <Text className={styles.desc}>需要市场人员补充材料</Text>
              </View>
            </View>
          </View>
        </View>

        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>门店项目效果对比</Text>
          </View>
          <ScrollView className={styles.projectComparison} scrollX>
            {projectComparisons.map((project) => (
              <View key={project.category} className={styles.projectCard}>
                <Text className={styles.projectTitle}>{project.categoryName}项目</Text>
                {project.stores.map((store: any) => (
                  <View key={store.storeName} className={styles.storeRow}>
                    <Text className={styles.storeName}>{store.storeName}</Text>
                    <View className={styles.storeStats}>
                      <View className={styles.stat}>
                        <Text className={styles.value}>{store.customerCount}</Text>
                        <Text className={styles.label}>到院</Text>
                      </View>
                      <View className={styles.stat}>
                        <Text className={styles.value}>{store.dealCount}</Text>
                        <Text className={styles.label}>成交</Text>
                      </View>
                      <View className={styles.stat}>
                        <Text className={styles.value}>{formatMoney(store.revenue, false)}</Text>
                        <Text className={styles.label}>营收</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </ScrollView>
  );
};

export default HomePage;
