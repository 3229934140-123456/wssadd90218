import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Input } from '@tarojs/components';
import classnames from 'classnames';
import CreatorCard from '@/components/CreatorCard';
import Empty from '@/components/Empty';
import { mockCreators } from '@/data/creators';
import type { ROIType } from '@/types/creator';
import styles from './index.module.scss';

type FilterType = 'all' | ROIType;
type SortType = 'roi' | 'revenue' | 'customer' | 'commission';

const CreatorsPage: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [sortType, setSortType] = useState<SortType>('roi');
  const [sortAsc, setSortAsc] = useState(false);

  const filterOptions: { value: FilterType; label: string }[] = [
    { value: 'all', label: '全部' },
    { value: 'high', label: '高投产' },
    { value: 'medium', label: '中投产' },
    { value: 'low', label: '低投产' },
  ];

  const sortOptions: { value: SortType; label: string }[] = [
    { value: 'roi', label: '投产比' },
    { value: 'revenue', label: '成交额' },
    { value: 'customer', label: '到院人数' },
    { value: 'commission', label: '应付佣金' },
  ];

  const filteredCreators = useMemo(() => {
    let result = [...mockCreators];

    if (searchText) {
      const keyword = searchText.toLowerCase();
      result = result.filter(c => c.name.toLowerCase().includes(keyword));
    }

    if (filterType !== 'all') {
      result = result.filter(c => c.roi === filterType);
    }

    result.sort((a, b) => {
      let diff = 0;
      switch (sortType) {
        case 'roi':
          diff = a.roiValue - b.roiValue;
          break;
        case 'revenue':
          diff = a.monthlyData.totalRevenue - b.monthlyData.totalRevenue;
          break;
        case 'customer':
          diff = a.monthlyData.customerCount - b.monthlyData.customerCount;
          break;
        case 'commission':
          diff = a.monthlyData.commission - b.monthlyData.commission;
          break;
      }
      return sortAsc ? diff : -diff;
    });

    return result;
  }, [searchText, filterType, sortType, sortAsc]);

  const counts = useMemo(() => ({
    all: mockCreators.length,
    high: mockCreators.filter(c => c.roi === 'high').length,
    medium: mockCreators.filter(c => c.roi === 'medium').length,
    low: mockCreators.filter(c => c.roi === 'low').length,
  }), []);

  const handleSort = (type: SortType) => {
    if (sortType === type) {
      setSortAsc(!sortAsc);
    } else {
      setSortType(type);
      setSortAsc(false);
    }
  };

  const clearSearch = () => {
    setSearchText('');
  };

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header}>
        <View className={styles.searchBar}>
          <Text className={styles.searchIcon}>🔍</Text>
          <Input
            className={styles.searchInput}
            placeholder="搜索达人名称"
            value={searchText}
            onInput={e => setSearchText(e.detail.value)}
            confirmType="search"
          />
          {searchText && (
            <Text className={styles.clearBtn} onClick={clearSearch}>✕</Text>
          )}
        </View>

        <ScrollView className={styles.filterTabs} scrollX>
          {filterOptions.map(option => (
            <View
              key={option.value}
              className={classnames(styles.filterTab, filterType === option.value && styles.active)}
              onClick={() => setFilterType(option.value)}
            >
              <Text>{option.label}</Text>
              <Text className={styles.count}>{counts[option.value]}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <View className={styles.sortBar}>
        <View className={styles.sortOptions}>
          {sortOptions.map(option => (
            <Text
              key={option.value}
              className={classnames(styles.sortOption, sortType === option.value && styles.active)}
              onClick={() => handleSort(option.value)}
            >
              {option.label}
              {sortType === option.value && (
                <Text className={styles.sortIcon}>{sortAsc ? '↑' : '↓'}</Text>
              )}
            </Text>
          ))}
        </View>
      </View>

      <View className={styles.content}>
        <View className={styles.summaryRow}>
          <Text className={styles.summaryText}>
            共 <Text className={styles.highlight}>{filteredCreators.length}</Text> 位达人
          </Text>
          <View className={styles.roiLegend}>
            <View className={styles.legendItem}>
              <View className={classnames(styles.dot, styles.high)} />
              <Text>高投产≥3</Text>
            </View>
            <View className={styles.legendItem}>
              <View className={classnames(styles.dot, styles.medium)} />
              <Text>中1.5-3</Text>
            </View>
            <View className={styles.legendItem}>
              <View className={classnames(styles.dot, styles.low)} />
              <Text>低{'<'}1.5</Text>
            </View>
          </View>
        </View>

        {filteredCreators.length > 0 ? (
          filteredCreators.map((creator) => (
            <CreatorCard key={creator.id} creator={creator} />
          ))
        ) : (
          <Empty
            icon="👥"
            title="没有找到相关达人"
            description="尝试修改筛选条件或搜索关键词"
          />
        )}
      </View>
    </ScrollView>
  );
};

export default CreatorsPage;
