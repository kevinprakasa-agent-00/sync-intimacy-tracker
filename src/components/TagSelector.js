import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { CONTEXT_TAGS, colors, typography, spacing, radii } from '../theme';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const TagSelector = ({ selectedTags, onToggleTag }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Add context</Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {CONTEXT_TAGS.map((tag) => (
          <TagChip
            key={tag.id}
            tag={tag}
            selected={selectedTags.includes(tag.id)}
            onPress={() => onToggleTag(tag.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const TagChip = ({ tag, selected, onPress }) => {
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
        styles.chip,
        selected && styles.chipSelected,
        animatedStyle
      ]}
      activeOpacity={0.8}
    >
      <Text style={styles.emoji}>{tag.emoji}</Text>
      <Text style={[styles.labelText, selected && styles.labelTextSelected]}>
        {tag.label}
      </Text>
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cream[300],
    borderRadius: radii.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  chipSelected: {
    backgroundColor: colors.peach[200],
    borderColor: colors.peach[300],
  },
  emoji: {
    fontSize: 16,
    marginRight: 6,
  },
  labelText: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
  labelTextSelected: {
    color: colors.text.primary,
    fontWeight: typography.weights.medium,
  },
});
