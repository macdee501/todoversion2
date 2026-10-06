import { Show, useUser } from "@clerk/expo";
import { UserButton } from '@clerk/expo/native'
import { View, Text, StyleSheet } from "react-native";

export default function MainScreen() {

  // useUser hook to get the information of the signed user
  const{user} = useUser()
  return (
    <View style={styles.container}>

    <Show fallback={<Text>
      Users that are not signed in will see this
    </Text>} when="signed-in">
    <Text>Welcome:{user?.id}</Text>
    

    </Show>
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});