import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, radii, shadows, spacing, typography } from '../theme';

export const PaperCard = ({ children, style, onPress }) => {
  const Wrapper = onPress ? TouchableOpacity : View;
  return (
    <Wrapper style={[styles.card, style]} onPress={onPress} activeOpacity={0.9}>
      {children}
    </Wrapper>
  );
};

export const Heading = ({ children, size = 'lg', color = 'primary', style, center }) => {
  const colorValue = colors.text[color] || colors.text.primary;
  const fontSize = typography.sizes[size] || typography.sizes.lg;

  return (
    <Text style={[
      styles.heading,
      { fontSize, color: colorValue },
      center && styles.center,
      style
    ]}>
      {children}
    </Text>
  );
};

export const Body = ({ children, size = 'base', color = 'primary', style, center }) => {
  const colorValue = colors.text[color] || colors.text.primary;
  const fontSize = typography.sizes[size] || typography.sizes.base;

  return (
    <Text style={[
      styles.body,
      { fontSize, color: colorValue },
      center && styles.center,
      style
    ]}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.md,
    ...shadows.soft,
  },
  heading: {
    fontWeight: typography.weights.bold,
  },
  body: {
    fontWeight: typography.weights.regular,
  },
  center: {
    textAlign: 'center',
  },
});
