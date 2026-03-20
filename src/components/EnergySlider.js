import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
} from 'react-native-reanimated';
import { colors, typography, spacing, fonts } from '../theme';
import { Icons } from './Icons';

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
            onPress={() => onChange(level)}
          />
        ))}
      </View>
    </View>
  );
};

const HeartButton = ({ filled, onPress }) => {
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
      <Icons 
        name="heart" 
        size={32} 
        color={filled ? colors.heart : colors.cream[400]} 
        fill={filled}
      />
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
    fontFamily: fonts.semibold,
    fontSize: typography.sizes.md,
    color: colors.text.primary,
  },
  valueText: {
    fontFamily: fonts.medium,
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
});
