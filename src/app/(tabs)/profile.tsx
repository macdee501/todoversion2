
import { useAuth, useUser } from "@clerk/expo";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenContainer } from "react-native-screens";

export default function AccountScreen() {
  const { user } = useUser();
  const { signOut, sessionId } = useAuth();

  const [loading, setLoading] = useState(false);

  // Sign out of the current session
  const handleSignOut = async () => {
    if (loading) return;

    setLoading(true);

    try {
      await signOut(
        sessionId ? { sessionId } : undefined
      );

      router.replace("/(auth)");
    } catch (error) {
      console.error("Sign out error:", error);
      Alert.alert(
        "Sign Out Failed",
        "Unable to sign out. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Confirm before signing out
  const confirmSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: handleSignOut,
        },
      ]
    );
  };

  const displayName =
    user?.fullName ||
    user?.firstName ||
    "ToDo User";

  const email =
    user?.primaryEmailAddress?.emailAddress ||
    "No email available";

  return (

    <SafeAreaView
      className="flex-1 bg-[#F3F3F3]"
      edges={["top"]}
    >
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 pb-10"
      >
        {/* Screen Header */}
        <View className="mb-7 mt-6">
          <Text className="text-3xl font-bold text-[#303030]">
            My Account
          </Text>

          <Text className="mt-1 text-[#888888]">
            Manage your profile and preferences
          </Text>
        </View>

        {/* Profile Card */}
        <View className="items-center rounded-3xl bg-white px-5 py-8">

          {/* Profile Picture */}
          {user?.imageUrl ? (
            <Image
              source={{ uri: user.imageUrl }}
              className="h-24 w-24 rounded-full"
            />
          ) : (
            <View className="h-24 w-24 items-center justify-center rounded-full bg-[#E5E5E5]">
              <Text className="text-4xl font-bold text-[#424242]">
                {displayName.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}

          {/* User Details */}
          <Text className="mt-5 text-2xl font-bold text-[#303030]">
            {displayName}
          </Text>

          <Text className="mt-2 text-sm text-[#777777]">
            {email}
          </Text>

          <View className="mt-4 rounded-full bg-[#F2F2F2] px-5 py-2">
            <Text className="text-xs font-medium text-[#555555]">
              Personal Account
            </Text>
          </View>
        </View>

        {/* Account Details */}
        <View className="mt-7">
          <Text className="mb-4 text-lg font-bold text-[#303030]">
            Account Information
          </Text>

          <View className="rounded-2xl bg-white p-5">

            {/* Full Name */}
            <View className="mb-5">
              <Text className="mb-2 text-xs text-[#999999]">
                FULL NAME
              </Text>

              <Text className="text-base font-medium text-[#303030]">
                {displayName}
              </Text>
            </View>

            <View className="mb-5 h-px bg-[#EEEEEE]" />

            {/* Email Address */}
            <View className="mb-5">
              <Text className="mb-2 text-xs text-[#999999]">
                EMAIL ADDRESS
              </Text>

              <Text className="text-base font-medium text-[#303030]">
                {email}
              </Text>
            </View>

            <View className="mb-5 h-px bg-[#EEEEEE]" />

            {/* User ID */}
            <View>
              <Text className="mb-2 text-xs text-[#999999]">
                ACCOUNT ID
              </Text>

              <Text
                selectable
                className="text-sm text-[#777777]"
              >
                {user?.id}
              </Text>
            </View>
          </View>
        </View>

        {/* Sign Out */}
        <Pressable
          onPress={confirmSignOut}
          disabled={loading}
          className="mt-8 h-14 items-center justify-center rounded-2xl bg-[#424242]"
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text className="text-lg font-semibold text-white">
              Sign Out
            </Text>
          )}
        </Pressable>

        {/* App Version */}
        <Text className="mt-8 text-center text-xs text-[#AAAAAA]">
          ToDoVersion • Version 2.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
