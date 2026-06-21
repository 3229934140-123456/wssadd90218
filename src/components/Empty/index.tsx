import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

interface EmptyProps {
  icon?: string;
  title?: string;
  description?: string;
}

const Empty: React.FC<EmptyProps> = ({
  icon = '📋',
  title = '暂无数据',
  description = '这里还没有内容哦',
}) => {
  return (
    <View className={styles.emptyContainer}>
      <View className={styles.icon}>
        <Text className={styles.iconText}>{icon}</Text>
      </View>
      <Text className={styles.title}>{title}</Text>
      <Text className={styles.description}>{description}</Text>
    </View>
  );
};

export default Empty;
