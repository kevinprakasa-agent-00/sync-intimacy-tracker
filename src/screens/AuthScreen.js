import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  StatusBar,
  Platform
} from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withRepeat,
  withTiming,
  interpolate,
  Easing
} from 'react-native-reanimated';
import { useSyncStore } from '../context/store';
import { colors, typography, spacing, radii, fonts } from '../theme';
import { PaperCard, Heading, Body } from '../components/ui';
import { Icons } from '../components/Icons';

// Conditionally import local authentication (not available on web)
let LocalAuthentication = null;
if (Platform.OS !== 'web') {
  try {
    LocalAuthentication = require('expo-local-authentication');
  } catch (e) {
    console.log('expo-local-authentication not available');
  }
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const AuthScreen = ({ navigation }) => {
  const { setUILocked } = useSyncStore();
  const [authError, setAuthError] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  
  const lockScale = useSharedValue(1);
  const pulseScale = useSharedValue(1);
  
  // Gentle pulse animation for the lock
  useEffect(() => {
    pulseScale.value = withRepeat(
      withTiming(1.1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);
  
  const handleAuth = async () => {
    if (isAuthenticating) return;
    setIsAuthenticating(true);
    setAuthError(null);
    
    // Animate button press
    lockScale.value = withSpring(0.9, { damping: 10 }, () => {
      lockScale.value = withSpring(1, { damping: 15 });
    });
    
    // On web or if local auth not available, just unlock
    if (Platform.OS === 'web' || !LocalAuthentication) {
      setUILocked(false);
      setIsAuthenticating(false);
      return;
    }
    
    try {
      // Check if device supports biometrics
      const compatible = await LocalAuthentication.hasHardwareAsync();
      if (!compatible) {
        // If no biometrics, just unlock
        setUILocked(false);
        setIsAuthenticating(false);
        return;
      }
      
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (!enrolled) {
        setAuthError('No biometrics enrolled on this device');
        setIsAuthenticating(false);
        return;
      }
      
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Unlock Sync',
        fallbackLabel: 'Use passcode',
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
      });
      
      if (result.success) {
        setUILocked(false);
      } else {
        setAuthError('Authentication failed');
      }
    } catch (error) {
      setAuthError('Something went wrong');
      console.error('Auth error:', error);
    } finally {
      setIsAuthenticating(false);
    }
  };
  
  const lockAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: lockScale.value }],
  }));
  
  const pulseAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: interpolate(pulseScale.value, [1, 1.1], [0.3, 0]),
  }));
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Decorative blob background */}
      <View style={styles.blob1} />
      <View style={styles.blob2} />
      
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}>
            <Icons name="heart" size={64} color={colors.blush[400]} fill={true} />
          </View>
          <Heading size="xl" style={styles.appName}>Sync</Heading>
          <Body size="md" color="secondary" style={styles.tagline}>
            Your private intimacy journal
          </Body>
        </View>
        
        <View style={styles.lockContainer}>
          <Animated.View style={[styles.lockPulse, pulseAnimatedStyle]} />
          <AnimatedTouchable
            onPress={handleAuth}
            style={[styles.lockButton, lockAnimatedStyle]}
            activeOpacity={0.8}
          >
            <Icons name="lock" size={32} color={colors.text.primary} />
          </AnimatedTouchable>
          
          <Body size="sm" color="secondary" style={styles.hintText}>
            Tap to unlock
          </Body>
        </View>
        
        {authError && (
          <PaperCard style={styles.errorCard}>
            <Text style={styles.errorText}>{authError}</Text>
          </PaperCard>
        )}
        
        <View style={styles.privacyNote}>
          <Icons name="shield" size={16} color={colors.text.muted} />
          <Body size="xs" color="muted" style={styles.privacyText}>
            Your data stays on your device
          </Body>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  blob1: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: colors.blush[100],
    opacity: 0.5,
  },
  blob2: {
    position: 'absolute',
    bottom: -50,
    left: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.peach[100],
    opacity: 0.4,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing['3xl'],
  },
  logoIcon: {
    marginBottom: spacing.md,
  },
  appName: {
    marginBottom: spacing.xs,
  },
  tagline: {
    textAlign: 'center',
  },
  lockContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  lockPulse: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.blush[200],
  },
  lockButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.rose[200],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  hintText: {
    marginTop: spacing.md,
  },
  errorCard: {
    backgroundColor: colors.error + '20',
    marginHorizontal: spacing.xl,
    marginBottom: spacing.md,
  },
  errorText: {
    color: colors.error,
    textAlign: 'center',
    fontFamily: fonts.regular,
  },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: spacing.xl,
    gap: spacing.xs,
  },
  privacyText: {
    textAlign: 'center',
  },
});
