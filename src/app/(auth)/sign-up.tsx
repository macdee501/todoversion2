
import { useState } from "react";
import { router } from "expo-router";
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

import { useAppSignUp } from "../../hooks/useAppSignUp";

export default function SignUpScreen() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    code,
    setCode,
    pendingVerification,
    errorMessage,
    loading,
    handleSignUp,
    handleVerify,
    resendCode,
  } = useAppSignUp();

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
          {/* Navigation */}
          <Pressable
            onPress={() => router.back()}
            className="h-11 w-11 items-center justify-center rounded-xl bg-white"
          >
            <Text className="text-3xl text-[#424242]">
              ‹
            </Text>
          </Pressable>

          {/* Branding */}
          <View className="items-center pb-10 pt-10">
            <View className="mb-7 h-20 w-20 items-center justify-center rounded-3xl bg-[#424242]">
              <Text className="text-4xl font-bold text-white">
                ✓
              </Text>
            </View>

            <Text className="text-3xl font-bold text-[#303030]">
              {pendingVerification
                ? "Verify Your Email"
                : "Create Account"}
            </Text>

            <Text className="mt-3 text-center text-base text-[#777777]">
              {pendingVerification
                ? `We sent a verification code to ${email}`
                : "Start organizing your tasks today."}
            </Text>
          </View>

          {pendingVerification ? (
            // EMAIL VERIFICATION SCREEN
            <View className="gap-5">
              <View>
                <Text className="mb-2 font-medium text-[#424242]">
                  Verification Code
                </Text>

                <TextInput
                  value={code}
                  onChangeText={setCode}
                  placeholder="Enter your code"
                  placeholderTextColor="#999999"
                  keyboardType="number-pad"
                  autoComplete="one-time-code"
                  className="h-14 rounded-xl border border-[#DDDDDD] bg-white px-4 text-center text-xl tracking-widest text-[#303030]"
                />
              </View>

              <Pressable
                onPress={handleVerify}
                disabled={loading}
                className="h-14 items-center justify-center rounded-xl bg-[#424242] disabled:opacity-50"
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-lg font-semibold text-white">
                    Verify Email
                  </Text>
                )}
              </Pressable>

              <Pressable
                onPress={resendCode}
                disabled={loading}
                className="py-3"
              >
                <Text className="text-center font-medium text-[#424242]">
                  Didn't receive a code? Resend
                </Text>
              </Pressable>
            </View>
          ) : (
            // CREATE ACCOUNT SCREEN
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
                    placeholder="Create a password"
                    placeholderTextColor="#999999"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoComplete="new-password"
                    className="h-full flex-1 px-4 text-base text-[#303030]"
                  />

                  <Pressable
                    onPress={() => setShowPassword(!showPassword)}
                    className="px-4"
                  >
                    <Text className="text-[#777777]">
                      {showPassword ? "Hide" : "Show"}
                    </Text>
                  </Pressable>
                </View>
              </View>

              {/* Confirm Password */}
              <View>
                <Text className="mb-2 font-medium text-[#424242]">
                  Confirm Password
                </Text>

                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm your password"
                  placeholderTextColor="#999999"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  className="h-14 rounded-xl border border-[#DDDDDD] bg-white px-4 text-base text-[#303030]"
                />
              </View>

              {/* Clerk CAPTCHA for web */}
                <View nativeID="clerk-captcha" className="my-3" />

              {/* Submit */}
              <Pressable
                onPress={handleSignUp}
                disabled={loading}
                className="mt-3 h-14 items-center justify-center rounded-xl bg-[#424242] disabled:opacity-50"
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-lg font-semibold text-white">
                    Create Account
                  </Text>
                )}
              </Pressable>
            </View>
          )}

          {/* Error Message */}
          {!!errorMessage && (
            <Text className="mt-5 text-center text-sm text-red-600">
              {errorMessage}
            </Text>
          )}

          {/* Footer */}
          {!pendingVerification && (
            <View className="mt-auto flex-row justify-center pt-10">
              <Text className="text-[#777777]">
                Already have an account?{" "}
              </Text>

              <Pressable
                onPress={() =>
                  router.replace("/(auth)/sign-in")
                }
              >
                <Text className="font-bold text-[#303030]">
                  Sign In
                </Text>
              </Pressable>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
