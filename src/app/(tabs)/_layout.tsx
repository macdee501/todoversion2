
import { useAuth } from "@clerk/expo";
import { Redirect, Tabs } from "expo-router";
import { Text, View } from "react-native";

export default function HomeLayout() {
  const { isLoaded, isSignedIn } = useAuth();

  // Wait for Clerk
  if (!isLoaded) {
    return null;
  }

  // Protect authenticated screens
  if (!isSignedIn) {
    return <Redirect href="/(auth)" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: "#303030",
        tabBarInactiveTintColor: "#999999",

        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#E5E5E5",
          height: 65,
          paddingTop: 8,
          paddingBottom: 8,
        },

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 22 }}>
              {focused ? "⌂" : "⌂"}
            </Text>
          ),
        }}
      />

      <Tabs.Screen
        name="completed"
        options={{
          title: "Completed",
          tabBarIcon: () => (
            <Text style={{ fontSize: 20 }}>
              ✓
            </Text>
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Account",
          tabBarIcon: () => (
            <Text style={{ fontSize: 20 }}>
              ◉
            </Text>
          ),
        }}
      />
    </Tabs>
  );
}
