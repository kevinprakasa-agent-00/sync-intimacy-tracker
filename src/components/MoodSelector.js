import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { MOODS, colors, typography, spacing, radii } from '../theme';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const MoodSelector = ({ selectedMood, onSelectMood }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>How did it feel?</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {MOODS.map((mood) => (
          <MoodOption
            key={mood.id}
            mood={mood}
            selected={selectedMood?.id === mood.id}
            onPress={() => onSelectMood(mood)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const MoodOption = ({ mood, selected, onPress }) => {
  const scale = useSharedValue(1);
  
  const handlePress = () => {
    scale.value = withSpring(0.9, { damping: 15 }, () => {
      scale.value = withSpring(1, { damping: 15 });
    });
    onPress();
  };
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  return (
    <AnimatedTouchable
      onPress={handlePress}
      style={[
        styles.moodOption,
        { backgroundColor: mood.color },
        selected && styles.moodOptionSelected,
        animatedStyle
      ]}
      activeOpacity={0.8}
    >
      <Text style={styles.moodEmoji}>{mood.emoji}</Text>
      <Text style={styles.moodLabel}>{mood.label}</Text>
      {selected && <View style={styles.selectedIndicator} />}
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
  },
  label: {
    fontFamily: typography.fonts.heading,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
    marginLeft: spacing.md,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  moodOption: {
    width: 80,
    height: 100,
    borderRadius: radii.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
    borderWidth: 3,
    borderColor: 'transparent',
    ...Platform.select({
      ios: {
        shadowColor: colors.rose[200],
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  moodOptionSelected: {
    borderColor: colors.text.primary,
    transform: [{ scale: 1.05 }],
  },
  moodEmoji: {
    fontSize: 28,
    marginBottom: spacing.xs,
  },
  moodLabel: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    color: colors.text.primary,
  },
  selectedIndicator: {
    position: 'absolute',
    bottom: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.text.primary,
  },
});
