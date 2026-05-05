import { View, Text, Platform } from "react-native";

type Props = {
  title: string;
  rightElement?: React.ReactNode;
};

export function GlassHeader({ title, rightElement }: Props) {
  const isWeb = Platform.OS === "web";

  return (
    <View
      style={
        isWeb
          ? {
              backgroundColor: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(40px) saturate(1.8)",
              WebkitBackdropFilter: "blur(40px) saturate(1.8)",
              borderBottomWidth: 0.5,
              borderBottomColor: "rgba(255,255,255,0.2)",
              boxShadow:
                "0 8px 32px -8px rgba(0,0,0,0.3), inset 0 -1px 0 rgba(255,255,255,0.1)",
            }
          : {
              backgroundColor: "rgba(30,30,42,0.9)",
              borderBottomWidth: 1,
              borderBottomColor: "rgba(255,255,255,0.1)",
            }
      }
    >
      <View className="flex-row items-center justify-between px-5 pt-12 pb-4">
        <Text className="text-text-primary text-heading-md">{title}</Text>
        {rightElement}
      </View>
    </View>
  );
}
