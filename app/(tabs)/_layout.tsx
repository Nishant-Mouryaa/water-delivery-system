import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { useAuth } from '@/components/AuthContext';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { user, loading } = useAuth();

  if (loading) return null; // Optionally show a loading spinner

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      {!user && (
        <Tabs.Screen
          name="signup"
          options={{
            title: 'Sign Up',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />, // Use a relevant icon
          }}
        />
      )}
      {!user && (
        <Tabs.Screen
          name="signin"
          options={{
            title: 'Sign In',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />, // Use a relevant icon
          }}
        />
      )}
      {user && (
        <Tabs.Screen
          name="customer"
          options={{
            title: 'Customer',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="chevron.right" color={color} />, // Use a relevant icon
          }}
        />
      )}
    </Tabs>
  );
}
