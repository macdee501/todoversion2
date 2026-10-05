import { useAuth } from "@clerk/expo";
import { Redirect, Stack } from "expo-router";

export default function HomeLayout() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return null;
  }

  // Not logged in?
  // Kick them back to sign-in.
  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}