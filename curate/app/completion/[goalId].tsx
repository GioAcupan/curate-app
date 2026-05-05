import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";

export default function CompletionScreen() {
  const { goalId } = useLocalSearchParams<{ goalId: string }>();
  return (
    <View className="flex-1 items-center justify-center bg-surface-base">
      <Text className="text-text-primary text-heading-md">Complete: {goalId}</Text>
    </View>
  );
}
