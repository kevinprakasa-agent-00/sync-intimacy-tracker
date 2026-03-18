import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSyncStore } from '../context/store';
import { colors, typography, spacing, radii, shadows, MOODS } from '../theme';

export default function InsightsScreen() {
  const { moments } = useSyncStore();
  const momentCount = moments?.length || 0;
  
  // Calculate mood distribution
  const moodCounts = {};
  (moments || []).forEach(m => {
    moodCounts[m.mood] = (moodCounts[m.mood] || 0) + 1;
  });
  
  const topMood = Object.entries(moodCounts)
    .sort((a, b) => b[1] - a[1])[0];
  const topMoodData = topMood ? MOODS.find(m => m.id === topMood[0]) : null;
  
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Insights</Text>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.insightCard}>
          <Text style={styles.insightEmoji}>📊</Text>
          <Text style={styles.insightValue}>{momentCount}</Text>
          <Text style={styles.insightLabel}>moments logged</Text>
        </View>
        
        {topMoodData && (
          <View style={styles.insightCard}>
            <Text style={styles.insightEmoji}>{topMoodData.emoji}</Text>
            <Text style={styles.insightValue}>{topMoodData.label}</Text>
            <Text style={styles.insightLabel}>your most common mood</Text>
          </View>
        )}
        
        <View style={styles.patternCard}>
          <Text style={styles.patternTitle}>💡 Pattern Recognition</Text>
          <Text style={styles.patternText}>
            Log more moments to see patterns in your intimacy rhythm.
          </Text>
        </View>
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
  insightCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.xl,
    marginBottom: spacing.md,
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
