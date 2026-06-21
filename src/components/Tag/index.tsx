import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';

export type TagType = 'high' | 'medium' | 'low' | 'pending' | 'success' | 'warning' | 'error' | 'default';

interface TagProps {
  type: TagType;
  text: string;
  className?: string;
}

const Tag: React.FC<TagProps> = ({ type, text, className }) => {
  return (
    <View className={classnames(styles.tag, styles[type], className)}>
      <Text>{text}</Text>
    </View>
  );
};

export default Tag;
