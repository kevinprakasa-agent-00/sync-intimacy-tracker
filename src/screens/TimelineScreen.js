import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { format } from 'date-fns';
import { useSyncStore } from '../context/store';
import { colors, typography, spacing, radii, shadows, MOODS } from '../theme';

export default function TimelineScreen() {
  const { moments } = useSyncStore();
  
  const sortedMoments = [...(moments || [])].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );
  
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Moments</Text>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {sortedMoments.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📝</Text>
            <Text style={styles.emptyText}>No moments yet</Text>
            <Text style={styles.emptySubtext}>Tap + to log your first moment</Text>
          </View>
        ) : (
          sortedMoments.map((moment, index) => {
            const mood = MOODS.find(m => m.id === moment.mood) || MOODS[0];
            return (
              <View key={index} style={styles.momentCard}>
                <View style={styles.momentHeader}>
                  <Text style={styles.momentDate}>
                    {format(new Date(moment.date), 'MMM d, yyyy')}
                  </Text>
                  <View style={[styles.moodBadge, { backgroundColor: mood.color }]}>
                    <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                    <Text style={styles.moodLabel}>{mood.label}</Text>
                  </View>
                </View>
                {moment.notes && (
                  <Text style={styles.momentNotes}>{moment.notes}</Text>
                )}
              </View>
            );
          })
        )}
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
  emptyState: {
    alignItems: 'center',
    marginTop: spacing['3xl'],
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: typography.sizes.lg,
    color: colors.text.secondary,
  },
  emptySubtext: {
    fontSize: typography.sizes.sm,
    color: colors.text.muted,
    marginTop: spacing.xs,
  },
  momentCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.soft,
  },
  momentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  momentDate: {
    fontSize: typography.sizes.sm,
    color: colors.text.muted,
  },
  moodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.md,
  },
  moodEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
  moodLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    color: colors.text.primary,
  },
  momentNotes: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    fontStyle: 'italic',
  },
});
