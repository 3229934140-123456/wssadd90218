import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import type { Creator } from '@/types/creator';
import Tag from '@/components/Tag';
import { formatMoney, formatNumber, formatROI, getROILabel } from '@/utils/format';
import styles from './index.module.scss';

interface CreatorCardProps {
  creator: Creator;
  showRank?: boolean;
  rank?: number;
}

const CreatorCard: React.FC<CreatorCardProps> = ({ creator, showRank = false, rank }) => {
  const handleClick = () => {
    Taro.navigateTo({
      url: `/pages/creator-detail/index?id=${creator.id}`,
    });
  };

  return (
    <View className={styles.creatorCard} onClick={handleClick}>
      <View className={styles.header}>
        <Image className={styles.avatar} src={creator.avatar} mode="aspectFill" />
        <View className={styles.info}>
          <View className={styles.nameRow}>
            <Text className={styles.name}>{creator.name}</Text>
            {showRank && rank && (
              <Text className={styles.platform}>#{rank}</Text>
            )}
            <Tag type={creator.roi} text={getROILabel(creator.roiValue)} />
            {creator.isHighCommission && (
              <Text className={styles.highCommissionBadge}>高额佣金</Text>
            )}
          </View>
          <View className={styles.meta}>
            <Text className={styles.metaItem}>
              {creator.platform} · <Text className={styles.value}>{formatNumber(creator.followers)}</Text> 粉丝
            </Text>
            <Text className={styles.metaItem}>
              ROI <Text className={styles.value}>{formatROI(creator.roiValue)}</Text>
            </Text>
          </View>
        </View>
      </View>
      <View className={styles.stats}>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{creator.monthlyData.customerCount}</Text>
          <Text className={styles.statLabel}>到院人数</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{creator.monthlyData.dealCount}</Text>
          <Text className={styles.statLabel}>有效成交</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{formatMoney(creator.monthlyData.avgOrderValue, false)}</Text>
          <Text className={styles.statLabel}>客单价</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={classnames(styles.statValue, styles.amount)}>{formatMoney(creator.monthlyData.commission, false)}</Text>
          <Text className={styles.statLabel}>应付佣金</Text>
        </View>
      </View>
    </View>
  );
};

export default CreatorCard;
