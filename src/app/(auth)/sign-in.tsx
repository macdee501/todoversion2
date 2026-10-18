
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { useAppSignIn } from "../../hooks/useAppSignIn";

export default function SignInScreen() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    code,
    setCode,
    errorMessage,
    loading,
    needsVerification,
    handleSignIn,
    handleVerify,
  } = useAppSignIn();

  const [showPassword, setShowPassword] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-[#F3F3F3]">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="flex-grow px-7 py-6"
          keyboardShouldPersistTaps="handled"
        >
          {/* Back button */}
          <Pressable
            onPress={() => router.back()}
            className="h-11 w-11 items-center justify-center rounded-xl bg-white"
          >
            <Text className="text-3xl text-[#333333]">‹</Text>
          </Pressable>

          {/* Logo and heading */}
          <View className="items-center pb-10 pt-12">
            <View className="mb-8 h-20 w-20 items-center justify-center rounded-3xl bg-[#424242]">
              <Text className="text-5xl font-bold text-white">
                ✓
              </Text>
            </View>

            <Text className="text-center text-3xl font-bold text-[#303030]">
              {needsVerification
                ? "Verify your account"
                : "Welcome back"}
            </Text>

            <Text className="mt-3 text-center text-base leading-6 text-[#777777]">
              {needsVerification
                ? "Enter the verification code sent to your email."
                : "Sign in to continue managing your tasks."}
            </Text>
          </View>

          {needsVerification ? (
            /* Verification form */
            <View className="gap-5">
              <View>
                <Text className="mb-2 font-medium text-[#424242]">
                  Verification Code
                </Text>

                <TextInput
                  value={code}
                  onChangeText={setCode}
                  placeholder="Enter verification code"
                  placeholderTextColor="#999999"
                  keyboardType="number-pad"
                  autoComplete="one-time-code"
                  className="h-14 rounded-xl border border-[#DDDDDD] bg-white px-4 text-base text-[#303030]"
                />
              </View>

              <Pressable
                onPress={handleVerify}
                disabled={loading}
                className="h-14 items-center justify-center rounded-xl bg-[#424242]"
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-lg font-semibold text-white">
                    Verify and Continue
                  </Text>
                )}
              </Pressable>
            </View>
          ) : (
            /* Email and password form */
            <View className="gap-5">
              {/* Email */}
              <View>
                <Text className="mb-2 font-medium text-[#424242]">
                  Email Address
                </Text>

                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  placeholderTextColor="#999999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  className="h-14 rounded-xl border border-[#DDDDDD] bg-white px-4 text-base text-[#303030]"
                />
              </View>

              {/* Password */}
              <View>
                <Text className="mb-2 font-medium text-[#424242]">
                  Password
                </Text>

                <View className="h-14 flex-row items-center rounded-xl border border-[#DDDDDD] bg-white">
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password"
                    placeholderTextColor="#999999"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoComplete="current-password"
                    className="h-full flex-1 px-4 text-base text-[#303030]"
                  />

                  <Pressable
                    onPress={() => setShowPassword(!showPassword)}
                    className="px-4"
                  >
                    <Text className="font-medium text-[#777777]">
                      {showPassword ? "Hide" : "Show"}
                    </Text>
                  </Pressable>
                </View>
              </View>

              {/* Forgot password */}
              <Pressable
                onPress={() =>
                  router.push("/(auth)/forgot-password" as any)
                }
              >
                <Text className="text-right font-medium text-[#424242]">
                  Forgot password?
                </Text>
              </Pressable>

              {/* Sign In button */}
              <Pressable
                onPress={handleSignIn}
                disabled={loading}
                className={`mt-3 h-14 items-center justify-center rounded-xl ${
                  loading ? "bg-gray-400" : "bg-[#424242]"
                }`}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-lg font-semibold text-white">
                    Sign In
                  </Text>
                )}
              </Pressable>
            </View>
          )}

          {/* Authentication error */}
          {!!errorMessage && (
            <Text
              accessibilityRole="alert"
              className="mt-5 text-center text-sm text-red-600"
            >
              {errorMessage}
            </Text>
          )}

          {/* Footer */}
          {!needsVerification && (
            <View className="mt-auto flex-row justify-center pt-12">
              <Text className="text-[#777777]">
                Don't have an account?{" "}
              </Text>

              <Pressable
                onPress={() => router.push("/(auth)/sign-up")}
              >
                <Text className="font-bold text-[#303030]">
                  Sign Up
                </Text>
              </Pressable>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
