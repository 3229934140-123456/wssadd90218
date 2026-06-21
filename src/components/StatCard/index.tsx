import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';

interface StatCardProps {
  label: string;
  value: string;
  subInfo?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'stable';
  };
  iconColor?: 'blue' | 'green' | 'orange' | 'red';
  iconText?: string;
  isAmount?: boolean;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subInfo,
  trend,
  iconColor = 'blue',
  iconText,
  isAmount = false,
  onClick,
}) => {
  const trendText = trend
    ? `${trend.direction === 'up' ? '↑' : trend.direction === 'down' ? '↓' : '→'} ${Math.abs(trend.value)}%`
    : '';

  return (
    <View className={styles.statCard} onClick={onClick}>
      {iconText && (
        <View className={classnames(styles.iconArea, styles[iconColor])}>
          <Text className={classnames(styles.iconText, styles[iconColor])}>{iconText}</Text>
        </View>
      )}
      <View className={styles.header}>
        <Text className={styles.label}>{label}</Text>
        {trend && (
          <Text className={classnames(styles.trend, styles[trend.direction])}>
            {trendText}
          </Text>
        )}
      </View>
      <Text className={classnames(styles.value, isAmount && styles.amount)}>{value}</Text>
      {subInfo && <Text className={styles.subInfo}>{subInfo}</Text>}
    </View>
  );
};

export default StatCard;
