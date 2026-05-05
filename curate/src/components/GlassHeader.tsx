import { View, Text, Platform } from "react-native";

type Props = {
  title: string;
  rightElement?: React.ReactNode;
};

const HEADER_PADDING_TOP = 48;
const HEADER_PADDING_BOTTOM = 16;
const HEADER_HORIZONTAL = 20;
export const GLASS_HEADER_HEIGHT = HEADER_PADDING_TOP + 32 + HEADER_PADDING_BOTTOM;

export function GlassHeader({ title, rightElement }: Props) {
  const isWeb = Platform.OS === "web";

  return (
    <View
      style={
        isWeb
          ? {
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 10,
              backgroundColor: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(30px) saturate(1.5)",
              WebkitBackdropFilter: "blur(30px) saturate(1.5)",
              borderBottomWidth: 1,
              borderBottomColor: "rgba(255,255,255,0.15)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.12), 0 4px 16px -4px rgba(0,0,0,0.2)",
            }
          : {
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 10,
              backgroundColor: "rgba(40,40,54,0.95)",
              borderBottomWidth: 1,
              borderBottomColor: "rgba(255,255,255,0.1)",
            }
      }
    >
      <View
        className="flex-row items-center justify-between"
        style={{
          paddingTop: HEADER_PADDING_TOP,
          paddingBottom: HEADER_PADDING_BOTTOM,
          paddingHorizontal: HEADER_HORIZONTAL,
        }}
      >
        <Text className="text-text-primary text-heading-md">{title}</Text>
        {rightElement}
      </View>
    </View>
  );
}
