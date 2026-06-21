import dayjs from 'dayjs';

export const formatDate = (date: string | Date, format = 'YYYY-MM-DD'): string => {
  return dayjs(date).format(format);
};

export const formatDateTime = (date: string | Date, format = 'YYYY-MM-DD HH:mm'): string => {
  return dayjs(date).format(format);
};

export const formatMonth = (date: string | Date): string => {
  return dayjs(date).format('YYYY年MM月');
};

export const getToday = (): string => {
  return dayjs().format('YYYY-MM-DD');
};

export const getCurrentMonth = (): string => {
  return dayjs().format('YYYY-MM');
};

export const getDaysInMonth = (year: number, month: number): number => {
  return dayjs(`${year}-${month}-01`).daysInMonth();
};

export const getFirstDayOfMonth = (year: number, month: number): number => {
  return dayjs(`${year}-${month}-01`).day();
};

export const isSameDay = (date1: string | Date, date2: string | Date): boolean => {
  return dayjs(date1).isSame(date2, 'day');
};

export const isToday = (date: string | Date): boolean => {
  return dayjs(date).isSame(dayjs(), 'day');
};

export const isPast = (date: string | Date): boolean => {
  return dayjs(date).isBefore(dayjs(), 'day');
};

export const isFuture = (date: string | Date): boolean => {
  return dayjs(date).isAfter(dayjs(), 'day');
};

export const getRelativeTime = (date: string | Date): string => {
  const now = dayjs();
  const target = dayjs(date);
  const diffDays = now.diff(target, 'day');

  if (diffDays === 0) {
    const diffHours = now.diff(target, 'hour');
    if (diffHours === 0) {
      const diffMinutes = now.diff(target, 'minute');
      return diffMinutes <= 0 ? '刚刚' : `${diffMinutes}分钟前`;
    }
    return `${diffHours}小时前`;
  }
  if (diffDays === 1) return '昨天';
  if (diffDays < 7) return `${diffDays}天前`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`;
  return formatDate(date);
};

export const getDaysRemaining = (deadline: string | Date): number => {
  return dayjs(deadline).diff(dayjs(), 'day');
};

export const generateCalendarDays = (year: number, month: number): (dayjs.Dayjs | null)[] => {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const days: (dayjs.Dayjs | null)[] = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(dayjs(`${year}-${month}-${i}`));
  }

  return days;
};
