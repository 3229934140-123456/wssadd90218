import React, { useState, useMemo } from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import dayjs from 'dayjs';
import type { Settlement } from '@/types/settlement';
import styles from './index.module.scss';

interface CalendarProps {
  onDateSelect?: (date: string) => void;
  selectedDate?: string;
  settlements: Settlement[];
}

const Calendar: React.FC<CalendarProps> = ({ onDateSelect, selectedDate, settlements }) => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selected, setSelected] = useState<string>(selectedDate || dayjs().format('YYYY-MM-DD'));

  const year = currentDate.year();
  const month = currentDate.month() + 1;

  const settlementDates = useMemo(() => {
    const dateSet = new Set<string>();
    const pendingDeadlines = new Map<string, number>();

    settlements.forEach((s) => {
      if (s.submitDate) {
        dateSet.add(dayjs(s.submitDate).format('YYYY-MM-DD'));
      }
      if (s.status === 'pending') {
        const deadline = dayjs(s.submitDate).add(5, 'day').format('YYYY-MM-DD');
        pendingDeadlines.set(deadline, (pendingDeadlines.get(deadline) || 0) + 1);
      }
    });

    return { dateSet, pendingDeadlines };
  }, [settlements]);

  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  const getDays = () => {
    const firstDay = dayjs(`${year}-${month}-01`).day();
    const daysInMonth = dayjs(`${year}-${month}-01`).daysInMonth();
    const days: { day: number | null; date: string | null; isOtherMonth: boolean }[] = [];

    for (let i = 0; i < firstDay; i++) {
      days.push({ day: null, date: null, isOtherMonth: true });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = dayjs(`${year}-${month}-${i}`).format('YYYY-MM-DD');
      days.push({ day: i, date: dateStr, isOtherMonth: false });
    }

    return days;
  };

  const days = getDays();

  const handlePrevMonth = () => {
    setCurrentDate(currentDate.subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    setCurrentDate(currentDate.add(1, 'month'));
  };

  const handleDateClick = (date: string) => {
    setSelected(date);
    onDateSelect?.(date);
  };

  return (
    <View className={styles.calendar}>
      <View className={styles.header}>
        <View className={styles.navBtn} onClick={handlePrevMonth}>
          <Text>‹</Text>
        </View>
        <Text className={styles.monthText}>{year}年{month}月</Text>
        <View className={styles.navBtn} onClick={handleNextMonth}>
          <Text>›</Text>
        </View>
      </View>

      <View className={styles.weekDays}>
        {weekDays.map((day) => (
          <Text key={day} className={styles.weekDay}>{day}</Text>
        ))}
      </View>

      <View className={styles.daysGrid}>
        {days.map((item, index) => {
          if (!item.day || !item.date) {
            return <View key={index} className={classnames(styles.dayCell, styles.otherMonth)} />;
          }

          const hasSettlement = settlementDates.dateSet.has(item.date);
          const deadlineCount = settlementDates.pendingDeadlines.get(item.date) || 0;
          const isToday = dayjs(item.date).isSame(dayjs(), 'day');
          const isSelected = item.date === selected;

          return (
            <View
              key={index}
              className={classnames(
                styles.dayCell,
                isToday && styles.today,
                isSelected && styles.selected,
                hasSettlement && styles.hasSettlement,
                deadlineCount > 0 && styles.hasDeadline
              )}
              onClick={() => handleDateClick(item.date!)}
            >
              <Text className={styles.dayNumber}>{item.day}</Text>
              {hasSettlement && <View className={classnames(styles.dot, styles.green)} />}
              {deadlineCount > 0 && (
                <View className={styles.deadlineBadge}>{deadlineCount}</View>
              )}
            </View>
          );
        })}
      </View>

      <View className={styles.legend}>
        <View className={styles.legendItem}>
          <View className={classnames(styles.dot, styles.blue)} />
          <Text>今日</Text>
        </View>
        <View className={styles.legendItem}>
          <View className={classnames(styles.dot, styles.green)} />
          <Text>有结算</Text>
        </View>
        <View className={styles.legendItem}>
          <View className={classnames(styles.dot, styles.red)} />
          <Text>待确认截止</Text>
        </View>
      </View>
    </View>
  );
};

export default Calendar;
