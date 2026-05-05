import { View, Text, Platform } from "react-native";
import { BlurView } from "expo-blur";
import { fluentGlass, webGlassStyle } from "../lib/glass-styles";

type Props = {
  title: string;
  rightElement?: React.ReactNode;
};

const HEADER_PADDING_TOP = 48;
const HEADER_PADDING_BOTTOM = 24;
const HEADER_HORIZONTAL = 20;
export const GLASS_HEADER_HEIGHT =
  HEADER_PADDING_TOP + 32 + HEADER_PADDING_BOTTOM;

export function GlassHeader({ title, rightElement }: Props) {
  const isWeb = Platform.OS === "web";

  const inner = (
    <View
      style={{
        paddingTop: HEADER_PADDING_TOP,
        paddingBottom: HEADER_PADDING_BOTTOM,
        paddingHorizontal: HEADER_HORIZONTAL,
        backgroundColor: fluentGlass.tint,
      }}
    >
      <View className="flex-row items-center justify-between">
        <Text className="text-text-primary text-heading-md">{title}</Text>
        {rightElement}
      </View>
    </View>
  );

  if (isWeb) {
    return (
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          ...webGlassStyle(fluentGlass),
          borderTopWidth: 0,
          borderLeftWidth: 0,
          borderRightWidth: 0,
        }}
      >
        {inner}
      </View>
    );
  }

  return (
    <BlurView
      intensity={fluentGlass.nativeBlurIntensity}
      tint={fluentGlass.nativeTint}
      experimentalBlurMethod="dimezisBlurView"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        borderBottomWidth: fluentGlass.border.native.borderWidth,
        borderBottomColor: fluentGlass.border.native.borderColor,
      }}
    >
      {inner}
    </BlurView>
  );
}
