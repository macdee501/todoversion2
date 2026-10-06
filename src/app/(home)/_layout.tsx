import { useAuth, useUser } from "@clerk/expo";
import { Redirect, Stack } from "expo-router";
import { Button, Modal, StyleSheet, Text, View } from "react-native";
import {UserButton, UserProfileView} from "@clerk/expo/native"
import { useState } from "react";

export default function HomeLayout() {
  const { isLoaded, isSignedIn } = useAuth();
    const{user} =useUser()
      const [isAuthViewOpen, setIsAuthViewOpen] = useState(false)

  if (!isLoaded) {
    return null;
  }

  // Not logged in?
  // Kick them back to sign-in.
  if (!isSignedIn) {
    return <Redirect href="/(auth)" />;
  }

  return (
    <Stack
    screenOptions={{
      headerRight:()=>(
        <View style={styles.rightHeader}>
          <Button title="Account"  onPress={()=> setIsAuthViewOpen(true)}/>
          <Modal
          animationType="slide"
          visible={isAuthViewOpen}
          presentationStyle="pageSheet"
          onRequestClose={() => setIsAuthViewOpen(false)}
          >
            <UserProfileView/>
          </Modal>
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