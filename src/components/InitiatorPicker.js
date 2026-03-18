import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { INITIATORS, colors, typography, spacing, radii } from '../theme';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const InitiatorPicker = ({ selected, onSelect }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Who initiated?</Text>
      
      <View style={styles.optionsContainer}>
        {INITIATORS.map((initiator) => (
          <InitiatorOption
            key={initiator.id}
            initiator={initiator}
            selected={selected === initiator.id}
            onPress={() => onSelect(initiator.id)}
          />
        ))}
      </View>
    </View>
  );
};

const InitiatorOption = ({ initiator, selected, onPress }) => {
  const scale = useSharedValue(1);
  
  const handlePress = () => {
    scale.value = withSpring(0.95, { damping: 15 }, () => {
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
        styles.option,
        selected && styles.optionSelected,
        animatedStyle
      ]}
      activeOpacity={0.8}
    >
      <Text style={styles.emoji}>{initiator.emoji}</Text>
      <Text style={[styles.labelText, selected && styles.labelTextSelected]}>
        {initiator.label}
      </Text>
      <Text style={styles.description}>{initiator.description}</Text>
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  label: {
    fontFamily: typography.fonts.heading,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  option: {
    flex: 1,
    backgroundColor: colors.cream[200],
    borderRadius: radii.lg,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionSelected: {
    backgroundColor: colors.blush[100],
    borderColor: colors.blush[200],
  },
  emoji: {
    fontSize: 28,
    marginBottom: spacing.xs,
  },
  labelText: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.text.secondary,
  },
  labelTextSelected: {
    color: colors.text.primary,
  },
  description: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.xs,
    color: colors.text.muted,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
});
