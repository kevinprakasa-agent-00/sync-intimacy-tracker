import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PaperCard, Heading, Body } from './ui';
import { colors, typography, spacing, fonts } from '../theme';
import { Icons } from './Icons';

export const StreakCard = ({ streak, daysSince }) => {
  return (
    <PaperCard variant="elevated" style={styles.streakCard}>
      <View style={styles.streakHeader}>
        <Icons name={streak > 0 ? 'fire' : 'moon'} size={48} color={colors.blush[400]} />
        <View style={styles.streakTextContainer}>
          <Heading size="xl" style={styles.streakNumber}>
            {streak}
          </Heading>
          <Body size="sm" color="secondary">day{streak !== 1 ? 's' : ''} streak</Body>
        </View>
      </View>
      
      <View style={styles.divider} />
      
      <Body size="sm" color="muted" style={styles.daysSinceText}>
        {daysSince === 0 
          ? "Connected today" 
          : daysSince === 1 
          ? "1 day since last moment"
          : `${daysSince} days since last moment`}
      </Body>
    </PaperCard>
  );
};

export const TrendCard = ({ thisMonth, lastMonth, trend }) => {
  const isPositive = trend >= 0;
  
  return (
    <PaperCard style={styles.trendCard}>
      <Icons name="chart" size={24} color={colors.blush[400]} style={styles.trendIcon} />
      <Heading size="lg" style={styles.monthCount}>{thisMonth}</Heading>
      <Body size="sm" color="secondary">this month</Body>
      
      <View style={styles.trendRow}>
        <Text style={[styles.trendArrow, isPositive ? styles.positive : styles.negative]}>
          {isPositive ? '↑' : '↓'}
        </Text>
        <Body size="xs" color="muted">
          {trend === null ? 'First month!' : `${Math.abs(trend).toFixed(0)}% ${isPositive ? 'more' : 'less'}`}
        </Body>
      </View>
    </PaperCard>
  );
};

export const RhythmCard = ({ frequency }) => {
  const getRhythmLabel = () => {
    if (!frequency) return 'Just getting started';
    if (frequency <= 2) return 'Close companions';
    if (frequency <= 5) return 'Steady rhythm';
    if (frequency <= 7) return 'Weekly warriors';
    return 'Taking your time';
  };
  
  return (
    <PaperCard style={styles.rhythmCard}>
      <Icons name="clock" size={28} color={colors.blush[400]} style={styles.rhythmIcon} />
      <Heading size="md">Your Rhythm</Heading>
      
      <Body size="sm" color="secondary" style={styles.rhythmLabel}>
        {getRhythmLabel()}
      </Body>
      
      {frequency && (
        <Body size="xs" color="muted" style={styles.frequencyText}>
          Every {frequency.toFixed(1)} days
        </Body>
      )}
    </PaperCard>
  );
};

export const MoodDistribution = ({ moodStats }) => {
  const total = Object.values(moodStats).reduce((a, b) => a + b, 0);
  
  if (total === 0) {
    return (
      <PaperCard style={styles.moodCard}>
        <Heading size="md">Mood Map</Heading>
        <Body size="sm" color="muted" style={styles.emptyText}>
          Log moments to see your mood distribution
        </Body>
      </PaperCard>
    );
  }
  
  const sortedMoods = Object.entries(moodStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 4);
  
  return (
    <PaperCard style={styles.moodCard}>
      <Heading size="md" style={styles.moodTitle}>Mood Map</Heading>
      
      <View style={styles.moodBars}>
        {sortedMoods.map(([moodId, count]) => {
          const percentage = (count / total) * 100;
          return (
            <View key={moodId} style={styles.moodBarRow}>
              <View style={styles.barContainer}>
                <View 
                  style={[
                    styles.bar, 
                    { width: `${Math.max(percentage, 10)}%` }
                  ]} 
                />
              </View>
              <Body size="xs" style={styles.moodPercent}>
                {percentage.toFixed(0)}%
              </Body>
            </View>
          );
        })}
      </View>
    </PaperCard>
  );
};

const styles = StyleSheet.create({
  streakCard: {
    margin: spacing.md,
    padding: spacing.lg,
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakTextContainer: {
    flex: 1,
    marginLeft: spacing.md,
  },
  streakNumber: {
    marginBottom: -4,
  },
  divider: {
    height: 1,
    backgroundColor: colors.cream[400],
    marginVertical: spacing.md,
  },
  daysSinceText: {
    textAlign: 'center',
  },
  
  trendCard: {
    flex: 1,
    margin: spacing.xs,
    padding: spacing.md,
    alignItems: 'center',
  },
  trendIcon: {
    marginBottom: spacing.xs,
  },
  monthCount: {
    marginBottom: -2,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  trendArrow: {
    fontSize: 14,
    marginRight: 4,
    fontFamily: fonts.bold,
  },
  positive: {
    color: colors.success,
  },
  negative: {
    color: colors.error,
  },
  
  rhythmCard: {
    flex: 1,
    margin: spacing.xs,
    padding: spacing.md,
    alignItems: 'center',
  },
  rhythmIcon: {
    marginBottom: spacing.xs,
  },
  rhythmLabel: {
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  frequencyText: {
    marginTop: spacing.xs,
  },
  
  moodCard: {
    margin: spacing.md,
    padding: spacing.md,
  },
  moodTitle: {
    marginBottom: spacing.md,
  },
  moodBars: {
    gap: spacing.sm,
  },
  moodBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  barContainer: {
    flex: 1,
    height: 8,
    backgroundColor: colors.cream[300],
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: spacing.sm,
  },
  bar: {
    height: '100%',
    backgroundColor: colors.blush[200],
    borderRadius: 4,
  },
  moodPercent: {
    width: 32,
    textAlign: 'right',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
