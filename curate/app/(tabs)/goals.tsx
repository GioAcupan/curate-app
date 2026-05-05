import { View, Text } from "react-native";
import { ScreenContainer } from "../../src/components/ScreenContainer";
import { GlassHeader, GLASS_HEADER_HEIGHT } from "../../src/components/GlassHeader";

export default function GoalsScreen() {
  return (
    <ScreenContainer>
      <View className="flex-1 items-center justify-center" style={{ paddingTop: GLASS_HEADER_HEIGHT }}>
        <Text className="text-text-primary text-heading-md">Goals</Text>
      </View>
      <GlassHeader title="Goals" />
    </ScreenContainer>
  );
}
