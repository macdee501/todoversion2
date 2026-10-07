import { useAuth, useUser } from "@clerk/expo";
import { Redirect, Stack } from "expo-router";
import { Button, Modal, StyleSheet, Text, View } from "react-native";
import {UserButton, UserProfileView} from "@clerk/expo/native"
import { useState } from "react";

export default function HomeLayout() {

  // hooks from Clerk to check whether clerk isloaded and a user is signed in
  const { isLoaded, isSignedIn } = useAuth();

  // useUser hook from Clerk to allow user details to extracted and used
  const{user} =useUser()

  // a state to handle the AuthView form clerk to open or close
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

      // Built in Header Component from  React Native that will place a button 
      // on the right side
      headerRight:()=>(
        <View style={styles.rightHeader}>
          {/* Button to toggle AuthView Component */}
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