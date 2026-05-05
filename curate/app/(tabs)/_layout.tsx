import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="brief" />
      <Tabs.Screen name="goals" />
      <Tabs.Screen name="tracks" />
      <Tabs.Screen name="feed" />
    </Tabs>
  );
}
