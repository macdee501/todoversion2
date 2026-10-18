
import { ReactNode } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ScreenContainerProps = {
  children: ReactNode;
  scrollable?: boolean;
};

export default function ScreenContainer({
  children,
  scrollable = true,
}: ScreenContainerProps) {
  const insets = useSafeAreaInsets();

  // Match the floating bar's bottom offset and height,
  // leaving additional space for the final screen item.
  const bottomPadding = Math.max(insets.bottom, 12) + 110;

  if (!scrollable) {
    return (
      <View
        className="flex-1 bg-[#F3F3F3] px-5"
        style={{
          paddingTop: insets.top + 12,
          paddingBottom: bottomPadding,
        }}
      >
        {children}
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-[#F3F3F3]"
      contentContainerStyle={{
        paddingTop: insets.top + 12,
        paddingBottom: bottomPadding,
        paddingHorizontal: 20,
      }}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  );
}
