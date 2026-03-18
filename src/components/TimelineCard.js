import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { formatDate, formatTime } from '../utils/helpers';
import { MOODS, colors, typography, spacing, radii, shadows } from '../theme';

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
          <Text style={styles.moodEmoji}>{mood.emoji}</Text>
          <Text style={styles.moodLabel}>{mood.label}</Text>
        </View>
        
        {/* Caption area */}
        <View style={styles.captionArea}>
          <Text style={styles.dateText}>{formatDate(moment.date)}</Text>
          <Text style={styles.timeText}>{formatTime(moment.date)}</Text>
          
          {/* Energy hearts */}
          <View style={styles.energyRow}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Text key={i} style={styles.energyHeart}>
                {i < moment.energy ? '❤️' : '🤍'}
              </Text>
            ))}
          </View>
          
          {/* Context tags */}
          {moment.tags?.length > 0 && (
            <View style={styles.tagsRow}>
              {moment.tags.slice(0, 2).map((tagId, i) => {
                const tag = getTagById(tagId);
                return tag ? (
                  <Text key={i} style={styles.tagEmoji}>{tag.emoji}</Text>
                ) : null;
              })}
              {moment.tags.length > 2 && (
                <Text style={styles.moreTags}>+{moment.tags.length - 2}</Text>
              )}
            </View>
          )}
          
          {/* Initiator */}
          <View style={styles.initiatorRow}>
            <Text style={styles.initiatorText}>
              {getInitiatorEmoji(moment.initiator)}
            </Text>
          </View>
        </View>
      </View>
    </AnimatedTouchable>
  );
};

// Helper functions
const getTagById = (id) => {
  const tags = [
    { id: 'late_night', emoji: '🌙' },
    { id: 'morning_surprise', emoji: '🌅' },
    { id: 'date_night', emoji: '🍷' },
    { id: 'spontaneous', emoji: '💫' },
    { id: 'after_work', emoji: '💼' },
    { id: 'weekend_vibes', emoji: '🏖️' },
    { id: 'celebration', emoji: '🎉' },
    { id: 'makeup', emoji: '💕' },
    { id: 'vacation', emoji: '✈️' },
    { id: 'anniversary', emoji: '💍' },
  ];
  return tags.find(t => t.id === id);
};

const getInitiatorEmoji = (initiator) => {
  const map = {
    you: '💁',
    partner: '💁‍♀️',
    mutual: '💑',
  };
  return map[initiator] || '💑';
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
    ...shadows.medium,
  },
  imageArea: {
    width: 220,
    height: 160,
    borderRadius: radii.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moodEmoji: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  moodLabel: {
    fontFamily: typography.fonts.heading,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
  },
  captionArea: {
    paddingTop: spacing.md,
    alignItems: 'center',
  },
  dateText: {
    fontFamily: typography.fonts.accent,
    fontSize: typography.sizes.lg,
    color: colors.text.primary,
  },
  timeText: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
    marginTop: 2,
  },
  energyRow: {
    flexDirection: 'row',
    marginTop: spacing.sm,
    gap: 2,
  },
  energyHeart: {
    fontSize: 12,
  },
  tagsRow: {
    flexDirection: 'row',
    marginTop: spacing.sm,
    gap: spacing.xs,
    alignItems: 'center',
  },
  tagEmoji: {
    fontSize: 14,
  },
  moreTags: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
  },
  initiatorRow: {
    marginTop: spacing.sm,
  },
  initiatorText: {
    fontSize: 16,
  },
});
