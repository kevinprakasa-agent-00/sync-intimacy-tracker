import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { CONTEXT_TAGS, colors, typography, spacing, radii, fonts } from '../theme';
import { Icons } from './Icons';

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
      <Icons name={tag.icon} size={16} color={selected ? colors.text.primary : colors.text.secondary} />
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
    fontFamily: fonts.semibold,
    fontSize: typography.sizes.md,
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
  labelText: {
    fontFamily: fonts.regular,
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginLeft: 6,
  },
  labelTextSelected: {
    fontFamily: fonts.medium,
    color: colors.text.primary,
  },
});
