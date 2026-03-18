import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSyncStore } from '../context/store';
import { colors, typography, spacing, radii, shadows } from '../theme';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { moments, getStreak, getThisMonthCount } = useSyncStore();
  
  const streak = getStreak ? getStreak() : 0;
  const thisMonth = getThisMonthCount ? getThisMonthCount() : moments?.length || 0;
  
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.logoEmoji}>💕</Text>
          <Text style={styles.appName}>Sync</Text>
          <Text style={styles.tagline}>Your private intimacy journal</Text>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{streak}</Text>
            <Text style={styles.statLabel}>day streak</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{thisMonth}</Text>
            <Text style={styles.statLabel}>this month</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{moments?.length || 0}</Text>
            <Text style={styles.statLabel}>total</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.logButton}
          onPress={() => navigation.navigate('LogMoment')}
        >
          <Text style={styles.logButtonText}>+ Log Moment</Text>
        </TouchableOpacity>
        
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginTop: Platform.OS === 'web' ? 40 : 60,
    marginBottom: spacing.xl,
  },
  logoEmoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  appName: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  tagline: {
    fontSize: typography.sizes.base,
    color: colors.text.secondary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginHorizontal: spacing.xs,
    alignItems: 'center',
    ...shadows.soft,
  },
  statNumber: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
  },
  statLabel: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  logButton: {
    backgroundColor: colors.blush[200],
    borderRadius: radii.full,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    ...shadows.soft,
  },
  logButtonText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
  },
});
