import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Image } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import classnames from 'classnames';
import dayjs from 'dayjs';
import Calendar from '@/components/Calendar';
import Empty from '@/components/Empty';
import { useAppStore } from '@/store';
import type { Settlement } from '@/types/settlement';
import { formatMoney } from '@/utils/format';
import { formatDate, getDaysRemaining } from '@/utils/date';
import styles from './index.module.scss';

type TabType = 'pending' | 'calendar' | 'history';

const CalendarPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('pending');
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));

  const settlements = useAppStore((state) => state.settlements);

  useDidShow(() => {
  });

  const pendingSettlements = useMemo(
    () => settlements.filter((s) => s.status === 'pending'),
    [settlements]
  );

  const dateSettlements = useMemo(() => {
    return settlements.filter((s) => {
      const submitDate = dayjs(s.submitDate).format('YYYY-MM-DD');
      return submitDate === selectedDate;
    });
  }, [settlements, selectedDate]);

  const historySettlements = useMemo(
    () => settlements.filter((s) => s.status !== 'pending'),
    [settlements]
  );

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setActiveTab('calendar');
  };

  const handleSettlementClick = (id: string) => {
    Taro.navigateTo({
      url: `/pages/settlement-detail/index?id=${id}`,
    });
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: '待确认',
      confirmed: '已确认',
      paid: '已付款',
      disputed: '有争议',
    };
    return labels[status] || status;
  };

  const totalPendingCommission = pendingSettlements.reduce(
    (sum, s) => sum + s.commission,
    0
  );

  const getDeadline = (submitDate: string) => {
    return dayjs(submitDate).add(5, 'day').format('YYYY-MM-DD');
  };

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.tabBar}>
        <View
          className={classnames(styles.tabItem, activeTab === 'pending' && styles.active)}
          onClick={() => setActiveTab('pending')}
        >
          <Text>待确认</Text>
          {pendingSettlements.length > 0 && (
            <View className={styles.badge}>{pendingSettlements.length}</View>
          )}
        </View>
        <View
          className={classnames(styles.tabItem, activeTab === 'calendar' && styles.active)}
          onClick={() => setActiveTab('calendar')}
        >
          <Text>日历视图</Text>
        </View>
        <View
          className={classnames(styles.tabItem, activeTab === 'history' && styles.active)}
          onClick={() => setActiveTab('history')}
        >
          <Text>历史记录</Text>
        </View>
      </View>

      <View className={styles.content}>
        {activeTab === 'pending' && (
          <>
            <View className={styles.section}>
              <View className={styles.sectionHeader}>
                <Text className={styles.sectionTitle}>待确认结算单</Text>
                <Text className={styles.sectionSubtitle}>
                  共 {pendingSettlements.length} 笔，{formatMoney(totalPendingCommission)}
                </Text>
              </View>

              {pendingSettlements.length > 0 ? (
                <View className={styles.pendingList}>
                  {pendingSettlements.map((item) => {
                    const deadline = getDeadline(item.submitDate);
                    const daysRemaining = getDaysRemaining(deadline);
                    const isUrgent = daysRemaining <= 3;

                    return (
                      <View
                        key={item.id}
                        className={styles.pendingItem}
                        onClick={() => handleSettlementClick(item.id)}
                      >
                        <Image
                          className={styles.avatar}
                          src={item.creatorAvatar}
                          mode="aspectFill"
                        />
                        <View className={styles.info}>
                          <Text className={styles.name}>
                            {item.creatorName}
                            {item.isHighCommission && (
                              <Text className={styles.highBadge}>高额佣金</Text>
                            )}
                          </Text>
                          <View className={styles.meta}>
                            <Text className={styles.period}>{item.period}</Text>
                            <Text className={styles.count}>{item.dealCount} 笔成交</Text>
                          </View>
                        </View>
                        <View className={styles.amount}>
                          <Text className={styles.value}>
                            {formatMoney(item.commission, false)}
                          </Text>
                          <Text className={classnames(styles.deadline, isUrgent && styles.urgent)}>
                            {isUrgent
                              ? `还剩 ${daysRemaining} 天`
                              : `截止 ${formatDate(deadline, 'MM-DD')}`}
                          </Text>
                        </View>
                        <Text className={styles.arrow}>›</Text>
                      </View>
                    );
                  })}
                </View>
              ) : (
                <Empty
                  icon="✅"
                  title="暂无待确认结算"
                  description="所有结算单都已处理完毕"
                />
              )}
            </View>
          </>
        )}

        {activeTab === 'calendar' && (
          <>
            <View className={styles.section}>
              <Calendar
                onDateSelect={handleDateSelect}
                selectedDate={selectedDate}
                settlements={settlements}
              />
            </View>

            <View className={styles.section}>
              <View className={styles.selectedDateInfo}>
                <View className={styles.dateHeader}>
                  <Text className={styles.date}>
                    {formatDate(selectedDate, 'YYYY年MM月DD日')}
                  </Text>
                  <Text className={styles.count}>
                    共 <Text className={styles.num}>{dateSettlements.length}</Text> 笔结算
                  </Text>
                </View>

                {dateSettlements.length > 0 ? (
                  <>
                    <View className={styles.summary}>
                      <View className={styles.summaryItem}>
                        <Text className={styles.value}>
                          {dateSettlements.reduce((sum, s) => sum + s.customerCount, 0)}
                        </Text>
                        <Text className={styles.label}>到院人数</Text>
                      </View>
                      <View className={styles.summaryItem}>
                        <Text className={styles.value}>
                          {dateSettlements.reduce((sum, s) => sum + s.dealCount, 0)}
                        </Text>
                        <Text className={styles.label}>成交数</Text>
                      </View>
                      <View className={styles.summaryItem}>
                        <Text className={classnames(styles.value, styles.amount)}>
                          {formatMoney(
                            dateSettlements.reduce((sum, s) => sum + s.commission, 0),
                            false
                          )}
                        </Text>
                        <Text className={styles.label}>佣金</Text>
                      </View>
                    </View>

                    <View className={styles.settlementList}>
                      {dateSettlements.map((item) => (
                        <View
                          key={item.id}
                          className={styles.settlementItem}
                          onClick={() => handleSettlementClick(item.id)}
                        >
                          <Image
                            className={styles.avatar}
                            src={item.creatorAvatar}
                            mode="aspectFill"
                          />
                          <View className={styles.info}>
                            <Text className={styles.name}>{item.creatorName}</Text>
                            <Text className={styles.meta}>
                              {item.period} · {item.store}
                            </Text>
                          </View>
                          <View className={styles.status}>
                            <Text className={styles.amount}>
                              {formatMoney(item.commission, false)}
                            </Text>
                            <Text
                              className={classnames(styles.statusText, styles[item.status])}
                            >
                              {getStatusLabel(item.status)}
                            </Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  </>
                ) : (
                  <Empty
                    icon="📅"
                    title="当日无结算记录"
                    description="选择其他日期查看"
                  />
                )}
              </View>
            </View>
          </>
        )}

        {activeTab === 'history' && (
          <View className={styles.section}>
            <View className={styles.sectionHeader}>
              <Text className={styles.sectionTitle}>历史结算记录</Text>
            </View>

            {historySettlements.length > 0 ? (
              <View className={styles.pendingList}>
                {historySettlements.map((item) => (
                  <View
                    key={item.id}
                    className={styles.pendingItem}
                    onClick={() => handleSettlementClick(item.id)}
                  >
                    <Image
                      className={styles.avatar}
                      src={item.creatorAvatar}
                      mode="aspectFill"
                    />
                    <View className={styles.info}>
                      <Text className={styles.name}>{item.creatorName}</Text>
                      <View className={styles.meta}>
                        <Text className={styles.period}>{item.period}</Text>
                        <Text className={styles.count}>{item.dealCount} 笔成交</Text>
                      </View>
                    </View>
                    <View className={styles.status}>
                      <Text className={styles.value}>
                        {formatMoney(item.commission, false)}
                      </Text>
                      <Text
                        className={classnames(styles.statusText, styles[item.status])}
                      >
                        {getStatusLabel(item.status)}
                      </Text>
                    </View>
                    <Text className={styles.arrow}>›</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Empty
                icon="📋"
                title="暂无历史记录"
                description="结算完成后会在这里显示"
              />
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default CalendarPage;
