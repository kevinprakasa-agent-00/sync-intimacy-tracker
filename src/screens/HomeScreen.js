import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSyncStore } from '../context/store';
import { colors, typography, spacing, radii, shadows, fonts } from '../theme';
import { Icons } from '../components/Icons';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { moments, getStreak, getThisMonthCount } = useSyncStore();
  
  const streak = getStreak ? getStreak() : 0;
  const thisMonth = getThisMonthCount ? getThisMonthCount() : moments?.length || 0;
  
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Icons name="heart" size={64} color={colors.blush[400]} fill={true} />
          </View>
          <Text style={styles.appName}>Sync</Text>
          <Text style={styles.tagline}>Your private intimacy journal</Text>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Icons name="fire" size={24} color={colors.blush[400]} style={styles.statIcon} />
            <Text style={styles.statNumber}>{streak}</Text>
            <Text style={styles.statLabel}>day streak</Text>
          </View>
          
          <View style={styles.statCard}>
            <Icons name="calendar" size={24} color={colors.blush[400]} style={styles.statIcon} />
            <Text style={styles.statNumber}>{thisMonth}</Text>
            <Text style={styles.statLabel}>this month</Text>
          </View>
          
          <View style={styles.statCard}>
            <Icons name="chart" size={24} color={colors.blush[400]} style={styles.statIcon} />
            <Text style={styles.statNumber}>{moments?.length || 0}</Text>
            <Text style={styles.statLabel}>total</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.logButton}
          onPress={() => navigation.navigate('LogMoment')}
        >
          <View style={styles.logButtonContent}>
            <Icons name="plus" size={20} color={colors.text.primary} />
            <Text style={styles.logButtonText}>Log Moment</Text>
          </View>
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
  logoContainer: {
    marginBottom: spacing.md,
  },
  appName: {
    fontSize: typography.sizes['2xl'],
    fontFamily: fonts.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  tagline: {
    fontSize: typography.sizes.base,
    fontFamily: fonts.regular,
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
  statIcon: {
    marginBottom: spacing.xs,
  },
  statNumber: {
    fontSize: typography.sizes.xl,
    fontFamily: fonts.bold,
    color: colors.text.primary,
  },
  statLabel: {
    fontSize: typography.sizes.sm,
    fontFamily: fonts.regular,
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
  logButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  logButtonText: {
    fontSize: typography.sizes.md,
    fontFamily: fonts.semibold,
    color: colors.text.primary,
  },
});
