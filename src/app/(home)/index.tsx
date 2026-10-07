import { Show, useUser } from "@clerk/expo";
import { UserButton } from '@clerk/expo/native'
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MainScreen() {

  // useUser hook to get the information of the signed user
  const{user} = useUser()
  return (
    <SafeAreaView style={styles.container}>

    

    <Text>Welcome:{user?.fullName}</Text>
    <Text>
      Tasks Are Loading
    </Text>
    

   
    </SafeAreaView>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
   
  },
});