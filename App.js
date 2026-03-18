import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { colors, typography, spacing } from './src/theme';
import { useSyncStore } from './src/context/store';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import TimelineScreen from './src/screens/TimelineScreen';
import InsightsScreen from './src/screens/InsightsScreen';
import LogMomentScreen from './src/screens/LogMomentScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabIcon = ({ emoji, focused }) => (
  <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
    <Text style={[styles.iconEmoji, focused && styles.iconEmojiFocused]}>
      {emoji}
    </Text>
  </View>
);

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: styles.tabBar,
      tabBarActiveTintColor: colors.text.primary,
      tabBarInactiveTintColor: colors.text.muted,
    }}
  >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} />,
        tabBarLabel: 'Home',
      }}
    />
    <Tab.Screen
      name="Timeline"
      component={TimelineScreen}
      options={{
        tabBarIcon: ({ focused }) => <TabIcon emoji="📖" focused={focused} />,
        tabBarLabel: 'Timeline',
      }}
    />
    <Tab.Screen
      name="Insights"
      component={InsightsScreen}
      options={{
        tabBarIcon: ({ focused }) => <TabIcon emoji="💡" focused={focused} />,
        tabBarLabel: 'Insights',
      }}
    />
  </Tab.Navigator>
);

export default function App() {
  return (
    <SafeAreaProvider>
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
  iconEmoji: {
    fontSize: 20,
    opacity: 0.6,
  },
  iconEmojiFocused: {
    opacity: 1,
  },
});
