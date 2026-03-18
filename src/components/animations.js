import React, { useEffect, useCallback } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withRepeat, 
  withTiming,
  interpolate,
  Easing
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { colors, radii, shadows } from '../theme';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const FloatingAddButton = ({ onPress, size = 72, pulse = true }) => {
  const scale = useSharedValue(1);
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.5);
  
  // Heartbeat pulse animation
  useEffect(() => {
    if (!pulse) return;
    
    pulseScale.value = withRepeat(
      withTiming(1.4, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    
    pulseOpacity.value = withRepeat(
      withTiming(0, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [pulse]);
  
  const handlePress = useCallback(() => {
    // Haptic heartbeat feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // Button press animation
    scale.value = withSpring(0.9, { damping: 10, stiffness: 400 }, () => {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    });
    
    onPress?.();
  }, [onPress]);
  
  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  const pulseAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));
  
  return (
    <AnimatedTouchable
      onPress={handlePress}
      style={[
        styles.button, 
        { width: size, height: size, borderRadius: size / 2 },
        buttonAnimatedStyle
      ]}
      activeOpacity={0.9}
    >
      {pulse && (
        <Animated.View 
          style={[
            styles.pulseRing, 
            { width: size, height: size, borderRadius: size / 2 },
            pulseAnimatedStyle
          ]} 
        />
      )}
      <Animated.View style={[styles.innerButton, { width: size, height: size, borderRadius: size / 2 }]}>
        <Text style={styles.plusIcon}>+</Text>
      </Animated.View>
    </AnimatedTouchable>
  );
};

// Simple Text component for the plus sign
const Text = ({ children, style }) => (
  <Animated.Text style={style}>{children}</Animated.Text>
);

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.large,
  },
  pulseRing: {
    position: 'absolute',
    backgroundColor: colors.blush[200],
  },
  innerButton: {
    backgroundColor: colors.blush[200],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.blush[100],
  },
  plusIcon: {
    fontSize: 36,
    fontWeight: '300',
    color: colors.text.primary,
    marginTop: -2,
  },
});

// Streak flame with gentle animation
export const StreakFlame = ({ streak, size = 32 }) => {
  const flameScale = useSharedValue(1);
  const flameRotate = useSharedValue(0);
  
  useEffect(() => {
    flameScale.value = withRepeat(
      withTiming(1.1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    
    flameRotate.value = withRepeat(
      withTiming(3, { duration: 600, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: flameScale.value },
      { rotate: `${flameRotate.value}deg` }
    ],
  }));
  
  return (
    <Animated.Text style={[{ fontSize: size }, animatedStyle]}>
      {streak > 0 ? '🔥' : '💤'}
    </Animated.Text>
  );
};

// Heart burst animation for save action
export const HeartBurst = ({ trigger, onComplete }) => {
  const hearts = Array.from({ length: 6 });
  const heartAnimations = hearts.map(() => ({
    scale: useSharedValue(0),
    translateY: useSharedValue(0),
    translateX: useSharedValue(0),
    opacity: useSharedValue(1),
  }));
  
  useEffect(() => {
    if (!trigger) return;
    
    heartAnimations.forEach((anim, i) => {
      const angle = (i * 60) * (Math.PI / 180);
      const distance = 60 + Math.random() * 40;
      
      anim.scale.value = withSpring(1, { damping: 12 });
      anim.translateX.value = withTiming(Math.cos(angle) * distance, { duration: 600 });
      anim.translateY.value = withTiming(Math.sin(angle) * distance - 30, { duration: 600 });
      anim.opacity.value = withTiming(0, { duration: 600 }, () => {
        if (i === 0) onComplete?.();
      });
    });
  }, [trigger]);
  
  return (
    <View style={styles.burstContainer}>
      {hearts.map((_, i) => {
        const anim = heartAnimations[i];
        const animatedStyle = useAnimatedStyle(() => ({
          transform: [
            { translateX: anim.translateX.value },
            { translateY: anim.translateY.value },
            { scale: anim.scale.value }
          ],
          opacity: anim.opacity.value,
        }));
        
        return (
          <Animated.Text key={i} style={[styles.burstHeart, animatedStyle]}>
            ❤️
          </Animated.Text>
        );
      })}
    </View>
  );
};

// Breathing animation wrapper
export const BreatheView = ({ children, duration = 4000, intensity = 0.02 }) => {
  const scale = useSharedValue(1);
  
  useEffect(() => {
    scale.value = withRepeat(
      withTiming(1 + intensity, { duration: duration / 2, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  return (
    <Animated.View style={animatedStyle}>
      {children}
    </Animated.View>
  );
};

const styles2 = StyleSheet.create({
  burstContainer: {
    position: 'absolute',
    width: 1,
    height: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  burstHeart: {
    position: 'absolute',
    fontSize: 24,
  },
});

// Merge styles
Object.assign(styles, styles2);
