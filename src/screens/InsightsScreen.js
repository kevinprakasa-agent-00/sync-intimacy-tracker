import React, { useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Dimensions 
} from 'react-native';
import { format, subDays, startOfWeek, addDays, isSameDay } from 'date-fns';
import { useSyncStore } from '../context/store';
import { colors, typography, spacing, radii, shadows, MOODS } from '../theme';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - spacing.lg * 2;

export default function InsightsScreen() {
  const { moments } = useSyncStore();
  const momentCount = moments?.length || 0;

  // Calculate mood distribution
  const moodCounts = useMemo(() => {
    const counts = {};
    (moments || []).forEach(m => {
      counts[m.mood] = (counts[m.mood] || 0) + 1;
    });
    return counts;
  }, [moments]);

  const topMood = Object.entries(moodCounts)
    .sort((a, b) => b[1] - a[1])[0];
  const topMoodData = topMood ? MOODS.find(m => m.id === topMood[0]) : null;

  // Calculate weekly frequency (last 12 weeks)
  const weeklyData = useMemo(() => {
    const data = [];
    const today = new Date();
    for (let i = 11; i >= 0; i--) {
      const weekStart = startOfWeek(subDays(today, i * 7));
      const weekEnd = addDays(weekStart, 6);
      const count = moments.filter(m => {
        const date = new Date(m.date);
        return date >= weekStart && date <= weekEnd;
      }).length;
      data.push({
        label: format(weekStart, 'MMM d'),
        count,
      });
    }
    return data;
  }, [moments]);

  // Day of week patterns
  const dayOfWeekData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const counts = new Array(7).fill(0);
    (moments || []).forEach(m => {
      const day = new Date(m.date).getDay();
      counts[day]++;
    });
    return days.map((day, i) => ({ day, count: counts[i] }));
  }, [moments]);

  // Calculate streak
  const calculateStreak = () => {
    if (moments.length === 0) return 0;
    const sorted = [...moments].sort((a, b) => new Date(b.date) - new Date(a.date));
    const today = new Date();
    let streak = 0;
    let checkDate = new Date(today);
    
    for (const moment of sorted) {
      const momentDate = new Date(moment.date);
      const diffTime = Math.abs(checkDate - momentDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 1) {
        streak++;
        checkDate = momentDate;
      } else {
        break;
      }
    }
    return streak;
  };

  const streak = calculateStreak();

  // Calculate average frequency
  const avgFrequency = useMemo(() => {
    if (moments.length < 2) return null;
    const sorted = [...moments].sort((a, b) => new Date(a.date) - new Date(b.date));
    const first = new Date(sorted[0].date);
    const last = new Date(sorted[sorted.length - 1].date);
    const daysDiff = (last - first) / (1000 * 60 * 60 * 24);
    return daysDiff / (sorted.length - 1);
  }, [moments]);

  const maxWeeklyCount = Math.max(...weeklyData.map(d => d.count), 1);
  const maxDayCount = Math.max(...dayOfWeekData.map(d => d.count), 1);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Insights</Text>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Stats Overview Cards */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>🔥</Text>
            <Text style={styles.statValue}>{streak}</Text>
            <Text style={styles.statLabel}>day streak</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>📊</Text>
            <Text style={styles.statValue}>{momentCount}</Text>
            <Text style={styles.statLabel}>total moments</Text>
          </View>
          
          {avgFrequency && (
            <View style={styles.statCard}>
              <Text style={styles.statEmoji}>⏱️</Text>
              <Text style={styles.statValue}>{Math.round(avgFrequency)}</Text>
              <Text style={styles.statLabel}>days avg</Text>
            </View>
          )}
        </View>

        {/* Top Mood Card */}
        {topMoodData && (
          <View style={[styles.insightCard, { backgroundColor: topMoodData.color + '30' }]}>
            <Text style={styles.insightEmoji}>{topMoodData.emoji}</Text>
            <Text style={styles.insightValue}>{topMoodData.label}</Text>
            <Text style={styles.insightLabel}>your most common mood</Text>
            <Text style={styles.insightCount}>{topMood[1]} times</Text>
          </View>
        )}

        {/* Weekly Frequency Chart */}
        {momentCount > 0 && (
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>📈 Weekly Frequency (12 weeks)</Text>
            <View style={styles.chartContainer}>
              {weeklyData.map((item, index) => (
                <View key={index} style={styles.barContainer}>
                  <View 
                    style={[
                      styles.bar, 
                      { 
                        height: (item.count / maxWeeklyCount) * 100,
                        backgroundColor: item.count > 0 ? colors.blush[200] : colors.cream[300]
                      }
                    ]} 
                  />
                  <Text style={styles.barLabel}>{item.label}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Day of Week Pattern */}
        {momentCount > 0 && (
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>📅 Day of Week Pattern</Text>
            <View style={styles.dayChartContainer}>
              {dayOfWeekData.map((item, index) => (
                <View key={index} style={styles.dayBarContainer}>
                  <View style={styles.dayBarWrapper}>
                    <View 
                      style={[
                        styles.dayBar, 
                        { 
                          width: (item.count / maxDayCount) * 100,
                          backgroundColor: item.count > 0 ? colors.peach[300] : colors.cream[300]
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.dayLabel}>{item.day}</Text>
                  <Text style={styles.dayCount}>{item.count}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Mood Distribution */}
        {momentCount > 0 && (
          <View style={styles.chartCard}
          >
            <Text style={styles.chartTitle}>🎭 Mood Distribution</Text>
            <View style={styles.moodGrid}
003e
              {MOODS.map(mood => {
                const count = moodCounts[mood.id] || 0;
                const percentage = momentCount > 0 ? (count / momentCount) * 100 : 0;
                return (
                  <View key={mood.id} style={styles.moodItem}
                  >
                    <View style={styles.moodRow}
                    >
                      <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                      <Text style={styles.moodName}>{mood.label}</Text>
                      <Text style={styles.moodPercent}>{Math.round(percentage)}%</Text>
                    </View>
                    <View style={styles.moodBarBg}
                    >
                      <View 
                        style={[
                          styles.moodBarFill,
                          { 
                            width: `${percentage}%`,
                            backgroundColor: mood.color 
                          }
                        ]} 
                      />
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Pattern Recognition */}
        <View style={styles.patternCard}>
          <Text style={styles.patternTitle}>💡 Pattern Recognition</Text>
          <Text style={styles.patternText}>
            {momentCount === 0 
              ? "Log more moments to see patterns in your intimacy rhythm."
              : momentCount < 5
              ? "Keep logging! Once you have 5+ moments, we'll start showing patterns."
              : topMoodData 
              ? `You're feeling ${topMoodData.label.toLowerCase()} most often. ${topMoodData.label === 'Magical' ? 'Keep that spark alive! ✨' : topMoodData.label === 'Passionate' ? 'Fire still burning! 🔥' : 'Sweet and steady! 💕'}`
              : "You're building a beautiful connection story. Keep it up!"}
          </Text>        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.md,
    alignItems: 'center',
    ...shadows.soft,
  },
  statEmoji: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  statValue: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
  },
  statLabel: {
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  insightCard: {
    borderRadius: radii.lg,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    alignItems: 'center',
    ...shadows.soft,
  },
  insightEmoji: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  insightValue: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
  },
  insightLabel: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  insightCount: {
    fontSize: typography.sizes.sm,
    color: colors.text.muted,
    marginTop: spacing.xs,
  },
  chartCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.soft,
  },
  chartTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    paddingTop: spacing.md,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
  },
  bar: {
    width: 12,
    borderRadius: 6,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 9,
    color: colors.text.muted,
    marginTop: spacing.xs,
    transform: [{ rotate: '-45deg' }],
  },
  dayChartContainer: {
    gap: spacing.sm,
  },
  dayBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayBarWrapper: {
    flex: 1,
    height: 20,
    backgroundColor: colors.cream[200],
    borderRadius: radii.sm,
    marginRight: spacing.sm,
    overflow: 'hidden',
  },
  dayBar: {
    height: '100%',
    borderRadius: radii.sm,
  },
  dayLabel: {
    width: 40,
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
  dayCount: {
    width: 30,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
    textAlign: 'right',
  },
  moodGrid: {
    gap: spacing.md,
  },
  moodItem: {
    gap: spacing.xs,
  },
  moodRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moodEmoji: {
    fontSize: 18,
    marginRight: spacing.xs,
  },
  moodName: {
    flex: 1,
    fontSize: typography.sizes.sm,
    color: colors.text.primary,
  },
  moodPercent: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
  },
  moodBarBg: {
    height: 8,
    backgroundColor: colors.cream[200],
    borderRadius: radii.full,
    overflow: 'hidden',
  },
  moodBarFill: {
    height: '100%',
    borderRadius: radii.full,
  },
  patternCard: {
    backgroundColor: colors.blush[50],
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginTop: spacing.md,
  },
  patternTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  patternText: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    lineHeight: 22,
  },
});
