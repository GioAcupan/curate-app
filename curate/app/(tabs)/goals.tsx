import { View, Text } from "react-native";
import { ScreenContainer } from "../../src/components/ScreenContainer";
import { GlassHeader } from "../../src/components/GlassHeader";

export default function GoalsScreen() {
  return (
    <ScreenContainer>
      <GlassHeader title="Goals" />
      <View className="flex-1 items-center justify-center">
        <Text className="text-text-primary text-heading-md">Goals</Text>
      </View>
    </ScreenContainer>
  );
}
