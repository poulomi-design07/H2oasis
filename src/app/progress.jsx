
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, {
  Circle,
  Line,
  Polyline,
  Rect,
} from 'react-native-svg';

const COLORS = {
  background: '#F3F6F1',
  white: '#FFFFFF',
  section: '#EAF1ED',
  border: '#D7E2DC',
  primary: '#28545A',
  accent: '#477C78',
  secondary: '#83A9A0',
  text: '#203A3A',
  muted: '#78908A',
  lightText: '#9AADA6',
};

const PERIODS = ['Daily', 'Week', 'Month', 'Year'];

const EMPTY_DRINK_TOTALS = {
  water: 0,
  milk: 0,
  tea: 0,
};

/* --------------------------------------------------
   HELPER FUNCTIONS
-------------------------------------------------- */

function parseJSON(value, fallback) {
  if (!value) return fallback;

  try {
    return JSON.parse(Array.isArray(value) ? value[0] : value);
  } catch {
    return fallback;
  }
}

function getCalendarDays(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startingDay = (firstDay + 6) % 7;

  return [
    ...Array(startingDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];
}

function isSameDate(date1, date2) {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

function formatDate(date) {
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/*
  Hydration records can contain:

  volume_ml             = actual drink volume
  hydration_factor      = drink-specific hydration factor
  hydration_credit_ml   = actual volume multiplied by factor

  Graphs use hydration_credit_ml.

  The other fields are fallbacks for compatibility
  with your current frontend records.
*/

function getEntryAmount(entry) {
  return Math.max(
    0,
    Number(
      entry.hydration_credit_ml ??
      entry.amount ??
      entry.volume_ml ??
      0
    ) || 0
  );
}

/* --------------------------------------------------
   TEMPORARY SAMPLE DATA

   These are sample hydration-credit values.
   They are only for graph UI testing.

   They are not saved to Supabase.
-------------------------------------------------- */

function createSampleEntries() {
  const entries = [];
  const today = new Date();

  for (let offset = 364; offset >= 0; offset--) {
    const date = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - offset
    );

    const dayNumber =
      date.getDate() + date.getMonth() * 31;

    const drinks = [
      {
        hour: 8,
        amount: 200 + (dayNumber % 4) * 50,
      },
      {
        hour: 12,
        amount: 250 + (dayNumber % 3) * 50,
      },
      {
        hour: 17,
        amount: 200 + (dayNumber % 5) * 50,
      },
    ];

    drinks.forEach((drink) => {
      const timestamp = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        drink.hour,
        0
      );

      entries.push({
        timestamp: timestamp.toISOString(),
        hydration_credit_ml: drink.amount,
      });
    });
  }

  return entries;
}

/* --------------------------------------------------
   GRAPH DATA CALCULATIONS
-------------------------------------------------- */

function getPeriodData(entries, period, selectedDate) {
  const getTotal = (start, end) => {
    return entries.reduce((total, entry) => {
      const date = new Date(entry.timestamp);

      if (Number.isNaN(date.getTime())) {
        return total;
      }

      if (date >= start && date < end) {
        return total + getEntryAmount(entry);
      }

      return total;
    }, 0);
  };

  /* DAILY: HOURLY CUMULATIVE LINE GRAPH */

  if (period === 'Daily') {
    const start = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate()
    );

    const end = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate() + 1
    );

    const dailyEntries = entries.filter((entry) => {
      const date = new Date(entry.timestamp);

      return (
        !Number.isNaN(date.getTime()) &&
        date >= start &&
        date < end
      );
    });

    const hours = Array.from(
      { length: 17 },
      (_, index) => ({
        hour: index + 6,
        amount: 0,
      })
    );

    dailyEntries.forEach((entry) => {
      const date = new Date(entry.timestamp);
      const hour = date.getHours();

      if (hour >= 6 && hour <= 22) {
        hours[hour - 6].amount += getEntryAmount(entry);
      }
    });

    let cumulative = 0;

    return hours.map((item) => {
      cumulative += item.amount;

      return {
        ...item,
        cumulative,
      };
    });
  }

  /* WEEK: MONDAY TO SUNDAY BAR GRAPH */

  if (period === 'Week') {
    const start = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate()
    );

    const day = start.getDay();
    const mondayOffset = day === 0 ? -6 : 1 - day;

    start.setDate(start.getDate() + mondayOffset);

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);

      const nextDate = new Date(date);
      nextDate.setDate(date.getDate() + 1);

      return {
        label: date.toLocaleDateString('en-IN', {
          weekday: 'short',
        }),
        value: getTotal(date, nextDate),
      };
    });
  }

  /* MONTH: DAILY BAR GRAPH */

  if (period === 'Month') {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();

    const daysInMonth = new Date(
      year,
      month + 1,
      0
    ).getDate();

    return Array.from(
      { length: daysInMonth },
      (_, index) => {
        const date = new Date(
          year,
          month,
          index + 1
        );

        const nextDate = new Date(
          year,
          month,
          index + 2
        );

        return {
          label: String(index + 1),
          value: getTotal(date, nextDate),
        };
      }
    );
  }

  /* YEAR: MONTHLY BAR GRAPH */

  if (period === 'Year') {
    const year = selectedDate.getFullYear();

    return Array.from({ length: 12 }, (_, index) => {
      const start = new Date(year, index, 1);
      const end = new Date(year, index + 1, 1);

      return {
        label: start.toLocaleDateString('en-IN', {
          month: 'short',
        }),
        value: getTotal(start, end),
      };
    });
  }

  return [];
}

/* --------------------------------------------------
   BOTTOM NAVIGATION ICONS
-------------------------------------------------- */

function HomeIcon({ active = false, size = 22 }) {
  const color = active
    ? COLORS.primary
    : COLORS.lightText;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Polyline
        points="3,10.5 12,3 21,10.5 21,21 14,21 14,15 10,15 10,21 3,21 3,10.5"
        fill={color}
      />
    </Svg>
  );
}

function ProgressIcon({ active = false, size = 22 }) {
  const color = active
    ? COLORS.primary
    : COLORS.lightText;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Line x1="4" y1="20" x2="4" y2="11"
        stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Line x1="10" y1="20" x2="10" y2="5"
        stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Line x1="16" y1="20" x2="16" y2="12"
        stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Line x1="22" y1="20" x2="22" y2="3"
        stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

function AppIcon({
  name,
  color = COLORS.primary,
  size = 22,
}) {
  const common = {
    stroke: color,
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    fill: 'none',
  };

  if (name === 'calendar') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Rect {...common} x="3" y="5" width="18" height="16" rx="2.5" />
        <Line {...common} x1="7" y1="3" x2="7" y2="7" />
        <Line {...common} x1="17" y1="3" x2="17" y2="7" />
        <Line {...common} x1="3" y1="10" x2="21" y2="10" />
        <Circle cx="8" cy="14" r="0.8" fill={color} />
        <Circle cx="12" cy="14" r="0.8" fill={color} />
        <Circle cx="16" cy="14" r="0.8" fill={color} />
        <Circle cx="8" cy="17" r="0.8" fill={color} />
        <Circle cx="12" cy="17" r="0.8" fill={color} />
      </Svg>
    );
  }

  if (name === 'back' || name === 'chevron-left') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Polyline
          points="15,18 9,12 15,6"
          stroke={color}
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </Svg>
    );
  }

  if (name === 'close') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Line {...common} x1="18" y1="6" x2="6" y2="18" />
        <Line {...common} x1="6" y1="6" x2="18" y2="18" />
      </Svg>
    );
  }

  if (name === 'chevron-right') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Polyline {...common} points="9,18 15,12 9,6" />
      </Svg>
    );
  }

  return null;
}

/* --------------------------------------------------
   PROGRESS RING
-------------------------------------------------- */

function ProgressRing({ percentage }) {
  const radius = 43;
  const circumference = 2 * Math.PI * radius;

  const progress = Math.min(
    Math.max(percentage, 0),
    100
  );

  const dashOffset =
    circumference - (progress / 100) * circumference;

  return (
    <View style={styles.ringWrapper}>
      <Svg width="112" height="112" viewBox="0 0 112 112">
        <Circle
          cx="56"
          cy="56"
          r={radius}
          stroke={COLORS.section}
          strokeWidth="9"
          fill="none"
        />

        <Circle
          cx="56"
          cy="56"
          r={radius}
          stroke={COLORS.accent}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={dashOffset}
          rotation="-90"
          origin="56, 56"
          fill="none"
        />
      </Svg>

      <View style={styles.ringCenter}>
        <Text style={styles.ringPercentage}>
          {Math.round(progress)}%
        </Text>
        <Text style={styles.ringCaption}>Completed</Text>
      </View>
    </View>
  );
}

/* --------------------------------------------------
   SUMMARY CARD
-------------------------------------------------- */

function SummaryCard({
  icon,
  label,
  value,
  subtitle,
}) {
  return (
    <View style={styles.summaryCard}>
      <View style={styles.summaryIcon}>
        <Text style={styles.summaryEmoji}>{icon}</Text>
      </View>

      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
      <Text style={styles.summarySubtitle}>{subtitle}</Text>
    </View>
  );
}

/* --------------------------------------------------
   EMPTY CHART
-------------------------------------------------- */

function EmptyChart({ message }) {
  return (
    <View style={styles.emptyChart}>
      <Text style={styles.emptyChartIcon}>📊</Text>
      <Text style={styles.emptyChartText}>{message}</Text>
    </View>
  );
}

/* --------------------------------------------------
   DAILY LINE CHART
-------------------------------------------------- */

function DailyLineChart({ data, goal }) {
  const total =
    data.length > 0
      ? data[data.length - 1].cumulative
      : 0;

  if (total === 0) {
    return (
      <EmptyChart message="No hydration records are available for this date." />
    );
  }

  const chartHeight = 125;
  const chartWidth = 300;

  const maxValue =
    Math.max(goal, total, 500) * 1.15;

  const getY = (value) =>
    chartHeight - (value / maxValue) * chartHeight;

  const points = data
    .map((item, index) => {
      const x =
        (index / (data.length - 1)) * chartWidth;

      return `${x},${getY(item.cumulative)}`;
    })
    .join(' ');

  const goalY = getY(goal);

  return (
    <View style={styles.lineChartContainer}>
      <Svg width="100%" height={155} viewBox="0 0 300 155">
        {[0, 1, 2, 3, 4].map((index) => {
          const y = (index / 4) * chartHeight;

          return (
            <Line
              key={index}
              x1="0"
              y1={y}
              x2="300"
              y2={y}
              stroke={COLORS.border}
              strokeWidth="1"
              strokeDasharray="4 5"
            />
          );
        })}

        <Line
          x1="0"
          y1={goalY}
          x2="300"
          y2={goalY}
          stroke={COLORS.secondary}
          strokeWidth="1.5"
          strokeDasharray="5 4"
        />

        <Polyline
          points={points}
          fill="none"
          stroke={COLORS.accent}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {data.map((item, index) => {
          if (item.cumulative === 0) return null;

          const x =
            (index / (data.length - 1)) * chartWidth;

          return (
            <Circle
              key={item.hour}
              cx={x}
              cy={getY(item.cumulative)}
              r="3"
              fill={COLORS.white}
              stroke={COLORS.accent}
              strokeWidth="2"
            />
          );
        })}
      </Svg>

      <View style={styles.chartTimeLabels}>
        <Text style={styles.chartTimeLabel}>6 AM</Text>
        <Text style={styles.chartTimeLabel}>12 PM</Text>
        <Text style={styles.chartTimeLabel}>6 PM</Text>
        <Text style={styles.chartTimeLabel}>10 PM</Text>
      </View>

      <Text style={styles.chartFootnote}>
        Total hydration: {total.toLocaleString()} ml
      </Text>
    </View>
  );
}

/* --------------------------------------------------
   BAR CHART: WEEK, MONTH AND YEAR
-------------------------------------------------- */

function BarChart({ data, period }) {
  const total = data.reduce(
    (sum, item) => sum + item.value,
    0
  );

  if (total === 0) {
    return (
      <EmptyChart message="No hydration records are available for this period." />
    );
  }

  const chartWidth = 300;
  const chartHeight = 125;

  const maxValue =
    Math.max(500, ...data.map((item) => item.value)) * 1.2;

  const slotWidth = chartWidth / data.length;

  const barWidth = Math.max(
    3,
    Math.min(22, slotWidth * 0.58)
  );

  const showLabel = (index) => {
    if (period === 'Week' || period === 'Year') {
      return true;
    }

    return (
      index === 0 ||
      (index + 1) % 5 === 0 ||
      index === data.length - 1
    );
  };

  return (
    <View style={styles.barChartContainer}>
      <Text style={styles.barChartTotal}>
        {total.toLocaleString()} ml total
      </Text>

      <Svg width="100%" height={145} viewBox="0 0 300 145">
        {[0, 1, 2, 3, 4].map((index) => {
          const y = (index / 4) * chartHeight;

          return (
            <Line
              key={index}
              x1="0"
              y1={y}
              x2="300"
              y2={y}
              stroke={COLORS.border}
              strokeWidth="1"
              strokeDasharray="4 5"
            />
          );
        })}

        {data.map((item, index) => {
          const barHeight =
            (item.value / maxValue) * chartHeight;

          const x =
            index * slotWidth +
            (slotWidth - barWidth) / 2;

          const y = chartHeight - barHeight;

          return (
            <Rect
              key={index}
              x={x}
              y={y}
              width={barWidth}
              height={Math.max(
                barHeight,
                item.value > 0 ? 2 : 0
              )}
              rx="3"
              fill={COLORS.accent}
              opacity={item.value > 0 ? 1 : 0.25}
            />
          );
        })}
      </Svg>

      <View style={styles.barChartLabels}>
        {data.map((item, index) => (
          <View
            key={index}
            style={[
              styles.barChartLabelSlot,
              { width: `${100 / data.length}%` },
            ]}
          >
            <Text style={styles.barChartLabel}>
              {showLabel(index) ? item.label : ''}
            </Text>
          </View>
        ))}
      </View>

      <Text style={styles.chartFootnote}>
        Hydration credited during each{' '}
        {period === 'Year' ? 'month' : 'day'}
      </Text>
    </View>
  );
}

/* --------------------------------------------------
   TREND CHART
-------------------------------------------------- */

function TrendChart({
  selectedPeriod,
  entries,
  selectedDate,
  goal,
}) {
  const chartData = useMemo(
    () => getPeriodData(
      entries,
      selectedPeriod,
      selectedDate
    ),
    [entries, selectedPeriod, selectedDate]
  );

  const subtitle = {
    Daily: formatDate(selectedDate),

    Week: 'Monday – Sunday',

    Month: selectedDate.toLocaleDateString('en-IN', {
      month: 'long',
      year: 'numeric',
    }),

    Year: String(selectedDate.getFullYear()),
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeadingRow}>
        <View>
          <Text style={styles.cardTitle}>
            Hydration Trend
          </Text>

          <Text style={styles.cardSubtitle}>
            {subtitle[selectedPeriod]}
          </Text>
        </View>

        <View style={styles.trendLegend}>
          <View style={styles.legendDot} />
          <Text style={styles.legendText}>Hydration</Text>
        </View>
      </View>

      {selectedPeriod === 'Daily' ? (
        <DailyLineChart
          data={chartData}
          goal={goal}
        />
      ) : (
        <BarChart
          data={chartData}
          period={selectedPeriod}
        />
      )}

      {selectedPeriod === 'Daily' && (
        <View style={styles.goalLegend}>
          <View style={styles.goalLegendLine} />
          <Text style={styles.goalLegendText}>
            Daily goal: {goal.toLocaleString()} ml
          </Text>
        </View>
      )}
    </View>
  );
}

/* --------------------------------------------------
   DRINK BREAKDOWN
-------------------------------------------------- */

function TodayHydrationCard({
  drinkTotals,
  untrackedIntake,
  isSelectedDateToday,
}) {
  const drinks = [
    {
      name: 'Water',
      amount: drinkTotals.water,
      icon: '💧',
      color: COLORS.accent,
    },
    {
      name: 'Tea',
      amount: drinkTotals.tea,
      icon: '🍵',
      color: COLORS.secondary,
    },
    {
      name: 'Milk',
      amount: drinkTotals.milk,
      icon: '🥛',
      color: COLORS.primary,
    },
  ];

  const total =
    drinks.reduce(
      (sum, drink) => sum + drink.amount,
      0
    ) + untrackedIntake;

  if (!isSelectedDateToday) {
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Drink Breakdown
        </Text>

        <EmptyChart message="Drink details for this date are not available yet." />
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.cardHeadingRow}>
        <View>
          <Text style={styles.cardTitle}>
            Today's Hydration
          </Text>

          <Text style={styles.cardSubtitle}>
            Your drink breakdown
          </Text>
        </View>

        <Text style={styles.breakdownTotal}>
          {total.toLocaleString()} ml
        </Text>
      </View>

      {drinks.map((drink) => {
        const percentage =
          total > 0
            ? (drink.amount / total) * 100
            : 0;

        return (
          <View key={drink.name} style={styles.drinkRow}>
            <View style={styles.drinkIcon}>
              <Text style={styles.drinkEmoji}>
                {drink.icon}
              </Text>
            </View>

            <View style={styles.drinkInfo}>
              <View style={styles.drinkInfoTop}>
                <Text style={styles.drinkName}>
                  {drink.name}
                </Text>

                <Text style={styles.drinkAmount}>
                  {drink.amount.toLocaleString()} ml
                </Text>
              </View>

              <View style={styles.drinkProgressTrack}>
                <View
                  style={[
                    styles.drinkProgressFill,
                    {
                      width: `${percentage}%`,
                      backgroundColor: drink.color,
                    },
                  ]}
                />
              </View>
            </View>
          </View>
        );
      })}

      {untrackedIntake > 0 && (
        <View style={styles.drinkRow}>
          <View style={styles.drinkIcon}>
            <Text style={styles.drinkEmoji}>💧</Text>
          </View>

          <View style={styles.drinkInfo}>
            <View style={styles.drinkInfoTop}>
              <Text style={styles.drinkName}>
                Earlier intake
              </Text>

              <Text style={styles.drinkAmount}>
                {untrackedIntake.toLocaleString()} ml
              </Text>
            </View>

            <View style={styles.drinkProgressTrack}>
              <View
                style={[
                  styles.drinkProgressFill,
                  {
                    width: `${
                      (untrackedIntake / Math.max(total, 1)) * 100
                    }%`,
                    backgroundColor: COLORS.lightText,
                  },
                ]}
              />
            </View>
          </View>
        </View>
      )}

      {total === 0 && (
        <Text style={styles.noDrinkText}>
          No drinks logged yet. Start by logging your first drink!
        </Text>
      )}
    </View>
  );
}

/* --------------------------------------------------
   CALENDAR MODAL
-------------------------------------------------- */

function CalendarModal({
  visible,
  onClose,
  visibleMonth,
  selectedDate,
  onChangeMonth,
  onSelectDate,
  onDone,
}) {
  const days = getCalendarDays(visibleMonth);
  const today = new Date();

  const monthName = visibleMonth.toLocaleDateString(
    'en-IN',
    {
      month: 'long',
      year: 'numeric',
    }
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent={false}
    >
      <View style={styles.calendarOverlay}>
        <View style={styles.calendarModal}>
          <View style={styles.calendarModalHeader}>
            <View>
              <Text style={styles.calendarHeading}>
                Select Date
              </Text>

              <Text style={styles.calendarSubheading}>
                View your hydration journey
              </Text>
            </View>

            <Pressable
              onPress={onClose}
              style={styles.calendarClose}
            >
              <AppIcon
                name="close"
                color={COLORS.primary}
                size={20}
              />
            </Pressable>
          </View>

          <View style={styles.monthNavigation}>
            <Pressable
              onPress={() => onChangeMonth(-1)}
              style={styles.monthArrow}
            >
              <AppIcon name="chevron-left" size={20} />
            </Pressable>

            <Text style={styles.monthTitle}>
              {monthName}
            </Text>

            <Pressable
              onPress={() => onChangeMonth(1)}
              style={styles.monthArrow}
              disabled={
                visibleMonth.getFullYear() === today.getFullYear() &&
                visibleMonth.getMonth() === today.getMonth()
              }
            >
              <AppIcon name="chevron-right" size={20} />
            </Pressable>
          </View>

          <View style={styles.weekDays}>
            {[
              'Mon',
              'Tue',
              'Wed',
              'Thu',
              'Fri',
              'Sat',
              'Sun',
            ].map((day) => (
              <Text key={day} style={styles.weekDayText}>
                {day}
              </Text>
            ))}
          </View>

          <View style={styles.calendarGrid}>
            {days.map((day, index) => {
              if (day === null) {
                return (
                  <View
                    key={`empty-${index}`}
                    style={styles.calendarDay}
                  />
                );
              }

              const date = new Date(
                visibleMonth.getFullYear(),
                visibleMonth.getMonth(),
                day
              );

              const selected = isSameDate(
                date,
                selectedDate
              );

              const isToday = isSameDate(date, today);

              const futureDate =
                date > today && !isToday;

              return (
                <Pressable
                  key={day}
                  disabled={futureDate}
                  onPress={() => onSelectDate(date)}
                  style={[
                    styles.calendarDay,
                    selected && styles.selectedCalendarDay,
                    !selected && isToday && styles.todayCalendarDay,
                    futureDate && styles.futureCalendarDay,
                  ]}
                >
                  <Text
                    style={[
                      styles.calendarDayText,
                      selected && styles.selectedCalendarDayText,
                      !selected && isToday && styles.todayCalendarDayText,
                      futureDate && styles.futureCalendarDayText,
                    ]}
                  >
                    {day}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.selectedDateContainer}>
            <Text style={styles.selectedDateLabel}>
              Selected date
            </Text>

            <Text style={styles.selectedDateValue}>
              {formatDate(selectedDate)}
            </Text>
          </View>

          <Pressable
            onPress={onDone}
            style={styles.calendarDoneButton}
          >
            <Text style={styles.calendarDoneText}>
              Done
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

/* --------------------------------------------------
   MAIN PROGRESS SCREEN
-------------------------------------------------- */

export default function ProgressScreen() {
  const router = useRouter();

  const {
    hydration: hydrationParam,
    hydrationGoal: goalParam,
    drinkTotals: drinkTotalsParam,
    logEntries: logEntriesParam,
  } = useLocalSearchParams();

  const hydration = Math.max(
    0,
    Number(hydrationParam) || 0
  );

  const goal = Math.max(
    1,
    Number(goalParam) || 2000
  );

  const drinkTotals = useMemo(() => {
    const parsed = parseJSON(
      drinkTotalsParam,
      EMPTY_DRINK_TOTALS
    );

    return {
      water: Math.max(
        0,
        Number(parsed?.water) || 0
      ),

      milk: Math.max(
        0,
        Number(parsed?.milk) || 0
      ),

      tea: Math.max(
        0,
        Number(parsed?.tea) || 0
      ),
    };
  }, [drinkTotalsParam]);

  const logEntries = useMemo(() => {
    const parsed = parseJSON(
      logEntriesParam,
      []
    );

    return Array.isArray(parsed) ? parsed : [];
  }, [logEntriesParam]);

  const [selectedPeriod, setSelectedPeriod] =
    useState('Daily');

  const [calendarVisible, setCalendarVisible] =
    useState(false);

  const [selectedDate, setSelectedDate] =
    useState(new Date());

  const [visibleMonth, setVisibleMonth] =
    useState(
      new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1
      )
    );

  /*
    Temporary sample data.

    Real entries will be used whenever they are
    available. Sample records are only a fallback
    when there are no real records yet.
  */

  const sampleEntries = useMemo(
    () => createSampleEntries(),
    []
  );

  const chartEntries =
    logEntries.length > 0
      ? logEntries
      : sampleEntries;

  const today = new Date();

  const isSelectedDateToday = isSameDate(
    selectedDate,
    today
  );

  const percentage = Math.min(
    (hydration / goal) * 100,
    100
  );

  const remaining = Math.max(
    goal - hydration,
    0
  );

  const loggedDrinkTotal =
    drinkTotals.water +
    drinkTotals.milk +
    drinkTotals.tea;

  const untrackedIntake = Math.max(
    hydration - loggedDrinkTotal,
    0
  );

  const currentDrinkTotal =
    drinkTotals.water +
    drinkTotals.milk +
    drinkTotals.tea;

  const averageText =
    logEntries.length > 0
      ? `${(currentDrinkTotal / 1000).toFixed(2)} L`
      : '—';

  /* CALENDAR NAVIGATION */

  const changeMonth = (direction) => {
    setVisibleMonth((current) => {
      const nextMonth = new Date(
        current.getFullYear(),
        current.getMonth() + direction,
        1
      );

      const currentDate = new Date();

      if (
        nextMonth.getFullYear() > currentDate.getFullYear() ||
        (
          nextMonth.getFullYear() === currentDate.getFullYear() &&
          nextMonth.getMonth() > currentDate.getMonth()
        )
      ) {
        return current;
      }

      return nextMonth;
    });
  };

  const handleCalendar = () => {
    setVisibleMonth(
      new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        1
      )
    );

    setCalendarVisible(true);
  };

  const handleLog = () => {
    router.replace('/dashboard');
  };

  const handleBack = () => {
    router.replace('/dashboard');
  };

  /* --------------------------------------------------
     SCREEN UI
  -------------------------------------------------- */

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['top', 'bottom']}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.background}
        translucent={false}
      />

      <View style={styles.screen}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* HEADER */}

          <View style={styles.header}>
            <Pressable
              onPress={handleBack}
              style={styles.backButton}
              hitSlop={8}
            >
              <AppIcon name="back" size={24} />
            </Pressable>

            <View style={styles.headerTitleContainer}>
              <View style={styles.headerIcon}>
                <ProgressIcon active size={21} />
              </View>

              <View>
                <Text style={styles.headerTitle}>
                  Progress
                </Text>

                <Text style={styles.headerSubtitle}>
                  Your hydration journey
                </Text>
              </View>
            </View>

            <Pressable
              onPress={handleCalendar}
              style={styles.calendarButton}
            >
              <AppIcon
                name="calendar"
                color={COLORS.primary}
                size={21}
              />
            </Pressable>
          </View>

          {/* PERIOD SELECTOR */}

          <View style={styles.periodSelector}>
            {PERIODS.map((period) => {
              const active =
                selectedPeriod === period;

              return (
                <Pressable
                  key={period}
                  onPress={() => setSelectedPeriod(period)}
                  style={[
                    styles.periodButton,
                    active && styles.periodButtonActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.periodText,
                      active && styles.periodTextActive,
                    ]}
                  >
                    {period}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* HYDRATION OVERVIEW */}

          <View style={styles.overviewCard}>
            <View style={styles.overviewText}>
              <Text style={styles.overviewTitle}>
                Hydration Overview
              </Text>

              <Text style={styles.overviewSubtitle}>
                {isSelectedDateToday
                  ? "Today's hydration progress"
                  : 'Selected date hydration progress'}
              </Text>

              <Text style={styles.overviewAmount}>
                {isSelectedDateToday
                  ? `${hydration.toLocaleString()} ml`
                  : '—'}
              </Text>

              <Text style={styles.overviewGoal}>
                of {goal.toLocaleString()} ml daily goal
              </Text>

              <View style={styles.overviewRemaining}>
                <Text style={styles.remainingText}>
                  {isSelectedDateToday
                    ? remaining > 0
                      ? `${remaining.toLocaleString()} ml left to reach your goal`
                      : 'Daily goal reached! 🎉'
                    : 'No saved data for this date'}
                </Text>
              </View>
            </View>

            <ProgressRing
              percentage={
                isSelectedDateToday ? percentage : 0
              }
            />
          </View>

          {/* SUMMARY */}

          <View style={styles.sectionHeading}>
            <Text style={styles.sectionTitle}>
              Your Summary
            </Text>
          </View>

          <View style={styles.summaryGrid}>
            <SummaryCard
              icon="🔥"
              label="Current Streak"
              value="—"
              subtitle="Needs saved daily history"
            />

            <SummaryCard
              icon="💧"
              label="Logged Drinks"
              value={averageText}
              subtitle="Today's recorded drinks"
            />
          </View>

          {/* HYDRATION TRENDS */}

          <View style={styles.sectionHeading}>
            <Text style={styles.sectionTitle}>
              Your Trends
            </Text>
          </View>

          <TrendChart
            selectedPeriod={selectedPeriod}
            entries={chartEntries}
            selectedDate={selectedDate}
            goal={goal}
          />

          {/* DRINK BREAKDOWN */}

          <View style={styles.sectionHeading}>
            <Text style={styles.sectionTitle}>
              Drink Breakdown
            </Text>
          </View>

          <TodayHydrationCard
            drinkTotals={drinkTotals}
            untrackedIntake={untrackedIntake}
            isSelectedDateToday={isSelectedDateToday}
          />

          <View style={styles.bottomSpace} />
        </ScrollView>

        {/* BOTTOM NAVIGATION */}

        <View style={styles.bottomNav}>
          <Pressable
            style={styles.navItem}
            onPress={() => router.replace('/dashboard')}
          >
            <HomeIcon active={false} size={22} />
            <Text style={styles.navLabel}>Home</Text>
          </Pressable>

          <Pressable
            style={styles.logNavItem}
            onPress={handleLog}
          >
            <View style={styles.logButton}>
              <Text style={styles.logPlus}>+</Text>
            </View>

            <Text style={styles.logLabel}>Log</Text>
          </Pressable>

          <Pressable style={styles.navItem}>
            <ProgressIcon active size={22} />

            <Text
              style={[
                styles.navLabel,
                styles.activeNavLabel,
              ]}
            >
              Progress
            </Text>

            <View style={styles.navIndicator} />
          </Pressable>
        </View>
      </View>

      {/* CALENDAR */}

      <CalendarModal
        visible={calendarVisible}
        onClose={() => setCalendarVisible(false)}
        visibleMonth={visibleMonth}
        selectedDate={selectedDate}
        onChangeMonth={changeMonth}
        onSelectDate={setSelectedDate}
        onDone={() => setCalendarVisible(false)}
      />
    </SafeAreaView>
  );
}

/* --------------------------------------------------
   STYLES
-------------------------------------------------- */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },

  backButton: {
    width: 32,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 5,
    gap: 10,
  },

  headerIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: COLORS.section,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 21,
    fontWeight: '700',
    color: COLORS.text,
  },

  headerSubtitle: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 3,
  },

  calendarButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  periodSelector: {
    flexDirection: 'row',
    backgroundColor: COLORS.section,
    borderRadius: 14,
    padding: 5,
    marginBottom: 20,
  },

  periodButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: 10,
  },

  periodButtonActive: {
    backgroundColor: COLORS.primary,
  },

  periodText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.muted,
  },

  periodTextActive: {
    color: COLORS.white,
  },

  overviewCard: {
    backgroundColor: COLORS.white,
    borderRadius: 22,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 25,
  },

  overviewText: {
    flex: 1,
    paddingRight: 5,
  },

  overviewTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },

  overviewSubtitle: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 5,
  },

  overviewAmount: {
    fontSize: 27,
    fontWeight: '800',
    color: COLORS.primary,
    marginTop: 18,
  },

  overviewGoal: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 3,
  },

  overviewRemaining: {
    backgroundColor: COLORS.section,
    alignSelf: 'flex-start',
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 7,
    marginTop: 12,
  },

  remainingText: {
    fontSize: 10,
    color: COLORS.primary,
    fontWeight: '600',
  },

  ringWrapper: {
    width: 112,
    height: 112,
    alignItems: 'center',
    justifyContent: 'center',
  },

  ringCenter: {
    position: 'absolute',
    alignItems: 'center',
  },

  ringPercentage: {
    fontSize: 23,
    fontWeight: '800',
    color: COLORS.primary,
  },

  ringCaption: {
    fontSize: 10,
    color: COLORS.muted,
    marginTop: 2,
  },

  sectionHeading: {
    marginBottom: 12,
    marginTop: 2,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
  },

  summaryGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },

  summaryCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
  },

  summaryIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: COLORS.section,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  summaryEmoji: {
    fontSize: 17,
  },

  summaryLabel: {
    fontSize: 11,
    color: COLORS.muted,
  },

  summaryValue: {
    fontSize: 21,
    fontWeight: '800',
    color: COLORS.primary,
    marginTop: 5,
  },

  summarySubtitle: {
    fontSize: 10,
    color: COLORS.lightText,
    marginTop: 3,
  },

  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginBottom: 24,
  },

  cardHeadingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },

  cardSubtitle: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 4,
  },

  trendLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  legendDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.accent,
  },

  legendText: {
    fontSize: 10,
    color: COLORS.muted,
  },

  lineChartContainer: {
    width: '100%',
    marginTop: 5,
  },

  barChartContainer: {
    width: '100%',
    marginTop: 5,
  },

  barChartTotal: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 8,
  },

  barChartLabels: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 3,
  },

  barChartLabelSlot: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  barChartLabel: {
    fontSize: 8,
    color: COLORS.muted,
    textAlign: 'center',
  },

  chartTimeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
    marginTop: 3,
  },

  chartTimeLabel: {
    fontSize: 9,
    color: COLORS.muted,
  },

  chartFootnote: {
    fontSize: 9,
    color: COLORS.lightText,
    marginTop: 9,
  },

  emptyChart: {
    minHeight: 135,
    backgroundColor: COLORS.background,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
  },

  emptyChartIcon: {
    fontSize: 25,
    marginBottom: 9,
  },

  emptyChartText: {
    fontSize: 11,
    lineHeight: 17,
    color: COLORS.muted,
    textAlign: 'center',
  },

  goalLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },

  goalLegendLine: {
    width: 22,
    borderTopWidth: 2,
    borderColor: COLORS.secondary,
    borderStyle: 'dashed',
  },

  goalLegendText: {
    fontSize: 10,
    color: COLORS.muted,
  },

  breakdownTotal: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.primary,
  },

  drinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    gap: 12,
  },

  drinkIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: COLORS.section,
    alignItems: 'center',
    justifyContent: 'center',
  },

  drinkEmoji: {
    fontSize: 18,
  },

  drinkInfo: {
    flex: 1,
  },

  drinkInfoTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 7,
  },

  drinkName: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },

  drinkAmount: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },

  drinkProgressTrack: {
    height: 6,
    borderRadius: 5,
    backgroundColor: COLORS.section,
    overflow: 'hidden',
  },

  drinkProgressFill: {
    height: '100%',
    borderRadius: 5,
    backgroundColor: COLORS.accent,
  },

  noDrinkText: {
    fontSize: 11,
    color: COLORS.muted,
    textAlign: 'center',
    marginTop: 18,
  },

  bottomSpace: {
    height: 20,
  },

  /* BOTTOM NAVIGATION */

  bottomNav: {
    height: 78,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 23,
    borderTopRightRadius: 23,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 15,
    elevation: 12,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -3 },
  },

  navItem: {
    flex: 1,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },

  logNavItem: {
    flex: 1,
    height: 78,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -25,
  },

  logButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.2,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 4 },
  },

  logPlus: {
    color: COLORS.white,
    fontSize: 34,
    fontWeight: '400',
    lineHeight: 39,
    textAlign: 'center',
    includeFontPadding: false,
  },

  logLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: COLORS.muted,
    marginTop: 3,
  },

  navLabel: {
    fontSize: 9,
    color: COLORS.muted,
    fontWeight: '500',
    marginTop: 5,
  },

  activeNavLabel: {
    color: COLORS.primary,
    fontWeight: '800',
  },

  navIndicator: {
    width: 17,
    height: 3,
    borderRadius: 2,
    backgroundColor: COLORS.accent,
    marginTop: 4,
  },

  /* CALENDAR */

  calendarOverlay: {
    flex: 1,
    backgroundColor: 'rgba(24, 48, 45, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  calendarModal: {
    width: '100%',
    maxWidth: 390,
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  calendarModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 22,
  },

  calendarHeading: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
  },

  calendarSubheading: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 4,
  },

  calendarClose: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: COLORS.section,
    justifyContent: 'center',
    alignItems: 'center',
  },

  monthNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },

  monthTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },

  monthArrow: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: COLORS.section,
    alignItems: 'center',
    justifyContent: 'center',
  },

  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },

  weekDayText: {
    width: '13%',
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.muted,
  },

  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },

  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
  },

  calendarDayText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.text,
  },

  selectedCalendarDay: {
    backgroundColor: COLORS.primary,
  },

  selectedCalendarDayText: {
    color: COLORS.white,
    fontWeight: '800',
  },

  todayCalendarDay: {
    backgroundColor: COLORS.section,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },

  todayCalendarDayText: {
    color: COLORS.primary,
    fontWeight: '800',
  },

  futureCalendarDay: {
    opacity: 0.35,
  },

  futureCalendarDayText: {
    color: COLORS.lightText,
  },

  selectedDateContainer: {
    backgroundColor: COLORS.section,
    borderRadius: 13,
    padding: 12,
    marginTop: 18,
  },

  selectedDateLabel: {
    fontSize: 10,
    color: COLORS.muted,
    fontWeight: '600',
  },

  selectedDateValue: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '700',
    marginTop: 4,
  },

  calendarDoneButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },

  calendarDoneText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  },
});
