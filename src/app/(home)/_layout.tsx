import { useAuth, useUser } from "@clerk/expo";
import { UserProfileView } from "@clerk/expo/native";
import { Redirect, Stack, Tabs } from "expo-router";
import { useState } from "react";
import { Button, Modal, StyleSheet, View } from "react-native";

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
    <>
    {/* Replaced Stack with Tabs as Tabs allows navigation between screens at the bottom of the screen */}
    <Tabs
    screenOptions={{

      // Built in Header Component from  React Native that will place a button 
      // on the right side
      headerRight:()=>(
        <View style={styles.rightHeader}>
          {/* Button to toggle AuthView Component */}
          <Button title="Account"  onPress={()=> setIsAuthViewOpen(true)}/>
            {/* change the presentation style allows to transparent allows to play around with the modal height  */}
          <Modal
          animationType="slide"
          visible={isAuthViewOpen}
          transparent={true}
          onRequestClose={() => setIsAuthViewOpen(false)}
          >
            {/*  */}
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>

            <UserProfileView/>
              </View>
            </View>
          </Modal>
        </View>
      )
    }}
    >
      <Tabs.Screen name="index" options={{title:"Home"}}/>
      <Tabs.Screen name="completed" options={{title:"Completed Tasks"}}/>
    </Tabs>
    </>
  );
}

const styles = StyleSheet.create({
  rightHeader: {},

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  modalContent: {
    height: "80%",
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
});