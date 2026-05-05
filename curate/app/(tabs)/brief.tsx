import { View, Text } from "react-native";
import { ScreenContainer } from "../../src/components/ScreenContainer";
import { GlassHeader } from "../../src/components/GlassHeader";

export default function BriefScreen() {
  return (
    <ScreenContainer>
      <GlassHeader title="Brief" />
      <View className="flex-1 items-center justify-center">
        <Text className="text-text-primary text-heading-md">Brief</Text>
      </View>
    </ScreenContainer>
  );
}
