import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { formatDate, formatTime } from '../utils/helpers';
import { MOODS, INITIATORS, CONTEXT_TAGS, colors, typography, spacing, radii, shadows, fonts } from '../theme';
import { Icons, MoodIcon } from './Icons';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const TimelineCard = ({ moment, index, onPress, rotation }) => {
  const scale = useSharedValue(1);
  const mood = MOODS.find(m => m.id === moment.mood) || MOODS[0];
  
  // Calculate slight rotation for polaroid effect
  const cardRotation = rotation !== undefined 
    ? rotation 
    : (index % 2 === 0 ? -2 : 2) + (Math.random() * 2 - 1);
  
  const handlePress = () => {
    scale.value = withSpring(0.97, { damping: 15 }, () => {
      scale.value = withSpring(1, { damping: 15 });
    });
    onPress?.(moment);
  };
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${cardRotation}deg` },
      { scale: scale.value }
    ],
  }));
  
  return (
    <AnimatedTouchable
      onPress={handlePress}
      style={[styles.card, animatedStyle]}
      activeOpacity={0.95}
    >
      {/* Polaroid frame */}
      <View style={styles.polaroid}>
        {/* Image area with mood color */}
        <View style={[styles.imageArea, { backgroundColor: mood.color }]}>
          <MoodIcon moodId={mood.id} size={48} color={colors.text.primary} />
          <Text style={styles.moodLabel}>{mood.label}</Text>
        </View>
        
        {/* Caption area */}
        <View style={styles.captionArea}>
          <Text style={styles.dateText}>{formatDate(moment.date)}</Text>
          <Text style={styles.timeText}>{formatTime(moment.date)}</Text>
          
          {/* Energy hearts */}
          <View style={styles.energyRow}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Icons 
                key={i} 
                name="heart" 
                size={12} 
                color={i < moment.energy ? colors.heart : colors.cream[400]}
                fill={i < moment.energy}
              />
            ))}
          </View>
          
          {/* Context tags */}
          {moment.tags?.length > 0 && (
            <View style={styles.tagsRow}>
              {moment.tags.slice(0, 2).map((tagId, i) => {
                const tag = CONTEXT_TAGS.find(t => t.id === tagId);
                return tag ? (
                  <Icons key={i} name={tag.icon} size={14} color={colors.text.secondary} />
                ) : null;
              })}
              {moment.tags.length > 2 && (
                <Text style={styles.moreTags}>+{moment.tags.length - 2}</Text>
              )}
            </View>
          )}
          
          {/* Initiator */}
          <View style={styles.initiatorRow}>
            <Icons 
              name={getInitiatorIcon(moment.initiator)} 
              size={16} 
              color={colors.text.secondary} 
            />
          </View>
        </View>
      </View>
    </AnimatedTouchable>
  );
};

// Helper function
const getInitiatorIcon = (initiator) => {
  const initiatorData = INITIATORS.find(i => i.id === initiator);
  return initiatorData?.icon || 'link';
};

const styles = StyleSheet.create({
  card: {
    marginVertical: spacing.sm,
    marginHorizontal: spacing.md,
    alignSelf: 'center',
  },
  polaroid: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: 12,
    ...shadows.soft,
  },
  imageArea: {
    width: 220,
    height: 160,
    borderRadius: radii.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moodLabel: {
    fontFamily: fonts.bold,
    fontSize: typography.sizes.lg,
    color: colors.text.primary,
    marginTop: spacing.sm,
  },
  captionArea: {
    paddingTop: spacing.md,
    alignItems: 'center',
  },
  dateText: {
    fontFamily: fonts.semibold,
    fontSize: typography.sizes.lg,
    color: colors.text.primary,
  },
  timeText: {
    fontFamily: fonts.regular,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
    marginTop: 2,
  },
  energyRow: {
    flexDirection: 'row',
    marginTop: spacing.sm,
    gap: 2,
  },
  tagsRow: {
    flexDirection: 'row',
    marginTop: spacing.sm,
    gap: spacing.xs,
    alignItems: 'center',
  },
  moreTags: {
    fontFamily: fonts.regular,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
  },
  initiatorRow: {
    marginTop: spacing.sm,
  },
});
