import { useAuth } from "@clerk/expo";
import { Redirect, Stack } from "expo-router";

export default function AuthLayout() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return null;
  }

  // Already logged in?
  // Don't allow access to sign-in/sign-up.
  if (isSignedIn) {
    return <Redirect href="/(home)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}