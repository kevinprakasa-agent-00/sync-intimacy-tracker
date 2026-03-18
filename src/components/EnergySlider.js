import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  interpolateColor
} from 'react-native-reanimated';
import { colors, typography, spacing } from '../theme';
import * as Haptics from 'expo-haptics';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const EnergySlider = ({ value, onChange, min = 1, max = 5 }) => {
  const hearts = Array.from({ length: max }, (_, i) => i + 1);
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Energy level</Text>
        <Text style={styles.valueText}>{getEnergyLabel(value)}</Text>
      </View>
      
      <View style={styles.heartsContainer}>
        {hearts.map((level) => (
          <HeartButton
            key={level}
            level={level}
            filled={level <= value}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onChange(level);
            }}
          />
        ))}
      </View>
    </View>
  );
};

const HeartButton = ({ level, filled, onPress }) => {
  const scale = useSharedValue(1);
  
  const handlePress = () => {
    scale.value = withSpring(1.3, { damping: 10 }, () => {
      scale.value = withSpring(1, { damping: 12 });
    });
    onPress();
  };
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  return (
    <AnimatedTouchable
      onPress={handlePress}
      style={[styles.heartButton, animatedStyle]}
      activeOpacity={0.7}
    >
      <Text style={[styles.heart, filled && styles.heartFilled]}>
        {filled ? '❤️' : '🤍'}
      </Text>
    </AnimatedTouchable>
  );
};

const getEnergyLabel = (value) => {
  const labels = {
    1: 'Gentle',
    2: 'Relaxed',
    3: 'Balanced',
    4: 'Energetic',
    5: 'Intense',
  };
  return labels[value] || 'Balanced';
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  label: {
    fontFamily: typography.fonts.heading,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
  },
  valueText: {
    fontFamily: typography.fonts.accent,
    fontSize: typography.sizes.md,
    color: colors.rose[300],
  },
  heartsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
  },
  heartButton: {
    padding: spacing.sm,
  },
  heart: {
    fontSize: 32,
    opacity: 0.4,
  },
  heartFilled: {
    opacity: 1,
  },
});
