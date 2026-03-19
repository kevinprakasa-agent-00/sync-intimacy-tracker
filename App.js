import React, { useEffect, useState, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import { colors, typography, spacing, fonts } from './src/theme';
import { useSyncStore } from './src/context/store';
import { Icons } from './src/components/Icons';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import TimelineScreen from './src/screens/TimelineScreen';
import InsightsScreen from './src/screens/InsightsScreen';
import LogMomentScreen from './src/screens/LogMomentScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Keep splash screen visible while loading fonts
SplashScreen.preventAutoHideAsync();

const TabIcon = ({ iconName, focused }) => (
  <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
    <Icons 
      name={iconName} 
      size={22} 
      color={focused ? colors.text.primary : colors.text.muted} 
    />
  </View>
);

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: styles.tabBar,
      tabBarActiveTintColor: colors.text.primary,
      tabBarInactiveTintColor: colors.text.muted,
      tabBarLabelStyle: {
        fontFamily: fonts.body,
        fontSize: 12,
      },
    }}
  >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        tabBarIcon: ({ focused }) => <TabIcon iconName="home" focused={focused} />,
        tabBarLabel: 'Home',
      }}
    />
    <Tab.Screen
      name="Timeline"
      component={TimelineScreen}
      options={{
        tabBarIcon: ({ focused }) => <TabIcon iconName="timeline" focused={focused} />,
        tabBarLabel: 'Timeline',
      }}
    />
    <Tab.Screen
      name="Insights"
      component={InsightsScreen}
      options={{
        tabBarIcon: ({ focused }) => <TabIcon iconName="insights" focused={focused} />,
        tabBarLabel: 'Insights',
      }}
    />
  </Tab.Navigator>
);

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadResources() {
      try {
        await Font.loadAsync({
          'Quicksand-Light': require('./assets/fonts/Quicksand-Light.ttf'),
          'Quicksand-Regular': require('./assets/fonts/Quicksand-Regular.ttf'),
          'Quicksand-Medium': require('./assets/fonts/Quicksand-Medium.ttf'),
          'Quicksand-SemiBold': require('./assets/fonts/Quicksand-SemiBold.ttf'),
          'Quicksand-Bold': require('./assets/fonts/Quicksand-Bold.ttf'),
          'Inter-Regular': require('./assets/fonts/Inter-Regular.ttf'),
          'Inter-Medium': require('./assets/fonts/Inter-Medium.ttf'),
          'Inter-Bold': require('./assets/fonts/Inter-Bold.ttf'),
          'Caveat-Regular': require('./assets/fonts/Caveat-Regular.ttf'),
          'Caveat-Bold': require('./assets/fonts/Caveat-Bold.ttf'),
        });
      } catch (e) {
        console.warn('Error loading fonts:', e);
      } finally {
        setFontsLoaded(true);
      }
    }

    loadResources();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider onLayout={onLayoutRootView}>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen 
            name="LogMoment" 
            component={LogMomentScreen}
            options={{ presentation: 'modal' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopWidth: 0,
    elevation: 8,
    shadowColor: colors.rose[200],
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    height: Platform.OS === 'web' ? 70 : 80,
    paddingBottom: Platform.OS === 'web' ? 10 : 20,
    paddingTop: 10,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  iconContainerFocused: {
    backgroundColor: colors.blush[100],
  },
});
