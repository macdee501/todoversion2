
import { useAuth } from "@clerk/expo";
import { Redirect, Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons"

export default function HomeLayout() {
  const { isLoaded, isSignedIn } = useAuth();

  // Get device-specific safe-area measurements
  const insets = useSafeAreaInsets();

  // Space above Android navigation buttons
  const bottomSpace = Math.max(insets.bottom, 12) + 12;

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href="/(auth)" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        // Hide the floating bar while typing
        tabBarHideOnKeyboard: true,

        // Hide default Expo Router tab labels
        tabBarShowLabel: false,

        // Floating tab container
        tabBarStyle: {
          position: "absolute",
          bottom: bottomSpace,
          left: 20,
          right: 20,

          height: 74,
          paddingTop: 7,
          paddingBottom: 7,

          borderRadius: 28,
          backgroundColor: "#FFFFFF",
          borderTopWidth: 0,

          elevation: 10,

          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.1,
          shadowRadius: 10,
        },

        tabBarItemStyle: {
          borderRadius: 22,
          marginHorizontal: 3,
        },

        sceneStyle: {
          backgroundColor: "#F3F3F3",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              name="home-outline"
              activeName="home"
              label="Home"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="completed"
        options={{
          title: "Completed",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              name="checkmark-done-outline"
              activeName="checkmark-done"
              label="Completed"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Account",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              name="person-outline"
              activeName="person"
              label="Account"
            />
          ),
        }}
      />
    </Tabs>
  );
}

// Reusable Tab Icon Component
type TabIconProps = {
  focused: boolean;
  name: keyof typeof Ionicons.glyphMap;
  activeName: keyof typeof Ionicons.glyphMap;
  label: string;
};

function TabIcon({
  focused,
  name,
  activeName,
  label,
}: TabIconProps) {
  return (
    <View
      className={`h-[58px] w-full min-w-[80px] items-center justify-center rounded-[22px] ${
        focused ? "bg-[#424242]" : "bg-transparent"
      }`}
    >
      <Ionicons
        name={focused ? activeName : name}
        size={22}
        color={focused ? "#FFFFFF" : "#777777"}
      />

      <Text
        className={`mt-1 text-[11px] font-semibold ${
          focused ? "text-white" : "text-[#777777]"
        }`}
      >
        {label}
      </Text>
    </View>
  );
}
