import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { fluentGlass } from "../../src/lib/glass-styles";

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
            backgroundColor: fluentGlass.tint,
            backdropFilter: `blur(${fluentGlass.blur}px) saturate(${fluentGlass.saturation})`,
            WebkitBackdropFilter: `blur(${fluentGlass.blur}px) saturate(${fluentGlass.saturation})`,
            borderWidth: fluentGlass.border.web.borderWidth,
            borderColor: fluentGlass.border.web.borderColor,
            borderRadius: 100,
            boxShadow: fluentGlass.shadow.web,
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
            backgroundColor: 'transparent',
            borderWidth: fluentGlass.border.native.borderWidth,
            borderColor: fluentGlass.border.native.borderColor,
            borderRadius: 100,
            paddingBottom: 0,
            borderTopWidth: 0,
            elevation: 0,
            overflow: 'hidden',
          },
        }),
        tabBarBackground: () =>
          Platform.OS === "web" ? null : (
            <BlurView
              tint={fluentGlass.nativeTint}
              intensity={fluentGlass.nativeBlurIntensity}
              experimentalBlurMethod="dimezisBlurView"
              style={{ flex: 1 }}
            />
          ),
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
