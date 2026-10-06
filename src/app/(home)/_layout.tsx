import { useAuth } from "@clerk/expo";
import { Redirect, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import {UserButton} from "@clerk/expo/native"

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
    <Stack
    screenOptions={{
      headerRight:()=>(
        <View style={styles.rightHeader}>
          {/* <UserButton/> */}
          <Text>

          Gonna Place A User Button Here
          </Text>
        </View>
      )
    }}
    >
      <Stack.Screen name="index" options={{title:"Home"}}/>
    </Stack>
  );
}

const styles = StyleSheet.create({
  rightHeader:{

  }

})