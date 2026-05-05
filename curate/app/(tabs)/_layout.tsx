import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelPosition: 'below-icon',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          letterSpacing: 0.2,
          marginBottom: 6,
        },
        tabBarItemStyle: {
          paddingTop: 8,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarStyle: Platform.select({
          web: {
            position: 'absolute',
            bottom: 24,
            left: 0,
            right: 0,
            marginHorizontal: 'auto',
            width: '100%',
            maxWidth: 400,
            height: 72,
            backgroundColor: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(40px) saturate(1.8)',
            WebkitBackdropFilter: 'blur(40px) saturate(1.8)',
            borderWidth: 0.5,
            borderColor: 'rgba(255,255,255,0.2)',
            borderRadius: 100,
            boxShadow: '0 8px 32px -8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
            paddingBottom: 0,
            borderTopWidth: 0,
            elevation: 0,
          } as any,
          default: {
            position: 'absolute',
            bottom: 24,
            left: 24,
            right: 24,
            height: 72,
            backgroundColor: 'rgba(30,30,42,0.9)',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.1)',
            borderRadius: 100,
            paddingBottom: 0,
            borderTopWidth: 0,
            elevation: 0,
          },
        }),
        tabBarActiveTintColor: '#FF6D00',
        tabBarInactiveTintColor: 'rgba(240,239,244,0.35)',
      }}
    >
      <Tabs.Screen 
        name="brief" 
        options={{ 
          title: 'Brief',
          tabBarIcon: ({ color }) => <Feather name="file-text" size={18} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="goals" 
        options={{ 
          title: 'Goals',
          tabBarIcon: ({ color }) => <Feather name="target" size={18} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="tracks" 
        options={{ 
          title: 'Tracks',
          tabBarIcon: ({ color }) => <Feather name="layers" size={18} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="feed" 
        options={{ 
          title: 'Feed',
          tabBarIcon: ({ color }) => <Feather name="activity" size={18} color={color} />
        }} 
      />
    </Tabs>
  );
}
